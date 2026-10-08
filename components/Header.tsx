"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="relative z-50 px-5 py-5 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="relative z-50 flex items-center">
            <Image
              src="/images/momentum-logo.png"
              alt="Momentum"
              width={180}
              height={60}
              className="h-auto w-32 sm:w-36"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/fix-my-day"
              className="text-sm font-medium text-[var(--ink)] transition-colors hover:text-[var(--teal)]"
            >
              Fix My Day
            </Link>

            <Link
              href="/how-it-works"
              className="text-sm font-medium text-[var(--ink)] transition-colors hover:text-[var(--teal)]"
            >
              How It Works
            </Link>

            <Link
              href="/about"
              className="text-sm font-medium text-[var(--ink)] transition-colors hover:text-[var(--teal)]"
            >
              About
            </Link>

            <Link
              href="/contact"
              className="text-sm font-medium text-[var(--ink)] transition-colors hover:text-[var(--teal)]"
            >
              Contact
            </Link>

            <Link
              href="/fix-my-day"
              className="flex items-center gap-2 rounded-full bg-[var(--deep-blue)] px-5 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
            >
              Start
              <ArrowUpRight size={16} />
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="relative z-50 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--deep-blue)]/15 bg-white/60 text-[var(--deep-blue)] md:hidden"
          >
            {isOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {isOpen && (
          <div className="fixed inset-0 -z-10 bg-[var(--cream)] px-5 pt-28 md:hidden">
            <div className="flex min-h-full flex-col justify-between pb-10">
              <nav className="flex flex-col">
                <Link
                  href="/fix-my-day"
                  onClick={() => setIsOpen(false)}
                  className="border-b border-[var(--deep-blue)]/10 py-6 text-4xl text-[var(--deep-blue)]"
                  style={{ fontFamily: "var(--heading-font)" }}
                >
                  Fix My Day
                </Link>

                <Link
                  href="/how-it-works"
                  onClick={() => setIsOpen(false)}
                  className="border-b border-[var(--deep-blue)]/10 py-6 text-4xl text-[var(--deep-blue)]"
                  style={{ fontFamily: "var(--heading-font)" }}
                >
                  How It Works
                </Link>

                <Link
                  href="/about"
                  onClick={() => setIsOpen(false)}
                  className="border-b border-[var(--deep-blue)]/10 py-6 text-4xl text-[var(--deep-blue)]"
                  style={{ fontFamily: "var(--heading-font)" }}
                >
                  About
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="border-b border-[var(--deep-blue)]/10 py-6 text-4xl text-[var(--deep-blue)]"
                  style={{ fontFamily: "var(--heading-font)" }}
                >
                  Contact
                </Link>
              </nav>

              <div>
                <p className="mb-4 text-sm text-[var(--muted)]">
                  Ready to get your day moving?
                </p>

                <Link
                  href="/fix-my-day"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-full bg-[var(--deep-blue)] px-6 py-4 text-sm font-medium text-white"
                >
                  Start with Fix My Day
                  <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}