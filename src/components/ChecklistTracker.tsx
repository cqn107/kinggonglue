"use client";

import { useEffect, useMemo, useState } from "react";

export interface ChecklistItem {
  id: string;
  label: string;
  hint?: string;
}

export interface ChecklistSection {
  id: string;
  title: string;
  note?: string;
  /** daily: 按天重置；weekly: 按自然周（周一）重置；manual: 仅手动重置 */
  reset: "daily" | "weekly" | "manual";
  items: ChecklistItem[];
}

function dayKey() {
  return new Date().toISOString().slice(0, 10);
}

function weekKey() {
  const d = new Date();
  // ISO 周一为一周开始：用当年的周一序号做 key
  const day = (d.getDay() + 6) % 7;
  const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - day);
  return monday.toISOString().slice(0, 10);
}

function periodKey(reset: ChecklistSection["reset"]) {
  if (reset === "daily") return dayKey();
  if (reset === "weekly") return weekKey();
  return "manual";
}

interface StoredState {
  periods: Record<string, string>; // sectionId -> periodKey
  checked: Record<string, boolean>; // itemId -> done
}

function load(key: string): StoredState {
  if (typeof window === "undefined") return { periods: {}, checked: {} };
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as StoredState;
  } catch {
    /* 忽略损坏数据 */
  }
  return { periods: {}, checked: {} };
}

export default function ChecklistTracker({
  storageKey,
  sections,
  resetLabel = "重置进度",
}: {
  storageKey: string;
  sections: ChecklistSection[];
  resetLabel?: string;
}) {
  const [state, setState] = useState<StoredState>({ periods: {}, checked: {} });
  const [hydrated, setHydrated] = useState(false);

  // 初始化 + 跨天/跨周自动重置
  useEffect(() => {
    const saved = load(storageKey);
    const next: StoredState = { periods: { ...saved.periods }, checked: { ...saved.checked } };
    for (const s of sections) {
      if (s.reset !== "manual" && next.periods[s.id] !== periodKey(s.reset)) {
        next.periods[s.id] = periodKey(s.reset);
        for (const item of s.items) delete next.checked[item.id];
      }
    }
    setState(next);
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey, hydrated]);

  const toggle = (id: string) =>
    setState((s) => ({ ...s, checked: { ...s.checked, [id]: !s.checked[id] } }));

  const resetAll = () => {
    const next: StoredState = { periods: {}, checked: {} };
    for (const s of sections) {
      next.periods[s.id] = periodKey(s.reset);
      for (const item of s.items) next.checked[item.id] = false;
    }
    setState(next);
  };

  const total = useMemo(
    () => sections.reduce((n, s) => n + s.items.length, 0),
    [sections]
  );
  const doneCount = sections
    .flatMap((s) => s.items)
    .filter((i) => state.checked[i.id]).length;

  return (
    <div className="space-y-6">
      {sections.map((s) => {
        const done = s.items.filter((i) => state.checked[i.id]).length;
        return (
          <section
            key={s.id}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200"
          >
            <div className="flex flex-wrap items-baseline gap-2">
              <h2 className="text-lg font-bold">{s.title}</h2>
              <span className="text-xs text-stone-400">
                {done}/{s.items.length}
                {s.reset === "daily" && " · 每日自动重置"}
                {s.reset === "weekly" && " · 每周一自动重置"}
              </span>
            </div>
            {s.note && <p className="mt-1 text-sm text-stone-500">{s.note}</p>}
            <div className="mt-4 space-y-2">
              {s.items.map((item) => {
                const checked = !!state.checked[item.id];
                return (
                  <label
                    key={item.id}
                    className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-stone-50"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(item.id)}
                      className="mt-1 h-4 w-4 accent-emerald-600"
                    />
                    <span>
                      <span
                        className={
                          checked
                            ? "text-sm text-stone-400 line-through"
                            : "text-sm"
                        }
                      >
                        {item.label}
                      </span>
                      {item.hint && (
                        <span className="block text-xs text-stone-400">
                          {item.hint}
                        </span>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>
        );
      })}

      <div className="flex items-center gap-4">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-200">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${total ? (doneCount / total) * 100 : 0}%` }}
          />
        </div>
        <span className="text-sm text-stone-500">
          {doneCount}/{total}
        </span>
        <button
          onClick={resetAll}
          className="rounded-full bg-stone-100 px-4 py-1.5 text-sm text-stone-600 hover:bg-stone-200"
        >
          {resetLabel}
        </button>
      </div>
    </div>
  );
}
