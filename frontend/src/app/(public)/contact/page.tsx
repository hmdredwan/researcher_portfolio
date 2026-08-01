import { getResearcher } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import ContactForm from "./ContactForm";
import { Mail, MapPin, Globe } from "lucide-react";

export const revalidate = 60;

export default async function ContactPage() {
  let r: Awaited<ReturnType<typeof getResearcher>> | undefined;
  try {
    r = await getResearcher();
  } catch {}

  return (
    <div className="container-page py-16">
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        description="Questions, collaborations, or speaking invitations — I'd love to hear from you."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        {/* Info */}
        <div className="space-y-4">
          {r?.email && (
            <InfoRow icon={<Mail size={18} />} label="Email" value={r.email} href={`mailto:${r.email}`} />
          )}
          {r?.location && (
            <InfoRow icon={<MapPin size={18} />} label="Location" value={r.location} />
          )}
          {r?.website && (
            <InfoRow icon={<Globe size={18} />} label="Website" value={r.website} href={r.website} />
          )}
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
            <p className="text-sm font-medium text-indigo-900">
              Response time
            </p>
            <p className="mt-1 text-sm text-indigo-700">
              I typically reply within a few business days. For urgent matters, email is best.
            </p>
          </div>
        </div>

        {/* Form */}
        <ContactForm />
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const content = (
    <div className="flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-4">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-ink-400">{label}</p>
        <p className="truncate font-medium text-ink-900">{value}</p>
      </div>
    </div>
  );
  return href ? (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="block transition hover:-translate-y-0.5">{content}</a>
  ) : content;
}
