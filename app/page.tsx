import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-[var(--cream)] text-[var(--ink)]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-between border-b border-[var(--ink)]/10">
          <span className="text-xs uppercase tracking-widest font-medium">Momentum</span>
          <div className="flex gap-6 text-xs">
            <Link href="/how-it-works" className="text-[var(--muted)]">How it works</Link>
            <Link href="/contact" className="text-[var(--muted)]">Contact</Link>
          </div>
        </div>

        <div className="py-12 md:py-20 grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <p className="text-xs uppercase tracking-widest text-[var(--teal)]">A better way forward</p>
            <h1 className="mt-6 text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight" style={{ fontFamily: "var(--heading-font)" }}>
              Your day does<br />not need a<br /><span className="text-[var(--teal)]">restart.</span>
            </h1>
            <p className="mt-8 max-w-sm text-base leading-7 text-[var(--muted)]">
              Sometimes you just need to figure out what is getting in the way and make one good next move.
            </p>
            <Link href="/fix-my-day" className="mt-10 inline-flex items-center gap-3 border-b border-[var(--ink)] pb-2 text-sm font-medium">
              Start with Fix My Day <ArrowUpRight size={16} />
            </Link>

            <div className="mt-16 grid grid-cols-3 gap-6 border-t border-[var(--ink)]/10 pt-8">
              <div><p className="text-xs text-[var(--muted)]">01</p><p className="mt-2 text-sm leading-6">Name the problem</p></div>
              <div><p className="text-xs text-[var(--muted)]">02</p><p className="mt-2 text-sm leading-6">Make it smaller</p></div>
              <div><p className="text-xs text-[var(--muted)]">03</p><p className="mt-2 text-sm leading-6">Take the next move</p></div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-[var(--white)]">
              <Image src="/images/momentum-hero.jpg" alt="Calm desk" fill className="object-cover" priority />
            </div>
            <div className="absolute -bottom-6 -left-6 rounded-2xl bg-[var(--white)] border border-[var(--ink)]/10 p-4 shadow-sm">
              <p className="text-xs text-[var(--muted)]">Right now</p>
              <p className="mt-1 text-sm">Keep moving — 2 min to start</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--ink)] text-[var(--white)]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <p className="text-xs uppercase tracking-widest text-[var(--mint)]">The idea</p>
            <h2 className="mt-6 text-4xl md:text-5xl leading-none tracking-tight" style={{ fontFamily: "var(--heading-font)" }}>
              Less pressure.<br />More momentum.
            </h2>
          </div>
          <div className="md:col-span-7 flex items-end">
            <p className="text-xl md:text-2xl leading-8 text-[var(--white)]/70 max-w-xl">
              You do not always need a perfect plan. You need enough clarity to know what to do next. That is what Momentum is for.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="flex justify-between items-end">
          <h2 className="text-3xl md:text-5xl leading-none tracking-tight" style={{ fontFamily: "var(--heading-font)" }}>
            One problem.<br />One next move.
          </h2>
          <Link href="/how-it-works" className="hidden md:inline-flex items-center gap-2 text-sm">
            See how it works <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-12 grid md:grid-cols-3 border-y border-[var(--ink)]/10 divide-y md:divide-y-0 md:divide-x divide-[var(--ink)]/10">
          <div className="py-10 md:pr-10">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--white)]">
              <Image src="/images/moment-01.jpg" alt="Name the problem" fill className="object-cover" />
            </div>
            <p className="mt-6 text-xs text-[var(--muted)]">01</p>
            <h3 className="mt-2 text-xl tracking-tight">Name the problem</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Start with what is actually getting in your way. Not everything, just the thing.</p>
          </div>
          <div className="py-10 md:px-10">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--white)]">
              <Image src="/images/moment-02.jpg" alt="Make it smaller" fill className="object-cover" />
            </div>
            <p className="mt-6 text-xs text-[var(--muted)]">02</p>
            <h3 className="mt-2 text-xl tracking-tight">Make it smaller</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Turn the big messy thing into something you can deal with in the next hour.</p>
          </div>
          <div className="py-10 md:pl-10">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--white)]">
              <Image src="/images/moment-03.jpg" alt="Next move" fill className="object-cover" />
            </div>
            <p className="mt-6 text-xs text-[var(--muted)]">03</p>
            <h3 className="mt-2 text-xl tracking-tight">Take the next move</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Leave with one clear action, not another list to feel guilty about.</p>
          </div>
        </div>
      </div>

      <div className="border-y border-[var(--ink)]/10 bg-[var(--white)]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs uppercase tracking-widest text-[var(--teal)]">Maybe today looks like this</p>
            <h2 className="mt-6 text-4xl md:text-5xl leading-none tracking-tight" style={{ fontFamily: "var(--heading-font)" }}>
              You know you need to do something. <span className="text-[var(--muted)]">Just not what.</span>
            </h2>
            <div className="mt-10 relative aspect-[5/4] overflow-hidden rounded-2xl bg-[var(--cream)]">
              <Image src="/images/today-looks.jpg" alt="Today feels" fill className="object-cover" />
            </div>
          </div>
          <div className="lg:col-span-7 lg:pt-20">
            <div className="border-t border-[var(--ink)]/10">
              {[
                "I have too much to do",
                "I cannot focus",
                "My day got messy",
                "I do not know where to start",
              ].map((s, i) => (
                <div key={s} className="flex justify-between items-center border-b border-[var(--ink)]/10 py-6">
                  <div className="flex gap-6 items-center">
                    <span className="text-xs text-[var(--muted)]">0{i + 1}</span>
                    <span className="text-lg">{s}</span>
                  </div>
                  <span className="text-[var(--muted)]">→</span>
                </div>
              ))}
            </div>
            <div className="mt-10 rounded-3xl bg-[var(--cream)] p-8 flex gap-6 items-center">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[var(--white)]">
                <Image src="/images/fix-preview.jpg" alt="Fix my day preview" fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm leading-6 text-[var(--ink)]">If any of those sound familiar, Fix My Day was made for this exact moment.</p>
                <Link href="/fix-my-day" className="mt-3 inline-flex text-sm underline underline-offset-4">Try it now</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="rounded-3xl bg-[var(--teal)] p-8 md:p-14 grid md:grid-cols-12 gap-8 items-center overflow-hidden relative">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[32px] border-[var(--mint)]/30 pointer-events-none" />
          <div className="md:col-span-7 relative">
            <h2 className="text-5xl md:text-6xl leading-none tracking-tight text-[var(--white)]" style={{ fontFamily: "var(--heading-font)" }}>
              Let's make today feel a little lighter.
            </h2>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link href="/fix-my-day" className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-7 py-3.5 text-sm text-[var(--white)]">
                Fix My Day <ArrowRight size={16} />
              </Link>
              <span className="text-sm text-[var(--ink)]/70">Takes a moment to begin</span>
            </div>
          </div>
          
        </div>

        <div className="mt-16 flex justify-between items-center border-t border-[var(--ink)]/10 pt-10">
          <p className="max-w-xl text-2xl md:text-3xl leading-tight tracking-tight" style={{ fontFamily: "var(--heading-font)" }}>
            Progress does not always look dramatic. Sometimes it looks like knowing what to do next.
          </p>
          <div className="hidden md:grid h-12 w-12 place-items-center rounded-full bg-[var(--cream)] border border-[var(--ink)]/10">✓</div>
        </div>
      </div>
    </div>
  );
}