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
      <Navbar variant="dark" />
      <main>
        {/* Hero */}
        <section style={{ background: '#f8fafc', padding: '8rem 1.5rem 2.5rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            {/* Breadcrumb */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.8rem' }}>
              <a href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Beranda</a>
              <span style={{ color: '#cbd5e1' }}>›</span>
              <a href="/artikel" style={{ color: '#94a3b8', textDecoration: 'none' }}>Artikel</a>
              <span style={{ color: '#cbd5e1' }}>›</span>
              <span style={{ color: '#0f2d6b', fontWeight: 600 }}>{article.category}</span>
            </nav>

            {/* Badges */}
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <span style={{
                padding: '0.3rem 0.9rem',
                background: article.categoryColor + '12',
                color: article.categoryColor,
                borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700,
                border: `1px solid ${article.categoryColor}30`,
              }}>
                {article.category}
              </span>
              {article.tag && (
                <span style={{
                  padding: '0.3rem 0.9rem',
                  background: 'rgba(245,166,35,0.12)',
                  color: '#d97706',
                  borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700,
                  border: '1px solid rgba(245,166,35,0.3)',
                }}>
                  ✦ {article.tag}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: 'clamp(1.4rem, 2vw, 1.875rem)',
              fontWeight: 800, color: '#0f172a',
              lineHeight: 1.25, marginBottom: '1.5rem',
            }}>
              {article.title}
            </h1>

            {/* Meta */}
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {[
                { icon: '📅', text: article.date },
                { icon: '⏱', text: `${article.readTime} baca` },
                { icon: '✍️', text: 'Tim Redaksi STIMIK' },
              ].map(m => (
                <span key={m.text} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.35rem 0.85rem',
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '999px',
                  fontSize: '0.8rem', color: '#64748b',
                }}>
                  {m.icon} {m.text}
                </span>
              ))}
            </div>

            {/* Divider */}
            <div style={{ borderBottom: '1px solid #e2e8f0', marginTop: '2.5rem' }} />
          </div>
        </section>

        {/* Content */}
        <section style={{ background: '#f8fafc', padding: '2.5rem 1.5rem 6rem' }}>
          <div style={{
            maxWidth: '1280px', margin: '0 auto',
            display: 'grid', gap: '2.5rem',
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
          grid-template-columns: 1fr 320px;
        }
        @media (max-width: 960px) {
          .artikel-detail-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
