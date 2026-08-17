import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, BookOpen, PenLine, Sparkles, MapPin, Megaphone } from "lucide-react";
import { getResearcher, getStats, getPapers, getArticles, getNotices } from "@/lib/api";
import { PaperCard, ArticleCard } from "@/components/Cards";
import { initials } from "@/lib/utils";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const researcher = await getResearcher().catch(() => undefined);
  const name = researcher?.name || "AKM Mehedi Hasan";
  const title = researcher?.title || "Physicist & Researcher";
  const tagline =
    researcher?.tagline ||
    "Researching the universal theory of physics and exploring the fundamental laws of the universe.";

  const description = `${name} is a ${title.toLowerCase()} exploring the universal theory of physics, theoretical science, and the foundation of physical reality through research and publication.`;

  return {
    title: `${name} | ${title}`,
    description,
    keywords: [
      name,
      title,
      "universal theory of physics",
      "theoretical physics",
      "physics researcher",
      "scientific research",
      "fundamental physics",
      "research portfolio",
    ],
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: `${name} | ${title}`,
      description: tagline,
      type: "website",
      url: "/",
      siteName: name,
      images: [
        {
          url: "/images/favicon/android-chrome-512x512.png",
          width: 512,
          height: 512,
          alt: `${name} research portfolio`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | ${title}`,
      description: tagline,
      images: ["/images/favicon/android-chrome-512x512.png"],
    },
  };
}

export default async function HomePage() {
  let researcher: Awaited<ReturnType<typeof getResearcher>> | undefined;
  let stats: Awaited<ReturnType<typeof getStats>> | undefined;
  let papers: Awaited<ReturnType<typeof getPapers>> = [];
  let articles: Awaited<ReturnType<typeof getArticles>> = [];
  let notices: Awaited<ReturnType<typeof getNotices>> = [];

  try {
    [researcher, stats, papers, articles, notices] = await Promise.all([
      getResearcher(),
      getStats(),
      getPapers(),
      getArticles(),
      getNotices(),
    ]);
  } catch {
    // graceful fallback if API is down
  }

  const featuredPapers = papers.filter((p) => p.featured).slice(0, 3);
  const latestArticles = articles.slice(0, 3);
  const r = researcher;
  const marqueeNotices = notices.length > 0 ? [...notices] : [];

  return (
    <>
      {/* HERO */}
      {marqueeNotices.length > 0 && (
        <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-600/10">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-indigo-600 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-cyan-500 to-transparent" />
          <div className="relative z-10 flex items-center gap-3 overflow-hidden py-3">
            <div className="notice-marquee flex min-w-full flex-1 items-center gap-8 whitespace-nowrap text-sm font-medium text-white/95">
              {marqueeNotices.map((notice, index) => (
                <div key={`${notice.id}-${index}`} className="flex items-center gap-8">
                  {notice.link ? (
                    <a href={notice.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition hover:text-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-200" />
                      {notice.text}
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-200" />
                      {notice.text}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <section className="relative overflow-hidden bg-ink-900 text-white">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large gradient orb 1 - Primary */}
          <div className="absolute -top-64 -left-64 h-96 w-96 animate-float-smooth-1 rounded-full bg-gradient-to-br from-indigo-600/40 via-indigo-500/20 to-transparent blur-3xl" />
          
          {/* Large gradient orb 2 - Secondary */}
          <div className="absolute -bottom-40 -right-40 h-full w-full animate-float-smooth-2 rounded-full bg-gradient-to-tl from-cyan-500/25 via-indigo-500/10 to-transparent blur-3xl" />
          
          {/* Mid-range accent orb */}
          <div className="absolute top-1/3 right-1/4 h-80 w-80 animate-glow-pulse rounded-full bg-gradient-to-br from-purple-600/20 to-indigo-400/10 blur-2xl" />
          
          {/* Left accent orb */}
          <div className="absolute top-2/3 left-1/4 h-72 w-72 animate-glow-pulse-delayed rounded-full bg-gradient-to-tr from-indigo-500/15 to-cyan-400/5 blur-2xl" />
          
          {/* Floating particles */}
          <div className="absolute top-1/4 left-1/2 h-2 w-2 animate-float rounded-full bg-indigo-300/30" />
          <div className="absolute top-3/4 right-1/3 h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300/20" />
          <div className="absolute top-1/2 right-1/4 h-2 w-2 animate-float-delayed rounded-full bg-indigo-200/25" />
        </div>
        
        {/* Light rays effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-full animate-light-ray" style={{
            background: 'linear-gradient(90deg, transparent, rgba(129, 140, 248, 0.15), transparent)',
            width: '200%',
            height: '200%',
          }} />
          <div className="absolute -inset-full animate-light-ray-delayed" style={{
            background: 'linear-gradient(90deg, transparent, rgba(79, 70, 229, 0.1), transparent)',
            width: '200%',
            height: '200%',
          }} />
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-hero-grid opacity-50" />
        
        {/* Smooth gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/10 via-ink-900/50 to-ink-900/90" />
        
        {/* Secondary gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/20 via-ink-900/0 to-cyan-950/20" />
        
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="5" /%3E%3C/filter%3E%3Crect width="400" height="400" fill="white" filter="url(%23noiseFilter)" /%3E%3C/svg%3E")',
        }} />
        
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
            <div className="relative rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-md sm:p-8 overflow-hidden animate-glow-expand">
              {/* Shining light wave effect */}
              <div
                className="absolute inset-0 animate-light-wave pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(129, 140, 248, 0.3) 20%, rgba(200, 190, 255, 0.5) 50%, rgba(129, 140, 248, 0.3) 80%, transparent 100%)',
                  backgroundSize: '200% 100%',
                }}
              />
              
              {/* Animated shine effect */}
              <div
                className="absolute inset-0 animate-shine"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                  backgroundSize: '200% 100%',
                }}
              />
              
              {/* Animated border glow */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 animate-shine-border pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, rgba(79, 70, 229, 0), rgba(129, 140, 248, 0.4), rgba(79, 70, 229, 0))',
                  backgroundSize: '200% 100%',
                  filter: 'blur(2px)',
                }}
              />
              
              <div className="relative z-10">
                <p className="text-sm font-medium text-indigo-200">At a glance</p>
                <div className="mt-5 grid grid-cols-3 gap-4">
                  <Link href="/papers">
                    <Stat icon={<FileText size={18} />} value={stats?.papers ?? 0} label="Papers" isLink />
                  </Link>
                  <Link href="/books">
                    <Stat icon={<BookOpen size={18} />} value={stats?.books ?? 0} label="Books" isLink />
                  </Link>
                  <Link href="/articles">
                    <Stat icon={<PenLine size={18} />} value={stats?.articles ?? 0} label="Articles" isLink />
                  </Link>
                </div>
                <div className="mt-6 rounded-2xl bg-white/5 p-4 border border-white/10 hover:border-indigo-400/50 transition-colors duration-500">
                  <p className="text-xs leading-relaxed text-ink-300">
                    &ldquo;{r?.tagline || "Good research is both rigorous and useful."}&rdquo;
                  </p>
                </div>
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

function Stat({ icon, value, label, isLink }: { icon: React.ReactNode; value: number; label: string; isLink?: boolean }) {
  return (
    <div className={`relative rounded-2xl bg-white/5 p-4 text-center transition-all duration-300 ${
      isLink ? 'cursor-pointer hover:bg-white/10 hover:border-indigo-400/50 border border-transparent group overflow-hidden' : ''
    }`}>
      {/* Hover shine effect for interactive stats */}
      {isLink && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(129, 140, 248, 0.2), transparent)',
        }} />
      )}
      
      <div className={`relative z-10 mx-auto mb-2 grid h-9 w-9 place-items-center rounded-lg ${
        isLink ? 'bg-indigo-500/30 group-hover:bg-indigo-500/50 transition-colors duration-300' : 'bg-indigo-500/20'
      } text-indigo-200`}>
        {icon}
      </div>
      <div className={`font-serif text-2xl font-bold transition-all duration-300 ${
        isLink ? 'group-hover:text-indigo-100 group-hover:scale-110' : ''
      }`}>{value}</div>
      <div className={`text-xs transition-all duration-300 ${
        isLink ? 'text-ink-300 group-hover:text-indigo-200' : 'text-ink-300'
      }`}>{label}</div>
      
      {/* Bottom accent line for interactive stats */}
      {isLink && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      )}
    </div>
  );
}
