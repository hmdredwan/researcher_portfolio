"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getToken } from "@/lib/auth";
import { adminList, adminSave, adminDelete } from "@/lib/api";
import type { GalleryItem } from "@/lib/types";
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

type EditGalleryItem = Partial<GalleryItem> & {
  file_file?: File | null;
  thumbnail_file?: File | null;
};

const empty: EditGalleryItem = {
  category: "image",
  title: "",
  caption: "",
  youtube_url: "",
  file: null,
  thumbnail: null,
  order: 0,
  published: true,
  file_file: null,
  thumbnail_file: null,
};

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditGalleryItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<GalleryItem | null>(null);
  const { toast, show } = useToast();

  function load() {
    const token = getToken();
    if (!token) return;
    adminList
      .gallery(token)
      .then(setItems)
      .catch(() => show("Failed to load gallery", "error"))
      .finally(() => setLoading(false));
  }

  useEffect(load, [show]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    const token = getToken();
    if (!token || !editing) return;

    const payload = new FormData();
    payload.append("category", editing.category || "image");
    payload.append("title", editing.title || "");
    payload.append("caption", editing.caption || "");
    payload.append("youtube_url", editing.youtube_url || "");
    payload.append("order", String(editing.order ?? 0));
    payload.append("published", editing.published ? "true" : "false");
    if (editing.file_file instanceof File) payload.append("file", editing.file_file);
    if (editing.thumbnail_file instanceof File) payload.append("thumbnail", editing.thumbnail_file);

    setSaving(true);
    try {
      const saved = await adminSave.gallery(token, payload, editing.id);
      setItems((prev) => {
        const exists = prev.some((g) => g.id === saved.id);
        return exists ? prev.map((g) => (g.id === saved.id ? saved : g)) : [saved, ...prev];
      });
      setEditing(null);
      show("Gallery item saved");
    } catch {
      show("Failed to save gallery item", "error");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    const token = getToken();
    if (!token || !deleting) return;
    try {
      await adminDelete(token, "gallery", deleting.id);
      setItems((prev) => prev.filter((g) => g.id !== deleting.id));
      setDeleting(null);
      show("Gallery item deleted");
    } catch {
      show("Failed to delete", "error");
    }
  }

  if (loading) return <Spinner />;

  const categoryLabel = (c: string) => {
    switch (c) {
      case "video":
        return "Video";
      case "short":
        return "Short";
      case "image":
        return "Image";
      default:
        return c;
    }
  };

  const categoryColor = (c: string) => {
    switch (c) {
      case "video":
        return "bg-indigo-50 text-indigo-700";
      case "short":
        return "bg-amber-50 text-amber-700";
      case "image":
        return "bg-emerald-50 text-emerald-700";
      default:
        return "bg-ink-100 text-ink-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink-900">Gallery</h1>
          <p className="mt-1 text-ink-500">{items.length} total</p>
        </div>
        <AdminButton onClick={() => setEditing({ ...empty })}>
          <Plus size={16} /> New item
        </AdminButton>
      </div>

      {items.length === 0 ? (
        <EmptyRow message="No gallery items yet." />
      ) : (
        <div className="space-y-3">
          {items.map((g) => (
            <AdminCard key={g.id} className="flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-semibold text-ink-900">{g.title || "Untitled"}</h3>
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${categoryColor(g.category)}`}>
                    {categoryLabel(g.category)}
                  </span>
                  {!g.published && (
                    <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">DRAFT</span>
                  )}
                </div>
                <p className="truncate text-sm text-ink-500">
                  {g.caption ? g.caption.slice(0, 80) + (g.caption.length > 80 ? "…" : "") : "No caption"} ·{" "}
                  {g.youtube_url ? "YouTube" : g.file ? "Direct upload" : "No media"}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => setEditing(g)}
                  className="grid h-9 w-9 place-items-center rounded-lg text-ink-500 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleting(g)}
                  className="grid h-9 w-9 place-items-center rounded-lg text-ink-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit gallery item" : "New gallery item"}
      >
        {editing && (
          <form onSubmit={onSave} className="space-y-4">
            <Field label="Category">
              <select
                className="input"
                value={editing.category || "image"}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    category: e.target.value as "video" | "short" | "image",
                  })
                }
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="short">Short</option>
              </select>
            </Field>

            <Field label="Title">
              <input
                className="input"
                value={editing.title || ""}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                placeholder="Optional title"
              />
            </Field>

            <Field label="Caption">
              <textarea
                className="input resize-none"
                rows={3}
                value={editing.caption || ""}
                onChange={(e) => setEditing({ ...editing, caption: e.target.value })}
                placeholder="Description or caption (especially for images)"
              />
            </Field>

            {(editing.category === "video" || editing.category === "short") && (
              <Field label="YouTube URL">
                <input
                  className="input"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={editing.youtube_url || ""}
                  onChange={(e) => setEditing({ ...editing, youtube_url: e.target.value })}
                />
                <p className="mt-1 text-xs text-ink-500">
                  Paste a YouTube link. Leave empty if uploading a file directly.
                </p>
              </Field>
            )}

            <Field label={editing.category === "image" ? "Image file" : "Direct upload file"}>
              <input
                type="file"
                accept={editing.category === "image" ? "image/*" : "video/*"}
                className="input"
                onChange={(e) => setEditing({ ...editing, file_file: e.target.files?.[0] ?? null })}
              />
              {(editing.file_url || editing.file) && !editing.file_file && (
                <p className="mt-2 text-sm text-ink-500">
                  Current file:{" "}
                  <a
                    href={editing.file_url || editing.file!}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    View
                  </a>
                </p>
              )}
              {editing.file_file && (
                <p className="mt-2 text-sm text-ink-500">Selected file: {editing.file_file.name}</p>
              )}
            </Field>

            {(editing.category === "video" || editing.category === "short") && (
              <Field label="Thumbnail image">
                <input
                  type="file"
                  accept="image/*"
                  className="input"
                  onChange={(e) => setEditing({ ...editing, thumbnail_file: e.target.files?.[0] ?? null })}
                />
                {(editing.thumbnail_url || editing.thumbnail) && !editing.thumbnail_file && (
                  <p className="mt-2 text-sm text-ink-500">
                    Current thumbnail:{" "}
                    <a
                      href={editing.thumbnail_url || editing.thumbnail!}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      View
                    </a>
                  </p>
                )}
                {editing.thumbnail_file && (
                  <p className="mt-2 text-sm text-ink-500">Selected thumbnail: {editing.thumbnail_file.name}</p>
                )}
              </Field>
            )}

            <Field label="Sort order">
              <input
                type="number"
                className="input"
                value={editing.order ?? 0}
                onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
              />
            </Field>

            <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded"
                checked={!!editing.published}
                onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
              />
              Published
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <AdminButton type="button" variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </AdminButton>
              <AdminButton type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save item"}
              </AdminButton>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Delete gallery item"
        message={`Delete "${deleting?.title || deleting?.caption || "this item"}"? This cannot be undone.`}
        onConfirm={onDelete}
        onCancel={() => setDeleting(null)}
      />
      {toast && <Toast {...toast} />}
    </div>
  );
}
