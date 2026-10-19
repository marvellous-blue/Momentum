"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, Check } from "lucide-react";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    await new Promise((resolve) => setTimeout(resolve, 800));
    setStatus("sent");
  }

  return (
    <main className="min-h-screen bg-[var(--cream)] text-[var(--ink)]">
      <div className="mx-auto max-w-6xl px-6">
        <header className="flex h-16 items-center justify-between border-b border-[var(--ink)]/10">
          <Link
            href="/"
            className="text-xs font-medium uppercase tracking-widest"
          >
            Momentum
          </Link>

          <span className="text-xs uppercase tracking-widest text-[var(--muted)]">
            Contact
          </span>
        </header>

        <section className="grid gap-12 py-16 md:grid-cols-2 md:items-end md:py-24">
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--teal)]">
              Get in touch
            </p>

            <h1
              className="mt-4 text-5xl leading-none tracking-tight md:text-7xl"
              style={{ fontFamily: "var(--heading-font)" }}
            >
              We'd like to
              <br />
              <span className="font-light italic text-[var(--muted)]">
                hear from you.
              </span>
            </h1>

            <p className="mt-6 max-w-sm text-base leading-7 text-[var(--muted)]">
              Have a question, feedback, or an idea for Momentum? Send us a
              message. We'd love to hear what you think.
            </p>
          </div>

          <div className="pb-2">
            <div className="border-y border-[var(--ink)]/10 py-6">
              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--mint)]">
                  <Mail size={17} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
                    Email Momentum
                  </p>

                  <a
                    href="mailto:momentumofficial1214@gmail.com"
                    className="mt-2 inline-block break-all text-base transition-colors hover:text-[var(--teal)]"
                  >
                    momentumofficial1214@gmail.com
                  </a>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--muted)]">
                    Prefer email? Contact us directly from your email app.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="border-y border-[var(--ink)]/10 bg-[var(--white)]">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:py-20 lg:grid-cols-[320px_1fr]">
          <div className="h-fit space-y-5">
            <p className="text-xs uppercase tracking-widest text-[var(--teal)]">
              Your message matters
            </p>

            <h2
              className="text-3xl leading-tight tracking-tight md:text-4xl"
              style={{ fontFamily: "var(--heading-font)" }}
            >
              What's on
              <br />
              your mind?
            </h2>

            <p className="max-w-[280px] text-sm leading-6 text-[var(--muted)]">
              Share your thoughts, report a problem, or tell us how we could
              make Momentum better.
            </p>
          </div>

          <div>
            {status === "sent" ? (
              <div className="border border-[var(--ink)]/10 bg-[var(--cream)] px-6 py-12 text-center md:px-10">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--mint)]">
                  <Check size={21} />
                </div>

                <h3
                  className="mt-6 text-3xl tracking-tight"
                  style={{ fontFamily: "var(--heading-font)" }}
                >
                  Form preview complete.
                </h3>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[var(--muted)]">
                  The form is not connected to email delivery yet. Your message
                  has not been sent.
                </p>

                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-7 text-sm underline underline-offset-4"
                >
                  Back to contact form
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-8 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="text-xs uppercase tracking-widest text-[var(--muted)]"
                    >
                      Your name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      placeholder="Enter your name"
                      className="mt-3 w-full border-b border-[var(--ink)]/15 bg-transparent py-3 text-sm outline-none placeholder:text-[var(--muted)]/40 focus:border-[var(--teal)]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="text-xs uppercase tracking-widest text-[var(--muted)]"
                    >
                      Email address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@example.com"
                      className="mt-3 w-full border-b border-[var(--ink)]/15 bg-transparent py-3 text-sm outline-none placeholder:text-[var(--muted)]/40 focus:border-[var(--teal)]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="text-xs uppercase tracking-widest text-[var(--muted)]"
                  >
                    Subject
                  </label>

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    placeholder="What is this about?"
                    className="mt-3 w-full border-b border-[var(--ink)]/15 bg-transparent py-3 text-sm outline-none placeholder:text-[var(--muted)]/40 focus:border-[var(--teal)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="text-xs uppercase tracking-widest text-[var(--muted)]"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    placeholder="Write your message here..."
                    className="mt-3 w-full resize-y border-b border-[var(--ink)]/15 bg-transparent py-3 text-sm leading-6 outline-none placeholder:text-[var(--muted)]/40 focus:border-[var(--teal)]"
                  />
                </div>

                <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-[var(--muted)]">
                    Or email us directly using the address above.
                  </p>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--deep-blue)] px-7 py-3.5 text-sm font-medium text-[var(--white)] transition-colors hover:bg-[var(--ink)] disabled:opacity-60"
                  >
                    {status === "sending" ? "Please wait..." : "Send message"}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col gap-4 border-t border-[var(--ink)]/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="text-xs font-medium uppercase tracking-widest"
          >
            Momentum
          </Link>

          <p className="text-sm text-[var(--muted)]">
            One step at a time.
          </p>

          <a
            href="mailto:momentumofficial@gmail.com"
            className="text-sm transition-colors hover:text-[var(--teal)]"
          >
            Contact us <ArrowRight className="ml-1 inline" size={14} />
          </a>
        </div>
      </footer>
    </main>
  );
}

