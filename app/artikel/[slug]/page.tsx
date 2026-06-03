import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import FloatingCTA from '../../components/FloatingCTA';
import { allArticles } from '../data';
import ArticleContent from './ArticleContent';
import ArticleSidebar from './ArticleSidebar';
import ArticleHero from './ArticleHero';

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
    alternates: { canonical: `https://stimik-nusantara.ac.id/artikel/${slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `https://stimik-nusantara.ac.id/artikel/${slug}`,
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

  return (
    <>
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
