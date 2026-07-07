import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import FloatingCTA from "../../components/FloatingCTA";
import ArticleContent from "./ArticleContent";
import ArticleSidebar from "./ArticleSidebar";
import ArticleHero from "./ArticleHero";

const BASE_URL = "https://stiaahmakassar.ac.id";
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://stiaahmakassar.ac.id";

function resolveImage(image: string | null | undefined): string | undefined {
  if (!image) return undefined;
  if (image.startsWith("http")) return image;
  return `${API_URL}${image}`;
}

export interface ArticleForPage {
  id: string;
  title: string;
  titleEn: string | null;
  excerpt: string;
  excerptEn: string | null;
  content: string | null;
  contentEn: string | null;
  category: string;
  categoryColor: string;
  tag: string | null;
  tagColor: string | null;
  readTime: string;
  date: string;
  image: string | null;
}

type Props = { params: Promise<{ slug: string }> };

async function fetchArticle(slug: string): Promise<ArticleForPage | null> {
  try {
    const res = await fetch(`${API_URL}/api/articles/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<ArticleForPage>;
  } catch {
    return null;
  }
}

async function fetchRelated(
  category: string,
  excludeId: string,
): Promise<ArticleForPage[]> {
  try {
    const qs = new URLSearchParams({ category, limit: "4" });
    const res = await fetch(`${API_URL}/api/articles?${qs}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { data: ArticleForPage[] };
    return data.data.filter((a) => a.id !== excludeId).slice(0, 3);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `${BASE_URL}/article/${slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `${BASE_URL}/article/${slug}`,
      type: "article",
      ...(article.image
        ? { images: [{ url: resolveImage(article.image) as string }] }
        : {}),
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await fetchArticle(slug);
  if (!article) notFound();

  const related = await fetchRelated(article.category, article.id);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    url: `${BASE_URL}/article/${slug}`,
    ...(article.image ? { image: resolveImage(article.image) } : {}),
    publisher: {
      "@type": "CollegeOrUniversity",
      "@id": `${BASE_URL}/#organization`,
      name: "STIA YPA-AH MAKASSAR",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/article/${slug}`,
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
        name: "Artikel",
        item: `${BASE_URL}/article`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `${BASE_URL}/article/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Navbar variant="dark" />
      <main>
        <ArticleHero
          category={article.category}
          categoryColor={article.categoryColor}
          tag={article.tag}
          tagColor={article.tagColor}
          titleId={article.title}
          titleEn={article.titleEn}
          date={article.date}
          readTime={article.readTime}
          image={article.image}
        />

        <section
          style={{
            background: "var(--bg-muted)",
            padding: "2.5rem 1.5rem 6rem",
          }}
        >
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              display: "grid",
              gap: "2.5rem",
            }}
            className="artikel-detail-layout"
          >
            <ArticleContent article={article} />
            <ArticleSidebar related={related} />
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCTA />

      <style>{`
        .artikel-detail-layout { grid-template-columns: 1fr 320px; }
        @media (max-width: 960px) { .artikel-detail-layout { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}
