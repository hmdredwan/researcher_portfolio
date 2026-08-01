import { getBooks } from "@/lib/api";
import { BookCard } from "@/components/Cards";
import { PageHeader } from "@/components/PageHeader";

export const revalidate = 60;

export default async function BooksPage() {
  let books: Awaited<ReturnType<typeof getBooks>> = [];
  try {
    books = await getBooks();
  } catch {}

  return (
    <div className="container-page py-16">
      <PageHeader
        eyebrow="Author"
        title="Books"
        description="Textbooks and guides distilling years of research and teaching into accessible books."
      />

      {books.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-ink-200 py-20 text-center text-ink-500">
          No books published yet.
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {books.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      )}
    </div>
  );
}
