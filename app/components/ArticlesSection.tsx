'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

interface ApiArticle {
  id: string;
  title: string;
  titleEn: string | null;
  excerpt: string;
  excerptEn: string | null;
  category: string;
  categoryColor: string;
  tag: string | null;
  tagColor: string | null;
  readTime: string;
  date: string;
  image: string | null;
  published: boolean;
}

export default function ArticlesSection() {
  const { t, lang } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [articles, setArticles] = useState<ApiArticle[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/articles?limit=18`)
      .then(r => r.json())
      .then((res: { data: ApiArticle[] }) => setArticles(res.data ?? []))
      .catch(() => {});
  }, []);

  const categories = ['Semua', ...Array.from(new Set(articles.map(a => a.category)))];

  const filtered = (activeCategory === 'Semua'
    ? articles
    : articles.filter(a => a.category === activeCategory)
  ).slice(0, 6);

  return (
    <section
      id="artikel"
      ref={ref}
      style={{ padding: '6rem 0', background: '#f8fafc' }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease',
        }}>
          <div>
            <span className="section-label" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>
              {t.articles.sectionLabel}
            </span>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight: 800, color: '#0f2d6b', lineHeight: 1.2,
            }}>
              {t.articles.sectionTitle}{' '}
              <span style={{
                background: 'linear-gradient(135deg, #0f2d6b 0%, #f5a623 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>{t.articles.sectionGradient}</span>
            </h2>
            <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '0.95rem' }}>
              {t.articles.sectionDesc}
            </p>
          </div>
          <a
            href="/artikel"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.65rem 1.5rem',
              border: '1.5px solid #0f2d6b', color: '#0f2d6b',
              fontWeight: 600, fontSize: '0.875rem',
              borderRadius: '999px', textDecoration: 'none',
              transition: 'all 0.25s ease', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#0f2d6b';
              (e.currentTarget as HTMLAnchorElement).style.color = 'white';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              (e.currentTarget as HTMLAnchorElement).style.color = '#0f2d6b';
            }}
          >
            {t.articles.viewAll}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Category Filter */}
        <div style={{
          display: 'flex', gap: '0.5rem', flexWrap: 'wrap',
          marginBottom: '2.5rem',
          opacity: visible ? 1 : 0, transition: 'all 0.6s ease 0.1s',
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.45rem 1.1rem',
                borderRadius: '999px',
                fontSize: '0.8rem', fontWeight: 600,
                border: '1.5px solid',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderColor: activeCategory === cat ? '#0f2d6b' : '#e2e8f0',
                background: activeCategory === cat ? '#0f2d6b' : 'white',
                color: activeCategory === cat ? 'white' : '#64748b',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div style={{ display: 'grid', gap: '1.5rem' }} className="articles-grid">
          {filtered.map((article, i) => (
            <a key={article.id} href={`/artikel/${article.id}`} style={{ textDecoration: 'none' }}>
              <article
                style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(24px)',
                  transition: `all 0.5s ease ${i * 0.07 + 0.15}s`,
                  display: 'flex', flexDirection: 'column',
                  height: '100%',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(15,45,107,0.12)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(15,45,107,0.18)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
                }}
              >
                {/* Thumbnail */}
                {article.image && (
                  <div style={{ height: '180px', overflow: 'hidden', flexShrink: 0 }}>
                    <img
                      src={article.image}
                      alt={article.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                )}

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                  {/* Top row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      background: article.categoryColor + '18',
                      color: article.categoryColor,
                      borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700,
                    }}>
                      {article.category}
                    </span>
                    {article.tag && (
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        background: (article.tagColor ?? '#f5a623') + '20',
                        color: article.tagColor ?? '#f5a623',
                        borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700,
                      }}>
                        {article.tag}
                      </span>
                    )}
                    <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                      📅 {article.date} · ⏱ {article.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f2d6b', lineHeight: 1.4, margin: 0 }}>
                    {lang === 'en' ? (article.titleEn || article.title) : article.title}
                  </h3>

                  {/* Excerpt */}
                  <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.7, margin: 0, flex: 1 }}>
                    {lang === 'en' ? (article.excerptEn || article.excerpt) : article.excerpt}
                  </p>

                  {/* Read more */}
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                    color: '#0f2d6b', fontWeight: 600, fontSize: '0.82rem',
                    marginTop: '0.25rem',
                  }}>
                    {t.articles.readBtn}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </article>
            </a>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          textAlign: 'center', marginTop: '3rem',
          opacity: visible ? 1 : 0, transition: 'all 0.6s ease 0.5s',
        }}>
          <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {t.articles.newDaily}
          </p>
          <a
            href="/artikel"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.85rem 2rem',
              background: 'linear-gradient(135deg, #0f2d6b 0%, #1a4aad 100%)',
              color: 'white', fontWeight: 700, fontSize: '0.9rem',
              borderRadius: '999px', textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(15,45,107,0.25)',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 14px 32px rgba(15,45,107,0.35)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 24px rgba(15,45,107,0.25)';
            }}
          >
            {t.articles.exploreAll}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      <style>{`
        .articles-grid {
          grid-template-columns: repeat(3, 1fr);
        }
        @media (max-width: 1024px) {
          .articles-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .articles-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
