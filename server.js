import http from "node:http";
import { corsHeaders, forwardChatRequest, readConfig } from "./src/chatProxy.js";

const config = readConfig();
const port = Number(process.env.PORT || 8787);

function readJson(request) {
  return new Promise((resolve, reject) => {
    let raw = "";
    request.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) reject(new Error("Request body too large"));
    });
    request.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    request.on("error", reject);
  });
}

function sendJson(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json",
    ...corsHeaders(config.allowedOrigin)
  });
  response.end(JSON.stringify(body));
}

const server = http.createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    response.writeHead(204, corsHeaders(config.allowedOrigin));
    response.end();
    return;
  }

  if (request.url === "/health") {
    sendJson(response, 200, { ok: true, service: "ua-marketing-backend" });
    return;
  }

  if (request.url !== "/api/chat" || request.method !== "POST") {
    sendJson(response, 404, { error: "Not found" });
    return;
  }

  try {
    const body = await readJson(request);
    const result = await forwardChatRequest(body);
    sendJson(response, result.status, result.body);
  } catch (error) {
    sendJson(response, 400, { error: error.message });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`UA marketing backend listening on http://127.0.0.1:${port}`);
});