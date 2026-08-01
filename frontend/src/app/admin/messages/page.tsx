"use client";

import { useEffect, useState } from "react";
import { Mail, MailOpen, Trash2, Inbox } from "lucide-react";
import { getToken } from "@/lib/auth";
import { adminList, adminDelete, adminToggleMessageRead } from "@/lib/api";
import type { ContactMessage } from "@/lib/types";
import {
  AdminCard,
  ConfirmDialog,
  EmptyRow,
  Modal,
  Spinner,
  Toast,
  useToast,
} from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";

export default function AdminMessagesPage() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<ContactMessage | null>(null);
  const [deleting, setDeleting] = useState<ContactMessage | null>(null);
  const { toast, show } = useToast();

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    adminList.messages(token)
      .then(setItems)
      .catch(() => show("Failed to load messages", "error"))
      .finally(() => setLoading(false));
  }, [show]);

  function toggleRead(m: ContactMessage) {
    const token = getToken();
    if (!token) return;
    adminToggleMessageRead(token, m.id, !m.is_read)
      .then((updated) => setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x))))
      .catch(() => show("Failed to update", "error"));
  }

  function openMessage(m: ContactMessage) {
    setOpen(m);
    if (!m.is_read) toggleRead(m);
  }

  function onDelete() {
    const token = getToken();
    if (!token || !deleting) return;
    adminDelete(token, "messages", deleting.id)
      .then(() => {
        setItems((prev) => prev.filter((m) => m.id !== deleting.id));
        if (open?.id === deleting.id) setOpen(null);
        setDeleting(null);
        show("Message deleted");
      })
      .catch(() => show("Failed to delete", "error"));
  }

  if (loading) return <Spinner />;

  const unread = items.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-ink-900">Messages</h1>
        <p className="mt-1 text-ink-500">
          {items.length} total · {unread} unread
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyRow message="No messages yet. Submissions from your contact form appear here." />
      ) : (
        <div className="space-y-3">
          {items.map((m) => (
            <AdminCard
              key={m.id}
              className={`flex cursor-pointer items-center gap-4 transition hover:shadow-md ${
                !m.is_read ? "border-indigo-200 bg-indigo-50/40" : ""
              }`}
            >
              <button onClick={() => openMessage(m)} className="flex min-w-0 flex-1 items-center gap-4 text-left">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${m.is_read ? "bg-ink-100 text-ink-500" : "bg-indigo-600 text-white"}`}>
                  {m.is_read ? <MailOpen size={17} /> : <Mail size={17} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 font-semibold text-ink-900">
                    {!m.is_read && <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-600" />}
                    <span className="truncate">{m.name}</span>
                    <span className="text-xs font-normal text-ink-400">{m.email}</span>
                  </p>
                  <p className="truncate text-sm text-ink-500">{m.subject || m.message}</p>
                </div>
                <span className="shrink-0 text-xs text-ink-400">{formatDate(m.created_at)}</span>
              </button>
              <button
                onClick={() => toggleRead(m)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-500 hover:bg-ink-100"
                title={m.is_read ? "Mark unread" : "Mark read"}
              >
                {m.is_read ? <Mail size={16} /> : <MailOpen size={16} />}
              </button>
              <button
                onClick={() => setDeleting(m)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-500 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </AdminCard>
          ))}
        </div>
      )}

      {/* Detail modal */}
      <Modal open={!!open} onClose={() => setOpen(null)} title={open?.subject || "(no subject)"}>
        {open && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-ink-100 pb-3">
              <div>
                <p className="font-semibold text-ink-900">{open.name}</p>
                <a href={`mailto:${open.email}`} className="text-sm text-indigo-600 hover:underline">{open.email}</a>
              </div>
              <span className="text-xs text-ink-400">{formatDate(open.created_at)}</span>
            </div>
            <p className="whitespace-pre-wrap leading-relaxed text-ink-700">{open.message}</p>
            <a href={`mailto:${open.email}`} className="btn-primary mt-2">Reply via email</a>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Delete message"
        message={`Delete the message from ${deleting?.name}? This cannot be undone.`}
        onConfirm={onDelete}
        onCancel={() => setDeleting(null)}
      />
      {toast && <Toast {...toast} />}
    </div>
  );
}
