"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return null;
  }

  return (
    <footer className="bg-[var(--deep-blue)] px-5 py-10 text-white md:px-10 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p
            className="text-4xl"
            style={{ fontFamily: "var(--heading-font)" }}
          >
            Momentum
          </p>
          <p className="mt-2 max-w-xs text-sm leading-6 text-white/70">
            A little clarity can change the direction of your day.
          </p>
        </div>

        <div className="flex gap-6 text-sm text-white/80">
          <Link href="/dashboard" className="transition-opacity hover:opacity-60">
            Dashboard
          </Link>
          <Link href="/about" className="transition-opacity hover:opacity-60">
            About
          </Link>
        
          <Link
            href="/contact"
            className="transition-opacity hover:opacity-60"
          >
            Contact
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/15 pt-5 text-xs text-white/50">
        &copy; 2026 Momentum. All rights reserved.
      </div>
    </footer>
  );
}
