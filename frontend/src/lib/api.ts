import type {
  Researcher,
  Paper,
  Book,
  Article,
  ContactMessage,
  Stats,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${detail}`);
  }
  return res.json() as Promise<T>;
}

// --- Public read API -------------------------------------------------------

export const getResearcher = () => request<Researcher>("/researcher/");
export const getStats = () => request<Stats>("/stats/");
export const getPapers = () => request<Paper[]>("/papers/");
export const getPaper = (id: number) => request<Paper>(`/papers/${id}/`);
export const getBooks = () => request<Book[]>("/books/");
export const getArticles = () => request<Article[]>("/articles/");
export const getArticle = (slug: string) => request<Article>(`/articles/${slug}/`);

export async function sendContact(payload: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<ContactMessage> {
  return request<ContactMessage>("/contact/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// --- Admin API -------------------------------------------------------------

export interface AdminAuth {
  token: string;
  admin: { username: string; email: string };
}

export function adminLogin(username: string, password: string) {
  return request<AdminAuth>("/admin/login/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function adminLogout(token: string) {
  return request<{ detail: string }>("/admin/logout/", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

// Admin lists / detail (read)
export const adminList = {
  papers: (token: string) => request<Paper[]>("/admin/papers/", { headers: authHeader(token) }),
  books: (token: string) => request<Book[]>("/admin/books/", { headers: authHeader(token) }),
  articles: (token: string) => request<Article[]>("/admin/articles/", { headers: authHeader(token) }),
  messages: (token: string) => request<ContactMessage[]>("/admin/messages/", { headers: authHeader(token) }),
  researcher: (token: string) => request<Researcher>("/admin/researcher/", { headers: authHeader(token) }),
};

export const adminSave = {
  paper: (token: string, data: Partial<Paper>, id?: number) =>
    request<Paper>(id ? `/admin/papers/${id}/` : "/admin/papers/", {
      method: id ? "PUT" : "POST",
      headers: authHeader(token),
      body: JSON.stringify(data),
    }),
  book: (token: string, data: Partial<Book>, id?: number) =>
    request<Book>(id ? `/admin/books/${id}/` : "/admin/books/", {
      method: id ? "PUT" : "POST",
      headers: authHeader(token),
      body: JSON.stringify(data),
    }),
  article: (token: string, data: Partial<Article>, id?: number) =>
    request<Article>(id ? `/admin/articles/${id}/` : "/admin/articles/", {
      method: id ? "PUT" : "POST",
      headers: authHeader(token),
      body: JSON.stringify(data),
    }),
  researcher: (token: string, data: Partial<Researcher>) =>
    request<Researcher>("/admin/researcher/", {
      method: "PUT",
      headers: authHeader(token),
      body: JSON.stringify(data),
    }),
};

export function adminDelete(
  token: string,
  kind: "papers" | "books" | "articles" | "messages",
  id: number,
) {
  return request<{ detail: string }>(`/admin/${kind}/${id}/`, {
    method: "DELETE",
    headers: authHeader(token),
  });
}

export function adminToggleMessageRead(token: string, id: number, isRead: boolean) {
  return request<ContactMessage>(`/admin/messages/${id}/`, {
    method: "PUT",
    headers: authHeader(token),
    body: JSON.stringify({ is_read: isRead }),
  });
}

export const API_BASE = API_URL;
