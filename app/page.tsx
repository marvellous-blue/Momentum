import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Play } from "lucide-react";
import DashboardDemo from "../components/DashboardDemo"

export default function Home() {
  return (
    <div className="bg-[var(--cream)] text-[var(--ink)]">
      <div className="mx-auto max-w-6xl px-6">
        <header className="flex h-16 items-center justify-between border-b border-[var(--ink)]/10">
          <nav className="flex items-center gap-5 text-xs sm:gap-7">
            <a href="#demo" className="text-[var(--muted)] hover:text-[var(--deep-blue)]">
              Demo
            </a>
            <Link href="/contact" className="text-[var(--muted)] hover:text-[var(--deep-blue)]">
              Contact
            </Link>
          </nav>
        </header>

        <section className="grid items-center gap-12 py-16 md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--teal)]">
              Your personal workspace
            </p>

            <h1
              className="mt-6 text-6xl leading-[0.92] tracking-tight sm:text-7xl lg:text-8xl"
              style={{ fontFamily: "var(--heading-font)" }}
            >
              Make space
              <br />
              for what
              <br />
              <span className="text-[var(--teal)]">matters.</span>
            </h1>

            <p className="mt-7 max-w-md text-base leading-7 text-[var(--muted)]">
              Bring your tasks, notes, reminders and focus time into one place.
              Work out what needs attention and take your next step.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-3 rounded-full bg-[var(--deep-blue)] px-6 py-3.5 text-sm text-white transition-colors hover:bg-[var(--ink)]"
              >
                Open Momentum <ArrowUpRight size={16} />
              </Link>

              <a
                href="#demo"
                className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--deep-blue)]"
              >
                <Play size={15} /> Watch the demo
              </a>
            </div>

            <div className="mt-14 grid max-w-lg grid-cols-3 gap-4 border-t border-[var(--ink)]/10 pt-6">
              <div>
                <p className="text-xs text-[var(--teal)]">01</p>
                <p className="mt-2 text-sm">Organize your tasks</p>
              </div>
              <div>
                <p className="text-xs text-[var(--teal)]">02</p>
                <p className="mt-2 text-sm">Keep ideas and reminders</p>
              </div>
              <div>
                <p className="text-xs text-[var(--teal)]">03</p>
                <p className="mt-2 text-sm">Focus on the next step</p>
              </div>
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-white">
              <Image
                src="/images/momentum-hero.jpg"
                alt="A calm, focused workspace"
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="absolute -bottom-5 -left-3 max-w-[230px] rounded-2xl border border-[var(--ink)]/10 bg-white p-4 shadow-sm sm:-left-5">
              <p className="text-xs text-[var(--muted)]">A small step counts</p>
              <p className="mt-1 text-sm">You don't have to do everything at once.</p>
            </div>
          </div>
        </section>
      </div>

      <section className="bg-[var(--ink)] text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--mint)]">
              The idea
            </p>
            <h2
              className="mt-5 text-4xl leading-none sm:text-5xl"
              style={{ fontFamily: "var(--heading-font)" }}
            >
              Less scattered.
              <br />
              More intentional.
            </h2>
          </div>

          <p className="text-base leading-7 text-white/70 md:col-span-7 md:pt-8 md:text-xl md:leading-8">
            Your tasks shouldn't feel disconnected from your day. Momentum
            brings your plans, notes and reminders together, helping you turn
            a long list into a clearer next move.
          </p>
        </div>
      </section>

      
      <section id="demo" className="mx-auto max-w-6xl scroll-mt-8 px-6 py-16 md:py-24">
        <div className="grid items-end gap-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--teal)]">
              See it in action
            </p>
            <h2
              className="mt-5 text-4xl leading-none sm:text-5xl md:text-6xl"
              style={{ fontFamily: "var(--heading-font)" }}
            >
              A closer look at Momentum.
            </h2>
          </div>

          <p className="text-sm leading-6 text-[var(--muted)] md:col-span-4">
            Try the dashboard right here — add a task, set a reminder, save a
            note. Everything is saved locally in your browser.
          </p>
        </div>

        {/* Live interactive demo in place of the video */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-[var(--ink)]/10 shadow-sm">
          <div className="flex items-center gap-2 border-b border-[var(--ink)]/10 bg-white px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-400/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
            <span className="h-3 w-3 rounded-full bg-green-400/70" />
            <span className="ml-3 text-xs text-[var(--muted)]">momentum.app / dashboard</span>
          </div>

          {/* Constrain height so the demo scrolls internally instead of stretching the page */}
          <div className="max-h-[80vh] overflow-y-auto bg-[var(--cream)]">
            <DashboardDemo />
          </div>
        </div>

        <p className="mt-3 text-xs text-[var(--muted)]">
          Live interactive demo — nothing leaves your device.
        </p>
      </section>

      <section className="border-y border-[var(--ink)]/10 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--teal)]">
            One workspace
          </p>

          <h2
            className="mt-5 max-w-2xl text-4xl leading-none sm:text-5xl"
            style={{ fontFamily: "var(--heading-font)" }}
          >
            Everything has a place. Your next step has a purpose.
          </h2>

          <div className="mt-10 grid gap-8 border-t border-[var(--ink)]/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-[var(--teal)]">01 / TASKS</p>
              <h3 className="mt-3 text-lg">Know what's next</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Organize priorities, due dates and completed work.
              </p>
            </div>

            <div>
              <p className="text-xs text-[var(--teal)]">02 / NOTES</p>
              <h3 className="mt-3 text-lg">Keep your ideas</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Save useful thoughts before they get lost.
              </p>
            </div>

            <div>
              <p className="text-xs text-[var(--teal)]">03 / REMINDERS</p>
              <h3 className="mt-3 text-lg">Remember what matters</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Give important things a date and time.
              </p>
            </div>

            <div>
              <p className="text-xs text-[var(--teal)]">04 / FOCUS</p>
              <h3 className="mt-3 text-lg">Make time to act</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Use a focus session to work on one thing at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-[var(--teal)] p-8 md:p-14">
          <div className="relative z-10 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink)]/70">
              Your next step starts here
            </p>

            <h2
              className="mt-5 text-4xl leading-none text-white sm:text-6xl"
              style={{ fontFamily: "var(--heading-font)" }}
            >
              Make today a little clearer.
            </h2>

            <Link
              href="/dashboard"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[var(--ink)] px-6 py-3.5 text-sm text-white transition-colors hover:bg-[var(--deep-blue)]"
            >
              Open your dashboard <ArrowRight size={16} />
            </Link>
          </div>

          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border-[32px] border-[var(--mint)]/30" />
        </div>

        <footer className="mt-12 flex flex-col justify-between gap-4 border-t border-[var(--ink)]/10 pt-6 text-xs text-[var(--muted)] sm:flex-row">
          <p>Momentum — make room for what matters.</p>
          <div className="flex gap-5">
            <Link href="/contact">Contact</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>
        </footer>
      </section>
    </div>
  );
}