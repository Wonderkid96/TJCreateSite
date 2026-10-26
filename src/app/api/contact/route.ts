import nodemailer from "nodemailer";

/**
 * Contact form endpoint. Sends the enquiry from hello@ to hello@ over Gmail
 * SMTP with the visitor as reply-to, so replying in Gmail goes straight to
 * them. Replaced FormSubmit, which was taking 15 to 60+ seconds per request
 * (26 Oct 2026) and failing real enquiries.
 */

const CONTACT_EMAIL = "hello@tjcreate.co.uk";
const LIMITS = { name: 120, email: 254, company: 120, message: 5000 } as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Best-effort per-instance throttle. Serverless instances don't share memory,
// so this slows a single noisy client rather than guaranteeing a global cap.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > MAX_PER_WINDOW;
}

function allowedOrigin(origin: string | null) {
  if (!origin) return false;
  try {
    const { hostname } = new URL(origin);
    return hostname === "tjcreate.co.uk" || hostname.endsWith(".tjcreate.co.uk") || hostname === "localhost" || hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

const field = (body: Record<string, unknown>, key: string) => (typeof body[key] === "string" ? (body[key] as string).trim() : "");

export async function POST(request: Request) {
  if (!allowedOrigin(request.headers.get("origin"))) {
    return Response.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: bots fill the hidden field. Answer as if it worked so they move on.
  if (field(body, "website")) return Response.json({ ok: true });

  const name = field(body, "name").replace(/[\r\n]+/g, " ");
  const email = field(body, "email");
  const company = field(body, "company").replace(/[\r\n]+/g, " ");
  const message = field(body, "message");

  if (
    !name || name.length > LIMITS.name ||
    !email || email.length > LIMITS.email || !EMAIL_PATTERN.test(email) ||
    company.length > LIMITS.company ||
    !message || message.length > LIMITS.message
  ) {
    return Response.json({ ok: false, error: "Invalid fields" }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return Response.json({ ok: false, error: "Too many requests" }, { status: 429 });
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    console.error("Contact form: SMTP environment variables are missing");
    return Response.json({ ok: false, error: "Not configured" }, { status: 500 });
  }

  const port = Number(SMTP_PORT || 587);
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  try {
    await transport.sendMail({
      from: { name: "TJCreate website", address: SMTP_USER },
      to: CONTACT_EMAIL,
      replyTo: { name, address: email },
      subject: `Website enquiry from ${name}${company ? ` (${company})` : ""}`,
      text: `Name: ${name}\nEmail: ${email}\n${company ? `Company: ${company}\n` : ""}\n${message}`,
    });
  } catch (error) {
    console.error("Contact form: send failed", error);
    return Response.json({ ok: false, error: "Send failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
