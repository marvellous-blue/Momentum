"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  Command,
  FileText,
  LayoutDashboard,
  ListTodo,
  MessageSquareText,
  Plus,
  Send,
  Sparkles,
  Trash2,
  X,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";

type Priority = "high" | "normal" | "low";
type Section = "Overview" | "Tasks" | "Assistant" | "Notes" | "Reminders";

type Task = {
  id: string;
  title: string;
  priority: Priority;
  done: boolean;
  dueDate: string;
};

type Note = {
  id: string;
  title: string;
  body: string;
  updatedAt: string;
};

type Reminder = {
  id: string;
  title: string;
  at: string;
  done: boolean;
};

type SavedData = {
  tasks: Task[];
  notes: Note[];
  reminders: Reminder[];
};

const storageKey = "momentum_dashboard_v1";

const navigation: { label: Section; icon: typeof LayoutDashboard }[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Tasks", icon: ListTodo },
  { label: "Assistant", icon: MessageSquareText },
  { label: "Notes", icon: FileText },
  { label: "Reminders", icon: Bell },
];

export default function DashboardPage() {
  const [section, setSection] = useState<Section>("Overview");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState<Priority>("normal");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderAt, setReminderAt] = useState("");
  const [assistantInput, setAssistantInput] = useState("");
  const [assistantReply, setAssistantReply] = useState(
    "Hi. I can help you organize tasks, save an idea, or find what is already on your list."
  );
  const [confirmClear, setConfirmClear] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);
  const [notice, setNotice] = useState("");
  const [notificationPermission, setNotificationPermission] = useState("default");
  const notifiedReminderIds = useRef(new Set<string>());

  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  async function enableNotifications() {
    if (!("Notification" in window)) {
      setNotice("This browser does not support system notifications.");
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);

    if (permission === "granted") {
      setNotice("System notifications are enabled.");
      new Notification("Momentum", {
        body: "Notifications are ready for reminders while Momentum is running.",
        icon: "/images/momentum-logo.png",
      });
    } else {
      setNotice("Notifications were not enabled. You can change this in browser settings.");
    }
  }

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);

      if (saved) {
        const data = JSON.parse(saved) as SavedData;

        setTasks(Array.isArray(data.tasks) ? data.tasks : []);
        setNotes(Array.isArray(data.notes) ? data.notes : []);
        setReminders(Array.isArray(data.reminders) ? data.reminders : []);
      }
    } catch {
      setNotice(
        "Saved data could not be read. Your new changes can still be saved."
      );
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ tasks, notes, reminders })
      );
    } catch {
      setNotice("This browser could not save your latest changes.");
    }
  }, [tasks, notes, reminders, loaded]);

  useEffect(() => {
    const checkReminders = () => {
      reminders.forEach((reminder) => {
        if (
          !reminder.done &&
          new Date(reminder.at).getTime() <= Date.now() &&
          !notifiedReminderIds.current.has(reminder.id)
        ) {
          notifiedReminderIds.current.add(reminder.id);
          setNotice("Reminder: " + reminder.title);

          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Momentum reminder", {
              body: reminder.title,
              icon: "/images/momentum-logo.png",
            });
          }
        }
      });
    };

    checkReminders();
    const reminderInterval = window.setInterval(checkReminders, 15000);
    return () => window.clearInterval(reminderInterval);
  }, [reminders]);

  useEffect(() => {
    if (!timerRunning) return;

    if (timerSeconds <= 0) {
      setTimerRunning(false);
      setTimerFinished(true);
      setNotice("Your focus session is complete.");

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Momentum · Focus session complete", {
          body: "Your focus timer has finished.",
          icon: "/images/momentum-logo.png",
        });
      }
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimerSeconds((current) => current - 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [timerRunning, timerSeconds]);

  const completedCount = tasks.filter((task) => task.done).length;
  const openTasks = tasks.filter((task) => !task.done);
  const progress = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  const upcomingReminders = reminders
    .filter((reminder) => !reminder.done)
    .sort((a, b) => a.at.localeCompare(b.at))
    .slice(0, 3);

  const clockDisplay =
    String(Math.floor(timerSeconds / 60)).padStart(2, "0") +
    ":" +
    String(timerSeconds % 60).padStart(2, "0");

  function addTask(
    title = taskTitle,
    priority = taskPriority,
    dueDate = taskDueDate
  ) {
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setNotice("Give your task a name first.");
      return false;
    }

    const task: Task = {
      id: Date.now().toString() + Math.random().toString(16).slice(2, 7),
      title: cleanTitle,
      priority,
      done: false,
      dueDate,
    };

    setTasks((current) => [task, ...current]);
    setTaskTitle("");
    setTaskDueDate("");
    setTaskPriority("normal");
    setNotice("Task added.");

    return true;
  }

  function addNote(title: string, body: string) {
    const cleanBody = body.trim();
    const cleanTitle =
      title.trim() || cleanBody.split("\n")[0].slice(0, 42) || "Untitled note";

    if (!cleanBody) {
      setNotice("Write something in your note first.");
      return false;
    }

    const note: Note = {
      id: Date.now().toString() + Math.random().toString(16).slice(2, 7),
      title: cleanTitle,
      body: cleanBody,
      updatedAt: new Date().toISOString(),
    };

    setNotes((current) => [note, ...current]);
    setNoteTitle("");
    setNoteBody("");
    setNotice("Note saved on this device.");

    return true;
  }

  function addReminder(title: string, at: string) {
    if (!title.trim() || !at) {
      setNotice("Add a reminder name and a date and time.");
      return false;
    }

    if (new Date(at).getTime() < Date.now()) {
      setNotice("Choose a future time for this reminder.");
      return false;
    }

    const reminder: Reminder = {
      id: Date.now().toString() + Math.random().toString(16).slice(2, 7),
      title: title.trim(),
      at,
      done: false,
    };

    setReminders((current) =>
      [reminder, ...current].sort((a, b) => a.at.localeCompare(b.at))
    );
    setReminderTitle("");
    setReminderAt("");
    setNotice(
      "Reminder saved. Keep Momentum open if you want to check it here."
    );

    return true;
  }

  function runAssistant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const raw = assistantInput.trim();
    const command = raw.toLowerCase();

    if (!raw) return;

    if (
      command === "show my tasks" ||
      command === "show tasks" ||
      command === "list my tasks"
    ) {
      setSection("Tasks");

      setAssistantReply(
        openTasks.length
          ? "Here are your unfinished tasks. You have " +
              openTasks.length +
              " still open."
          : "You have no unfinished tasks right now."
      );
    } else if (
      command.startsWith("add task:") ||
      command.startsWith("add task ")
    ) {
      const title = raw
        .slice(raw.indexOf("task") + 4)
        .replace(/^[:\s]+/, "")
        .trim();

      if (title) {
        addTask(title, "normal", "");
        setAssistantReply("Added “" + title + "” to your task list.");
        setSection("Tasks");
      } else {
        setAssistantReply(
          "What should the task be called? Try “Add task: Finish my report”."
        );
      }
    } else if (
      command.startsWith("save this idea:") ||
      command.startsWith("save idea:")
    ) {
      const idea = raw.slice(raw.indexOf(":") + 1).trim();

      if (idea) {
        addNote("Saved idea", idea);
        setAssistantReply("Saved that idea in Notes on this device.");
        setSection("Notes");
      } else {
        setAssistantReply(
          "Write the idea after the colon, like “Save this idea: a budgeting app”."
        );
      }
    } else if (
      command.startsWith("i finished") ||
      command.startsWith("mark done")
    ) {
      const searchText = command
        .replace(/^i finished/, "")
        .replace(/^mark done/, "")
        .trim();

      const matches = openTasks.filter(
        (task) => searchText && task.title.toLowerCase().includes(searchText)
      );

      if (matches.length === 1) {
        setTasks((current) =>
          current.map((task) =>
            task.id === matches[0].id ? { ...task, done: true } : task
          )
        );

        setAssistantReply("Marked “" + matches[0].title + "” as done.");
      } else if (matches.length > 1) {
        setAssistantReply(
          "I found more than one matching task. Open Tasks and choose the exact one."
        );
        setSection("Tasks");
      } else {
        setAssistantReply(
          "I couldn't confidently match that to one task. Open Tasks and mark the exact task as done."
        );
        setSection("Tasks");
      }
    } else if (
      command === "delete all my tasks" ||
      command === "delete all tasks" ||
      command === "clear all tasks"
    ) {
      setConfirmClear(true);

      setAssistantReply(
        "This would remove every task saved on this device. Confirm below if you really want to continue."
      );
    } else if (command.startsWith("remind me to")) {
      setSection("Reminders");

      setAssistantReply(
        "I need an exact date and time before I can save a reminder. Use the Reminders form to set both."
      );
    } else if (command === "help" || command === "what can you do") {
      setAssistantReply(
        "Try “Add task: Finish my report”, “Show my tasks”, “I finished Finish my report”, “Save this idea: a budgeting app”, or “Delete all tasks”. I'll ask instead of guessing when something is unclear."
      );
    } else {
      setAssistantReply(
        "I don't know how to do that yet. Try “Add task: …”, “Show my tasks”, or “Save this idea: …”."
      );
    }

    setAssistantInput("");
  }

  function formatDate(value: string) {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function taskForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addTask();
  }

  function reminderForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addReminder(reminderTitle, reminderAt);
  }

  function noteForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addNote(noteTitle, noteBody);
  }

  return (
    <div className="min-h-screen bg-[var(--cream)] text-[var(--ink)]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-64 shrink-0 border-r border-[var(--ink)]/10 bg-[var(--cream)] px-6 py-7 lg:flex lg:flex-col">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/momentum-logo.png"
              alt="Momentum"
              width={180}
              height={60}
              className="h-auto w-36"
              priority
            />
            <span className="text-lg font-semibold tracking-tight">
              momentum
            </span>
          </Link>

          <p className="mt-12 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            Workspace
          </p>

          <nav className="mt-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  onClick={() => setSection(item.label)}
                  className={
                    "flex w-full items-center gap-3 px-3 py-3 text-left text-sm transition-colors " +
                    (section === item.label
                      ? "bg-[var(--deep-blue)] text-white"
                      : "text-[var(--muted)] hover:bg-white hover:text-[var(--deep-blue)]")
                  }
                >
                  <Icon size={17} strokeWidth={1.8} />
                  {item.label}

                  {item.label === "Tasks" && openTasks.length > 0 && (
                    <span
                      className={
                        "ml-auto text-xs " +
                        (section === item.label
                          ? "text-white/70"
                          : "text-[var(--muted)]")
                      }
                    >
                      {openTasks.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-[var(--ink)]/10 pt-5">
            <p className="text-sm leading-6 text-[var(--muted)]">
              A little clarity can change the direction of your day.
            </p>

            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-2 text-xs text-[var(--deep-blue)]"
            >
              Back to Momentum <ArrowRight size={14} />
            </Link>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-[var(--ink)]/10 px-5 py-4 sm:px-8 lg:px-10">
            <Link href="/" className="flex items-center gap-2 lg:hidden">
              <Image
                src="/images/momentum-logo.png"
                alt="Momentum"
                width={180}
                height={60}
                className="h-auto w-32"
                priority
              />
            </Link>

            <div className="flex items-center gap-3">
              <p className="hidden text-xs uppercase tracking-[0.18em] text-[var(--muted)] sm:block">
                Your personal workspace
              </p>
              <button
                onClick={enableNotifications}
                className="rounded-xl rounded-2xl border border-[var(--ink)]/10 bg-white shadow-sm px-3 py-2 text-xs text-[var(--deep-blue)] hover:bg-[var(--mint)]/20"
              >
                <Bell size={14} className="mr-2 inline" />
                {notificationPermission === "granted" ? "Notifications on" : "Enable notifications"}
              </button>
            </div>

            <Link
              href="/"
              className="text-xs text-[var(--muted)] transition-colors hover:text-[var(--deep-blue)]"
            >
              Visit website{" "}
              <ArrowRight size={13} className="ml-1 inline" />
            </Link>
          </header>

          <div className="border-b border-[var(--ink)]/10 px-4 py-2 lg:hidden">
            <nav className="flex gap-1 overflow-x-auto">
              {navigation.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                    onClick={() => setSection(item.label)}
                    className={
                      "flex shrink-0 items-center gap-2 px-3 py-2 text-xs " +
                      (section === item.label
                        ? "bg-[var(--deep-blue)] text-white"
                        : "text-[var(--muted)]")
                    }
                  >
                    <Icon size={14} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <main className="px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            {notice && (
              <div className="mb-6 flex items-center justify-between rounded-2xl border border-[var(--ink)]/10 bg-white shadow-sm px-4 py-3 text-sm">
                <span>{notice}</span>
                <button
                  onClick={() => setNotice("")}
                  aria-label="Dismiss message"
                >
                  <X size={15} />
                </button>
              </div>
            )}

            <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--teal)]">
                  Momentum / Workspace
                </p>

                <h1
                  className="mt-3 text-4xl leading-none tracking-tight text-[var(--deep-blue)] sm:text-5xl"
                  style={{ fontFamily: "var(--heading-font)" }}
                >
                  {section === "Overview"
                    ? "Make room for what matters."
                    : section}
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
                  {section === "Overview"
                    ? "A simple view of today, with your next move close at hand."
                    : section === "Tasks"
                      ? "Keep the important things visible and the next step manageable."
                      : section === "Assistant"
                        ? "Use clear commands. Momentum follows rules, not an AI model."
                        : section === "Notes"
                          ? "Keep useful thoughts and ideas in one place."
                          : "Give a reminder a real date and time so you know when it is due."}
                </p>
              </div>

              {section !== "Assistant" && (
                <button
                  onClick={() =>
                    setSection(
                      section === "Notes"
                        ? "Notes"
                        : section === "Reminders"
                          ? "Reminders"
                          : "Tasks"
                    )
                  }
                  className="inline-flex w-fit items-center gap-2 rounded-xl bg-[var(--deep-blue)] px-4 py-3 text-sm text-white transition-colors hover:bg-[var(--ink)]"
                >
                  <Plus size={16} />
                  {section === "Notes"
                    ? "New note"
                    : section === "Reminders"
                      ? "New reminder"
                      : "Add a task"}
                </button>
              )}
            </div>

            {section === "Overview" && (
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.8fr)]">
                <div className="space-y-6">
                  <section className="rounded-2xl border border-[var(--ink)]/10 bg-white shadow-sm p-5 sm:p-7">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                          Today's progress
                        </p>

                        <p
                          className="mt-3 text-3xl text-[var(--deep-blue)]"
                          style={{ fontFamily: "var(--heading-font)" }}
                        >
                          {completedCount} of {tasks.length} tasks complete
                        </p>
                      </div>

                      <p
                        className="text-2xl text-[var(--teal)]"
                        style={{ fontFamily: "var(--heading-font)" }}
                      >
                        {progress}%
                      </p>
                    </div>

                    <div className="mt-5 h-1.5 w-full bg-[var(--cream)]">
                      <div
                        className="h-full bg-[var(--teal)] transition-all"
                        style={{ width: progress + "%" }}
                      />
                    </div>

                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--muted)]">
                      <span>{openTasks.length} still to do</span>
                      <span>{notes.length} saved notes</span>
                      <span>
                        {reminders.filter((reminder) => !reminder.done).length}{" "}
                        reminders open
                      </span>
                    </div>
                  </section>

                  <section className="rounded-2xl border border-[var(--ink)]/10 bg-white shadow-sm p-5 sm:p-7">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-[var(--teal)]">
                          Your list
                        </p>
                        <h2
                          className="mt-2 text-2xl text-[var(--deep-blue)]"
                          style={{ fontFamily: "var(--heading-font)" }}
                        >
                          Next things to do
                        </h2>
                      </div>

                      <button
                        onClick={() => setSection("Tasks")}
                        className="text-xs text-[var(--muted)] hover:text-[var(--deep-blue)]"
                      >
                        All tasks{" "}
                        <ArrowRight size={13} className="ml-1 inline" />
                      </button>
                    </div>

                    {openTasks.length ? (
                      <div className="mt-5 divide-y divide-[var(--ink)]/10">
                        {openTasks.slice(0, 4).map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center gap-3 py-4"
                          >
                            <button
                              onClick={() =>
                                setTasks((current) =>
                                  current.map((item) =>
                                    item.id === task.id
                                      ? { ...item, done: true }
                                      : item
                                  )
                                )
                              }
                              aria-label={"Complete " + task.title}
                              className="text-[var(--teal)]"
                            >
                              <Circle size={18} strokeWidth={1.6} />
                            </button>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm">{task.title}</p>
                              {task.dueDate && (
                                <p className="mt-1 text-xs text-[var(--muted)]">
                                  Due {task.dueDate}
                                </p>
                              )}
                            </div>

                            <span
                              className={
                                "text-[10px] uppercase tracking-wider " +
                                (task.priority === "high"
                                  ? "text-[var(--teal)]"
                                  : "text-[var(--muted)]")
                              }
                            >
                              {task.priority === "high"
                                ? "Priority"
                                : task.priority === "low"
                                  ? "Later"
                                  : "Normal"}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-5 border-t border-[var(--ink)]/10 py-6 text-sm leading-6 text-[var(--muted)]">
                        Your list is clear. Add one task when you are ready to
                        begin.
                      </p>
                    )}

                    <form
                      onSubmit={taskForm}
                      className="mt-4 flex gap-2 border-t border-[var(--ink)]/10 pt-5"
                    >
                      <input
                        value={taskTitle}
                        onChange={(event) => setTaskTitle(event.target.value)}
                        placeholder="Add one thing to do…"
                        className="min-w-0 flex-1 bg-[var(--cream)]/60 px-3 py-3 text-sm outline-none focus:ring-1 focus:ring-[var(--teal)]"
                      />

                      <button
                        className="grid h-11 w-11 shrink-0 place-items-center bg-[var(--deep-blue)] text-white"
                        aria-label="Add task"
                      >
                        <Plus size={18} />
                      </button>
                    </form>
                  </section>

                  <section className="border border-[var(--ink)]/10 bg-[var(--deep-blue)] p-5 text-white sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-[var(--mint)]">
                          Focus time
                        </p>

                        <h2
                          className="mt-2 text-2xl"
                          style={{ fontFamily: "var(--heading-font)" }}
                        >
                          Give one thing your attention.
                        </h2>

                        <p className="mt-2 text-sm text-white/65">
                          A simple 25-minute timer. No extra setup.
                        </p>
                      </div>

                      <Clock3 size={22} className="text-[var(--mint)]" />
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-5">
                      <p className="font-mono text-4xl tracking-tight sm:text-5xl">
                        {clockDisplay}
                      </p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setTimerFinished(false);
                            setTimerRunning((running) => !running);
                          }}
                          className="inline-flex items-center gap-2 bg-[var(--mint)] px-4 py-2.5 text-sm font-medium text-[var(--deep-blue)]"
                        >
                          {timerRunning ? (
                            <Pause size={15} />
                          ) : (
                            <Play size={15} />
                          )}
                          {timerRunning ? "Pause" : "Start"}
                        </button>

                        <button
                          onClick={() => {
                            setTimerRunning(false);
                            setTimerSeconds(25 * 60);
                            setTimerFinished(false);
                          }}
                          className="grid h-10 w-10 place-items-center border border-white/25 text-white"
                          aria-label="Reset timer"
                        >
                          <RotateCcw size={15} />
                        </button>
                      </div>
                    </div>

                    {timerFinished && (
                      <p className="mt-4 text-sm text-[var(--mint)]">
                        Focus session complete. Take a short break if you need
                        one.
                      </p>
                    )}
                  </section>
                </div>

                <div className="space-y-6">
                  <section className="rounded-2xl border border-[var(--ink)]/10 bg-white shadow-sm p-5 sm:p-7">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center bg-[var(--cream)] text-[var(--deep-blue)]">
                        <Sparkles size={17} />
                      </span>

                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-[var(--teal)]">
                          Quick assistant
                        </p>
                        <h2
                          className="mt-1 text-xl text-[var(--deep-blue)]"
                          style={{ fontFamily: "var(--heading-font)" }}
                        >
                          Say what you need.
                        </h2>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                      Try adding a task or saving an idea in plain language.
                    </p>

                    <form
                      onSubmit={runAssistant}
                      className="mt-5 flex gap-2"
                    >
                      <input
                        value={assistantInput}
                        onChange={(event) =>
                          setAssistantInput(event.target.value)
                        }
                        placeholder="Add task: read chapter one"
                        className="min-w-0 flex-1 rounded-xl border border-[var(--ink)]/10 px-3 py-3 text-sm outline-none focus:border-[var(--teal)]"
                      />

                      <button
                        className="grid h-11 w-11 shrink-0 place-items-center bg-[var(--deep-blue)] text-white"
                        aria-label="Send command"
                      >
                        <Send size={16} />
                      </button>
                    </form>

                    <p className="mt-4 border-l-2 border-[var(--mint)] pl-3 text-xs leading-5 text-[var(--muted)]">
                      {assistantReply}
                    </p>

                    <button
                      onClick={() => setSection("Assistant")}
                      className="mt-4 text-xs text-[var(--deep-blue)] underline underline-offset-4"
                    >
                      Open assistant
                    </button>
                  </section>

                  <section className="rounded-2xl border border-[var(--ink)]/10 bg-white shadow-sm p-5 sm:p-7">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-[var(--teal)]">
                          Coming up
                        </p>
                        <h2
                          className="mt-2 text-2xl text-[var(--deep-blue)]"
                          style={{ fontFamily: "var(--heading-font)" }}
                        >
                          Reminders
                        </h2>
                      </div>

                      <Bell size={19} className="text-[var(--muted)]" />
                    </div>

                    {upcomingReminders.length ? (
                      <div className="mt-4 divide-y divide-[var(--ink)]/10">
                        {upcomingReminders.map((reminder) => (
                          <div key={reminder.id} className="py-3">
                            <p className="text-sm">{reminder.title}</p>
                            <p className="mt-1 text-xs text-[var(--muted)]">
                              {formatDate(reminder.at)}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                        No reminders yet. Add a date and time when something
                        needs your attention.
                      </p>
                    )}

                    <button
                      onClick={() => setSection("Reminders")}
                      className="mt-4 text-xs text-[var(--deep-blue)] underline underline-offset-4"
                    >
                      Manage reminders
                    </button>
                  </section>

                  <section className="rounded-2xl border border-[var(--ink)]/10 bg-white shadow-sm p-5 sm:p-7">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-[var(--teal)]">
                          Keep the thought
                        </p>
                        <h2
                          className="mt-2 text-2xl text-[var(--deep-blue)]"
                          style={{ fontFamily: "var(--heading-font)" }}
                        >
                          Notes
                        </h2>
                      </div>

                      <FileText size={19} className="text-[var(--muted)]" />
                    </div>

                    {notes.length ? (
                      <div className="mt-4 border-t border-[var(--ink)]/10 pt-4">
                        <p className="text-sm font-medium">{notes[0].title}</p>
                        <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-xs leading-5 text-[var(--muted)]">
                          {notes[0].body}
                        </p>
                      </div>
                    ) : (
                      <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                        Save an idea before it slips away.
                      </p>
                    )}

                    <button
                      onClick={() => setSection("Notes")}
                      className="mt-4 text-xs text-[var(--deep-blue)] underline underline-offset-4"
                    >
                      Open notes
                    </button>
                  </section>
                </div>
              </div>
            )}

            {section === "Tasks" && (
              <div className="max-w-4xl rounded-2xl border border-[var(--ink)]/10 bg-white shadow-sm p-5 sm:p-8">
                <form
                  onSubmit={taskForm}
                  className="grid gap-3 border-b border-[var(--ink)]/10 pb-6 md:grid-cols-[minmax(0,1fr)_140px_160px_auto]"
                >
                  <input
                    value={taskTitle}
                    onChange={(event) => setTaskTitle(event.target.value)}
                    placeholder="What needs to get done?"
                    className="min-w-0 rounded-xl border border-[var(--ink)]/10 px-3 py-3 text-sm outline-none focus:border-[var(--teal)]"
                  />

                  <select
                    value={taskPriority}
                    onChange={(event) =>
                      setTaskPriority(event.target.value as Priority)
                    }
                    className="rounded-2xl border border-[var(--ink)]/10 bg-white shadow-sm px-3 py-3 text-sm"
                  >
                    <option value="high">Priority</option>
                    <option value="normal">Normal</option>
                    <option value="low">Can wait</option>
                  </select>

                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(event) => setTaskDueDate(event.target.value)}
                    aria-label="Task due date"
                    className="rounded-xl border border-[var(--ink)]/10 px-3 py-3 text-sm"
                  />

                  <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--deep-blue)] px-4 py-3 text-sm text-white">
                    <Plus size={16} /> Add
                  </button>
                </form>

                <div className="mt-2 divide-y divide-[var(--ink)]/10">
                  {tasks.length ? (
                    tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start gap-3 py-5"
                      >
                        <button
                          onClick={() =>
                            setTasks((current) =>
                              current.map((item) =>
                                item.id === task.id
                                  ? { ...item, done: !item.done }
                                  : item
                              )
                            )
                          }
                          aria-label={
                            task.done
                              ? "Mark task incomplete"
                              : "Mark task complete"
                          }
                          className={
                            "mt-0.5 " +
                            (task.done
                              ? "text-[var(--teal)]"
                              : "text-[var(--muted)]")
                          }
                        >
                          {task.done ? (
                            <CheckCircle2 size={19} />
                          ) : (
                            <Circle size={19} />
                          )}
                        </button>

                        <div className="min-w-0 flex-1">
                          <p
                            className={
                              "text-sm " +
                              (task.done
                                ? "text-[var(--muted)] line-through"
                                : "text-[var(--ink)]")
                            }
                          >
                            {task.title}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-3 text-[10px] uppercase tracking-wider text-[var(--muted)]">
                            <span>
                              {task.priority === "high"
                                ? "Priority"
                                : task.priority === "low"
                                  ? "Can wait"
                                  : "Normal"}
                            </span>

                            {task.dueDate && <span>Due {task.dueDate}</span>}
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            setTasks((current) =>
                              current.filter((item) => item.id !== task.id)
                            )
                          }
                          aria-label={"Delete " + task.title}
                          className="p-1 text-[var(--muted)] hover:text-[var(--deep-blue)]"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="py-12 text-center text-sm text-[var(--muted)]">
                      No tasks yet. Add the first one above.
                    </p>
                  )}
                </div>
              </div>
            )}

            {section === "Assistant" && (
              <div className="grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                <section className="rounded-2xl border border-[var(--ink)]/10 bg-white shadow-sm p-5 sm:p-8">
                  <div className="flex items-start gap-4 border-b border-[var(--ink)]/10 pb-6">
                    <span className="grid h-11 w-11 place-items-center bg-[var(--deep-blue)] text-white">
                      <Command size={20} />
                    </span>

                    <div>
                      <h2
                        className="text-2xl text-[var(--deep-blue)]"
                        style={{ fontFamily: "var(--heading-font)" }}
                      >
                        Momentum assistant
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                        A small rule-based helper. It handles commands it
                        recognizes and tells you when it needs more detail.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 border-l-2 border-[var(--mint)] bg-[var(--cream)]/60 px-4 py-4 text-sm leading-6">
                    {assistantReply}
                  </div>

                  {confirmClear && (
                    <div className="mt-4 border border-[var(--ink)]/15 p-4">
                      <p className="text-sm">
                        Delete all {tasks.length} tasks? This cannot be undone.
                      </p>

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => {
                            setTasks([]);
                            setConfirmClear(false);
                            setAssistantReply(
                              "All tasks have been removed from this device."
                            );
                          }}
                          className="rounded-xl bg-[var(--deep-blue)] px-4 py-2 text-xs text-white"
                        >
                          Yes, delete tasks
                        </button>

                        <button
                          onClick={() => {
                            setConfirmClear(false);
                            setAssistantReply("Nothing was deleted.");
                          }}
                          className="border border-[var(--ink)]/15 px-4 py-2 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <form
                    onSubmit={runAssistant}
                    className="mt-6 flex gap-2"
                  >
                    <input
                      value={assistantInput}
                      onChange={(event) =>
                        setAssistantInput(event.target.value)
                      }
                      placeholder="Type a command…"
                      className="min-w-0 flex-1 border border-[var(--ink)]/15 px-4 py-3 text-sm outline-none focus:border-[var(--teal)]"
                    />

                    <button className="inline-flex items-center gap-2 rounded-xl bg-[var(--deep-blue)] px-4 py-3 text-sm text-white">
                      <Send size={16} />
                      <span className="hidden sm:inline">Send</span>
                    </button>
                  </form>
                </section>

                <aside className="rounded-2xl border border-[var(--ink)]/10 bg-white shadow-sm p-5 sm:p-6">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--teal)]">
                    Try saying
                  </p>

                  <div className="mt-4 space-y-3">
                    {[
                      "Add task: Finish my report",
                      "Show my tasks",
                      "Save this idea: a budgeting app",
                      "I finished Finish my report",
                      "Delete all tasks",
                    ].map((example) => (
                      <button
                        key={example}
                        onClick={() => setAssistantInput(example)}
                        className="block w-full border-b border-[var(--ink)]/10 pb-3 text-left text-xs leading-5 text-[var(--muted)] hover:text-[var(--deep-blue)]"
                      >
                        {example}
                      </button>
                    ))}
                  </div>

                  <p className="mt-5 text-xs leading-5 text-[var(--muted)]">
                    This assistant uses programmed rules. It does not send your
                    text to an AI service.
                  </p>
                </aside>
              </div>
            )}

            {section === "Notes" && (
              <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <form
                  onSubmit={noteForm}
                  className="h-fit rounded-2xl border border-[var(--ink)]/10 bg-white shadow-sm p-5 sm:p-7"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--teal)]">
                    New note
                  </p>

                  <input
                    value={noteTitle}
                    onChange={(event) => setNoteTitle(event.target.value)}
                    placeholder="Give it a title (optional)"
                    className="mt-5 w-full border-b border-[var(--ink)]/15 py-3 text-sm outline-none focus:border-[var(--teal)]"
                  />

                  <textarea
                    value={noteBody}
                    onChange={(event) => setNoteBody(event.target.value)}
                    placeholder="Write an idea, thought, or something to remember…"
                    rows={7}
                    className="mt-4 w-full resize-y bg-[var(--cream)]/50 p-4 text-sm leading-6 outline-none focus:ring-1 focus:ring-[var(--teal)]"
                  />

                  <button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[var(--deep-blue)] px-5 py-3 text-sm text-white">
                    <Plus size={16} /> Save note
                  </button>
                </form>

                <div className="grid content-start gap-3 sm:grid-cols-2">
                  {notes.length ? (
                    notes.map((note) => (
                      <article
                        key={note.id}
                        className="rounded-2xl border border-[var(--ink)]/10 bg-white shadow-sm p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h2
                            className="text-lg text-[var(--deep-blue)]"
                            style={{ fontFamily: "var(--heading-font)" }}
                          >
                            {note.title}
                          </h2>

                          <button
                            onClick={() =>
                              setNotes((current) =>
                                current.filter((item) => item.id !== note.id)
                              )
                            }
                            aria-label={"Delete " + note.title}
                            className="text-[var(--muted)]"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-[var(--muted)]">
                          {note.body}
                        </p>

                        <p className="mt-4 text-[10px] uppercase tracking-wider text-[var(--muted)]">
                          {new Date(note.updatedAt).toLocaleDateString()}
                        </p>
                      </article>
                    ))
                  ) : (
                    <p className="border border-dashed border-[var(--ink)]/20 p-8 text-sm leading-6 text-[var(--muted)] sm:col-span-2">
                      Your saved notes will appear here. They stay in this
                      browser on this device.
                    </p>
                  )}
                </div>
              </div>
            )}

            {section === "Reminders" && (
              <div className="grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                <form
                  onSubmit={reminderForm}
                  className="h-fit rounded-2xl border border-[var(--ink)]/10 bg-white shadow-sm p-5 sm:p-7"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--teal)]">
                    Create a reminder
                  </p>

                  <label className="mt-5 block text-xs text-[var(--muted)]">
                    What should you remember?
                  </label>

                  <input
                    value={reminderTitle}
                    onChange={(event) => setReminderTitle(event.target.value)}
                    placeholder="Call Mum, take a break…"
                    className="mt-2 w-full rounded-xl border border-[var(--ink)]/10 px-3 py-3 text-sm outline-none focus:border-[var(--teal)]"
                  />

                  <label className="mt-5 block text-xs text-[var(--muted)]">
                    Date and time
                  </label>

                  <input
                    type="datetime-local"
                    value={reminderAt}
                    onChange={(event) => setReminderAt(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-[var(--ink)]/10 px-3 py-3 text-sm outline-none focus:border-[var(--teal)]"
                  />

                  <button className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--deep-blue)] px-5 py-3 text-sm text-white">
                    <Bell size={15} /> Save reminder
                  </button>

                  <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
                    These reminders are saved in your browser. This first
                    version does not send notifications while the website is
                    closed.
                  </p>
                </form>

                <section className="rounded-2xl border border-[var(--ink)]/10 bg-white shadow-sm p-5 sm:p-7">
                  <div className="flex items-center justify-between border-b border-[var(--ink)]/10 pb-4">
                    <h2
                      className="text-2xl text-[var(--deep-blue)]"
                      style={{ fontFamily: "var(--heading-font)" }}
                    >
                      Your reminders
                    </h2>

                    <span className="text-xs text-[var(--muted)]">
                      {reminders.filter((reminder) => !reminder.done).length}{" "}
                      open
                    </span>
                  </div>

                  <div className="divide-y divide-[var(--ink)]/10">
                    {reminders.length ? (
                      [...reminders]
                        .sort((a, b) => a.at.localeCompare(b.at))
                        .map((reminder) => (
                          <div
                            key={reminder.id}
                            className="flex items-start gap-3 py-5"
                          >
                            <button
                              onClick={() =>
                                setReminders((current) =>
                                  current.map((item) =>
                                    item.id === reminder.id
                                      ? { ...item, done: !item.done }
                                      : item
                                  )
                                )
                              }
                              aria-label={
                                reminder.done
                                  ? "Reopen reminder"
                                  : "Complete reminder"
                              }
                              className={
                                "mt-0.5 " +
                                (reminder.done
                                  ? "text-[var(--teal)]"
                                  : "text-[var(--muted)]")
                              }
                            >
                              {reminder.done ? (
                                <CheckCircle2 size={18} />
                              ) : (
                                <Circle size={18} />
                              )}
                            </button>

                            <div className="min-w-0 flex-1">
                              <p
                                className={
                                  "text-sm " +
                                  (reminder.done
                                    ? "line-through text-[var(--muted)]"
                                    : "")
                                }
                              >
                                {reminder.title}
                              </p>

                              <p className="mt-1 text-xs text-[var(--muted)]">
                                {formatDate(reminder.at)}
                              </p>
                            </div>

                            <button
                              onClick={() =>
                                setReminders((current) =>
                                  current.filter(
                                    (item) => item.id !== reminder.id
                                  )
                                )
                              }
                              aria-label={"Delete " + reminder.title}
                              className="text-[var(--muted)]"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))
                    ) : (
                      <p className="py-12 text-center text-sm text-[var(--muted)]">
                        Nothing scheduled yet.
                      </p>
                    )}
                  </div>
                </section>
              </div>
            )}

            <p className="mt-10 text-center text-[10px] uppercase tracking-[0.15em] text-[var(--muted)]">
              Your workspace is saved locally on this device
            </p>
          </main>
        </div>
      </div>
    </div>
  );
}