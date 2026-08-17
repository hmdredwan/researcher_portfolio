import Link from "next/link";
import Image from "next/image";
import { FileText, BookOpen, ArrowUpRight, Calendar } from "lucide-react";
import type { Paper, Book, Article } from "@/lib/types";
import { tagsToArray, formatDate } from "@/lib/utils";

export function PaperCard({ paper }: { paper: Paper }) {
  const tags = tagsToArray(paper.tags);
  return (
    <article className="card group flex flex-col">
      <div className="flex items-center gap-2 text-xs text-ink-400">
        <Calendar size={14} />
        <span>{paper.year}</span>
        {paper.venue && (
          <>
            <span>·</span>
            <span className="truncate font-medium text-indigo-600">{paper.venue}</span>
          </>
        )}
      </div>

      <h3 className="mt-3 font-serif text-lg font-bold leading-snug text-ink-900 group-hover:text-indigo-700">
        {paper.title}
      </h3>
      <p className="mt-1 text-sm text-ink-500">{paper.authors}</p>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-600">
        {paper.abstract}
      </p>

      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span key={t} className="pill">{t}</span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center gap-3 pt-5">
        {paper.pdf ? (
          <a
            href={paper.pdf}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            <FileText size={15} /> View PDF
          </a>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-sm text-ink-400">
            <FileText size={15} /> PDF unavailable
          </span>
        )}
        {paper.doi && (
          <a
            href={`https://doi.org/${paper.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-indigo-600"
          >
            DOI <ArrowUpRight size={13} />
          </a>
        )}
      </div>
    </article>
  );
}

export function BookCard({ book }: { book: Book }) {
  return (
    <article className="card group flex gap-5">
      <div className="grid h-36 w-24 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-800 text-center text-white shadow-md">
        <div className="px-2">
          <BookOpen size={20} className="mx-auto opacity-80" />
          <p className="mt-1 line-clamp-3 font-serif text-[11px] font-bold leading-tight">
            {book.title}
          </p>
        </div>
      </div>
      <div className="flex min-w-0 flex-col">
        <p className="text-xs text-ink-400">{book.year} {book.publisher ? `· ${book.publisher}` : ""}</p>
        <h3 className="mt-1 font-serif text-lg font-bold leading-snug text-ink-900 group-hover:text-indigo-700">
          {book.title}
        </h3>
        <p className="text-sm text-ink-500">{book.authors}</p>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-600">
          {book.description}
        </p>
        {book.link && (
          <a
            href={book.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Learn more <ArrowUpRight size={14} />
          </a>
        )}
      </div>
    </article>
  );
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/articles/${article.slug}`} className="card group flex flex-col">
      {(article.cover_url || article.cover) && (
        <div className="overflow-hidden rounded-t-2xl">
          <Image
            src={article.cover_url || article.cover!}
            alt={article.title}
            width={1200}
            height={675}
            className="aspect-video w-full object-cover"
          />
        </div>
      )}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-xs text-ink-400">
          <Calendar size={14} />
          <span>{formatDate(article.created_at)}</span>
        </div>
        <h3 className="mt-3 font-serif text-xl font-bold leading-snug text-ink-900 group-hover:text-indigo-700">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-600">
          {article.excerpt}
        </p>
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-indigo-600 group-hover:gap-2">
          Read article <ArrowUpRight size={14} />
        </span>
      </div>
    </Link>
  );
}
