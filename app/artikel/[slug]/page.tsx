import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import FloatingCTA from '../../components/FloatingCTA';
import { allArticles } from '../data';
import ArticleContent from './ArticleContent';
import ArticleSidebar from './ArticleSidebar';
import ArticleHero from './ArticleHero';

const BASE_URL = 'https://stiaabdulharis.ac.id'

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return allArticles.map(a => ({ slug: a.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = allArticles.find(a => a.id === slug);
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
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = allArticles.find(a => a.id === slug);
  if (!article) notFound();

  const related = allArticles
    .filter(a => a.id !== slug && a.category === article.category)
    .slice(0, 3);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    url: `${BASE_URL}/artikel/${slug}`,
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
          titleEn={article.en.title}
          date={article.date}
          readTime={article.readTime}
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
