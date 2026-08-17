import Link from "next/link";
import { Github, Linkedin, Globe, Mail, GraduationCap, MapPin } from "lucide-react";
import { getResearcher } from "@/lib/api";
import { dummyResearcher } from "@/lib/dummyData";

export const revalidate = 60;

const interests = [
  "Unified Theory",
  "Theoretical Physics",
  "Quantum Gravity",
  "Fundamental Forces",
  "Cosmology & Astrophysics",
  "Foundations of Physics",
];

const timeline = [
  { year: "2025", title: "Continued research in adaptive optimization", place: "Journal of Machine Learning Research" },
  { year: "2024", title: "Published on low-resource translation & clinical AI", place: "ACL · IEEE J-BHI" },
  { year: "2023", title: "Edge vision transformers & federated personalization", place: "CVPR · NeurIPS Workshop" },
  { year: "2022", title: "Survey on responsible machine learning", place: "ACM Computing Surveys" },
];

export default async function AboutPage() {
  let r: Awaited<ReturnType<typeof getResearcher>> | undefined;
  try {
    r = await getResearcher();
  } catch {
    r = dummyResearcher;
  }

  return (
    <div className="container-page py-16">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">About</p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-ink-900 sm:text-5xl">
          {r?.name || "AKM Mehedi Hasan"}
        </h1>
        {r?.title && <p className="mt-3 text-lg text-ink-500">{r.title}</p>}
      </header>

      <div className="mt-14 grid gap-12 lg:grid-cols-[0.8fr_1.6fr]">
        {/* Profile sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-sm">
            <div className="mx-auto h-40 w-40 overflow-hidden rounded-2xl shadow-lg shadow-indigo-600/20">
              <img src="/images/mehedi.png" alt={r?.name || "Profile"} className="h-full w-full object-cover" />
            </div>
            <h2 className="mt-5 text-center font-serif text-xl font-bold text-ink-900">
              {r?.name}
            </h2>
            {r?.location && (
              <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-ink-500">
                <MapPin size={13} /> {r.location}
              </p>
            )}
            <div className="mt-5 flex justify-center gap-2">
              {r?.github_url && <Icon href={r.github_url} label="GitHub"><Github size={17} /></Icon>}
              {r?.linkedin_url && <Icon href={r.linkedin_url} label="LinkedIn"><Linkedin size={17} /></Icon>}
              {r?.website && <Icon href={r.website} label="Website"><Globe size={17} /></Icon>}
              {r?.email && <Icon href={`mailto:${r.email}`} label="Email"><Mail size={17} /></Icon>}
            </div>
            {r?.email && (
              <a href={`mailto:${r.email}`} className="btn-primary mt-6 w-full">
                <Mail size={15} /> Contact me
              </a>
            )}
          </div>
        </aside>

        {/* Bio */}
        <div>
          <div className="prose-rich max-w-none">
            {(r?.bio || "").split("\n\n").map((para, i) => (
              <p key={i} className="text-lg leading-relaxed text-ink-700">{para}</p>
            ))}
            {!r?.bio && (
              <p className="text-lg text-ink-600">
                A researcher dedicated to building intelligent systems that work for people, with interests spanning machine learning and human-centered computing.
              </p>
            )}
          </div>

          {/* Research interests */}
          <section className="mt-12">
            <h3 className="flex items-center gap-2 font-serif text-2xl font-bold text-ink-900">
              <GraduationCap size={22} className="text-indigo-600" /> Research interests
            </h3>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {interests.map((i) => (
                <span key={i} className="rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
                  {i}
                </span>
              ))}
            </div>
          </section>

          {/* Timeline */}
          <section className="mt-12">
            <h3 className="font-serif text-2xl font-bold text-ink-900">Recent milestones</h3>
            <ol className="mt-6 space-y-6 border-l-2 border-ink-100 pl-6">
              {timeline.map((t) => (
                <li key={t.year} className="relative">
                  <span className="absolute -left-[31px] top-1 grid h-5 w-5 place-items-center rounded-full border-2 border-white bg-indigo-600 ring-4 ring-indigo-50" />
                  <p className="text-sm font-bold text-indigo-600">{t.year}</p>
                  <p className="mt-0.5 font-semibold text-ink-900">{t.title}</p>
                  <p className="text-sm text-ink-500">{t.place}</p>
                </li>
              ))}
            </ol>
          </section>

          <div className="mt-12">
            <Link href="/papers" className="btn-primary">Explore my research →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Icon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full border border-ink-200 text-ink-600 transition hover:border-indigo-300 hover:text-indigo-600">
      {children}
    </a>
  );
}
