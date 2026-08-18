import { getArticles } from "@/lib/api";
import { dummyArticles } from "@/lib/dummyData";
import { ArticleCard } from "@/components/Cards";
import { PageHeader } from "@/components/PageHeader";

export const revalidate = 60;

export default async function ArticlesPage() {
  let articles: Awaited<ReturnType<typeof getArticles>> = [];
  try {
    articles = await getArticles();
  } catch {
    // will fallback below
  }

  if (!articles || articles.length === 0) articles = dummyArticles;

  return (
    <div className="container-page py-16">
      <PageHeader
        eyebrow="Writing"
        title="Articles"
        description="Essays and notes on research, ideas, and the practice of building intelligent systems."
      />

      {articles.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-ink-200 py-20 text-center text-ink-500">
          No articles published yet.
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}