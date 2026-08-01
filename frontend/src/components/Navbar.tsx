"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, GraduationCap } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/papers", label: "Papers" },
  { href: "/books", label: "Books" },
  { href: "/articles", label: "Articles" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100 bg-white/80 backdrop-blur-md">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-serif text-lg font-bold text-ink-900">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white">
            <GraduationCap size={20} />
          </span>
          <span className="hidden sm:inline">Mehedi Hasan</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname?.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg text-ink-700 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-ink-100 bg-white md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {links.map((l) => {
              const active =
                l.href === "/" ? pathname === "/" : pathname?.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-medium ${
                    active ? "bg-indigo-50 text-indigo-700" : "text-ink-700 hover:bg-ink-50"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
