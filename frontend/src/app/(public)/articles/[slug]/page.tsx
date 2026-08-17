import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, ArrowRight } from "lucide-react";
import { getArticle, getArticles } from "@/lib/api";
import { dummyArticle, dummyArticles } from "@/lib/dummyData";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const articles = await getArticles();
    return articles.map((a) => ({ slug: a.slug }));
  } catch {
    return dummyArticles.map((a) => ({ slug: a.slug }));
  }
}

export default async function ArticleDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  let article: Awaited<ReturnType<typeof getArticle>> = dummyArticle;
  try {
    const fetched = await getArticle(params.slug);
    if (fetched) article = fetched;
  } catch {
    // use dummyArticle
  }

  return (
    <article className="container-page py-16">
      <Link href="/articles" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-indigo-600">
        <ArrowLeft size={15} /> Back to articles
      </Link>

      <header className="mx-auto mt-8 max-w-3xl">
        <div className="flex items-center gap-2 text-sm text-ink-500">
          <Calendar size={14} />
          <time dateTime={article.created_at}>{formatDate(article.created_at)}</time>
        </div>
        <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-ink-900 sm:text-5xl">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="mt-5 text-xl leading-relaxed text-ink-500">{article.excerpt}</p>
        )}
      </header>

      <div className="mx-auto mt-10 max-w-3xl space-y-8">
        {(article.cover_url || article.cover) && (
          <div className="overflow-hidden rounded-3xl border border-ink-100 shadow-sm">
            <Image
              src={article.cover_url || article.cover!}
              alt={article.title}
              width={1200}
              height={675}
              className="aspect-video w-full object-cover"
            />
          </div>
        )}

        {(article.video_url || article.video) && (
          <div className="overflow-hidden rounded-3xl border border-ink-100 bg-ink-950 shadow-sm">
            <video
              controls
              className="aspect-video w-full bg-black"
              src={article.video_url || article.video!}
            />
          </div>
        )}

        <div className="prose-rich">
          {article.body.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-3xl rounded-2xl border border-ink-100 bg-ink-50 p-6 text-center">
        <p className="font-serif text-lg font-bold text-ink-900">Thanks for reading</p>
        <p className="mt-1 text-sm text-ink-500">Have thoughts or questions? Reach out.</p>
        <Link href="/contact" className="mt-4 inline-flex items-center gap-1.5 font-semibold text-indigo-600 hover:gap-2.5">
          Get in touch <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}
