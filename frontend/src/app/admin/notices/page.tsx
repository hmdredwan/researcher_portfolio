"use client";

import { useEffect, useState } from "react";
import { Bell, Plus, Pencil, Trash2 } from "lucide-react";
import { getToken } from "@/lib/auth";
import { adminList, adminSave, adminDelete } from "@/lib/api";
import type { Notice } from "@/lib/types";
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

const empty: Partial<Notice> = {
  text: "",
  link: "",
  is_active: true,
};

export default function AdminNoticesPage() {
  const [items, setItems] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Notice> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<Notice | null>(null);
  const { toast, show } = useToast();

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    adminList.notices(token)
      .then(setItems)
      .catch(() => show("Failed to load notices", "error"))
      .finally(() => setLoading(false));
  }, [show]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    const token = getToken();
    if (!token || !editing) return;

    setSaving(true);
    try {
      const saved = await adminSave.notice(token, editing, editing.id);
      setItems((prev) => {
        const exists = prev.some((item) => item.id === saved.id);
        return exists ? prev.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...prev];
      });
      setEditing(null);
      show("Notice saved");
    } catch {
      show("Failed to save notice", "error");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    const token = getToken();
    if (!token || !deleting) return;
    try {
      await adminDelete(token, "notices", deleting.id);
      setItems((prev) => prev.filter((item) => item.id !== deleting.id));
      setDeleting(null);
      show("Notice deleted");
    } catch {
      show("Failed to delete notice", "error");
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink-900">Notices</h1>
          <p className="mt-1 text-ink-500">Announcements shown in the hero banner.</p>
        </div>
        <AdminButton onClick={() => setEditing({ ...empty })}>
          <Plus size={16} /> New notice
        </AdminButton>
      </div>

      {items.length === 0 ? (
        <EmptyRow message="No notices yet. Create the first announcement banner." />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <AdminCard key={item.id} className="flex items-center gap-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                <Bell size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-semibold text-ink-900">{item.text}</h3>
                  {!item.is_active && <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">OFF</span>}
                </div>
                <p className="truncate text-sm text-ink-500">{item.link || "No link"} · {formatDate(item.created_at)}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button onClick={() => setEditing(item)} className="grid h-9 w-9 place-items-center rounded-lg text-ink-500 hover:bg-indigo-50 hover:text-indigo-600">
                  <Pencil size={16} />
                </button>
                <button onClick={() => setDeleting(item)} className="grid h-9 w-9 place-items-center rounded-lg text-ink-500 hover:bg-red-50 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit notice" : "New notice"}>
        {editing && (
          <form onSubmit={onSave} className="space-y-4">
            <Field label="Text">
              <input
                className="input"
                required
                value={editing.text || ""}
                onChange={(e) => setEditing({ ...editing, text: e.target.value })}
                placeholder="New paper published, speaking event, theory update..."
              />
            </Field>

            <Field label="Link (optional)">
              <input
                className="input"
                type="url"
                value={editing.link || ""}
                onChange={(e) => setEditing({ ...editing, link: e.target.value })}
                placeholder="https://example.com"
              />
            </Field>

            <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded"
                checked={!!editing.is_active}
                onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
              />
              Active
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <AdminButton type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</AdminButton>
              <AdminButton type="submit" disabled={saving}>{saving ? "Saving…" : "Save notice"}</AdminButton>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Delete notice"
        message={`Delete "${deleting?.text}"? This will remove it from the hero banner.`}
        onConfirm={onDelete}
        onCancel={() => setDeleting(null)}
      />
      {toast && <Toast {...toast} />}
    </div>
  );
}
