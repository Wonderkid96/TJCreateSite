"use client";

import { FormEvent, useState } from "react";

type FormValues = { name: string; email: string; message: string; company: string; website: string };
type ContactFormProps = { email: string };

const FIELD_CLASS = "mt-2 min-h-12 w-full rounded-[2px] border border-paper/30 bg-ink px-3 py-2 text-base text-paper placeholder:text-paper/40 focus-visible:border-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper";
const LABEL_CLASS = "block text-sm font-medium text-paper";

export default function ContactForm({ email }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [messageLength, setMessageLength] = useState(0);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "pending") return;
    setStatus("pending");
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (field: keyof FormValues) => String(data.get(field) ?? "").trim();

    if (value("website")) {
      setStatus("error");
      return;
    }

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(email)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        signal: AbortSignal.timeout(12000),
        body: JSON.stringify({
          name: value("name"),
          email: value("email"),
          message: value("message"),
          company: value("company"),
          _subject: "TJCreate website enquiry",
          _replyto: value("email"),
          _honey: value("website"),
          _template: "table",
        }),
      });

      if (!response.ok) throw new Error("Contact request failed");
      const result: unknown = await response.json();
      if (
        typeof result !== "object" ||
        result === null ||
        !("success" in result) ||
        (result.success !== true && result.success !== "true") ||
        ("message" in result && /activat/i.test(String(result.message)))
      ) {
        throw new Error("Contact provider did not confirm delivery");
      }
      form.reset();
      setMessageLength(0);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div data-no-auto-text-reveal className="border border-paper/15 bg-paper/[0.04] p-5 md:p-7">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-paper/60">Tell me about it</p>
      <h3 className="mt-3 font-display text-2xl uppercase leading-tight md:text-3xl">Start a conversation<span className="text-accent">.</span></h3>

      <p className="mt-4 text-sm text-paper/65">Prefer a form? Leave your details below. Required fields are marked *.</p>

      <form onSubmit={handleSubmit} autoComplete="on" onInput={(event) => {
        if (status === "error") setStatus("idle");
        if (event.target instanceof HTMLTextAreaElement && event.target.name === "message") {
          setMessageLength(event.target.value.length);
        }
      }} className="mt-7 space-y-5" aria-busy={status === "pending"}>
        <div>
          <label htmlFor="contact-name" className={LABEL_CLASS}>Name <span aria-hidden="true" className="text-accent">*</span></label>
          <input id="contact-name" name="name" autoComplete="name" required maxLength={120} defaultValue="" className={FIELD_CLASS} />
        </div>

        <div>
          <label htmlFor="contact-email" className={LABEL_CLASS}>Email <span aria-hidden="true" className="text-accent">*</span></label>
          <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} defaultValue="" className={FIELD_CLASS} />
        </div>

        <div>
          <label htmlFor="contact-company" className={LABEL_CLASS}>Company <span className="font-normal text-paper/55">(optional)</span></label>
          <input id="contact-company" name="company" autoComplete="organization" maxLength={120} defaultValue="" className={FIELD_CLASS} />
        </div>

        <div>
          <label htmlFor="contact-message" className={LABEL_CLASS}>Project details <span aria-hidden="true" className="text-accent">*</span></label>
          <textarea id="contact-message" name="message" required maxLength={5000} rows={4} defaultValue="" className={`${FIELD_CLASS} min-h-32 resize-y`} />
          <p className="mt-1 text-right text-xs text-paper/50">{messageLength}/5000</p>
        </div>

        <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
          <label htmlFor="contact-website">Leave this field empty</label>
          <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>

        <p className="text-xs leading-relaxed text-paper/60">Your details are used to reply to your enquiry. <a href="/privacy" className="underline underline-offset-4 hover:text-paper">Privacy policy</a>.</p>

        <div className="flex flex-col items-start gap-4 pt-1">
          <button type="submit" disabled={status === "pending"} className="inline-flex min-h-12 items-center justify-center rounded-[2px] bg-accent px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper disabled:cursor-wait disabled:opacity-60">
            {status === "pending" ? "Sending…" : "Send enquiry"}
          </button>
          <p aria-live="polite" role={status === "error" ? "alert" : "status"} className="min-h-5 text-sm text-paper/75">
            {status === "success" && "Thanks, your message has been sent."}
            {status === "error" && <>That didn&apos;t send. Your details are still here. <a className="underline underline-offset-4 hover:text-paper" href={`mailto:${email}?subject=${encodeURIComponent("Project enquiry")}`} onClick={(event) => {
              const form = event.currentTarget.closest("form");
              if (!form) return;
              const data = new FormData(form);
              const name = String(data.get("name") ?? "").trim();
              const replyEmail = String(data.get("email") ?? "").trim();
              const message = String(data.get("message") ?? "").trim();
              const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${replyEmail})`);
              event.currentTarget.href = `mailto:${email}?subject=${encodeURIComponent("Project enquiry")}&body=${body}`;
            }}>Email me directly</a>.</>}
          </p>
        </div>
      </form>
    </div>
  );
}
