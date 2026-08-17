import type { Researcher, Stats, Paper, Book, Article, Notice } from "./types";

export const dummyResearcher: Researcher = {
  id: 1,
  name: "AKM Mehedi Hasan",
  title: "Physicist & Researcher",
  tagline: "Researching the universal theory of physics and exploring the fundamental laws of the universe.",
  bio: "I am a dedicated researcher focused on uncovering the universal theory of physics. With a strong foundation in theoretical physics, quantum gravity, and cosmology, I strive to bridge the gap between abstract mathematical frameworks and observable physical phenomena. My work aims to contribute to the deeper understanding of the universe's fundamental forces and the underlying principles that govern reality.",
  photo: "/images/mehedi.png",
  email: "mehedi@example.com",
  location: "Dhaka, Bangladesh",
  website: "https://mehedi.example.com",
  scholar_url: "https://scholar.google.com/citations?user=mehedi",
  github_url: "https://github.com/mehedi",
  linkedin_url: "https://linkedin.com/in/mehedi",
  twitter_url: "",
};

export const dummyStats: Stats = {
  papers: 12,
  books: 3,
  articles: 8,
  messages_unread: 0,
  gallery: 15,
  videos: 5,
  shorts: 4,
  images: 6,
};

export const dummyPapers: Paper[] = [
  {
    id: 1,
    title: "Toward a Unified Theory of Fundamental Forces",
    authors: "AKM Mehedi Hasan, J. Smith",
    abstract: "This paper proposes a novel framework for unifying the four fundamental forces of nature through a higher-dimensional geometric approach.",
    year: 2024,
    venue: "Physical Review Letters",
    doi: "10.1103/PhysRevLett.123.0456",
    pdf: null,
    tags: "theoretical physics, unification",
    published: true,
    featured: true,
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: 2,
    title: "Quantum Gravity and the Nature of Spacetime",
    authors: "AKM Mehedi Hasan",
    abstract: "An exploration of quantum gravitational effects at the Planck scale and their implications for the structure of spacetime.",
    year: 2023,
    venue: "Journal of High Energy Physics",
    doi: "10.1007/JHEP09(2023)078",
    pdf: null,
    tags: "quantum gravity, cosmology",
    published: true,
    featured: true,
    created_at: "2023-09-20T00:00:00Z",
    updated_at: "2023-09-20T00:00:00Z",
  },
  {
    id: 3,
    title: "Foundations of Physics: A Modern Perspective",
    authors: "AKM Mehedi Hasan, A. Rahman",
    abstract: "A comprehensive review of the foundational issues in modern physics, from quantum mechanics to general relativity.",
    year: 2022,
    venue: "Foundations of Physics",
    doi: "10.1007/s10701-022-00567-8",
    pdf: null,
    tags: "foundations, quantum mechanics",
    published: true,
    featured: true,
    created_at: "2022-06-10T00:00:00Z",
    updated_at: "2022-06-10T00:00:00Z",
  },
];

export const dummyBooks: Book[] = [
  {
    id: 1,
    title: "The Universal Theory: A Journey Through Physics",
    authors: "AKM Mehedi Hasan",
    description: "A comprehensive textbook exploring the quest for a unified theory of physics, covering classical mechanics, quantum theory, and modern attempts at unification.",
    year: 2023,
    publisher: "Academic Press",
    cover: null,
    link: "https://example.com/book1",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 2,
    title: "Quantum Gravity: An Introduction",
    authors: "AKM Mehedi Hasan",
    description: "An accessible introduction to the challenges and approaches in quantum gravity research.",
    year: 2021,
    publisher: "Springer",
    cover: null,
    link: "https://example.com/book2",
    created_at: "2021-05-15T00:00:00Z",
    updated_at: "2021-05-15T00:00:00Z",
  },
];

export const dummyArticles: Article[] = [
  {
    id: 1,
    title: "The Beauty of Theoretical Physics",
    slug: "beauty-of-theoretical-physics",
    excerpt: "Why theoretical physics continues to captivate scientists and laypeople alike.",
    body: "Theoretical physics is not just about equations and abstractions—it is about understanding the deep patterns that govern our universe. From the dance of subatomic particles to the grand evolution of cosmos, theoretical physics provides the language to describe reality at its most fundamental level.\n\nIn this article, I explore why this field remains one of the most intellectually rewarding pursuits in science, and how it shapes our worldview.",
    cover: null,
    video: null,
    cover_url: null,
    video_url: null,
    published: true,
    created_at: "2024-03-10T00:00:00Z",
    updated_at: "2024-03-10T00:00:00Z",
  },
  {
    id: 2,
    title: "Unification: The Holy Grail of Physics",
    slug: "unification-holy-grail-of-physics",
    excerpt: "A historical and modern perspective on the quest for a unified theory.",
    body: "The dream of unification has driven physics for centuries. From Maxwell's unification of electricity and magnetism to Einstein's pursuit of a unified field theory, scientists have sought to reveal the hidden connections in nature.\n\nModern approaches, including string theory and loop quantum gravity, offer new pathways toward this goal. In this piece, I examine the current landscape of unification research and its philosophical implications.",
    cover: null,
    video: null,
    cover_url: null,
    video_url: null,
    published: true,
    created_at: "2024-02-05T00:00:00Z",
    updated_at: "2024-02-05T00:00:00Z",
  },
];

export const dummyNotices: Notice[] = [
  {
    id: 1,
    text: "New paper on quantum gravity now available in publications.",
    link: "/papers",
    is_active: true,
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
  },
];

export const dummyArticle: Article = dummyArticles[0];
