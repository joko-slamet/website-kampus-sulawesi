import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import FloatingCTA from '../../components/FloatingCTA';
import { allArticles } from '../data';
import ArticleContent from './ArticleContent';
import ArticleSidebar from './ArticleSidebar';
import ArticleHero from './ArticleHero';

const BASE_URL = 'https://stiaabdulharis.ac.id';
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export interface ArticleForPage {
  id: string;
  title: string;
  titleEn: string;
  excerpt: string;
  excerptEn: string;
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

export async function generateStaticParams() {
  return allArticles.map(a => ({ slug: a.id }));
}

async function fetchArticle(slug: string): Promise<ArticleForPage | null> {
  try {
    const res = await fetch(`${API_URL}/api/articles/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json() as Promise<ArticleForPage>;
  } catch {
    return null;
  }
}

async function fetchRelated(category: string, excludeId: string): Promise<ArticleForPage[]> {
  try {
    const qs = new URLSearchParams({ category, limit: '4' });
    const res = await fetch(`${API_URL}/api/articles?${qs}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json() as { data: ArticleForPage[] };
    return data.data.filter(a => a.id !== excludeId).slice(0, 3);
  } catch {
    return [];
  }
}

async function getArticle(slug: string): Promise<ArticleForPage | null> {
  // Try DB first (supports AI-generated articles)
  const dbArticle = await fetchArticle(slug);
  if (dbArticle) return dbArticle;

  // Fall back to static data
  const static_ = allArticles.find(a => a.id === slug);
  if (!static_) return null;
  return {
    id: static_.id,
    title: static_.title,
    titleEn: static_.en.title,
    excerpt: static_.excerpt,
    excerptEn: static_.en.excerpt,
    category: static_.category,
    categoryColor: static_.categoryColor,
    tag: static_.tag,
    tagColor: static_.tagColor,
    readTime: static_.readTime,
    date: static_.date,
    image: null,
    content: null,
    contentEn: null,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `${BASE_URL}/artikel/${slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `${BASE_URL}/artikel/${slug}`,
      type: 'article',
      ...(article.image ? { images: [{ url: article.image }] } : {}),
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const related = await fetchRelated(article.category, article.id);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    url: `${BASE_URL}/artikel/${slug}`,
    ...(article.image ? { image: article.image } : {}),
    publisher: {
      '@type': 'CollegeOrUniversity',
      '@id': `${BASE_URL}/#organization`,
      name: 'STIA YPA-AH "Abdul Haris" Makassar',
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/artikel/${slug}` },
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Artikel', item: `${BASE_URL}/artikel` },
      { '@type': 'ListItem', position: 3, name: article.title, item: `${BASE_URL}/artikel/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
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

        <section style={{ background: '#f8fafc', padding: '2.5rem 1.5rem 6rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gap: '2.5rem' }} className="artikel-detail-layout">
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
