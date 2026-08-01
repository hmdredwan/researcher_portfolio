import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-5">
      <div className="text-center">
        <p className="font-serif text-7xl font-bold text-indigo-600">404</p>
        <h1 className="mt-4 font-serif text-2xl font-bold text-ink-900">Page not found</h1>
        <p className="mt-2 text-ink-500">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="btn-primary mt-6">Back home</Link>
      </div>
    </div>
  );
}
