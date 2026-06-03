import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import FloatingCTA from '../../components/FloatingCTA';
import { allArticles } from '../data';
import { getArticleContent } from '../content';
import ArticleBody from './ArticleBody';
import ArticleSidebar from './ArticleSidebar';

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

  const content = getArticleContent(slug);
  const related = allArticles
    .filter(a => a.id !== slug && a.category === article.category)
    .slice(0, 3);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section style={{
          background: 'linear-gradient(135deg, #071a40 0%, #0f2d6b 60%, #1a4aad 100%)',
          padding: '9rem 1.5rem 4rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '10%', right: '5%',
            width: '400px', height: '400px',
            background: 'radial-gradient(circle, rgba(245,166,35,0.1) 0%, transparent 70%)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />

          <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
            {/* Breadcrumb */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.8rem' }}>
              <a href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Beranda</a>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>›</span>
              <a href="/artikel" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Artikel</a>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>›</span>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{article.category}</span>
            </nav>

            {/* Category + Tag */}
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <span style={{
                padding: '0.3rem 0.9rem',
                background: article.categoryColor + '30',
                color: '#fff',
                borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700,
                border: `1px solid ${article.categoryColor}60`,
              }}>
                {article.category}
              </span>
              {article.tag && (
                <span style={{
                  padding: '0.3rem 0.9rem',
                  background: article.tagColor! + '30',
                  color: '#fbbf24',
                  borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700,
                  border: `1px solid ${article.tagColor}60`,
                }}>
                  {article.tag}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              fontWeight: 800, color: 'white',
              lineHeight: 1.25, marginBottom: '1.5rem',
            }}>
              {article.title}
            </h1>

            {/* Meta */}
            <div style={{
              display: 'flex', gap: '1.5rem', flexWrap: 'wrap',
              color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem',
            }}>
              <span>📅 {article.date}</span>
              <span>⏱ {article.readTime} baca</span>
              <span>✍️ Tim Redaksi STIMIK Nusantara</span>
            </div>
          </div>
        </section>

        {/* Content */}
        <section style={{ background: '#f8fafc', padding: '4rem 1.5rem 6rem' }}>
          <div style={{
            maxWidth: '1100px', margin: '0 auto',
            display: 'grid', gap: '3rem',
          }} className="artikel-detail-layout">

            {/* Main article body */}
            <ArticleBody article={article} content={content} />

            {/* Sidebar */}
            <ArticleSidebar related={related} />
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCTA />

      <style>{`
        .artikel-detail-layout {
          grid-template-columns: 1fr 300px;
        }
        @media (max-width: 900px) {
          .artikel-detail-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
