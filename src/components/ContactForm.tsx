"use client";

import { FormEvent, useState } from "react";

type FormValues = { name: string; email: string; message: string; company: string; website: string };
type ContactFormProps = { email: string };

const EMPTY_FORM: FormValues = { name: "", email: "", message: "", company: "", website: "" };
const FIELD_CLASS = "mt-2 min-h-12 w-full rounded-[2px] border border-paper/30 bg-ink px-3 py-2 text-base text-paper placeholder:text-paper/40 focus-visible:border-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper";
const LABEL_CLASS = "block text-sm font-medium text-paper";

export default function ContactForm({ email }: ContactFormProps) {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");

  function update(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (status === "error") setStatus("idle");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "pending") return;
    setStatus("pending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          company: values.company.trim(),
          website: values.website.trim(),
        }),
      });

      if (!response.ok) throw new Error("Contact request failed");
      setValues(EMPTY_FORM);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const fallbackBody = encodeURIComponent(`${values.message.trim()}\n\nFrom: ${values.name.trim()} (${values.email.trim()})`);

  return (
    <div className="border border-paper/15 bg-paper/[0.04] p-5 md:p-7">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-paper/60">Tell me about it</p>
      <h3 className="mt-3 font-display text-2xl uppercase leading-tight md:text-3xl">Start a conversation<span className="text-accent">.</span></h3>

      <p className="mt-4 text-sm text-paper/65">Prefer a form? Leave your details below. Required fields are marked *.</p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5" aria-busy={status === "pending"}>
        <div>
          <label htmlFor="contact-name" className={LABEL_CLASS}>Name <span aria-hidden="true" className="text-accent">*</span></label>
          <input id="contact-name" name="name" autoComplete="name" required maxLength={120} value={values.name} onChange={(event) => update("name", event.target.value)} className={FIELD_CLASS} />
        </div>

        <div>
          <label htmlFor="contact-email" className={LABEL_CLASS}>Email <span aria-hidden="true" className="text-accent">*</span></label>
          <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} value={values.email} onChange={(event) => update("email", event.target.value)} className={FIELD_CLASS} />
        </div>

        <div>
          <label htmlFor="contact-company" className={LABEL_CLASS}>Company <span className="font-normal text-paper/55">(optional)</span></label>
          <input id="contact-company" name="company" autoComplete="organization" maxLength={120} value={values.company} onChange={(event) => update("company", event.target.value)} className={FIELD_CLASS} />
        </div>

        <div>
          <label htmlFor="contact-message" className={LABEL_CLASS}>Project details <span aria-hidden="true" className="text-accent">*</span></label>
          <textarea id="contact-message" name="message" required maxLength={5000} rows={4} value={values.message} onChange={(event) => update("message", event.target.value)} className={`${FIELD_CLASS} min-h-32 resize-y`} />
          <p className="mt-1 text-right text-xs text-paper/50">{values.message.length}/5000</p>
        </div>

        <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
          <label htmlFor="contact-website">Leave this field empty</label>
          <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => update("website", event.target.value)} />
        </div>

        <p className="text-xs leading-relaxed text-paper/60">Your details are used to reply to your enquiry. <a href="/privacy" className="underline underline-offset-4 hover:text-paper">Privacy policy</a>.</p>

        <div className="flex flex-col items-start gap-4 pt-1">
          <button type="submit" disabled={status === "pending"} className="inline-flex min-h-12 items-center justify-center rounded-[2px] bg-accent px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper disabled:cursor-wait disabled:opacity-60">
            {status === "pending" ? "Sending…" : "Send enquiry"}
          </button>
          <p aria-live="polite" role={status === "error" ? "alert" : "status"} className="min-h-5 text-sm text-paper/75">
            {status === "success" && "Thanks, your message has been sent."}
            {status === "error" && <>That didn&apos;t send. Your details are still here. <a className="underline underline-offset-4 hover:text-paper" href={`mailto:${email}?subject=${encodeURIComponent("Project enquiry")}&body=${fallbackBody}`}>Email me directly</a>.</>}
          </p>
        </div>
      </form>
    </div>
  );
}
