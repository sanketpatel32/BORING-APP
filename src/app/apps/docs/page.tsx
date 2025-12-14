"use client";

import { ArrowLeftIcon, ArrowRightIcon, FontBoldIcon, FontItalicIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const fonts = [
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Times New Roman", value: "\"Times New Roman\", Times, serif" },
  { label: "Calibri", value: "Calibri, Candara, Segoe, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Courier New", value: "\"Courier New\", Courier, monospace" },
];

const sizes = [
  { label: "12", value: "2" },
  { label: "14", value: "3" },
  { label: "16", value: "4" },
  { label: "18", value: "5" },
  { label: "20", value: "6" },
];

export default function DocsPage() {
  const editorRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<Range | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await fetch("/api/docs/app2");
        if (!res.ok) return;
        const data = await res.json();
        if (data?.html && editorRef.current) {
          editorRef.current.innerHTML = data.html;
          return;
        }
      } catch (error) {
        console.error("Failed to load doc", error);
      }
      if (editorRef.current && editorRef.current.innerHTML.trim() === "") {
        editorRef.current.innerHTML = "<p>Start typing your doc...</p>";
      }
    };

    fetchDoc();
  }, []);

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  const run = (command: string, value?: string) => {
    if (selectionRef.current) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(selectionRef.current);
    }
    focusEditor();
    document.execCommand(command, false, value);
  };

  const storeSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      selectionRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const saveDoc = async (showStatus = false) => {
    const html = editorRef.current?.innerHTML ?? "";
    setSaving(true);
    if (showStatus) setStatus("Saving...");
    try {
      const res = await fetch("/api/docs/app2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html }),
      });
      if (!res.ok) throw new Error("Save failed");
      const now = new Date();
      setStatus(`Saved at ${now.toLocaleTimeString()}`);
    } catch (error) {
      console.error("Failed to save", error);
      if (showStatus) setStatus("Save failed");
    } finally {
      setSaving(false);
      if (showStatus) {
        setTimeout(() => setStatus(""), 2000);
      }
    }
  };

  useEffect(() => {
    const id = setInterval(() => {
      void saveDoc();
    }, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-black via-neutral-950 to-neutral-900 px-4 py-10 text-gray-100 sm:px-8">
      <div className="absolute left-4 top-4 sm:left-8 sm:top-8">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full border border-neutral-800/80 bg-neutral-950/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-200 shadow-lg backdrop-blur transition hover:border-neutral-700 hover:bg-neutral-900"
        >
          ← Back
        </Link>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-800/70 bg-neutral-950/80 px-4 py-3 shadow-lg backdrop-blur">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
            Doc toolbar
          </span>
          <div className="h-6 w-px bg-neutral-800" aria-hidden />

          <button
            type="button"
            onClick={() => run("bold")}
            onMouseDown={(e) => e.preventDefault()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm font-semibold uppercase tracking-wide text-gray-100 transition hover:border-neutral-700 hover:bg-neutral-850"
            title="Bold"
          >
            <FontBoldIcon />
          </button>

          <button
            type="button"
            onClick={() => run("italic")}
            onMouseDown={(e) => e.preventDefault()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm font-semibold uppercase tracking-wide text-gray-100 transition hover:border-neutral-700 hover:bg-neutral-850"
            title="Italic"
          >
            <FontItalicIcon />
          </button>

          <select
            className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-gray-100 transition hover:border-neutral-700 hover:bg-neutral-850"
            defaultValue={fonts[0]?.value}
            onChange={(e) => run("fontName", e.target.value)}
            onMouseDown={storeSelection}
          >
            {fonts.map((f) => (
              <option key={f.value} value={f.value} className="bg-neutral-900 text-gray-100">
                {f.label}
              </option>
            ))}
          </select>

          <select
            className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-gray-100 transition hover:border-neutral-700 hover:bg-neutral-850"
            defaultValue={sizes[2]?.value}
            onChange={(e) => run("fontSize", e.target.value)}
            onMouseDown={storeSelection}
            title="Font size"
          >
            {sizes.map((s) => (
              <option key={s.value} value={s.value} className="bg-neutral-900 text-gray-100">
                {s.label}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => run("outdent")}
              onMouseDown={(e) => e.preventDefault()}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm font-semibold uppercase tracking-wide text-gray-100 transition hover:border-neutral-700 hover:bg-neutral-850"
              title="Outdent"
            >
              <ArrowLeftIcon />
            </button>
            <button
              type="button"
              onClick={() => run("indent")}
              onMouseDown={(e) => e.preventDefault()}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm font-semibold uppercase tracking-wide text-gray-100 transition hover:border-neutral-700 hover:bg-neutral-850"
              title="Indent"
            >
              <ArrowRightIcon />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-neutral-800/70 bg-neutral-950/80 shadow-[0_20px_120px_rgba(0,0,0,0.55)] backdrop-blur">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,255,255,0.04),transparent_35%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.05),transparent_40%)]" />
          <div className="relative flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 text-xs uppercase tracking-[0.18em] text-neutral-400">
              <span>Docs</span>
              <div className="flex items-center gap-3">
                {status && <span className="text-[11px] font-semibold text-neutral-300">{status}</span>}
                <button
                  type="button"
                  onClick={() => saveDoc(true)}
                  disabled={saving}
                  className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-100 transition hover:border-neutral-700 hover:bg-neutral-850 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
            <div className="h-px bg-neutral-800" aria-hidden />
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={storeSelection}
              className="min-h-[70vh] px-6 pb-12 pt-6 text-base leading-7 text-gray-100 outline-none"
              style={{ fontFamily: fonts[0]?.value }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
