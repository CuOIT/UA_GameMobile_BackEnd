import { corsHeaders, forwardChatRequest, readConfig } from "../src/chatProxy.js";

export default async function handler(request, response) {
  const { allowedOrigin } = readConfig();
  const headers = corsHeaders(allowedOrigin);
  for (const [key, value] of Object.entries(headers)) response.setHeader(key, value);

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST, OPTIONS");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const result = await forwardChatRequest(request.body);
  response.status(result.status).json(result.body);
}