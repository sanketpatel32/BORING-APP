"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type TimerState = { endsAt: number } | null;

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function formatClock(now: Date) {
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function formatDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${pad(minutes)}:${pad(seconds)}`;
}

export default function BoringClockPage() {
  const [timer, setTimer] = useState<TimerState>(null);
  const [display, setDisplay] = useState("--:--");

  const hasTimer = useMemo(() => Boolean(timer), [timer]);

  useEffect(() => {
    const tick = () => {
      const nowTs = Date.now();
      const now = new Date(nowTs);

      if (timer) {
        const remaining = timer.endsAt - nowTs;
        if (remaining <= 0) {
          setTimer(null);
          setDisplay(formatClock(now));
          return;
        }
        setDisplay(formatDuration(remaining));
        return;
      }

      setDisplay(formatClock(now));
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timer]);

  const startTimer = () => {
    const minutesInput = window.prompt("Minutes for the timer?", "5");
    if (minutesInput === null) return;
    const minutes = parseInt(minutesInput, 10);
    if (Number.isNaN(minutes) || minutes < 0) {
      window.alert("Enter a valid non-negative number of minutes.");
      return;
    }
    const endsAt = Date.now() + minutes * 60 * 1000;
    setTimer({ endsAt });
  };

  const clearTimer = () => {
    setTimer(null);
  };

  const chars = display.split("");

  return (
    <main className="relative min-h-screen w-screen overflow-hidden bg-gradient-to-b from-black via-neutral-950 to-neutral-900 text-gray-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_45%)] opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.06),transparent_40%)] opacity-70" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-10 sm:py-12">
        <Link
          href="/"
          className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-neutral-800/80 bg-neutral-950/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-200 shadow-lg backdrop-blur transition hover:border-neutral-700 hover:bg-neutral-900 sm:left-8 sm:top-8"
        >
          ← Back
        </Link>

        <div className="relative w-full max-w-6xl overflow-hidden rounded-3xl border border-neutral-800/70 bg-neutral-950/80 px-6 py-10 shadow-[0_20px_120px_rgba(0,0,0,0.55)] backdrop-blur-lg sm:px-12 sm:py-14 lg:px-16 lg:py-16">
          <div className="relative flex flex-col items-center gap-12">
            <div
              aria-live="polite"
              className="flex items-center justify-center rounded-3xl border border-neutral-800 bg-neutral-900/80 px-8 py-10 shadow-[0_20px_80px_rgba(0,0,0,0.4)] sm:px-12 sm:py-12"
            >
              <AnimatePresence initial={false}>
                <motion.div
                  key={display}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.99 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex items-center gap-3 text-[12vw] font-semibold leading-none tracking-[0.18em] text-white sm:text-7xl lg:text-8xl xl:text-9xl"
                >
                  {chars.map((char, idx) => (
                    <motion.span
                      key={`${idx}-${char}`}
                      initial={{ rotateX: -90, opacity: 0 }}
                      animate={{ rotateX: 0, opacity: 1 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="inline-block min-w-[0.8ch] text-center"
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative flex flex-wrap justify-center gap-4 text-sm">
              {!hasTimer && (
                <motion.button
                  type="button"
                  onClick={startTimer}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98, y: 0 }}
                  className="rounded-xl border border-neutral-800 bg-neutral-900 px-5 py-3 font-semibold uppercase tracking-wide text-gray-100 shadow-lg transition hover:border-neutral-700 hover:bg-neutral-850 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300/70"
                >
                  Add Timer
                </motion.button>
              )}
              {hasTimer && (
                <motion.button
                  type="button"
                  onClick={clearTimer}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98, y: 0 }}
                  className="rounded-xl border border-neutral-800 bg-neutral-900 px-5 py-3 font-semibold uppercase tracking-wide text-gray-100 shadow-lg transition hover:border-neutral-700 hover:bg-neutral-850 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300/70"
                >
                  Clear Timer
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
