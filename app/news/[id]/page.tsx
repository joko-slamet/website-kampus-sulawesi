import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import FloatingCTA from "../../components/FloatingCTA";
import NewsDetailBody from "./NewsDetailBody";

const BASE_URL = "https://stiaahmakassar.ac.id";
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://stiaahmakassar.ac.id";

function resolveImage(image: string | null | undefined): string | undefined {
  if (!image) return undefined;
  if (image.startsWith("http")) return image;
  return `${API_URL}${image}`;
}

function stripHtml(html: string | null, maxLen = 160): string {
  if (!html) return "";
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > maxLen ? text.slice(0, maxLen) + "..." : text;
}

export interface NewsForPage {
  id: string;
  type: "news" | "announcement";
  title: string;
  image: string | null;
  content: string | null;
  category: string;
  tag: string | null;
  pinned: boolean;
  published: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

type Props = { params: Promise<{ id: string }> };

async function fetchNews(id: string): Promise<NewsForPage | null> {
  try {
    const res = await fetch(`${API_URL}/api/news/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<NewsForPage>;
  } catch {
    return null;
  }
}

async function fetchRelated(
  category: string,
  excludeId: string,
): Promise<NewsForPage[]> {
  try {
    const qs = new URLSearchParams({ category, limit: "5" });
    const res = await fetch(`${API_URL}/api/news?${qs}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { data: NewsForPage[] };
    return data.data.filter((n) => n.id !== excludeId).slice(0, 4);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const news = await fetchNews(id);
  if (!news) return {};
  const desc = stripHtml(news.content);
  return {
    title: `${news.title} - STIA Abdul Haris Makassar`,
    description: desc,
    alternates: { canonical: `${BASE_URL}/news/${id}` },
    openGraph: {
      title: news.title,
      description: desc,
      url: `${BASE_URL}/news/${id}`,
      type: "article",
      ...(news.image
        ? { images: [{ url: resolveImage(news.image) as string }] }
        : {}),
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params;
  const news = await fetchNews(id);
  if (!news) notFound();

  const related = await fetchRelated(news.category, news.id);

  const schema = {
    "@context": "https://schema.org",
    "@type": news.type === "announcement" ? "GovernmentNotice" : "NewsArticle",
    headline: news.title,
    description: stripHtml(news.content),
    datePublished: news.createdAt,
    dateModified: news.updatedAt,
    url: `${BASE_URL}/news/${id}`,
    ...(news.image ? { image: resolveImage(news.image) } : {}),
    publisher: {
      "@type": "CollegeOrUniversity",
      "@id": `${BASE_URL}/#organization`,
      name: "STIA YPA-AH MAKASSAR",
    },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Berita & Pengumuman",
        item: `${BASE_URL}/news`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: news.title,
        item: `${BASE_URL}/news/${id}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Navbar variant="light" />
      <main>
        <NewsDetailBody news={news} related={related} />
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
