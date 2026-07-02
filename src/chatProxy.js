const defaultProviderUrl = "https://api.openai.com/v1/chat/completions";

export function corsHeaders(origin = "*") {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
}

export function readConfig(env = process.env) {
  return {
    apiKey: env.AI_PROVIDER_API_KEY || env.OPENAI_API_KEY || "",
    providerUrl: env.AI_PROVIDER_URL || defaultProviderUrl,
    model: env.AI_MODEL || "gpt-4o-mini",
    allowedOrigin: env.ALLOWED_ORIGIN || "*"
  };
}

export function validateChatRequest(body) {
  if (!body || !Array.isArray(body.messages)) {
    return "Request body must include messages[].";
  }
  return "";
}

export async function forwardChatRequest(body, env = process.env) {
  const config = readConfig(env);
  if (!config.apiKey) {
    return { status: 500, body: { error: "Missing AI_PROVIDER_API_KEY or OPENAI_API_KEY" } };
  }

  const validationError = validateChatRequest(body);
  if (validationError) {
    return { status: 400, body: { error: validationError } };
  }

  const providerResponse = await fetch(config.providerUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: body.model || config.model,
      messages: body.messages,
      temperature: body.temperature ?? 0.4
    })
  });

  const payload = await providerResponse.json().catch(() => ({}));
  return { status: providerResponse.status, body: payload };
}