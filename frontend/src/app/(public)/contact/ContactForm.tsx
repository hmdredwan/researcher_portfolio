"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { sendContact } from "@/lib/api";

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      await sendContact(form);
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-green-200 bg-green-50 p-12 text-center">
        <CheckCircle2 size={48} className="text-green-600" />
        <h3 className="mt-4 font-serif text-xl font-bold text-ink-900">Message sent!</h3>
        <p className="mt-2 text-sm text-ink-600">Thank you for reaching out. I&apos;ll get back to you soon.</p>
        <button onClick={() => setStatus("idle")} className="btn-ghost mt-6">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">Name *</label>
          <input id="name" required value={form.name} onChange={(e) => update("name", e.target.value)} className="input" placeholder="Your name" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email *</label>
          <input id="email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} className="input" placeholder="you@example.com" />
        </div>
      </div>
      <div className="mt-5">
        <label className="label" htmlFor="subject">Subject</label>
        <input id="subject" value={form.subject} onChange={(e) => update("subject", e.target.value)} className="input" placeholder="What's this about?" />
      </div>
      <div className="mt-5">
        <label className="label" htmlFor="message">Message *</label>
        <textarea id="message" required rows={6} value={form.message} onChange={(e) => update("message", e.target.value)} className="input resize-none" placeholder="Your message…" />
      </div>

      {status === "error" && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <button type="submit" disabled={status === "loading"} className="btn-primary mt-6 w-full disabled:opacity-60">
        {status === "loading" ? (
          <><Loader2 size={16} className="animate-spin" /> Sending…</>
        ) : (
          <><Send size={16} /> Send message</>
        )}
      </button>
    </form>
  );
}
