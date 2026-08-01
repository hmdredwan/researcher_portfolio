import Link from "next/link";
import { ArrowRight, FileText, BookOpen, PenLine, Sparkles, MapPin } from "lucide-react";
import { getResearcher, getStats, getPapers, getArticles } from "@/lib/api";
import { PaperCard, ArticleCard } from "@/components/Cards";
import { initials } from "@/lib/utils";

export const revalidate = 60;

export default async function HomePage() {
  let researcher: Awaited<ReturnType<typeof getResearcher>> | undefined;
  let stats: Awaited<ReturnType<typeof getStats>> | undefined;
  let papers: Awaited<ReturnType<typeof getPapers>> = [];
  let articles: Awaited<ReturnType<typeof getArticles>> = [];

  try {
    [researcher, stats, papers, articles] = await Promise.all([
      getResearcher(),
      getStats(),
      getPapers(),
      getArticles(),
    ]);
  } catch {
    // graceful fallback if API is down
  }

  const featuredPapers = papers.filter((p) => p.featured).slice(0, 3);
  const latestArticles = articles.slice(0, 3);
  const r = researcher;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <div className="absolute inset-0 bg-hero-grid opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/40 via-ink-900/70 to-ink-900" />
        <div className="container-page relative grid gap-12 py-24 lg:grid-cols-[1.4fr_1fr] lg:py-32">
          <div className="animate-fade-up">
            {r?.title && (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-indigo-200 backdrop-blur">
                <Sparkles size={13} /> {r.title}
              </span>
            )}
            <h1 className="mt-6 font-serif text-4xl font-bold leading-tight sm:text-6xl">
              {r?.name || "AKM Mehedi Hasan"}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-200">
              {r?.tagline ||
                "Exploring the frontiers of artificial intelligence, machine learning, and human-centered computing."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/papers" className="btn-primary">
                View Research <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Get in Touch
              </Link>
            </div>
            {r?.location && (
              <p className="mt-8 inline-flex items-center gap-2 text-sm text-ink-300">
                <MapPin size={14} /> {r.location}
              </p>
            )}
          </div>

          {/* Stats card */}
          <div className="animate-fade-up [animation-delay:120ms]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:p-8">
              <p className="text-sm font-medium text-indigo-200">At a glance</p>
              <div className="mt-5 grid grid-cols-3 gap-4">
                <Stat icon={<FileText size={18} />} value={stats?.papers ?? 0} label="Papers" />
                <Stat icon={<BookOpen size={18} />} value={stats?.books ?? 0} label="Books" />
                <Stat icon={<PenLine size={18} />} value={stats?.articles ?? 0} label="Articles" />
              </div>
              <div className="mt-6 rounded-2xl bg-white/5 p-4">
                <p className="text-xs leading-relaxed text-ink-300">
                  &ldquo;{r?.tagline || "Good research is both rigorous and useful."}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT TEASER */}
      {r?.bio && (
        <section className="container-page py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:items-center">
            <div className="flex justify-center lg:justify-start">
              <div className="grid h-48 w-48 place-items-center rounded-3xl bg-gradient-to-br from-indigo-500 to-indigo-800 font-serif text-5xl font-bold text-white shadow-xl shadow-indigo-600/20">
                {initials(r.name)}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                About the researcher
              </p>
              <h2 className="section-title mt-2">Bridging curiosity and impact</h2>
              <p className="mt-5 line-clamp-5 text-lg leading-relaxed text-ink-600">
                {r.bio}
              </p>
              <Link href="/about" className="mt-6 inline-flex items-center gap-1.5 font-semibold text-indigo-600 hover:gap-2.5">
                Read full bio <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FEATURED PAPERS */}
      {featuredPapers.length > 0 && (
        <section className="bg-ink-50 py-20">
          <div className="container-page">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                  Selected work
                </p>
                <h2 className="section-title mt-2">Featured papers</h2>
              </div>
              <Link href="/papers" className="hidden items-center gap-1.5 font-semibold text-indigo-600 hover:gap-2.5 sm:inline-flex">
                All papers <ArrowRight size={16} />
              </Link>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredPapers.map((p) => (
                <PaperCard key={p.id} paper={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LATEST ARTICLES */}
      {latestArticles.length > 0 && (
        <section className="container-page py-20">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                From the blog
              </p>
              <h2 className="section-title mt-2">Latest articles</h2>
            </div>
            <Link href="/articles" className="hidden items-center gap-1.5 font-semibold text-indigo-600 hover:gap-2.5 sm:inline-flex">
              All articles <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-page pb-24">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 px-8 py-14 text-center text-white sm:px-16">
          <h2 className="font-serif text-3xl font-bold sm:text-4xl">Let&apos;s build something meaningful</h2>
          <p className="mx-auto mt-4 max-w-xl text-indigo-100">
            Open to collaboration, speaking, and conversations about research.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
          >
            Get in touch <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="rounded-2xl bg-white/5 p-4 text-center">
      <div className="mx-auto mb-2 grid h-9 w-9 place-items-center rounded-lg bg-indigo-500/20 text-indigo-200">
        {icon}
      </div>
      <div className="font-serif text-2xl font-bold">{value}</div>
      <div className="text-xs text-ink-300">{label}</div>
    </div>
  );
}
