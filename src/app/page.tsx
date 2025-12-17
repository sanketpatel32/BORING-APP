"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const apps: { href: string; title: string }[] = [
  { href: "/apps/boring-clock", title: "BORING CLOCK" },
  { href: "/apps/docs", title: "DOCS" },
  { href: "/apps/bookmarks", title: "BOOKMARKS" },
  { href: "/apps/commiter", title: "COMMITER" },
  { href: "/apps/app5", title: "APP 5" },
];

export default function Home() {
  return (
    <motion.main
      className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-neutral-900 px-6 py-12 text-gray-100"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.06,
              },
            },
          }}
        >
          {apps.map((app) => (
            <motion.div
              key={app.href}
              variants={{
                hidden: { opacity: 0, y: 18, scale: 0.97 },
                show: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ type: "spring", stiffness: 190, damping: 18 }}
            >
              <Link
                href={app.href}
                className="group relative flex h-full min-h-[220px] items-center justify-center overflow-hidden rounded-2xl border border-neutral-800/70 bg-neutral-950 px-10 py-14 text-xl font-semibold uppercase tracking-wide text-gray-100 shadow-2xl backdrop-blur transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300/60"
              >
                <motion.span
                  whileHover={{ scale: 1.05, rotate: -0.6 }}
                  whileTap={{ scale: 0.97, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="relative z-10 block"
                >
                  {app.title}
                </motion.span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/6 via-neutral-800/30 to-black opacity-0 transition group-hover:opacity-100"
                  initial={false}
                  animate={{ scale: [1, 1.02, 1], rotate: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                />
                <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                  <motion.div
                    className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),rgba(0,0,0,0))]"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileHover={{ scale: 1.05, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.main>
  );
}
