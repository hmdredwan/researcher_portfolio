"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getToken } from "@/lib/auth";
import { adminList, adminSave, adminDelete } from "@/lib/api";
import type { Article } from "@/lib/types";
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
import { formatDate } from "@/lib/utils";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const empty: Partial<Article> = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  published: true,
};

export default function AdminArticlesPage() {
  const [items, setItems] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Article> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<Article | null>(null);
  const { toast, show } = useToast();

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    adminList.articles(token)
      .then(setItems)
      .catch(() => show("Failed to load articles", "error"))
      .finally(() => setLoading(false));
  }, [show]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    const token = getToken();
    if (!token || !editing) return;
    const data = { ...editing, slug: editing.slug || slugify(editing.title || "") };
    setSaving(true);
    try {
      const saved = await adminSave.article(token, data, editing.id);
      setItems((prev) => {
        const exists = prev.some((a) => a.id === saved.id);
        return exists ? prev.map((a) => (a.id === saved.id ? saved : a)) : [saved, ...prev];
      });
      setEditing(null);
      show("Article saved");
    } catch {
      show("Failed to save article", "error");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    const token = getToken();
    if (!token || !deleting) return;
    try {
      await adminDelete(token, "articles", deleting.id);
      setItems((prev) => prev.filter((a) => a.id !== deleting.id));
      setDeleting(null);
      show("Article deleted");
    } catch {
      show("Failed to delete", "error");
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink-900">Articles</h1>
          <p className="mt-1 text-ink-500">{items.length} total</p>
        </div>
        <AdminButton onClick={() => setEditing({ ...empty })}>
          <Plus size={16} /> New article
        </AdminButton>
      </div>

      {items.length === 0 ? (
        <EmptyRow message="No articles yet. Write your first article." />
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <AdminCard key={a.id} className="flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-semibold text-ink-900">{a.title}</h3>
                  {!a.published && <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">DRAFT</span>}
                </div>
                <p className="truncate text-sm text-ink-500">
                  /{a.slug} · {formatDate(a.created_at)}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button onClick={() => setEditing(a)} className="grid h-9 w-9 place-items-center rounded-lg text-ink-500 hover:bg-indigo-50 hover:text-indigo-600">
                  <Pencil size={16} />
                </button>
                <button onClick={() => setDeleting(a)} className="grid h-9 w-9 place-items-center rounded-lg text-ink-500 hover:bg-red-50 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit article" : "New article"}>
        {editing && (
          <form onSubmit={onSave} className="space-y-4">
            <Field label="Title">
              <input className="input" required value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: editing.id ? editing.slug : slugify(e.target.value) })} />
            </Field>
            <Field label="Slug (URL)">
              <input className="input" required value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} />
            </Field>
            <Field label="Excerpt">
              <input className="input" value={editing.excerpt || ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} placeholder="Short summary shown in cards" />
            </Field>
            <Field label="Body (separate paragraphs with a blank line)">
              <textarea className="input resize-none" rows={9} value={editing.body || ""} onChange={(e) => setEditing({ ...editing, body: e.target.value })} />
            </Field>
            <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
              <input type="checkbox" className="h-4 w-4 rounded" checked={!!editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
              Published
            </label>
            <div className="flex justify-end gap-3 pt-2">
              <AdminButton type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</AdminButton>
              <AdminButton type="submit" disabled={saving}>{saving ? "Saving…" : "Save article"}</AdminButton>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Delete article"
        message={`Delete "${deleting?.title}"? This cannot be undone.`}
        onConfirm={onDelete}
        onCancel={() => setDeleting(null)}
      />
      {toast && <Toast {...toast} />}
    </div>
  );
}
