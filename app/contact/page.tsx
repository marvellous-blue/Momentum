"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail, Check } from "lucide-react";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    await new Promise(r => setTimeout(r, 800));
    setStatus("sent");
  }

  return (
    <div className="min-h-screen bg-[var(--cream)] text-[var(--ink)]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-between border-b border-[var(--ink)]/10">
          <Link href="/" className="text-xs uppercase tracking-widest font-medium">
            Momentum
          </Link>
          <span className="text-xs uppercase tracking-widest text-[var(--muted)]">Contact</span>
        </div>

        <div className="py-16 md:py-24 grid md:grid-cols-2 gap-12 items-end">
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--teal)]">Contact Momentum</p>
            <h1 className="mt-4 text-5xl md:text-7xl leading-none tracking-tight" style={{ fontFamily: "var(--heading-font)" }}>
              Have something<br /><span className="italic font-light text-[var(--muted)]">to say?</span>
            </h1>
            <p className="mt-6 text-base leading-7 text-[var(--muted)] max-w-sm">
              Whether you have a question, an idea, or something that could make Momentum better — we actually read everything.
            </p>
          </div>
          <div className="pb-2 space-y-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-[var(--white)]">
              <Image src="/images/contact-hero.jpg" alt="Contact Momentum" fill className="object-cover" priority />
            </div>
            <div className="inline-flex items-center gap-3 rounded-full border border-[var(--ink)]/10 bg-[var(--white)] px-4 py-2">
              <div className="h-8 w-8 rounded-full bg-[var(--mint)] grid place-items-center">
                <Mail size={14} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-[var(--muted)]">Email us directly</p>
                <a href="mailto:hello@momentum.com" className="text-sm">hello@momentum.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-y border-[var(--ink)]/10 bg-[var(--white)]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 grid lg:grid-cols-[320px_1fr] gap-12">
          <div className="lg:sticky lg:top-24 h-fit space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl leading-tight tracking-tight" style={{ fontFamily: "var(--heading-font)" }}>
                Tell us what's<br />on your mind.
              </h2>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)] max-w-[280px]">
                Questions, feedback, bugs, or just saying hello — everything is welcome. We don't do auto-replies.
              </p>
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl">
              <Image src="/images/contact-side.jpg" alt="We are listening" fill className="object-cover" />
            </div>
          </div>

          <div>
            {status === "sent"? (
              <div className="rounded-3xl border border-dashed border-[var(--ink)]/15 bg-[var(--cream)] px-8 py-10 text-center">
                <div className="relative mx-auto h-48 w-full max-w-sm overflow-hidden rounded-2xl">
                  <Image src="/images/contact-success.jpg" alt="Message sent" fill className="object-cover" />
                </div>
                <div className="mx-auto mt-8 h-12 w-12 rounded-full bg-[var(--ink)] text-[var(--white)] grid place-items-center">
                  <Check size={20} />
                </div>
                <h3 className="mt-6 text-3xl tracking-tight" style={{ fontFamily: "var(--heading-font)" }}>
                  Message received.
                </h3>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[var(--muted)]">
                  Thanks for reaching out. We'll get back to you within a day.
                </p>
                <button onClick={() => setStatus("idle")} className="mt-8 text-sm underline underline-offset-4">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid sm:grid-cols-2 gap-8">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-[var(--muted)]">Your name</label>
                    <input required placeholder="Your name" className="mt-3 w-full border-b border-[var(--ink)]/15 bg-transparent py-3 text-sm outline-none placeholder:text-[var(--muted)]/40 focus:border-[var(--ink)]" />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-[var(--muted)]">Email address</label>
                    <input required type="email" placeholder="Your email" className="mt-3 w-full border-b border-[var(--ink)]/15 bg-transparent py-3 text-sm outline-none placeholder:text-[var(--muted)]/40 focus:border-[var(--ink)]" />
                  </div>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-[var(--muted)]">Subject</label>
                  <input required placeholder="What is this about?" className="mt-3 w-full border-b border-[var(--ink)]/15 bg-transparent py-3 text-sm outline-none placeholder:text-[var(--muted)]/40 focus:border-[var(--ink)]" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-[var(--muted)]">Message</label>
                  <textarea required rows={5} placeholder="Tell us what you're thinking..." className="mt-3 w-full resize-none border-b border-[var(--ink)]/15 bg-transparent py-3 text-sm leading-6 outline-none placeholder:text-[var(--muted)]/40 focus:border-[var(--ink)]" />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <p className="hidden sm:block text-xs text-[var(--muted)]">We never share your email.</p>
                  <button disabled={status === "sending"} className="ml-auto inline-flex items-center gap-2 rounded-full bg-[var(--deep-blue)] px-7 py-3.5 text-sm font-medium text-[var(--white)] hover:bg-[var(--ink)] disabled:opacity-60">
                    {status === "sending"? "Sending..." : "Send message"} <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="flex flex-col md:flex-row justify-between gap-8 border-t border-[var(--ink)]/10 pt-10">
          <h2 className="text-2xl md:text-3xl leading-tight tracking-tight" style={{ fontFamily: "var(--heading-font)" }}>
            If your day is the reason you're here...
          </h2>
          <div className="max-w-sm">
            <p className="text-sm leading-6 text-[var(--muted)]">
              You don't need to figure everything out before you start. Sometimes the easiest way forward is to begin with one thing.
            </p>
            <Link href="/fix-my-day" className="mt-4 inline-flex items-center gap-2 text-sm font-medium">
              Try Fix My Day <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}