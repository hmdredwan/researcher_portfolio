"use client";

import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { getToken } from "@/lib/auth";
import { adminList, adminSave } from "@/lib/api";
import type { Researcher } from "@/lib/types";
import { AdminButton, AdminCard, Field, Spinner, Toast, useToast } from "@/components/admin/ui";

export default function AdminProfilePage() {
  const [form, setForm] = useState<Partial<Researcher>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast, show } = useToast();

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    adminList.researcher(token)
      .then((r) => setForm(r || {}))
      .catch(() => show("Failed to load profile", "error"))
      .finally(() => setLoading(false));
  }, [show]);

  function update(field: keyof Researcher, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    const token = getToken();
    if (!token) return;
    setSaving(true);
    try {
      const saved = await adminSave.researcher(token, form);
      setForm(saved);
      show("Profile saved");
    } catch {
      show("Failed to save profile", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-ink-900">Profile</h1>
        <p className="mt-1 text-ink-500">This information appears across your public site.</p>
      </div>

      <form onSubmit={onSave} className="space-y-5">
        <AdminCard className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <input className="input" required value={form.name || ""} onChange={(e) => update("name", e.target.value)} />
            </Field>
            <Field label="Title">
              <input className="input" value={form.title || ""} onChange={(e) => update("title", e.target.value)} />
            </Field>
          </div>
          <Field label="Tagline">
            <input className="input" value={form.tagline || ""} onChange={(e) => update("tagline", e.target.value)} />
          </Field>
          <Field label="Bio (separate paragraphs with a blank line)">
            <textarea className="input resize-none" rows={7} value={form.bio || ""} onChange={(e) => update("bio", e.target.value)} />
          </Field>
        </AdminCard>

        <AdminCard className="space-y-4">
          <h2 className="font-serif text-lg font-bold text-ink-900">Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email">
              <input type="email" className="input" value={form.email || ""} onChange={(e) => update("email", e.target.value)} />
            </Field>
            <Field label="Location">
              <input className="input" value={form.location || ""} onChange={(e) => update("location", e.target.value)} />
            </Field>
          </div>
        </AdminCard>

        <AdminCard className="space-y-4">
          <h2 className="font-serif text-lg font-bold text-ink-900">Links</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Website">
              <input className="input" value={form.website || ""} onChange={(e) => update("website", e.target.value)} />
            </Field>
            <Field label="Google Scholar">
              <input className="input" value={form.scholar_url || ""} onChange={(e) => update("scholar_url", e.target.value)} />
            </Field>
            <Field label="GitHub">
              <input className="input" value={form.github_url || ""} onChange={(e) => update("github_url", e.target.value)} />
            </Field>
            <Field label="LinkedIn">
              <input className="input" value={form.linkedin_url || ""} onChange={(e) => update("linkedin_url", e.target.value)} />
            </Field>
            <Field label="Twitter / X">
              <input className="input" value={form.twitter_url || ""} onChange={(e) => update("twitter_url", e.target.value)} />
            </Field>
          </div>
        </AdminCard>

        <div className="flex justify-end">
          <AdminButton type="submit" disabled={saving}>
            {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : <><Save size={16} /> Save profile</>}
          </AdminButton>
        </div>
      </form>
      {toast && <Toast {...toast} />}
    </div>
  );
}
