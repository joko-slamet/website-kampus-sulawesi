'use client';

import { useLanguage } from '../../i18n/LanguageContext';
import { resolveImage } from '../../lib/imageUrl';

type Props = {
  category: string;
  categoryColor: string;
  tag: string | null;
  tagColor: string | null;
  titleId: string;
  titleEn: string | null;
  date: string;
  readTime: string;
  image?: string | null;
};

export default function ArticleHero({ category, categoryColor, tag, titleId, titleEn, date, readTime, image }: Props) {
  const { t, lang } = useLanguage();
  const title = lang === 'en' ? (titleEn || titleId) : titleId;

  return (
    <section style={{ background: 'var(--bg-muted)', padding: '8rem 1.5rem 2.5rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.8rem' }}>
          <a href="/" style={{ color: 'var(--text-subtle)', textDecoration: 'none' }}>{t.articleDetail.home}</a>
          <span style={{ color: 'var(--border)' }}>›</span>
          <a href='/article' style={{ color: 'var(--text-subtle)', textDecoration: 'none' }}>{t.articleDetail.articles}</a>
          <span style={{ color: 'var(--border)' }}>›</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{category}</span>
        </nav>

        {/* Badges */}
        <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <span style={{ padding: '0.3rem 0.9rem', background: categoryColor + '12', color: categoryColor, borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, border: `1px solid ${categoryColor}30` }}>
            {category}
          </span>
          {tag && (
            <span style={{ padding: '0.3rem 0.9rem', background: 'rgba(245,166,35,0.12)', color: '#d97706', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(245,166,35,0.3)' }}>
              ✦ {tag}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 'clamp(1.4rem, 2vw, 1.875rem)', fontWeight: 800, color: 'var(--text-heading)', lineHeight: 1.25, marginBottom: '1.5rem' }}>
          {title}
        </h1>

        {/* Meta */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {[
            { icon: '📅', text: date },
            { icon: '⏱', text: `${readTime} ${t.articleDetail.readTime}` },
            { icon: '✍️', text: t.articleDetail.author },
          ].map(m => (
            <span key={m.text} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.85rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '999px', fontSize: '0.8rem', color: 'var(--text-body)' }}>
              {m.icon} {m.text}
            </span>
          ))}
        </div>

        {image && (
          <div style={{ marginTop: '2rem', borderRadius: '16px', overflow: 'hidden', aspectRatio: '16/9', width: '100%' }}>
            <img src={resolveImage(image)} alt={titleId} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        )}
        <div style={{ borderBottom: '1px solid var(--border)', marginTop: '2.5rem' }} />
      </div>
    </section>
  );
}
