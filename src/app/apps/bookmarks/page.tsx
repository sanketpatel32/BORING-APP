"use client";

import Link from "next/link";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { FormEvent, useEffect, useMemo, useState } from "react";

type Bookmark = {
  id: string;
  name: string;
  url: string;
  tags: string[];
};

const tagOptions = [
  { label: "games", icon: "🎮" },
  { label: "pirated", icon: "🛳️" },
  { label: "movies", icon: "🎬" },
  { label: "intresting", icon: "✨" },
  { label: "design", icon: "🎨" },
  { label: "inspirations", icon: "💡" },
  { label: "idea", icon: "🧠" },
];

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagChoice, setTagChoice] = useState(tagOptions[0].label);
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    const trimmedUrl = url.trim();
    let normalizedUrl = "";
    if (trimmedUrl.length > 0) {
      normalizedUrl = trimmedUrl.startsWith("http") ? trimmedUrl : `https://${trimmedUrl}`;
      try {
        new URL(normalizedUrl);
      } catch {
        setError("Enter a valid URL.");
        return;
      }
    }

    const payload = {
      id: editingId ?? undefined,
      name: name.trim(),
      url: normalizedUrl,
      url: normalizedUrl,
      tags: selectedTags,
    };

    try {
      const res = await fetch("/api/bookmarks", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setError("Failed to save bookmark.");
        return;
      }
      const data = await res.json();
      const saved = data?.bookmark as Bookmark | undefined;
      if (saved) {
        setBookmarks((prev) => {
          if (editingId) {
            return prev.map((b) => (b.id === editingId ? saved : b));
          }
          return [saved, ...prev];
        });
      }
      setName("");
      setUrl("");
      setSelectedTags([]);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      setError("Failed to save bookmark.");
    }
  };

  const sortedBookmarks = useMemo(() => {
    const term = search.trim().toLowerCase();
    return [...bookmarks]
      .filter((bm) => {
        const matchTerm =
          term.length === 0 ||
          bm.name.toLowerCase().includes(term) ||
          bm.url.toLowerCase().includes(term) ||
          bm.tags.some((t) => t.toLowerCase().includes(term));
        const matchTag = filterTag === "all" || bm.tags.includes(filterTag);
        return matchTerm && matchTag;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [bookmarks, filterTag, search]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/bookmarks");
        if (!res.ok) throw new Error("Load failed");
        const data = await res.json();
        const list = (data?.bookmarks as Bookmark[]) ?? [];
        setBookmarks(list);
      } catch (err) {
        console.error(err);
        setLoadError("Failed to load bookmarks.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const startEdit = (bm: Bookmark) => {
    setEditingId(bm.id);
    setName(bm.name);
    setUrl(bm.url);
    setSelectedTags(bm.tags);
  };

  const deleteBookmark = async (id: string) => {
    try {
      const res = await fetch(`/api/bookmarks?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete bookmark.");
    }
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-black via-neutral-950 to-neutral-900 px-6 py-12 text-gray-100">
      <div className="absolute left-4 top-4 sm:left-8 sm:top-8">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full border border-neutral-800/80 bg-neutral-950/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-200 shadow-lg backdrop-blur transition hover:border-neutral-700 hover:bg-neutral-900"
        >
          ← Back
        </Link>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 shadow-[0_20px_120px_rgba(0,0,0,0.55)] backdrop-blur"
        >
          <div className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-semibold text-gray-200">
                Name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-gray-100 outline-none transition focus:border-neutral-600"
                  placeholder="Site name"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-semibold text-gray-200">
                URL
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-gray-100 outline-none transition focus:border-neutral-600"
                  placeholder="https://example.com"
                />
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-gray-200">
              <span className="text-sm font-semibold text-gray-200">Tags</span>
              <select
                value={tagChoice}
                onChange={(e) => setTagChoice(e.target.value)}
                className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-gray-100 outline-none transition focus:border-neutral-600"
              >
                {tagOptions.map((tag) => (
                  <option key={tag.label} value={tag.label} className="bg-neutral-950 text-gray-100">
                    {tag.icon} {tag.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  if (!selectedTags.includes(tagChoice)) {
                    setSelectedTags((prev) => [...prev, tagChoice]);
                  }
                }}
                className="rounded-full border border-neutral-800 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-black transition hover:border-neutral-700 hover:bg-gray-200"
              >
                Add Tag
              </button>
              <div className="flex flex-wrap items-center gap-2">
                {selectedTags.length === 0 && <span className="text-xs text-neutral-500">No tags selected</span>}
                {selectedTags.map((tag) => {
                  const match = tagOptions.find((t) => t.label === tag);
                  const icon = match?.icon ?? "#";
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTags((prev) => prev.filter((t) => t !== tag))}
                      className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-200 transition hover:border-neutral-700 hover:bg-neutral-850"
                      title="Remove tag"
                    >
                      <span className="opacity-80">{icon}</span>
                      {tag}
                      <span aria-hidden>×</span>
                    </button>
                  );
                })}
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button
                  type="submit"
                  className="rounded-full border border-neutral-800 bg-white px-5 py-2 text-sm font-semibold uppercase tracking-wide text-black transition hover:border-neutral-700 hover:bg-gray-200"
                >
                  {editingId ? "Save changes" : "Add bookmark"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setName("");
                      setUrl("");
                      setSelectedTags([]);
                      setError("");
                    }}
                    className="rounded-full border border-neutral-800 bg-neutral-950 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-100 transition hover:border-neutral-700 hover:bg-neutral-850"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 shadow-[0_20px_120px_rgba(0,0,0,0.55)] backdrop-blur">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xs rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none transition focus:border-neutral-600"
            placeholder="Search name, URL, or tags"
          />
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-gray-100 outline-none transition focus:border-neutral-600"
            title="Filter by tag"
          >
            <option value="all" className="bg-neutral-950 text-gray-100">
              All tags
            </option>
            {tagOptions.map((tag) => (
              <option key={tag.label} value={tag.label} className="bg-neutral-950 text-gray-100">
                {tag.icon} {tag.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading && <div className="text-sm text-neutral-400">Loading bookmarks...</div>}
          {loadError && !loading && <div className="text-sm text-red-400">{loadError}</div>}
          {!loading && !loadError && sortedBookmarks.length === 0 && (
            <div className="text-sm text-neutral-400">No bookmarks found.</div>
          )}
          {!loading &&
            !loadError &&
            sortedBookmarks.map((bm) => {
              const hasUrl = bm.url.trim().length > 0;
              return (
                <div
                  key={bm.id}
                  className="group relative flex h-full flex-col gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 text-left shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:border-neutral-700 hover:bg-neutral-850"
                >
                  <div className="flex items-center justify-between gap-2">
                    {hasUrl ? (
                      <a
                        href={bm.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-white group-hover:text-gray-50 hover:underline"
                      >
                        {bm.name}
                      </a>
                    ) : (
                      <span className="text-lg font-semibold text-white">{bm.name}</span>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(bm)}
                        className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-300 transition hover:border-neutral-700 hover:bg-neutral-900"
                        title="Edit"
                      >
                        <Pencil1Icon />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteBookmark(bm.id)}
                        className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-red-300 transition hover:border-neutral-700 hover:bg-neutral-900"
                        title="Delete"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 break-all">
                    {hasUrl ? bm.url : "No URL provided"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {bm.tags.map((tag) => {
                      const match = tagOptions.find((t) => t.label === tag);
                      const icon = match?.icon ?? "#";
                      return (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-200"
                        >
                          <span className="opacity-80">{icon}</span>
                          {tag}
                        </span>
                      );
                    })}
                    {bm.tags.length === 0 && <span className="text-xs text-neutral-500">No tags</span>}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </main>
  );
}
