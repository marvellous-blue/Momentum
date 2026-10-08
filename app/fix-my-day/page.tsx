"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";

type View = "home" | "feel" | "block" | "plan" | "focus";
type Tag = "must" | "should" | "later";
type Task = { id: string; text: string; mins: number; tag: Tag; done: boolean };

export default function FixMyDayPage() {
  const [view, setView] = useState<View>("home");
  const [feel, setFeel] = useState("");
  const [block, setBlock] = useState("");
  const [mins, setMins] = useState(120);
  const [newText, setNewText] = useState("");
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", text: "Finish the draft I'm avoiding", mins: 40, tag: "must", done: false },
    { id: "2", text: "Send those 2 replies", mins: 15, tag: "should", done: false },
    { id: "3", text: "Clear desktop and files", mins: 20, tag: "later", done: false },
  ]);

  const feelings = ["Too much to do", "Can't focus", "Don't know where to start", "Day got messy", "Putting things off"];
  const blocks = ["Feels too big", "No clear first step", "Getting distracted", "Running out of time", "No energy"];

  const active = tasks.filter(t =>!t.done);
  const sorted = [...active].sort((a,b) => ({must:0,should:1,later:2}[a.tag] - {must:0,should:1,later:2}[b.tag]));

  let left = mins;
  const now: Task[] = [];
  const later: Task[] = [];
  for (let t of sorted) {
    if (t.mins <= left) { now.push(t); left -= t.mins; }
    else later.push(t);
  }

  function addTask() {
    if (!newText.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), text: newText.trim(), mins: 25, tag: "should", done: false }]);
    setNewText("");
  }

  const step = { home: 0, feel: 1, block: 2, plan: 3, focus: 4 }[view];

  return (
    <div className="min-h-screen bg-[var(--cream)] text-[var(--ink)]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-between border-b border-[var(--ink)]/10">
          <Link href="/" className="text-xs uppercase tracking-widest font-medium">Momentum</Link>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex gap-1.5">
              {[0,1,2,3,4].map(i => (
                <div key={i} className={`h-1 w-6 rounded-full transition-all ${i <= step? "bg-[var(--ink)]" : "bg-[var(--ink)]/10"}`} />
              ))}
            </div>
            <button onClick={() => { setView("home"); setFeel(""); setBlock(""); }} className="ml-4 text-xs uppercase tracking-widest text-[var(--muted)]">
              {view!== "home"? "reset" : "Fix My Day"}
            </button>
          </div>
        </div>

        {view === "home" && (
          <div className="py-12 md:py-20 grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <h1 className="text-5xl md:text-7xl leading-[0.9] tracking-tight" style={{ fontFamily: "var(--heading-font)" }}>
                Your day<br />doesn't need<br /><span className="italic font-light text-[var(--muted)]">fixing.</span><br />It needs<br />a next step.
              </h1>
              <div className="mt-10 flex gap-8 border-t border-[var(--ink)]/10 pt-8">
                <p className="max-w-[320px] text-sm leading-6 text-[var(--muted)]">
                  No charts. No hustle quotes. Just tell me what is happening and we will make a small plan you can start in ten minutes.
                </p>
                <button onClick={() => setView("feel")} className="h-fit shrink-0 rounded-full bg-[var(--ink)] text-[var(--white)] px-7 py-4 text-sm inline-flex items-center gap-2">
                  Start <ArrowRight size={16} />
                </button>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-[var(--white)] border border-[var(--ink)]/5">
                <Image src="/images/fix-preview.jpg" alt="fix my day" fill className="object-cover" />
              </div>
              <p className="mt-4 text-xs text-[var(--muted)]">Takes 2 minutes. No account.</p>
            </div>
          </div>
        )}

        {view === "feel" && (
          <div className="py-12 md:py-20 grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <p className="text-xs uppercase tracking-widest text-[var(--teal)]">01 / 04 — How it feels</p>
              <h2 className="mt-6 text-4xl md:text-5xl leading-none tracking-tight" style={{ fontFamily: "var(--heading-font)" }}>
                What is today<br />feeling like?
              </h2>
              <div className="mt-8 relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--white)] hidden md:block">
                <Image src="/images/moment-01.jpg" alt="feeling" fill className="object-cover" />
              </div>
            </div>
            <div className="lg:col-span-7 lg:pt-10">
              <div className="border-t border-[var(--ink)]/10">
                {feelings.map((f,i) => (
                  <button key={f} onClick={() => { setFeel(f); setView("block"); }} className="group flex w-full items-center justify-between border-b border-[var(--ink)]/10 py-7 text-left">
                    <div className="flex gap-6 items-center">
                      <span className="text-xs text-[var(--muted)]">0{i+1}</span>
                      <span className="text-xl md:text-2xl tracking-tight group-hover:translate-x-1 transition-transform">{f}</span>
                    </div>
                    <span className="text-[var(--muted)] group-hover:text-[var(--ink)]">→</span>
                  </button>
                ))}
              </div>
              <input value={feel} onChange={e => setFeel(e.target.value)} placeholder="Or write your own..." className="mt-8 w-full border-b border-[var(--ink)]/10 bg-transparent py-3 text-sm outline-none placeholder:text-[var(--muted)]/40" />
              {feel && <button onClick={() => setView("block")} className="mt-6 text-sm underline underline-offset-4">Continue with "{feel}" →</button>}
            </div>
          </div>
        )}

        {view === "block" && (
          <div className="py-12 md:py-20 grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <p className="text-xs uppercase tracking-widest text-[var(--teal)]">02 / 04 — What is stuck</p>
              <div className="mt-6 inline-block rounded-full border border-[var(--ink)]/10 bg-[var(--white)] px-4 py-2 text-sm">
                you said: <span className="font-medium">{feel}</span>
              </div>
              <h2 className="mt-10 text-4xl md:text-5xl leading-none tracking-tight" style={{ fontFamily: "var(--heading-font)" }}>
                What is making<br />it stick?
              </h2>
            </div>
            <div className="lg:col-span-7 lg:pt-16">
              <div className="flex flex-wrap gap-3">
                {blocks.map(b => (
                  <button key={b} onClick={() => { setBlock(b); setView("plan"); }} className="rounded-full border border-[var(--ink)] px-6 py-3.5 text-sm hover:bg-[var(--ink)] hover:text-[var(--white)] transition-colors">
                    {b}
                  </button>
                ))}
              </div>
              <div className="mt-12 relative h-px w-full bg-[var(--ink)]/10">
                <div className="absolute -top-1 left-0 h-2 w-2 rounded-full bg-[var(--mint)]" />
              </div>
              <p className="mt-4 text-xs text-[var(--muted)]">Pick the one that feels most true right now. You can change it later.</p>
            </div>
          </div>
        )}

        {view === "plan" && (
          <div className="py-12">
            <div className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-7">
                <p className="text-xs uppercase tracking-widest text-[var(--teal)]">03 / 04 — Time</p>
                <h2 className="mt-4 text-3xl md:text-4xl leading-none tracking-tight max-w-xl" style={{ fontFamily: "var(--heading-font)" }}>
                  What do you actually have time for?
                </h2>
                <div className="mt-8 flex items-center gap-6 border-y border-[var(--ink)]/10 py-6">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-[var(--muted)]"><span>Time today</span><span>{mins} min</span></div>
                    <input type="range" min={30} max={300} step={15} value={mins} onChange={e => setMins(Number(e.target.value))} className="mt-3 w-full accent-[var(--ink)]" />
                  </div>
                  <div className="h-12 w-px bg-[var(--ink)]/10" />
                  <div className="text-xs text-[var(--muted)]">Left: {left}m<br />Fits: {now.length}</div>
                </div>

                <div className="mt-6">
                  {active.map(t => (
                    <div key={t.id} className="flex gap-4 border-b border-[var(--ink)]/5 py-5">
                      <button onClick={() => setTasks(tasks.map(x => x.id === t.id? {...x, done:!x.done} : x))} className={`mt-1 h-5 w-5 rounded-full border grid place-items-center ${t.done? "bg-[var(--ink)] text-[var(--white)]" : "border-[var(--ink)]/20"}`}>
                        {t.done && <Check size={12} />}
                      </button>
                      <div className="flex-1">
                        <p className={`text-sm leading-6 ${t.done? "line-through text-[var(--muted)]" : ""}`}>{t.text}</p>
                        <div className="mt-2 flex gap-2">
                          <span className="text-xs text-[var(--muted)]">{t.mins}m</span>
                          <button onClick={() => setTasks(tasks.map(x => x.id === t.id? {...x, tag: x.tag === "must"? "should" : x.tag === "should"? "later" : "must"} : x))} className="text-xs rounded-full bg-[var(--white)] border border-[var(--ink)]/10 px-2.5 py-1">{t.tag}</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 flex gap-2">
                    <input value={newText} onChange={e => setNewText(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask()} placeholder="Add a real task, not a wish" className="flex-1 rounded-full border border-[var(--ink)]/10 bg-[var(--white)] px-5 py-3 text-sm outline-none" />
                    <button onClick={addTask} className="rounded-full bg-[var(--ink)] text-[var(--white)] px-6 text-sm">Add</button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="sticky top-8 rounded-3xl bg-[var(--white)] border border-[var(--ink)]/10 p-8">
                  <div className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-[var(--cream)]">
                    <Image src="/images/moment-02.jpg" alt="make it smaller" fill className="object-cover" />
                  </div>
                  <p className="mt-6 text-sm leading-6 text-[var(--muted)]">
                    We sorted by what has to happen first. You have <span className="text-[var(--ink)] font-medium">{mins} minutes</span> — we fit {now.length} things in that. The rest can wait.
                  </p>
                  <button onClick={() => setView("focus")} className="mt-6 w-full rounded-full bg-[var(--deep-blue)] py-4 text-sm text-[var(--white)]">
                    Make my focus list
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === "focus" && (
          <div className="py-12 md:py-20 grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7">
              <p className="text-xs uppercase tracking-widest text-[var(--teal)]">04 / 04 — Focus</p>
              <h2 className="mt-4 text-5xl md:text-6xl leading-none tracking-tight" style={{ fontFamily: "var(--heading-font)" }}>
                Do this<br /><span className="text-[var(--muted)]">first.</span>
              </h2>
              <div className="mt-10 border-t border-[var(--ink)]/10">
                {now.map((t,i) => (
                  <div key={t.id} className="flex gap-6 border-b border-[var(--ink)]/10 py-8">
                    <span className="text-xs text-[var(--muted)]">0{i+1}</span>
                    <div className="flex-1">
                      <p className="text-xl leading-7">{t.text}</p>
                      <p className="mt-2 text-xs text-[var(--muted)]">{t.mins}m · {t.tag} · {block}</p>
                    </div>
                    <button onClick={() => setTasks(tasks.map(x => x.id === t.id? {...x, done:!x.done} : x))} className="h-9 w-9 rounded-full border border-[var(--ink)]/15 grid place-items-center">
                      <Check size={16} />
                    </button>
                  </div>
                ))}
              </div>
              {later.length > 0 && (
                <div className="mt-12">
                  <p className="text-xs uppercase tracking-widest text-[var(--muted)]">Not now — {later.length}</p>
                  <div className="mt-4 text-sm text-[var(--muted)]">
                    {later.map(t => <div key={t.id} className="flex justify-between py-2 border-b border-[var(--ink)]/5"><span>{t.text}</span><span className="text-xs">{t.mins}m</span></div>)}
                  </div>
                </div>
              )}
            </div>
            <div className="lg:col-span-5">
              <div className="sticky top-8 space-y-4">
                <div className="rounded-3xl overflow-hidden border border-[var(--ink)]/10 bg-[var(--white)]">
                  <div className="relative aspect-[4/3] bg-[var(--cream)]">
                    <Image src="/images/moment-03.jpg" alt="next move" fill className="object-cover" />
                  </div>
                  <div className="p-6">
                    <p className="text-sm leading-6">"{feel}" usually isn't about time. It's about not knowing what counts as progress today.</p>
                  </div>
                </div>
                <button onClick={() => { setView("home"); setFeel(""); setBlock(""); }} className="w-full rounded-full border border-[var(--ink)]/15 py-3 text-sm">
                  Start over
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}