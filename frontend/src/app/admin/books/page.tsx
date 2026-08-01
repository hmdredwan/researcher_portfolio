"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { getToken } from "@/lib/auth";
import { adminList, adminSave, adminDelete } from "@/lib/api";
import type { Book } from "@/lib/types";
import {
  AdminButton,
  AdminCard,
  ConfirmDialog,
  EmptyRow,
  Field,
  Modal,
  Spinner,
  Toast,
  useToast,
} from "@/components/admin/ui";

const empty: Partial<Book> = {
  title: "",
  authors: "",
  description: "",
  year: new Date().getFullYear(),
  publisher: "",
  link: "",
};

export default function AdminBooksPage() {
  const [items, setItems] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Book> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<Book | null>(null);
  const { toast, show } = useToast();

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    adminList.books(token)
      .then(setItems)
      .catch(() => show("Failed to load books", "error"))
      .finally(() => setLoading(false));
  }, [show]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    const token = getToken();
    if (!token || !editing) return;
    setSaving(true);
    try {
      const saved = await adminSave.book(token, editing, editing.id);
      setItems((prev) => {
        const exists = prev.some((b) => b.id === saved.id);
        return exists ? prev.map((b) => (b.id === saved.id ? saved : b)) : [saved, ...prev];
      });
      setEditing(null);
      show("Book saved");
    } catch {
      show("Failed to save book", "error");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    const token = getToken();
    if (!token || !deleting) return;
    try {
      await adminDelete(token, "books", deleting.id);
      setItems((prev) => prev.filter((b) => b.id !== deleting.id));
      setDeleting(null);
      show("Book deleted");
    } catch {
      show("Failed to delete", "error");
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink-900">Books</h1>
          <p className="mt-1 text-ink-500">{items.length} total</p>
        </div>
        <AdminButton onClick={() => setEditing({ ...empty })}>
          <Plus size={16} /> New book
        </AdminButton>
      </div>

      {items.length === 0 ? (
        <EmptyRow message="No books yet. Create your first book." />
      ) : (
        <div className="space-y-3">
          {items.map((b) => (
            <AdminCard key={b.id} className="flex items-center gap-4">
              <div className="grid h-12 w-9 shrink-0 place-items-center rounded bg-indigo-600 text-[8px] font-bold text-white">
                {b.year}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold text-ink-900">{b.title}</h3>
                <p className="truncate text-sm text-ink-500">
                  {b.authors} · {b.publisher || "—"}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                {b.link && (
                  <a href={b.link} target="_blank" rel="noopener noreferrer" className="grid h-9 w-9 place-items-center rounded-lg text-ink-500 hover:bg-ink-100">
                    <ExternalLink size={16} />
                  </a>
                )}
                <button onClick={() => setEditing(b)} className="grid h-9 w-9 place-items-center rounded-lg text-ink-500 hover:bg-indigo-50 hover:text-indigo-600">
                  <Pencil size={16} />
                </button>
                <button onClick={() => setDeleting(b)} className="grid h-9 w-9 place-items-center rounded-lg text-ink-500 hover:bg-red-50 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit book" : "New book"}>
        {editing && (
          <form onSubmit={onSave} className="space-y-4">
            <Field label="Title">
              <input className="input" required value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </Field>
            <Field label="Authors">
              <input className="input" required value={editing.authors || ""} onChange={(e) => setEditing({ ...editing, authors: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea className="input resize-none" rows={4} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Year">
                <input type="number" className="input" required value={editing.year || ""} onChange={(e) => setEditing({ ...editing, year: Number(e.target.value) })} />
              </Field>
              <Field label="Publisher">
                <input className="input" value={editing.publisher || ""} onChange={(e) => setEditing({ ...editing, publisher: e.target.value })} />
              </Field>
            </div>
            <Field label="Link">
              <input className="input" placeholder="https://…" value={editing.link || ""} onChange={(e) => setEditing({ ...editing, link: e.target.value })} />
            </Field>
            <div className="flex justify-end gap-3 pt-2">
              <AdminButton type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</AdminButton>
              <AdminButton type="submit" disabled={saving}>{saving ? "Saving…" : "Save book"}</AdminButton>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Delete book"
        message={`Delete "${deleting?.title}"? This cannot be undone.`}
        onConfirm={onDelete}
        onCancel={() => setDeleting(null)}
      />
      {toast && <Toast {...toast} />}
    </div>
  );
}
