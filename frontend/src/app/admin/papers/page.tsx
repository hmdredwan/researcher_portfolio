"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { getToken } from "@/lib/auth";
import { adminList, adminSave, adminDelete } from "@/lib/api";
import type { Paper } from "@/lib/types";
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

const empty: Partial<Paper> = {
  title: "",
  authors: "",
  abstract: "",
  year: new Date().getFullYear(),
  venue: "",
  doi: "",
  tags: "",
  published: true,
  featured: false,
};

export default function AdminPapersPage() {
  const [items, setItems] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Paper> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<Paper | null>(null);
  const { toast, show } = useToast();

  function load() {
    const token = getToken();
    if (!token) return;
    adminList.papers(token)
      .then(setItems)
      .catch(() => show("Failed to load papers", "error"))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    const token = getToken();
    if (!token || !editing) return;
    setSaving(true);
    try {
      const saved = await adminSave.paper(token, editing, editing.id);
      setItems((prev) => {
        const exists = prev.some((p) => p.id === saved.id);
        return exists ? prev.map((p) => (p.id === saved.id ? saved : p)) : [saved, ...prev];
      });
      setEditing(null);
      show("Paper saved");
    } catch {
      show("Failed to save paper", "error");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    const token = getToken();
    if (!token || !deleting) return;
    try {
      await adminDelete(token, "papers", deleting.id);
      setItems((prev) => prev.filter((p) => p.id !== deleting.id));
      setDeleting(null);
      show("Paper deleted");
    } catch {
      show("Failed to delete", "error");
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink-900">Papers</h1>
          <p className="mt-1 text-ink-500">{items.length} total</p>
        </div>
        <AdminButton onClick={() => setEditing({ ...empty })}>
          <Plus size={16} /> New paper
        </AdminButton>
      </div>

      {items.length === 0 ? (
        <EmptyRow message="No papers yet. Create your first paper." />
      ) : (
        <div className="space-y-3">
          {items.map((p) => (
            <AdminCard key={p.id} className="flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-semibold text-ink-900">{p.title}</h3>
                  {!p.published && <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">DRAFT</span>}
                  {p.featured && <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">FEATURED</span>}
                </div>
                <p className="truncate text-sm text-ink-500">
                  {p.authors} · {p.year} · {p.venue || "—"}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                {p.pdf && (
                  <a href={p.pdf} target="_blank" rel="noopener noreferrer" className="grid h-9 w-9 place-items-center rounded-lg text-ink-500 hover:bg-ink-100">
                    <ExternalLink size={16} />
                  </a>
                )}
                <button onClick={() => setEditing(p)} className="grid h-9 w-9 place-items-center rounded-lg text-ink-500 hover:bg-indigo-50 hover:text-indigo-600">
                  <Pencil size={16} />
                </button>
                <button onClick={() => setDeleting(p)} className="grid h-9 w-9 place-items-center rounded-lg text-ink-500 hover:bg-red-50 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      {/* Edit modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit paper" : "New paper"}>
        {editing && (
          <form onSubmit={onSave} className="space-y-4">
            <Field label="Title">
              <input className="input" required value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </Field>
            <Field label="Authors">
              <input className="input" required value={editing.authors || ""} onChange={(e) => setEditing({ ...editing, authors: e.target.value })} />
            </Field>
            <Field label="Abstract">
              <textarea className="input resize-none" rows={4} value={editing.abstract || ""} onChange={(e) => setEditing({ ...editing, abstract: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Year">
                <input type="number" className="input" required value={editing.year || ""} onChange={(e) => setEditing({ ...editing, year: Number(e.target.value) })} />
              </Field>
              <Field label="Venue">
                <input className="input" value={editing.venue || ""} onChange={(e) => setEditing({ ...editing, venue: e.target.value })} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="DOI">
                <input className="input" value={editing.doi || ""} onChange={(e) => setEditing({ ...editing, doi: e.target.value })} />
              </Field>
              <Field label="PDF URL">
                <input className="input" placeholder="https://…" value={editing.pdf || ""} onChange={(e) => setEditing({ ...editing, pdf: e.target.value })} />
              </Field>
            </div>
            <Field label="Tags (comma-separated)">
              <input className="input" value={editing.tags || ""} onChange={(e) => setEditing({ ...editing, tags: e.target.value })} />
            </Field>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
                <input type="checkbox" className="h-4 w-4 rounded" checked={!!editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
                Published
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
                <input type="checkbox" className="h-4 w-4 rounded" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
                Featured
              </label>
            </div>
            <p className="rounded-lg bg-ink-50 px-3 py-2 text-xs text-ink-500">
              Note: PDF can be set by URL here. File uploads are available via the Django media folder.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <AdminButton type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</AdminButton>
              <AdminButton type="submit" disabled={saving}>{saving ? "Saving…" : "Save paper"}</AdminButton>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Delete paper"
        message={`Delete "${deleting?.title}"? This cannot be undone.`}
        onConfirm={onDelete}
        onCancel={() => setDeleting(null)}
      />
      {toast && <Toast {...toast} />}
    </div>
  );
}
