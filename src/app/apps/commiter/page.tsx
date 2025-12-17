"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const COMMON_TYPES = [
  { value: "feat", label: "Feature", description: "A new feature" },
  { value: "fix", label: "Fix", description: "A bug fix" },
  { value: "docs", label: "Documentation", description: "Documentation only changes" },
  { value: "style", label: "Style", description: "Changes that do not affect the meaning of the code" },
  { value: "refactor", label: "Refactor", description: "A code change that neither fixes a bug nor adds a feature" },
];

const UNCOMMON_TYPES = [
  { value: "perf", label: "Performance", description: "A code change that improves performance" },
  { value: "test", label: "Test", description: "Adding missing tests or correcting existing tests" },
  { value: "build", label: "Build", description: "Changes that affect the build system or external dependencies" },
  { value: "ci", label: "CI", description: "Changes to our CI configuration files and scripts" },
  { value: "revert", label: "Revert", description: "Reverts a previous commit" },
  { value: "chore", label: "Chore", description: "Changes to the build process or auxiliary tools" },
];

const ALL_TYPES = [...COMMON_TYPES, ...UNCOMMON_TYPES];



const LegendItem = ({ item }: { item: typeof COMMON_TYPES[0] }) => (
  <li className="text-sm">
    <div className="flex items-center gap-2 mb-1">
      <span className="font-mono font-bold text-blue-400">{item.value}</span>
    </div>
    <p className="text-neutral-500 leading-snug">{item.description}</p>
  </li>
);

export default function CommiterPage() {
  const [description, setDescription] = useState("");
  const [selectedType, setSelectedType] = useState("feat");
  const [copied, setCopied] = useState(false);



  const escapedDescription = description.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
  const combinedMessage = `git commit -m "${selectedType}:${escapedDescription}"`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(combinedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };




  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 py-12 text-gray-100 relative">
      <Link
        href="/"
        className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-neutral-800/80 bg-neutral-950/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-200 shadow-lg backdrop-blur transition hover:border-neutral-700 hover:bg-neutral-900 sm:left-8 sm:top-8 z-50"
      >
        ← Back
      </Link>
      <div className="flex w-full flex-col gap-8 xl:flex-row xl:items-start xl:justify-center">

        {/* Left Legend (Common) */}
        <div className="w-full xl:w-64 xl:shrink-0 order-2 xl:order-1">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/20 p-6 backdrop-blur-md">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-green-500">Common</h3>
            <ul className="space-y-4">
              {COMMON_TYPES.map((t) => (
                <LegendItem key={t.value} item={t} />
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-10 max-w-3xl order-1 xl:order-2">
          {/* 1. Input Bar */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur transition group-focus-within:opacity-40" />
            <input
              type="text"
              value={description}
              onChange={(e) => {
                let val = e.target.value;
                // Check if user pasted a full git commit command
                const gitRegex = /git\s+commit\s+-m\s+["'](.*)["']/;
                const match = val.match(gitRegex);
                if (match) {
                  val = match[1];
                } else if (val.startsWith('git commit -m "')) {
                  val = val.replace('git commit -m "', '');
                }
                if (val.endsWith('"') && (match || e.target.value.startsWith('git commit'))) {
                  val = val.slice(0, -1);
                }
                setDescription(val);
              }}
              placeholder="What are you committing?"
              className="relative block w-full rounded-2xl border border-neutral-800 bg-neutral-900 px-8 py-8 text-3xl font-medium text-white placeholder-neutral-700 shadow-2xl transition-all focus:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-700"
              autoFocus
            />
          </div>

          {/* 2. Options */}
          <div className="flex flex-wrap gap-3 justify-center">
            {ALL_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setSelectedType(t.value)}
                className={`rounded-xl border px-5 py-2.5 text-sm font-medium transition-all ${selectedType === t.value
                  ? "border-white bg-white text-black scale-105"
                  : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-600 hover:text-white hover:scale-105"
                  }`}
              >
                {t.value}
              </button>
            ))}
          </div>

          {/* 3. Combiner Message (Result) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedType + description}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              onClick={copyToClipboard}
              className="group cursor-pointer rounded-2xl border border-neutral-800 bg-neutral-900/40 p-10 backdrop-blur-sm transition-all hover:bg-neutral-900/60 hover:border-neutral-700 text-center"
            >
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-neutral-600 transition-colors group-hover:text-blue-400">
                {copied ? "Copied!" : "Click to Copy"}
              </div>
              <div className="font-mono text-2xl text-neutral-300 break-words md:text-3xl">
                <span className="text-neutral-500">git commit -m &quot;</span>
                <span className="text-blue-500 font-bold">{selectedType}:</span>
                <span className={!description ? "text-neutral-700" : ""}>{escapedDescription || "..."}</span>
                <span className="text-neutral-500">&quot;</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Legend (Uncommon) */}
        <div className="w-full xl:w-64 xl:shrink-0 order-3 xl:order-3">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/20 p-6 backdrop-blur-md">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-neutral-600">Other</h3>
            <ul className="space-y-4">
              {UNCOMMON_TYPES.map((t) => (
                <LegendItem key={t.value} item={t} />
              ))}
            </ul>
          </div>
        </div>

      </div>
    </main>
  );
}
