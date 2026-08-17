"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, BookOpen, PenLine, Mail, ArrowRight, Image } from "lucide-react";
import { getToken } from "@/lib/auth";
import { adminList, getStats } from "@/lib/api";
import type { ContactMessage, Stats } from "@/lib/types";
import { AdminCard, Spinner } from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    Promise.all([
      getStats(),
      adminList.messages(token).catch(() => [] as ContactMessage[]),
    ])
      .then(([s, msgs]) => {
        setStats(s);
        setRecent(msgs.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const cards = [
    { label: "Papers", value: stats?.papers ?? 0, icon: FileText, href: "/admin/papers", color: "bg-indigo-50 text-indigo-600" },
    { label: "Books", value: stats?.books ?? 0, icon: BookOpen, href: "/admin/books", color: "bg-emerald-50 text-emerald-600" },
    { label: "Articles", value: stats?.articles ?? 0, icon: PenLine, href: "/admin/articles", color: "bg-amber-50 text-amber-600" },
    { label: "Gallery", value: stats?.gallery ?? 0, icon: Image, href: "/admin/gallery", color: "bg-rose-50 text-rose-600" },
    { label: "Unread messages", value: stats?.messages_unread ?? 0, icon: Mail, href: "/admin/messages", color: "bg-sky-50 text-sky-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-ink-900">Welcome back 👋</h1>
        <p className="mt-1 text-ink-500">Here&apos;s an overview of your portfolio.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.label} href={c.href} className="group">
              <AdminCard className="h-full transition hover:-translate-y-1 hover:shadow-md">
                <div className={`grid h-11 w-11 place-items-center rounded-xl ${c.color}`}>
                  <Icon size={20} />
                </div>
                <p className="mt-4 font-serif text-3xl font-bold text-ink-900">{c.value}</p>
                <p className="mt-0.5 text-sm text-ink-500">{c.label}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 opacity-0 transition group-hover:opacity-100">
                  Manage <ArrowRight size={12} />
                </span>
              </AdminCard>
            </Link>
          );
        })}
      </div>

      <AdminCard>
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-ink-900">Recent messages</h2>
          <Link href="/admin/messages" className="text-sm font-semibold text-indigo-600 hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-4 divide-y divide-ink-100">
          {recent.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-500">No messages yet.</p>
          ) : (
            recent.map((m) => (
              <div key={m.id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-medium text-ink-900">
                    {!m.is_read && <span className="h-2 w-2 rounded-full bg-indigo-600" />}
                    {m.name}
                    <span className="text-xs font-normal text-ink-400">{m.email}</span>
                  </p>
                  <p className="truncate text-sm text-ink-500">{m.subject || m.message}</p>
                </div>
                <span className="ml-3 shrink-0 text-xs text-ink-400">{formatDate(m.created_at)}</span>
              </div>
            ))
          )}
        </div>
      </AdminCard>
    </div>
  );
}
