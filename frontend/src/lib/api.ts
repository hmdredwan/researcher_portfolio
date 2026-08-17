import type {
  Researcher,
  Paper,
  Book,
  Article,
  Notice,
  ContactMessage,
  Stats,
  GalleryItem,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = init?.body instanceof FormData
    ? { ...(init?.headers || {}) }
    : { "Content-Type": "application/json", ...(init?.headers || {}) };

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
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
export const getNotices = () => request<Notice[]>("/notices/");
export const getPapers = () => request<Paper[]>("/papers/");
export const getPaper = (id: number) => request<Paper>(`/papers/${id}/`);
export const getBooks = () => request<Book[]>("/books/");
export const getArticles = () => request<Article[]>("/articles/");
export const getArticle = (slug: string) => request<Article>(`/articles/${slug}/`);
export const getGallery = (category?: string) => {
  const url = category ? `/gallery/?category=${encodeURIComponent(category)}` : "/gallery/";
  return request<GalleryItem[]>(url);
};

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
  notices: (token: string) => request<Notice[]>("/admin/notices/", { headers: authHeader(token) }),
  messages: (token: string) => request<ContactMessage[]>("/admin/messages/", { headers: authHeader(token) }),
  gallery: (token: string) => request<GalleryItem[]>("/admin/gallery/", { headers: authHeader(token) }),
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
  article: (token: string, data: Partial<Article> | FormData, id?: number) => {
    const isFormData = data instanceof FormData || (data && typeof data === "object" && data.constructor?.name === "FormData");
    const body: BodyInit = isFormData ? (data as FormData) : JSON.stringify(data as Partial<Article>);
    return request<Article>(id ? `/admin/articles/${id}/` : "/admin/articles/", {
      method: id ? "PUT" : "POST",
      headers: authHeader(token),
      body,
    });
  },
  researcher: (token: string, data: Partial<Researcher>) =>
    request<Researcher>("/admin/researcher/", {
      method: "PUT",
      headers: authHeader(token),
      body: JSON.stringify(data),
    }),
  notice: (token: string, data: Partial<Notice>, id?: number) =>
    request<Notice>(id ? `/admin/notices/${id}/` : "/admin/notices/", {
      method: id ? "PUT" : "POST",
      headers: authHeader(token),
      body: JSON.stringify(data),
    }),
  gallery: (token: string, data: Partial<GalleryItem> | FormData, id?: number) => {
    const isFormData = data instanceof FormData || (data && typeof data === "object" && data.constructor?.name === "FormData");
    const body: BodyInit = isFormData ? (data as FormData) : JSON.stringify(data as Partial<GalleryItem>);
    return request<GalleryItem>(id ? `/admin/gallery/${id}/` : "/admin/gallery/", {
      method: id ? "PUT" : "POST",
      headers: authHeader(token),
      body,
    });
  },
};

export function adminDelete(
  token: string,
  kind: "papers" | "books" | "articles" | "notices" | "messages" | "gallery",
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
