"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  PenLine,
  Mail,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ExternalLink,
  GraduationCap,
  Image,
} from "lucide-react";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/papers", label: "Papers", icon: FileText },
  { href: "/admin/books", label: "Books", icon: BookOpen },
  { href: "/admin/articles", label: "Articles", icon: PenLine },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/notices", label: "Notices", icon: Bell },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/profile", label: "Profile", icon: User },
];

export default function AdminShell({
  children,
  onLogout,
}: {
  children: React.ReactNode;
  onLogout: () => void;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname?.startsWith(href);

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-ink-900 text-white transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600">
            <GraduationCap size={18} />
          </span>
          <div>
            <p className="text-sm font-bold leading-none">Admin Panel</p>
            <p className="text-[11px] text-ink-400">Mehedi Hasan</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {nav.map((item) => {
            const active = isActive(item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active ? "bg-indigo-600 text-white" : "text-ink-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute inset-x-0 bottom-0 space-y-1 border-t border-white/10 p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-300 hover:bg-white/5 hover:text-white"
          >
            <ExternalLink size={17} /> View site
          </Link>
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-300 hover:bg-red-500/10"
          >
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-ink-100 bg-white px-5 lg:px-8">
          <button
            className="grid h-9 w-9 place-items-center rounded-lg text-ink-700 lg:hidden"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <p className="font-serif text-lg font-bold text-ink-900">Dashboard</p>
        </header>
        <div className="p-5 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
