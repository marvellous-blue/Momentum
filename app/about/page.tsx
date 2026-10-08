import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, MoveRight } from "lucide-react";

const beliefs = [
  {
    number: "01",
    title: "Clarity before pressure",
    text: "When everything feels important, you can't tell where to begin. We help you find what matters right now.",
  },
  {
    number: "02",
    title: "Small steps count",
    text: "You don't need to fix everything at once. One useful decision can get things moving again.",
  },
  {
    number: "03",
    title: "Real life comes first",
    text: "Plans should work around real days, changing energy and limited time. Not the other way around.",
  },
];

const pillars = [
  {
    heading: "Clear Attention",
    description: "A simple way to see what's competing for your focus.",
  },
  {
    heading: "Realistic Scope",
    description: "A practical plan built around the time you actually have today.",
  },
  {
    heading: "Micro Progress",
    description: "A habit that turns one small decision into real momentum.",
  },
];

export default function About() {
  return (
    <div className="overflow-hidden">
      <section className="px-5 pb-16 pt-10 md:px-10 md:pt-14 lg:px-16 lg:pb-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-widest text-[var(--teal)]">
            <span className="h-px w-8 bg-[var(--teal)]" />
            Our story & philosophy
          </p>

          <div className="grid gap-8 lg:grid-cols-12">
            <h1 className="max-w-3xl text-5xl leading-[0.9] tracking-tight text-[var(--deep-blue)] sm:text-6xl lg:col-span-8 lg:text-6xl" style={{ fontFamily: "var(--heading-font)" }}>
              You don't need to have everything figured out to move forward.
            </h1>
            <p className="max-w-sm text-[15px] leading-7 text-[var(--muted)] lg:col-span-4 lg:self-end">
              Momentum was made for those days when your schedule feels larger than your capacity to manage it.
            </p>
          </div>

          <div className="relative mt-12">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl">
              <Image
                src="/images/momentum-about.jpg"
                alt="Calm workspace in morning light"
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </div>
            <div className="absolute -bottom-5 right-6 rounded-2xl bg-[var(--mint)] px-5 py-4 sm:right-10">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--deep-blue)]">Built for real lives</p>
              <p className="mt-1 text-sm text-[var(--deep-blue)]/80">One decision at a time.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--deep-blue)] px-5 py-16 text-white md:px-10 md:py-24 lg:px-16">
        <div className="mx-auto max-w-7xl grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image
              src="/images/momentum-story.jpg"
              alt="Founder working with notebook and tea"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </div>
          <div>
            <p className="mb-6 text-4xl text-[var(--mint)]" style={{ fontFamily: "var(--heading-font)" }}>"</p>
            <h2 className="text-3xl leading-snug sm:text-4xl" style={{ fontFamily: "var(--heading-font)" }}>
              Deciding what to do first often feels like work itself. Momentum exists to give you your focus back.
            </h2>
            <div className="mt-8 flex items-center gap-3">
              <span className="h-px w-8 bg-[var(--mint)]" />
              <p className="text-xs uppercase tracking-widest text-[var(--mint)]">Why we started</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-10 md:py-24 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs uppercase tracking-widest text-[var(--teal)]">What we believe</p>
          <h2 className="max-w-xl text-4xl leading-[0.95] tracking-tight text-[var(--deep-blue)] sm:text-5xl" style={{ fontFamily: "var(--heading-font)" }}>
            Progress doesn't have to be complicated.
          </h2>

          <div className="mt-12 grid border-t border-[var(--deep-blue)]/15 md:grid-cols-3">
            {beliefs.map((b) => (
              <div key={b.number} className="border-b border-[var(--deep-blue)]/15 py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-0">
                <span className="text-xs tracking-widest text-[var(--teal)]">{b.number}</span>
                <h3 className="mt-10 text-2xl text-[var(--deep-blue)]" style={{ fontFamily: "var(--heading-font)" }}>{b.title}</h3>
                <p className="mt-3 max-w-[300px] text-sm leading-6 text-[var(--muted)]">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--cream)] px-5 py-16 md:px-10 md:py-24 lg:px-16">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-xs uppercase tracking-widest text-[var(--teal)]">What Momentum is</p>
            <h2 className="mt-4 text-4xl leading-tight tracking-tight text-[var(--deep-blue)] sm:text-5xl" style={{ fontFamily: "var(--heading-font)" }}>
              Designed for clarity.
            </h2>
            <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/momentum-clarity.jpg"
                alt="Minimal desk detail"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4 lg:col-span-7">
            {pillars.map((p) => (
              <div key={p.heading} className="rounded-2xl bg-white p-6">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--mint)]">
                  <Check size={16} className="text-[var(--deep-blue)]" />
                </div>
                <h3 className="text-lg text-[var(--deep-blue)]" style={{ fontFamily: "var(--heading-font)" }}>{p.heading}</h3>
                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-10 md:py-24 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl bg-[var(--teal)] px-6 py-14 sm:px-10 md:px-14">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border-[30px] border-[var(--mint)]/40" />
            <div className="relative max-w-xl">
              <p className="text-xs uppercase tracking-widest text-[var(--deep-blue)]">Start where you are</p>
              <h2 className="mt-4 text-4xl leading-tight tracking-tight text-white sm:text-5xl" style={{ fontFamily: "var(--heading-font)" }}>
                You only need one next move.
              </h2>
              <Link href="/fix-my-day" className="mt-8 flex w-fit items-center gap-2 rounded-full bg-[var(--deep-blue)] px-6 py-3.5 text-sm font-semibold text-white">
                Try Fix My Day <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <Link href="/how-it-works" className="flex items-center gap-2 text-sm font-semibold text-[var(--deep-blue)]">
              See how Momentum works <MoveRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}