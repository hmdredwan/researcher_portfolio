import Link from "next/link";
import { Github, Linkedin, Mail, Twitter, GraduationCap } from "lucide-react";
import type { Researcher } from "@/lib/types";

export default function Footer({ researcher }: { researcher?: Researcher }) {
  const r = researcher;
  return (
    <footer className="mt-24 border-t border-ink-100 bg-ink-50">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-serif text-lg font-bold text-ink-900">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white">
              <GraduationCap size={18} />
            </span>
            {r?.name || "AKM Mehedi Hasan"}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-500">
            {r?.tagline ||
              "Researcher exploring the frontiers of AI and human-centered computing."}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li><Link className="hover:text-indigo-600" href="/about">About</Link></li>
            <li><Link className="hover:text-indigo-600" href="/papers">Papers</Link></li>
            <li><Link className="hover:text-indigo-600" href="/books">Books</Link></li>
            <li><Link className="hover:text-indigo-600" href="/articles">Articles</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            {r?.email && (
              <li>
                <a className="hover:text-indigo-600" href={`mailto:${r.email}`}>
                  {r.email}
                </a>
              </li>
            )}
            {r?.location && <li>{r.location}</li>}
            <li>
              <Link className="hover:text-indigo-600" href="/contact">Send a message →</Link>
            </li>
            <li>
              <Link className="hover:text-indigo-600 font-medium" href="/admin/login">Admin login →</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900">Connect</h4>
          <div className="mt-3 flex gap-3">
            {r?.github_url && <SocialLink href={r.github_url} label="GitHub"><Github size={18} /></SocialLink>}
            {r?.linkedin_url && <SocialLink href={r.linkedin_url} label="LinkedIn"><Linkedin size={18} /></SocialLink>}
            {r?.twitter_url && <SocialLink href={r.twitter_url} label="Twitter"><Twitter size={18} /></SocialLink>}
            {r?.email && <SocialLink href={`mailto:${r.email}`} label="Email"><Mail size={18} /></SocialLink>}
          </div>
        </div>
      </div>

      <div className="border-t border-ink-100">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-ink-400 sm:flex-row">
          <p>© {new Date().getFullYear()} {r?.name || "AKM Mehedi Hasan"}. All rights reserved.</p>
          <p>Built with Next.js &amp; Django</p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full border border-ink-200 bg-white text-ink-600 transition hover:border-indigo-300 hover:text-indigo-600"
    >
      {children}
    </a>
  );
}
