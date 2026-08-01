"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PaperCard } from "@/components/Cards";
import { tagsToArray } from "@/lib/utils";
import type { Paper } from "@/lib/types";

export default function PapersExplorer({ papers }: { papers: Paper[] }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeYear, setActiveYear] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    papers.forEach((p) => tagsToArray(p.tags).forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [papers]);

  const years = useMemo(() => {
    const set = new Set<number>();
    papers.forEach((p) => set.add(p.year));
    return Array.from(set).sort((a, b) => b - a);
  }, [papers]);

  const filtered = papers.filter((p) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.authors.toLowerCase().includes(q) ||
      p.abstract.toLowerCase().includes(q);
    const matchesTag = !activeTag || tagsToArray(p.tags).includes(activeTag);
    const matchesYear = !activeYear || String(p.year) === activeYear;
    return matchesQuery && matchesTag && matchesYear;
  });

  if (papers.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="mt-10">
      {/* Controls */}
      <div className="flex flex-col gap-4 rounded-2xl border border-ink-100 bg-white p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search papers, authors, abstracts…"
            className="input pl-9"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={activeYear ?? ""}
            onChange={(e) => setActiveYear(e.target.value || null)}
            className="input sm:w-36"
          >
            <option value="">All years</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tag chips */}
      {allTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              !activeTag ? "bg-indigo-600 text-white" : "bg-ink-50 text-ink-600 hover:bg-ink-100"
            }`}
          >
            All topics
          </button>
          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTag(t === activeTag ? null : t)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                activeTag === t ? "bg-indigo-600 text-white" : "bg-ink-50 text-ink-600 hover:bg-ink-100"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <p className="mt-6 text-sm text-ink-500">
        Showing {filtered.length} of {papers.length} papers
      </p>

      <div className="mt-5 grid gap-6 md:grid-cols-2">
        {filtered.map((p) => (
          <PaperCard key={p.id} paper={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-ink-200 py-16 text-center text-ink-500">
          No papers match your filters.
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-10 rounded-2xl border border-dashed border-ink-200 py-20 text-center">
      <p className="text-ink-500">No papers have been published yet.</p>
    </div>
  );
}
