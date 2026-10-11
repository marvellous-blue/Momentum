"use client"

import { useState, useEffect } from "react"
import Link from 'next/link'
import { Bell, Check, CheckCircle2, Clock3, ListTodo, Pause, Play, RotateCcw, Sparkles, X, ArrowRight } from "lucide-react"

type TaskItem = { id: string; text: string; rank: "must" | "should" | "skip" }
type PlanItem = TaskItem & { duration: number; state: "active" | "waiting" | "skip" | "done" }

export default function FixMyDay() {
  const [rawInput, setRawInput] = useState("")
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [totalMinutes, setTotalMinutes] = useState(60)
  const [schedule, setSchedule] = useState<PlanItem[]>([])
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [inPlanView, setInPlanView] = useState(false)
  const [banner, setBanner] = useState("")
  const [notificationStatus, setNotificationStatus] = useState("default")

  useEffect(() => {
    let t = localStorage.getItem("fd_tasks")
    if(t){
      try{ setTasks(JSON.parse(t)) }catch{}
    }
    let tm = localStorage.getItem("fd_time")
    if(tm) setTotalMinutes(JSON.parse(tm))

    let sc = localStorage.getItem("fd_schedule")
    if(sc) {
      try{
        let parsed = JSON.parse(sc)
        setSchedule(parsed)
      }catch{}
    }
    let cur = localStorage.getItem("fd_current")
    let vw = localStorage.getItem("fd_view")
    let lf = localStorage.getItem("fd_left")
    if(cur) try{ setCurrentTaskId(JSON.parse(cur)) }catch{}
    if(vw) try{ setInPlanView(JSON.parse(vw)) }catch{}
    if(lf) try{ setTimeLeft(JSON.parse(lf)) }catch{}
    if("Notification" in window) setNotificationStatus(Notification.permission)
  }, [])

  useEffect(() => {
    if(!isTimerActive) return
    if(timeLeft <= 0){
      setIsTimerActive(false)
      setBanner("Your time is up. How did that task go?")
      if("Notification" in window && Notification.permission === "granted"){
        new Notification("Momentum · Time is up", { body: "Your task time has ended." })
      }
      return
    }
    let id = window.setInterval(() => {
      setTimeLeft(v => v - 1)
    }, 1000)
    return () => clearInterval(id)
  }, [isTimerActive, timeLeft])

  function guess(title: string){
    let s = title.toLowerCase()
    if(s.includes("pray") || s.includes("medit")) return 10
    if(s.includes("sweep") || s.includes("clean") || s.includes("dish")) return 15
    if(s.includes("shower") || s.includes("bath")) return 15
    if(s.includes("cook") || s.includes("laundry")) return 25
    if(s.includes("read") || s.includes("study") || s.includes("assign") || s.includes("code")) return 35
    return 20
  }

  function makeTasks(){
    let parts = rawInput.split("\n")
    let cleaned = []
    for(let p of parts){
      let tt = p.trim()
      if(tt.length>0) cleaned.push(tt)
    }
    if(cleaned.length==0){
      setBanner("Add at least one task to get started.")
      return
    }
    let mapped = cleaned.map((title, i) => ({
      id: Date.now() + "-" + i + "-" + Math.floor(Math.random()*100),
      text: title,
      rank: "should" as const
    }))
    setTasks(mapped)
    setSchedule([])
    setInPlanView(false)
    setCurrentTaskId(null)
    setIsTimerActive(false)
    setTimeLeft(0)
    setBanner("")
    localStorage.setItem("fd_tasks", JSON.stringify(mapped))
    localStorage.setItem("fd_schedule", JSON.stringify([]))
  }

  function build(){
    let order: any = { must: 0, should: 1, skip: 2 }
    let sorted = [...tasks]
    sorted.sort((a,b) => order[a.rank] - order[b.rank])
    let budget = totalMinutes
    let result: PlanItem[] = []
    for(let item of sorted){
      let est = guess(item.text)
      if(item.rank==="skip"){
        result.push({...item, duration: est, state: "skip"})
        continue
      }
      if(budget<5){
        result.push({...item, duration: est, state: "waiting"})
        continue
      }
      let use = est
      if(use>budget) use = budget
      budget = budget - use
      result.push({...item, duration: use, state: "active"})
    }
    setSchedule(result)
    setInPlanView(true)
    setIsTimerActive(false)
    localStorage.setItem("fd_schedule", JSON.stringify(result))
    localStorage.setItem("fd_view", JSON.stringify(true))
    let first = result.find(x => x.state==="active")
    if(first){
      setCurrentTaskId(first.id)
      setTimeLeft(first.duration*60)
      localStorage.setItem("fd_current", JSON.stringify(first.id))
      localStorage.setItem("fd_left", JSON.stringify(first.duration*60))
    }
  }

  let activeTask = schedule.find(x => x.id===currentTaskId)
  let mm = Math.floor(timeLeft/60)
  let ss = timeLeft%60
  let display = (mm<10? "0"+mm: mm) + ":" + (ss<10? "0"+ss: ss)

  return (
    <div className="min-h-screen bg-[var(--cream)] text-[var(--ink)]">
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-10">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-[var(--deep-blue)]">
            <span className="h-8 w-8 bg-[var(--deep-blue)] text-white rounded-full grid place-items-center"><Sparkles size={16}/></span>
            Momentum <span className="text-[var(--muted)] font-normal">/ Fix My Day</span>
          </Link>
          <button onClick={async()=>{
            if(!("Notification" in window)){ setBanner("Notifications not supported"); return }
            let p = await Notification.requestPermission()
            setNotificationStatus(p)
            setBanner(p==="granted"? "Notifications enabled": "Notifications are off")
          }} className="text-xs border border-black/10 rounded-full px-4 py-2.5 flex items-center gap-2 bg-white">
            <Bell size={14}/> {notificationStatus==="granted"? "Notifications on": "Enable notifications"}
          </button>
        </div>

        <div className="mt-16 max-w-3xl">
          <p className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[var(--teal)]">A fresh start, right here</p>
          <h1 className="text-6xl md:text-[84px] leading-[0.9] tracking-tight mt-5 text-[var(--deep-blue)]" style={{ fontFamily: "var(--heading-font)" }}>
            Let's make today<br/>feel <span className="italic text-[var(--teal)] font-light">manageable.</span>
          </h1>
          <p className="mt-6 text-[15px] leading-7 text-[var(--muted)] max-w-lg">You don't have to do everything at once. Put your tasks down, choose what matters, and let's make a realistic plan.</p>
        </div>

        {banner && <div className="mt-8 bg-white border border-black/10 rounded-xl px-4 py-3 flex justify-between text-sm"><span>{banner}</span><button onClick={()=> setBanner("")}><X size={16}/></button></div>}

        {!inPlanView && (
          <div className="mt-12 grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
            <div className="bg-white border border-black/10 rounded-[22px] p-6 md:p-8">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-[var(--cream)] grid place-items-center text-[var(--deep-blue)]"><ListTodo size={20}/></div>
                <div><h2 className="text-2xl text-[var(--deep-blue)]" style={{ fontFamily: "var(--heading-font)" }}>Get it all out of your head.</h2><p className="text-sm text-[var(--muted)] mt-1">Write every task on a new line.</p></div>
              </div>
              <textarea value={rawInput} onChange={e=> setRawInput(e.target.value)} placeholder={"Say a prayer\nSweep the house\nFinish my assignment\nGet ready for school"} className="w-full mt-6 bg-[var(--cream)]/60 border border-black/10 rounded-xl p-4 text-sm leading-7 outline-none focus:border-[var(--teal)] min-h-[160px]"/>
              <button onClick={makeTasks} className="mt-5 w-full bg-[var(--deep-blue)] text-white rounded-full py-4 text-sm font-semibold flex justify-center items-center gap-2">Organize my tasks <ArrowRight size={16}/></button>
            </div>
            <div className="bg-[var(--deep-blue)] text-white rounded-[24px] p-8 flex flex-col justify-between">
              <div><p className="text-[11px] tracking-widest uppercase text-[var(--mint)] font-semibold">Before you begin</p><h2 className="text-[36px] leading-[1.1] mt-5" style={{ fontFamily: "var(--heading-font)" }}>A plan should fit your life, not the other way around.</h2></div>
              <div className="mt-10 border-t border-white/10 pt-6 text-sm text-white/60 space-y-3"><div className="flex gap-3 items-center"><CheckCircle2 size={16} className="text-[var(--mint)]"/> Start with your priorities</div><div className="flex gap-3 items-center"><Clock3 size={16} className="text-[var(--mint)]"/> Work with the time you have</div></div>
            </div>
          </div>
        )}

        {!inPlanView && tasks.length>0 && (
          <div className="mt-8 bg-white border border-black/10 rounded-2xl p-6 md:p-8">
            <div className="flex justify-between items-end"><div><p className="text-[11px] uppercase tracking-widest text-[var(--teal)] font-bold">Step 2</p><h2 className="text-3xl mt-1" style={{ fontFamily: "var(--heading-font)" }}>What matters most?</h2></div><p className="text-sm text-black/50">{tasks.length} tasks added</p></div>
            <div className="mt-6 divide-y divide-black/10">
              {tasks.map((t:any)=>(
                <div key={t.id} className="py-4 flex justify-between items-center gap-3">
                  <p className="text-sm font-medium flex-1">{t.text}</p>
                  <select value={t.rank} onChange={e=>{
                    let upd = tasks.map((x:any)=> x.id===t.id? {...x, rank: e.target.value}: x)
                    setTasks(upd)
                    localStorage.setItem("fd_tasks", JSON.stringify(upd))
                  }} className="text-xs border rounded-full px-3 py-2 bg-[var(--cream)]"><option value="must">Must do today</option><option value="should">Should do</option><option value="skip">Can wait</option></select>
                  <button onClick={()=>{
                    let upd = tasks.filter((x:any)=> x.id!==t.id)
                    setTasks(upd)
                    localStorage.setItem("fd_tasks", JSON.stringify(upd))
                  }} className="p-2 text-black/40"><X size={14}/></button>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t">
              <div className="flex justify-between"><h3 className="font-semibold text-[var(--deep-blue)]">How much time do you have?</h3><span className="text-xl text-[var(--teal)]" style={{ fontFamily: "var(--heading-font)" }}>{totalMinutes>=60? `${Math.floor(totalMinutes/60)}h ${totalMinutes%60? totalMinutes%60+"m": ""}`: totalMinutes+" min"}</span></div>
              <input type="range" min={15} max={240} step={5} value={totalMinutes} onChange={e=>{
                let v = Number(e.target.value)
                setTotalMinutes(v)
                localStorage.setItem("fd_time", JSON.stringify(v))
              }} className="w-full mt-5 accent-[var(--teal)]"/>
              <button onClick={build} className="mt-6 w-full bg-[var(--deep-blue)] text-white rounded-full py-4 text-sm font-semibold flex justify-center gap-2 items-center">Build my plan <Sparkles size={16}/></button>
            </div>
          </div>
        )}

        {inPlanView && (
          <div className="mt-12 grid lg:grid-cols-[0.9fr_1.1fr] gap-8">
            <div className="bg-[var(--deep-blue)] text-white rounded-[24px] p-7 h-fit">
              <p className="text-[11px] uppercase tracking-widest text-[var(--mint)]">Your next move</p>
              {activeTask?(
                <>
                <h2 className="text-4xl mt-4 leading-tight" style={{ fontFamily: "var(--heading-font)" }}>{activeTask.text}</h2>
                <p className="text-sm text-white/50 mt-2">{activeTask.duration} minutes planned</p>
                <div className="my-8 border border-white/10 rounded-[20px] bg-white/[0.05] py-8 text-center"><span className="text-6xl font-mono tracking-tight">{display}</span></div>
                <div className="flex gap-3">
                  <button onClick={()=> setIsTimerActive(!isTimerActive)} className="flex-1 bg-[var(--mint)] text-[var(--deep-blue)] rounded-full py-3.5 text-sm font-semibold flex justify-center items-center gap-2">{isTimerActive? <Pause size={16}/>: <Play size={16}/>} {isTimerActive? "Pause": "Start timer"}</button>
                  <button onClick={()=> {setTimeLeft(activeTask.duration*60); setIsTimerActive(false)}} className="border border-white/20 rounded-full px-4 grid place-items-center"><RotateCcw size={16}/></button>
                </div>
                {!isTimerActive && timeLeft===0 && (
                  <div className="mt-5 bg-white/10 rounded-2xl p-4">
                    <div className="grid gap-2 mt-1">
                      <button onClick={()=>{
                        let upd = schedule.map((p:any)=> p.id===currentTaskId? {...p, state: "done"}: p)
                        setSchedule(upd)
                        setIsTimerActive(false)
                        localStorage.setItem("fd_schedule", JSON.stringify(upd))
                        let nxt = upd.find((p:any)=> p.state==="active")
                        if(nxt){ setCurrentTaskId(nxt.id); setTimeLeft(nxt.duration*60) }else{ setCurrentTaskId(null); setBanner("You've reached the end. Well done.") }
                      }} className="bg-white text-[var(--deep-blue)] rounded-full py-3 text-sm font-semibold flex justify-center gap-2"><Check size={14}/> Finished — next task</button>
                      <button onClick={()=> {setTimeLeft(300); setIsTimerActive(true)}} className="border border-white/20 rounded-full py-3 text-sm">Give me 5 more minutes</button>
                      <button onClick={()=>{
                        setIsTimerActive(false)
                        let nxt = schedule.find((p:any)=> p.state==="active" && p.id!==currentTaskId)
                        if(nxt){ setCurrentTaskId(nxt.id); setTimeLeft(nxt.duration*60) }else setCurrentTaskId(null)
                      }} className="text-sm text-white/50 py-2">Not finished — move on</button>
                    </div>
                  </div>
                )}
                </>
              ):(
                <>
                <h2 className="text-[36px] mt-4" style={{ fontFamily: "var(--heading-font)" }}>That's your plan.</h2>
                <p className="text-sm text-white/60 mt-4">You've checked in on your scheduled tasks.</p>
                </>
              )}
            </div>
            <div className="bg-white border border-black/10 rounded-[24px] p-6 md:p-7">
              <div className="flex justify-between items-end"><div><p className="text-[11px] uppercase tracking-widest text-[var(--teal)] font-bold">Your day, simplified</p><h2 className="text-3xl mt-1" style={{ fontFamily: "var(--heading-font)" }}>Your plan</h2></div><p className="text-sm text-black/40">{totalMinutes} minutes available</p></div>
              <div className="mt-6 space-y-3">
                {schedule.map((task:any, idx:any)=>(
                  <div key={task.id} className={`border rounded-xl p-4 ${task.id===currentTaskId? "border-[var(--teal)] bg-[var(--teal)]/5": "border-black/10"}`}>
                    <div className="flex gap-3 items-start">
                      <span className={`h-7 w-7 rounded-full grid place-items-center text-xs ${task.state==="done"? "bg-[var(--teal)] text-white": "bg-[var(--cream)]"}`}>{task.state==="done"? <Check size={12}/>: String(idx+1).padStart(2,"0")}</span>
                      <div className="flex-1"><p className={`text-sm font-semibold ${task.state==="done"? "line-through text-black/40": ""}`}>{task.text}</p><p className="text-xs text-black/50 mt-1 flex gap-2 items-center"><Clock3 size={12}/>{task.state==="skip"||task.state==="waiting"? "No time allocated": task.duration+" min"}</p></div>
                      {task.state==="active" && <button onClick={()=> {setCurrentTaskId(task.id); setTimeLeft(task.duration*60); setIsTimerActive(true)}} className="text-xs border rounded-full px-3 py-1.5">{task.id===currentTaskId? "Selected": "Start"}</button>}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={()=>{
                setInPlanView(false)
                setCurrentTaskId(null)
                localStorage.setItem("fd_view", JSON.stringify(false))
              }} className="mt-6 w-full border rounded-full py-3.5 text-sm font-semibold flex justify-center gap-2"><RotateCcw size={14}/> Adjust my plan</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}