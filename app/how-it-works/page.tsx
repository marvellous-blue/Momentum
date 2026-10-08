import Link from "next/link";
import { ArrowRight, Clock3, ListChecks, Layers } from "lucide-react";

export default function HowItWorks() {
  return (
    <main className="bg-[var(--cream)] text-[var(--ink)]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-between border-b border-[var(--ink)]/10">
          <Link href="/" className="text-xs uppercase tracking-widest font-medium">
            Momentum
          </Link>
          <span className="text-xs uppercase tracking-widest text-[var(--muted)]">
            How it works
          </span>
        </div>

        <div className="py-16 md:py-24 grid md:grid-cols-2 gap-12 items-end">
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--teal)]">
              How it works
            </p>
            <h1 className="mt-4 text-5xl md:text-6xl leading-none tracking-tight" style={{ fontFamily: "var(--heading-font)" }}>
              A clearer way<br />to figure out<br />your day.
            </h1>
          </div>
          <div className="pb-2">
            <p className="text-base leading-7 text-[var(--muted)] max-w-sm">
              Momentum takes everything competing for your attention and helps you decide what actually fits right now.
            </p>
            <div className="mt-8 flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--muted)]">
              <span>↓</span><span>Start with what is on your mind</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-y border-[var(--ink)]/10 bg-[var(--white)]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 grid lg:grid-cols-[320px_1fr] gap-12">
          <div className="lg:sticky lg:top-24 h-fit">
            <h2 className="text-3xl md:text-4xl leading-tight tracking-tight" style={{ fontFamily: "var(--heading-font)" }}>
              Three things are<br />all you need.
            </h2>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)] max-w-[280px]">
              You don't need a system. You need a place to put things and a way to choose.
            </p>
          </div>

          <div className="divide-y divide-[var(--ink)]/10 border-y border-[var(--ink)]/10">

            <div className="py-10 flex gap-6">
              <div className="h-10 w-10 rounded-full bg-[var(--cream)] border border-[var(--ink)]/10 grid place-items-center shrink-0">
                <ListChecks size={18} className="text-[var(--ink)]" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[var(--muted)]">01</span>
                  <h3 className="text-xl md:text-2xl tracking-tight">Put your tasks in one place</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)] max-w-md">
                  Start by adding everything you are trying to keep track of. You don't need to organize it perfectly first. Just get it out of your head.
                </p>
              </div>
            </div>

            <div className="py-10 flex gap-6">
              <div className="h-10 w-10 rounded-full bg-[var(--mint)] grid place-items-center shrink-0">
                <Layers size={18} className="text-[var(--ink)]" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[var(--muted)]">02</span>
                  <h3 className="text-xl md:text-2xl tracking-tight">Give each task a weight</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)] max-w-md">
                  Tell it what needs attention first. Momentum separates what must happen from what can wait. Click the tag to change it.
                </p>
                <div className="mt-6 flex gap-2">
                  <span className="rounded-full bg-[var(--ink)] text-[var(--white)] px-3 py-1.5 text-xs">must</span>
                  <span className="rounded-full bg-[var(--cream)] border border-[var(--ink)]/10 px-3 py-1.5 text-xs">should</span>
                  <span className="rounded-full bg-[var(--cream)] border border-[var(--ink)]/10 px-3 py-1.5 text-xs">later</span>
                </div>
              </div>
            </div>

            <div className="py-10 flex gap-6">
              <div className="h-10 w-10 rounded-full bg-[var(--cream)] border border-[var(--ink)]/10 grid place-items-center shrink-0">
                <Clock3 size={18} className="text-[var(--ink)]" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[var(--muted)]">03</span>
                  <h3 className="text-xl md:text-2xl tracking-tight">Set your real time</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)] max-w-md">
                  Choose how much time you actually have today. Not how much you wish you had. Momentum builds your plan around that number.
                </p>
                <div className="mt-6 rounded-2xl bg-[var(--ink)] text-[var(--white)] p-6 max-w-sm">
                  <p className="text-xs uppercase tracking-widest text-[var(--white)]/40">Time you have</p>
                  <p className="mt-2 text-3xl">120 <span className="text-sm text-[var(--white)]/40">minutes</span></p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="py-16 md:py-28 grid md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-4xl md:text-5xl leading-none tracking-tight" style={{ fontFamily: "var(--heading-font)" }}>
              Your day starts<br />to look<br /><span className="text-[var(--muted)]">manageable.</span>
            </h2>
          </div>
          <div>
            <p className="text-base leading-7 text-[var(--muted)] max-w-md">
              Instead of staring at everything that needs to happen, you get a smaller picture of what matters now.
            </p>
            <div className="mt-10 space-y-5 border-t border-[var(--ink)]/10 pt-8">
              <div className="flex gap-3"><span className="text-[var(--ink)]/20">—</span><p className="text-sm">Know what deserves your attention first</p></div>
              <div className="flex gap-3"><span className="text-[var(--ink)]/20">—</span><p className="text-sm">See what can realistically fit in the time you have</p></div>
              <div className="flex gap-3"><span className="text-[var(--ink)]/20">—</span><p className="text-sm">Stop carrying every task in your head</p></div>
            </div>
            <div className="mt-12 rounded-3xl border border-[var(--ink)]/10 bg-[var(--white)] p-8">
              <p className="text-sm leading-6 text-[var(--muted)]">
                Momentum is not here to fill every minute. It is here to help you make a good decision about the next one.
              </p>
              <Link href="/fix-my-day" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--deep-blue)] text-[var(--white)] px-6 py-3 text-sm">
                Try Fix My Day <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}