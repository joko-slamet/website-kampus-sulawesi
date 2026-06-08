'use client';

import { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

type Block =
  | { type: 'heading'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'ordered'; items: string[] }
  | { type: 'callout'; icon: string; text: string }
  | { type: 'divider' };

import type { ArticleForPage } from './page';
type Article = Pick<ArticleForPage, 'id' | 'category' | 'categoryColor' | 'title' | 'excerpt' | 'date' | 'readTime' | 'tag' | 'tagColor'>;

export default function ArticleBody({ article, content }: { article: Article; content: Block[] }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article>
      {/* Body */}
      <div style={{
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '20px',
        padding: '2.5rem',
      }}>
        {content.map((block, i) => {
          if (block.type === 'heading') {
            return (
              <h2 key={i} style={{
                fontSize: '1.35rem', fontWeight: 800,
                color: '#0f2d6b', lineHeight: 1.3,
                marginTop: i === 0 ? 0 : '2rem', marginBottom: '0.75rem',
              }}>
                {block.text}
              </h2>
            );
          }
          if (block.type === 'subheading') {
            return (
              <h3 key={i} style={{
                fontSize: '1.05rem', fontWeight: 700,
                color: '#1e3a5f', lineHeight: 1.4,
                marginTop: '1.5rem', marginBottom: '0.6rem',
              }}>
                {block.text}
              </h3>
            );
          }
          if (block.type === 'paragraph') {
            return (
              <p key={i} style={{
                color: '#334155', fontSize: '1rem', lineHeight: 1.85,
                marginBottom: '1rem',
              }}>
                {block.text}
              </p>
            );
          }
          if (block.type === 'list') {
            return (
              <ul key={i} style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }}>
                {block.items.map((item, j) => (
                  <li key={j} style={{
                    color: '#334155', fontSize: '0.95rem', lineHeight: 1.75,
                    marginBottom: '0.4rem',
                  }}>
                    {item}
                  </li>
                ))}
              </ul>
            );
          }
          if (block.type === 'ordered') {
            return (
              <ol key={i} style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }}>
                {block.items.map((item, j) => (
                  <li key={j} style={{
                    color: '#334155', fontSize: '0.95rem', lineHeight: 1.75,
                    marginBottom: '0.4rem',
                  }}>
                    {item}
                  </li>
                ))}
              </ol>
            );
          }
          if (block.type === 'callout') {
            return (
              <div key={i} style={{
                background: '#f0f7ff',
                border: '1px solid #bfdbfe',
                borderRadius: '12px',
                padding: '1.1rem 1.25rem',
                margin: '1.5rem 0',
                display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{block.icon}</span>
                <p style={{ color: '#1e40af', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
                  {block.text}
                </p>
              </div>
            );
          }
          if (block.type === 'divider') {
            return (
              <hr key={i} style={{
                border: 'none', borderTop: '1px solid #e2e8f0',
                margin: '2rem 0',
              }} />
            );
          }
          return null;
        })}
      </div>

      {/* Share bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        flexWrap: 'wrap', marginTop: '1.5rem',
        padding: '1.25rem 1.5rem',
        background: 'white', border: '1px solid #e2e8f0',
        borderRadius: '16px',
      }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginRight: '0.25rem' }}>
          {t.articleDetail.shareLabel}
        </span>

        <a
          href={`https://wa.me/?text=${encodeURIComponent(article.title + ' - ')}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.5rem 1rem',
            background: '#25d366', color: 'white',
            borderRadius: '999px', textDecoration: 'none',
            fontSize: '0.8rem', fontWeight: 700,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.948-1.42A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
          </svg>
          WhatsApp
        </a>

        <button
          onClick={handleCopy}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.5rem 1rem',
            background: copied ? '#10b981' : '#f1f5f9',
            color: copied ? 'white' : '#475569',
            borderRadius: '999px', border: 'none',
            fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {copied ? t.articleDetail.copied : `🔗 ${t.articleDetail.copyLink}`}
        </button>

        <a
          href="/artikel"
          style={{
            marginLeft: 'auto',
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            fontSize: '0.8rem', color: '#0f2d6b', fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          {t.articleDetail.backToAll}
        </a>
      </div>
    </article>
  );
}
