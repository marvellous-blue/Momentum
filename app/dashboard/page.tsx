"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  FileText,
  LayoutDashboard,
  ListTodo,
  Menu,
  Plus,
  Search,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

type Priority = "high" | "normal" | "low";
type Section = "Overview" | "Tasks" | "Reminders" | "Assistant" | "Notes";

type Task = {
  id: string;
  title: string;
  priority: Priority;
  done: boolean;
  dueDate: string;
  createdAt: string;
};

type Reminder = {
  id: string;
  title: string;
  at: string;
  done: boolean;
};

type Note = {
  id: string;
  title: string;
  body: string;
  updatedAt: string;
};

const STORAGE_KEY = "momentum_dashboard_v2";
const NOTIFIED_KEY = "momentum_notified_reminders_v1";

const navigation: {
  name: Section;
  icon: typeof LayoutDashboard;
}[] = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Tasks", icon: ListTodo },
  { name: "Reminders", icon: Bell },
  { name: "Assistant", icon: Sparkles },
  { name: "Notes", icon: FileText },
];

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatDate(value: string) {
  if (!value) return "No deadline";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "No deadline";

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function reminderStatus(reminder: Reminder) {
  if (reminder.done) return "Completed";

  const time = new Date(reminder.at).getTime();

  if (Number.isNaN(time)) return "Invalid date";
  if (time <= Date.now()) return "Overdue";

  return "Upcoming";
}

export default function DashboardPage() {
  const [section, setSection] = useState<Section>("Overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState<Priority>("normal");
  const [taskDueDate, setTaskDueDate] = useState("");

  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderAt, setReminderAt] = useState("");

  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const [assistantInput, setAssistantInput] = useState("");
  const [assistantReply, setAssistantReply] = useState(
    "Tell me what you need to do. I can help organise tasks, find your next task, and save ideas."
  );

  const [searchText, setSearchText] = useState("");
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission | "unsupported">("default");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const data = JSON.parse(saved);

        setTasks(Array.isArray(data.tasks) ? data.tasks : []);
        setReminders(Array.isArray(data.reminders) ? data.reminders : []);
        setNotes(Array.isArray(data.notes) ? data.notes : []);
      }

      const notified = localStorage.getItem(NOTIFIED_KEY);

      if (notified) {
        const ids = JSON.parse(notified);
        if (Array.isArray(ids)) notifiedIds.current = new Set(ids);
      }
    } catch {
      setNotice("Some saved data could not be loaded.");
    }

    if (!("Notification" in window)) {
      setNotificationPermission("unsupported");
    } else {
      setNotificationPermission(Notification.permission);
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
    if (!timerRunning) return;

    if (timerSeconds <= 0) {
      setTimerRunning(false);
      setTimerFinished(true);
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimerSeconds((current) => current - 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [loaded, reminders]);

  const completedTasks = tasks.filter((task) => task.done).length;
  const remainingTasks = tasks.filter((task) => !task.done);

  const nextTask = useMemo(() => {
    const priorityOrder: Record<Priority, number> = {
      high: 0,
      normal: 1,
      low: 2,
    };

    return [...remainingTasks].sort((a, b) => {
      const aDue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bDue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;

      const aOverdue = aDue < Date.now();
      const bOverdue = bDue < Date.now();

      if (aOverdue !== bOverdue) return aOverdue ? -1 : 1;

      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }

      return aDue - bDue;
    })[0];
  }, [remainingTasks]);

  const upcomingReminders = reminders.filter(
    (reminder) => !reminder.done
  ).length;

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchText.toLowerCase())
  );

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = taskTitle.trim();
    if (!title) return;

    const newTask: Task = {
      id: makeId(),
      title,
      priority: taskPriority,
      done: false,
      dueDate: taskDueDate,
      createdAt: new Date().toISOString(),
    };

    setTasks((current) => [newTask, ...current]);
    setTaskTitle("");
    setTaskDueDate("");
    setTaskPriority("normal");
    setNotice("Task added.");
  }

  function toggleTask(id: string) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  function deleteTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id));
    setNotice("Task deleted.");
  }

  function addReminder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = reminderTitle.trim();
    const time = new Date(reminderAt).getTime();

    if (!title || !reminderAt || Number.isNaN(time)) {
      setNotice("Enter a reminder and a valid date and time.");
      return;
    }

    if (time <= Date.now()) {
      setNotice("Choose a future time for this reminder.");
      return;
    }

    const reminder: Reminder = {
      id: makeId(),
      title,
      at: new Date(time).toISOString(),
      done: false,
    };

    setReminders((current) =>
      [...current, reminder].sort(
        (a, b) =>
          new Date(a.at).getTime() - new Date(b.at).getTime()
      )
    );

    setReminderTitle("");
    setReminderAt("");
    setNotice("Reminder saved.");
  }

  function toggleReminder(id: string) {
    setReminders((current) =>
      current.map((reminder) => {
        if (reminder.id !== id) return reminder;

        const done = !reminder.done;

        if (done) {
          notifiedIds.current.add(id);
        } else {
          notifiedIds.current.delete(id);
        }

        localStorage.setItem(
          NOTIFIED_KEY,
          JSON.stringify([...notifiedIds.current])
        );

        return { ...reminder, done };
      })
    );
  }

  function deleteReminder(id: string) {
    setReminders((current) =>
      current.filter((reminder) => reminder.id !== id)
    );

    notifiedIds.current.delete(id);

    localStorage.setItem(
      NOTIFIED_KEY,
      JSON.stringify([...notifiedIds.current])
    );

    setNotice("Reminder deleted.");
  }

  async function enableNotifications() {
    if (!("Notification" in window)) {
      setNotificationPermission("unsupported");
      setNotice("This browser does not support notifications.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();

      setNotificationPermission(permission);

      if (permission === "granted") {
        setNotice("Browser notifications enabled.");

        new Notification("Momentum", {
          body: "Notifications are working.",
          icon: "/images/momentum-logo.png",
        });
      } else {
        setNotice(
          "Notifications were not enabled. Check your browser site settings."
        );
      }
    } catch {
      setNotice("Could not enable notifications in this browser.");
    }
  }

  function saveNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = noteTitle.trim();
    const body = noteBody.trim();

    if (!title || !body) {
      setNotice("Enter a note title and some text.");
      return;
    }

    if (editingNoteId) {
      setNotes((current) =>
        current.map((note) =>
          note.id === editingNoteId
            ? {
                ...note,
                title,
                body,
                updatedAt: new Date().toISOString(),
              }
            : note
        )
      );

      setNotice("Note updated.");
    } else {
      setNotes((current) => [
        {
          id: makeId(),
          title,
          body,
          updatedAt: new Date().toISOString(),
        },
        ...current,
      ]);

      setNotice("Note saved.");
    }

    setEditingNoteId(null);
    setNoteTitle("");
    setNoteBody("");
  }

  function editNote(note: Note) {
    setEditingNoteId(note.id);
    setNoteTitle(note.title);
    setNoteBody(note.body);
    setSection("Notes");
  }

  function deleteNote(id: string) {
    setNotes((current) => current.filter((note) => note.id !== id));
    setNotice("Note deleted.");
  }

  function handleAssistant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const input = assistantInput.trim();
    const lower = input.toLowerCase();

    if (!input) return;

    if (lower.startsWith("add task:")) {
      const title = input.slice("add task:".length).trim();

      if (!title) {
        setAssistantReply("Write the task after “Add task:”.");
      } else {
        setTasks((current) => [
          {
            id: makeId(),
            title,
            priority: "normal",
            done: false,
            dueDate: "",
            createdAt: new Date().toISOString(),
          },
          ...current,
        ]);

        setAssistantReply(`Added “${title}” to your tasks.`);
      }
    } else if (
      lower.includes("show my tasks") ||
      lower.includes("list my tasks")
    ) {
      const unfinished = tasks.filter((task) => !task.done);

      setAssistantReply(
        unfinished.length
          ? `You have ${unfinished.length} unfinished task(s): ${unfinished
              .slice(0, 5)
              .map((task) => task.title)
              .join(", ")}.`
          : "You have no unfinished tasks. You can add a new one in Tasks."
      );
    } else if (
      lower.includes("next task") ||
      lower.includes("what should i do")
    ) {
      setAssistantReply(
        nextTask
          ? `Consider doing “${nextTask.title}” next. Its priority is ${nextTask.priority}${
              nextTask.dueDate
                ? ` and its deadline is ${formatDate(nextTask.dueDate)}`
                : ""
            }.`
          : "You have no unfinished tasks. Add a task when you are ready."
      );
    } else if (lower.startsWith("save this idea:")) {
      const idea = input.slice("save this idea:".length).trim();

      if (!idea) {
        setAssistantReply("Write your idea after “Save this idea:”.");
      } else {
        setNotes((current) => [
          {
            id: makeId(),
            title: "Idea",
            body: idea,
            updatedAt: new Date().toISOString(),
          },
          ...current,
        ]);

        setAssistantReply("Saved your idea in Notes.");
      }
    } else if (lower.includes("remind me to")) {
      setAssistantReply(
        "I can save reminders, but I need the exact date and time. Open Reminders and enter them in the form."
      );
    } else if (
      lower.includes("delete all tasks") ||
      lower.includes("clear all tasks")
    ) {
      const confirmed = window.confirm(
        "Delete every task? This cannot be undone."
      );

      if (confirmed) {
        setTasks([]);
        setAssistantReply("All tasks have been deleted.");
      } else {
        setAssistantReply("No tasks were deleted.");
      }
    } else {
      setAssistantReply(
        "Try “Add task: Finish my assignment”, “Show my tasks”, “What should I do next?”, or “Save this idea: a budgeting app”."
      );
    }

    setAssistantInput("");
  }

  function changeSection(name: Section) {
    setSection(name);
    setMenuOpen(false);
    setSearchText("");
  }

  const pageTitle: Record<Section, string> = {
    Overview: "Your day, in focus.",
    Tasks: "Make progress, one task at a time.",
    Reminders: "Keep the important things in view.",
    Assistant: "Let's organise your thoughts.",
    Notes: "Keep your ideas somewhere safe.",
  };

  return (
    <div className="min-h-screen bg-[var(--cream)] text-[var(--ink)]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-64 shrink-0 border-r border-[var(--ink)]/10 bg-[var(--cream)] px-6 py-7 lg:flex lg:flex-col">
          <Link href="/" className="flex items-center gap-3">
            <span
              className="grid h-10 w-10 place-items-center bg-[var(--deep-blue)] text-lg text-white"
              style={{ fontFamily: "var(--heading-font)" }}
            >
              M
            </span>
            <span className="text-lg font-semibold tracking-tight">
              momentum
            </span>
          </a>

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            Workspace
          </p>

          <nav className="flex flex-col gap-1">
            {navigation.map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => changeSection(name)}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                  section === name
                    ? "bg-[var(--deep-blue)] text-white"
                    : "text-[var(--muted)] hover:bg-[var(--deep-blue)]/5 hover:text-[var(--ink)]"
                }`}
              >
                <Icon size={18} strokeWidth={1.8} />
                {name}
                {name === "Reminders" && upcomingReminders > 0 && (
                  <span className="ml-auto text-xs">{upcomingReminders}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto border-t border-[var(--deep-blue)]/10 pt-5">
            <p className="text-sm font-medium">One step at a time.</p>
            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
              You don't need to do everything at once.
            </p>
            <a
              href="/"
              className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--teal)] hover:underline"
            >
              Momentum home <ArrowRight size={15} />
            </a>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-[var(--ink)]/10 px-5 py-4 sm:px-8 lg:px-10">
            <Link href="/" className="flex items-center gap-2 lg:hidden">
              <span
                className="grid h-8 w-8 place-items-center bg-[var(--deep-blue)] text-white"
                style={{ fontFamily: "var(--heading-font)" }}
              >
                M
              </span>
              <span className="text-sm font-semibold">momentum</span>
            </Link>

            <p className="hidden text-xs uppercase tracking-[0.18em] text-[var(--muted)] sm:block">
              Your personal workspace
            </p>

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
              <div className="mb-6 flex items-center justify-between border border-[var(--ink)]/10 bg-white px-4 py-3 text-sm">
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
                  className="inline-flex w-fit items-center gap-2 bg-[var(--deep-blue)] px-4 py-3 text-sm text-white transition-colors hover:bg-[var(--ink)]"
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
                  <section className="border border-[var(--ink)]/10 bg-white p-5 sm:p-7">
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

                  <section className="border border-[var(--ink)]/10 bg-white p-5 sm:p-7">
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

                <div className="grid gap-4 sm:grid-cols-3">
                  <StatCard
                    label="Tasks remaining"
                    value={remainingTasks.length}
                    detail={`${completedTasks} completed`}
                  />
                  <StatCard
                    label="Reminders pending"
                    value={upcomingReminders}
                    detail="Not marked complete"
                  />
                  <StatCard
                    label="Notes saved"
                    value={notes.length}
                    detail="Ideas and thoughts"
                  />
                </div>

                <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
                  <div className="rounded-2xl border border-[var(--deep-blue)]/10 p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--teal)]">
                          Suggested next step
                        </p>
                        <h3 className="mt-2 text-xl font-semibold">
                          {nextTask ? nextTask.title : "Choose something to do"}
                        </h3>
                      </div>
                      <Sparkles
                        className="shrink-0 text-[var(--teal)]"
                        size={23}
                      />
                    </div>

                    {nextTask ? (
                      <>
                        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                          This suggestion considers task priority and deadlines.
                          It is a guide, not a strict schedule.
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                          <span className="rounded-full bg-[var(--deep-blue)]/5 px-3 py-1.5">
                            {nextTask.priority === "high"
                              ? "High priority"
                              : nextTask.priority === "normal"
                                ? "Normal priority"
                                : "Low priority"}
                          </span>
                          {nextTask.dueDate && (
                            <span className="rounded-full bg-[var(--deep-blue)]/5 px-3 py-1.5">
                              Due {formatDate(nextTask.dueDate)}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => toggleTask(nextTask.id)}
                          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--deep-blue)] px-4 py-3 text-sm text-white transition hover:opacity-90"
                        >
                          <Check size={17} />
                          Mark as completed
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => changeSection("Tasks")}
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[var(--deep-blue)] px-4 py-3 text-sm text-white"
                      >
                        Add a task <ArrowRight size={16} />
                      </button>
                    )}
                  </div>

                <div className="space-y-6">
                  <section className="border border-[var(--ink)]/10 bg-white p-5 sm:p-7">
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
                      onSubmit={(event) => {
                        handleAssistant(event);
                      }}
                      className="mt-5"
                    >
                      <input
                        value={assistantInput}
                        onChange={(event) =>
                          setAssistantInput(event.target.value)
                        }
                        placeholder="Add task: read chapter one"
                        className="min-w-0 flex-1 border border-[var(--ink)]/10 px-3 py-3 text-sm outline-none focus:border-[var(--teal)]"
                      />
                      <button
                        type="submit"
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--mint)] px-4 py-3 text-sm font-medium text-[var(--ink)]"
                      >
                        <Send size={16} />
                        Send to assistant
                      </button>
                    </form>
                    <p className="mt-3 text-xs leading-5 text-white/70">
                      {assistantReply}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-[var(--deep-blue)]/10 p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold">Your tasks</h3>
                    <button
                      onClick={() => changeSection("Tasks")}
                      className="text-sm text-[var(--teal)] hover:underline"
                    >
                      All tasks
                    </button>
                  </section>

                  <section className="border border-[var(--ink)]/10 bg-white p-5 sm:p-7">
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

                  <div className="mt-4">
                    {tasks.length === 0 ? (
                      <EmptyState message="Your task list is empty. Add your first task when you're ready." />
                    ) : (
                      tasks.slice(0, 5).map((task) => (
                        <TaskRow
                          key={task.id}
                          task={task}
                          onToggle={toggleTask}
                          onDelete={deleteTask}
                        />
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-[var(--deep-blue)]/10 p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold">Next reminders</h3>
                    <button
                      onClick={() => changeSection("Reminders")}
                      className="text-sm text-[var(--teal)] hover:underline"
                    >
                      All reminders
                    </button>
                  </section>

                  <section className="border border-[var(--ink)]/10 bg-white p-5 sm:p-7">
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

                  <div className="mt-4">
                    {reminders.filter((reminder) => !reminder.done).length ===
                    0 ? (
                      <EmptyState message="No pending reminders. Add one for something you don't want to forget." />
                    ) : (
                      reminders
                        .filter((reminder) => !reminder.done)
                        .slice(0, 4)
                        .map((reminder) => (
                          <ReminderRow
                            key={reminder.id}
                            reminder={reminder}
                            onToggle={toggleReminder}
                            onDelete={deleteReminder}
                          />
                        ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {section === "Tasks" && (
              <div className="max-w-4xl border border-[var(--ink)]/10 bg-white p-5 sm:p-8">
                <form
                  onSubmit={addTask}
                  className="grid gap-3 rounded-2xl border border-[var(--deep-blue)]/10 p-4 sm:grid-cols-2 sm:p-5"
                >
                  <input
                    value={taskTitle}
                    onChange={(event) => setTaskTitle(event.target.value)}
                    placeholder="What needs to get done?"
                    className="min-w-0 border border-[var(--ink)]/10 px-3 py-3 text-sm outline-none focus:border-[var(--teal)]"
                  />

                  <select
                    value={taskPriority}
                    onChange={(event) =>
                      setTaskPriority(event.target.value as Priority)
                    }
                    className="border border-[var(--ink)]/10 bg-white px-3 py-3 text-sm"
                  >
                    <option value="high">High priority</option>
                    <option value="normal">Normal priority</option>
                    <option value="low">Low priority</option>
                  </select>

                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(event) => setTaskDueDate(event.target.value)}
                    aria-label="Task due date"
                    className="border border-[var(--ink)]/10 px-3 py-3 text-sm"
                  />

                  <button className="inline-flex items-center justify-center gap-2 bg-[var(--deep-blue)] px-4 py-3 text-sm text-white">
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

                <div className="rounded-2xl border border-[var(--deep-blue)]/10 p-4 sm:p-5">
                  {filteredTasks.length === 0 ? (
                    <EmptyState message="No matching tasks. Add a task or try a different search." />
                  ) : (
                    filteredTasks.map((task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onDelete={deleteTask}
                      />
                    ))
                  )}
                </div>
              </div>
            )}

            {section === "Assistant" && (
              <div className="grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                <section className="border border-[var(--ink)]/10 bg-white p-5 sm:p-8">
                  <div className="flex items-start gap-4 border-b border-[var(--ink)]/10 pb-6">
                    <span className="grid h-11 w-11 place-items-center bg-[var(--deep-blue)] text-white">
                      <Command size={20} />
                    </span>

                    <div>
                      <h3 className="font-semibold">Browser notifications</h3>
                      <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                        {notificationPermission === "granted"
                          ? "Permission granted. You can receive browser notifications while reminders are checked."
                          : notificationPermission === "denied"
                            ? "Permission is blocked. Change the notification permission in your browser's site settings."
                            : notificationPermission === "unsupported"
                              ? "This browser does not support the Notification API."
                              : "Enable notifications and allow the browser permission request."}
                      </p>
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
                          className="bg-[var(--deep-blue)] px-4 py-2 text-xs text-white"
                        >
                          Yes, delete tasks
                        </button>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded-xl bg-[var(--deep-blue)] px-4 py-3 text-sm text-white"
                  >
                    <Plus size={17} />
                    Save reminder
                  </button>
                </form>

                <div className="rounded-2xl border border-[var(--deep-blue)]/10 p-4 sm:p-5">
                  {reminders.length === 0 ? (
                    <EmptyState message="No reminders yet. Add one with a date and time." />
                  ) : (
                    [...reminders]
                      .sort((a, b) => {
                        if (a.done !== b.done) return a.done ? 1 : -1;
                        return (
                          new Date(a.at).getTime() -
                          new Date(b.at).getTime()
                        );
                      })
                      .map((reminder) => (
                        <ReminderRow
                          key={reminder.id}
                          reminder={reminder}
                          onToggle={toggleReminder}
                          onDelete={deleteReminder}
                        />
                      ))
                  )}
                </div>
              </div>
            )}

            {section === "Assistant" && (
              <div className="mx-auto max-w-3xl space-y-6">
                <PageIntro
                  eyebrow="MOMENTUM ASSISTANT"
                  title={pageTitle.Assistant}
                  description="This assistant uses simple programmed rules to handle supported commands. It does not rely on an AI API."
                />

                <div className="rounded-2xl bg-[var(--deep-blue)] p-5 text-white sm:p-7">
                  <div className="flex items-center gap-3">
                    <Sparkles size={22} className="text-[var(--mint)]" />
                    <h3 className="text-lg font-semibold">What can I help with?</h3>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-white/80">
                    {assistantReply}
                  </p>

                  <form onSubmit={handleAssistant} className="mt-6 flex gap-2">
                    <input
                      value={assistantInput}
                      onChange={(event) =>
                        setAssistantInput(event.target.value)
                      }
                      placeholder="Type a supported command..."
                      className="min-w-0 flex-1 rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-sm text-white outline-none placeholder:text-white/50 focus:border-[var(--mint)]"
                    />

                    <button className="inline-flex items-center gap-2 bg-[var(--deep-blue)] px-4 py-3 text-sm text-white">
                      <Send size={16} />
                      <span className="hidden sm:inline">Send</span>
                    </button>
                  </form>
                </div>

                <aside className="border border-[var(--ink)]/10 bg-white p-5 sm:p-6">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--teal)]">
                    Try saying
                  </p>

                  <div className="mt-4 space-y-3">
                    {[
                      "Add task: Finish my assignment",
                      "Show my tasks",
                      "What should I do next?",
                      "Save this idea: a budgeting app",
                    ].map((command) => (
                      <button
                        key={command}
                        onClick={() => setAssistantInput(command)}
                        className="block w-full rounded-xl border border-[var(--deep-blue)]/10 px-3 py-3 text-left text-sm transition hover:bg-[var(--deep-blue)]/5"
                      >
                        {command}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {section === "Notes" && (
              <div className="space-y-6">
                <PageIntro
                  eyebrow="YOUR NOTES"
                  title={pageTitle.Notes}
                  description="Save ideas, thoughts, and information you want to return to later."
                />

                <form
                  onSubmit={noteForm}
                  className="h-fit border border-[var(--ink)]/10 bg-white p-5 sm:p-7"
                >
                  <input
                    value={noteTitle}
                    onChange={(event) => setNoteTitle(event.target.value)}
                    placeholder="Note title"
                    required
                    className="w-full rounded-xl border border-[var(--deep-blue)]/15 px-3 py-3 text-sm outline-none focus:border-[var(--teal)]"
                  />

                  <textarea
                    value={noteBody}
                    onChange={(event) => setNoteBody(event.target.value)}
                    placeholder="Write your idea here..."
                    required
                    rows={5}
                    className="w-full resize-y rounded-xl border border-[var(--deep-blue)]/15 px-3 py-3 text-sm leading-6 outline-none focus:border-[var(--teal)]"
                  />

                  <button className="mt-4 inline-flex items-center gap-2 bg-[var(--deep-blue)] px-5 py-3 text-sm text-white">
                    <Plus size={16} /> Save note
                  </button>
                </form>

                <div className="grid gap-4 md:grid-cols-2">
                  {notes.length === 0 ? (
                    <div className="md:col-span-2">
                      <EmptyState message="No notes saved yet. Your first idea can start here." />
                    </div>
                  ) : (
                    notes.map((note) => (
                      <article
                        key={note.id}
                        className="border border-[var(--ink)]/10 bg-white p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-semibold">{note.title}</h3>
                          <button
                            onClick={() => deleteNote(note.id)}
                            aria-label={`Delete ${note.title}`}
                            className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-[var(--muted)]">
                          {note.body}
                        </p>

                        <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--deep-blue)]/10 pt-3">
                          <span className="text-xs text-[var(--muted)]">
                            Updated {formatDate(note.updatedAt)}
                          </span>
                          <button
                            onClick={() => editNote(note)}
                            className="text-sm text-[var(--teal)] hover:underline"
                          >
                            Edit note
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </div>
            )}

            {section === "Reminders" && (
              <div className="grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                <form
                  onSubmit={reminderForm}
                  className="h-fit border border-[var(--ink)]/10 bg-white p-5 sm:p-7"
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
                    className="mt-2 w-full border border-[var(--ink)]/10 px-3 py-3 text-sm outline-none focus:border-[var(--teal)]"
                  />

                  <label className="mt-5 block text-xs text-[var(--muted)]">
                    Date and time
                  </label>

                  <input
                    type="datetime-local"
                    value={reminderAt}
                    onChange={(event) => setReminderAt(event.target.value)}
                    className="mt-2 w-full border border-[var(--ink)]/10 px-3 py-3 text-sm outline-none focus:border-[var(--teal)]"
                  />

                  <button className="mt-5 inline-flex items-center gap-2 bg-[var(--deep-blue)] px-5 py-3 text-sm text-white">
                    <Bell size={15} /> Save reminder
                  </button>

                  <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
                    These reminders are saved in your browser. This first
                    version does not send notifications while the website is
                    closed.
                  </p>
                </form>

                <section className="border border-[var(--ink)]/10 bg-white p-5 sm:p-7">
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

      <button
        onClick={() => onDelete(task.id)}
        aria-label={`Delete ${task.title}`}
        className="shrink-0 rounded-lg p-1.5 text-[var(--muted)] transition hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function ReminderRow({
  reminder,
  onToggle,
  onDelete,
}: {
  reminder: Reminder;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const status = reminderStatus(reminder);

  return (
    <div className="flex items-start gap-3 border-b border-[var(--deep-blue)]/10 py-4 last:border-b-0">
      <button
        onClick={() => onToggle(reminder.id)}
        aria-label={
          reminder.done ? "Reopen reminder" : "Mark reminder complete"
        }
        className="mt-0.5 shrink-0 text-[var(--teal)]"
      >
        {reminder.done ? (
          <CheckCircle2 size={20} />
        ) : (
          <Clock3 size={20} />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`break-words text-sm font-medium ${
            reminder.done ? "text-[var(--muted)] line-through" : ""
          }`}
        >
          {reminder.title}
        </p>

        <p className="mt-1 text-xs text-[var(--muted)]">
          {formatTime(reminder.at)}
        </p>

        <span
          className={`mt-2 inline-block rounded-full px-2.5 py-1 text-xs ${
            status === "Overdue"
              ? "bg-red-50 text-red-700"
              : status === "Completed"
                ? "bg-[var(--teal)]/10 text-[var(--teal)]"
                : "bg-[var(--deep-blue)]/5 text-[var(--muted)]"
          }`}
        >
          {status}
        </span>
      </div>

      <button
        onClick={() => onDelete(reminder.id)}
        aria-label={`Delete reminder ${reminder.title}`}
        className="shrink-0 rounded-lg p-1.5 text-[var(--muted)] transition hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}