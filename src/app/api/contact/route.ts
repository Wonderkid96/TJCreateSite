const CONTACT_EMAIL = "hello@tjcreate.co.uk";
const MAX_BODY_BYTES = 24_000;
const DELIVERY_ERROR = "Your message could not be sent. Please email hello@tjcreate.co.uk directly.";

// A per-instance burst limit supplements FormSubmit's own spam filtering.
// Serverless instances do not share this map; this is not a global quota.
const recentRequests = new Map<string, { count: number; expires: number }>();
const WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  }
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return Response.json({ error: "Expected JSON." }, { status: 415 });
  }

  // Bound the actual stream, including requests without Content-Length.
  const reader = request.body?.getReader();
  if (!reader) return Response.json({ error: "Missing message." }, { status: 400 });
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        return Response.json({ error: "Message is too long." }, { status: 413 });
      }
      chunks.push(value);
    }
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  let payload: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    payload = parsed as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const field = (key: string) => typeof payload[key] === "string" ? (payload[key] as string).trim() : "";
  const name = field("name");
  const email = field("email");
  const company = field("company");
  const message = field("message");
  if (field("website")) return Response.json({ error: "Invalid request." }, { status: 400 });
  if (!name || name.length > 120 || !email || email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /[\r\n]/.test(name + company) ||
      company.length > 120 || !message || message.length > 5000) {
    return Response.json({ error: "Check your name, email and project details." }, { status: 400 });
  }

  const now = Date.now();
  for (const [key, entry] of recentRequests) {
    if (entry.expires <= now) recentRequests.delete(key);
  }
  // Vercel supplies this address at its edge; local tests share one bucket.
  const ip = process.env.VERCEL
    ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() || "unknown"
    : "local";
  const entry = recentRequests.get(ip);
  if ((entry && entry.count >= 5) || (!entry && recentRequests.size >= 10_000)) {
    return Response.json({ error: "Too many enquiries. Please email me directly." }, {
      status: 429, headers: { "Retry-After": String(Math.ceil(((entry?.expires ?? now + WINDOW_MS) - now) / 1000)) },
    });
  }
  recentRequests.set(ip, { count: (entry?.count ?? 0) + 1, expires: entry?.expires ?? now + WINDOW_MS });

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", Referer: "https://www.tjcreate.co.uk/" },
      body: JSON.stringify({
        name, email, company, message,
        _subject: "TJCreate website enquiry",
        _replyto: email,
        _template: "table",
        _url: "https://www.tjcreate.co.uk/#contact",
      }),
      signal: AbortSignal.timeout(12_000),
    });
    const result = await response.json();
    // Activation and provider errors can arrive with HTTP 200.
    if (!response.ok || (result.success !== true && result.success !== "true") ||
        /activat/i.test(String(result.message ?? ""))) {
      return Response.json({ error: DELIVERY_ERROR }, { status: 502 });
    }
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: DELIVERY_ERROR }, { status: 502 });
  }
}
