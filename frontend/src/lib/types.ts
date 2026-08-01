export interface Researcher {
  id: number;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  photo: string | null;
  email: string;
  location: string;
  website: string;
  scholar_url: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
}

export interface Paper {
  id: number;
  title: string;
  authors: string;
  abstract: string;
  year: number;
  venue: string;
  doi: string;
  pdf: string | null;
  tags: string;
  published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Book {
  id: number;
  title: string;
  authors: string;
  description: string;
  year: number;
  publisher: string;
  cover: string | null;
  link: string;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Stats {
  papers: number;
  books: number;
  articles: number;
  messages_unread: number;
}
