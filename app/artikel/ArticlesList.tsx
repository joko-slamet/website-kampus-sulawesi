'use client';

import { useState, useMemo } from 'react';
import { allArticles, categories } from './data';

const PAGE_SIZE = 9;

export default function ArticlesList() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = allArticles;
    if (activeCategory !== 'Semua') {
      result = result.filter(a => a.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        a => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeCategory, search]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  const handleCategory = (cat: string) => {
    setActiveCategory(cat);
    setPage(1);
  };

  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  return (
    <>
      {/* Search + Filter */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: '1.25rem',
        marginBottom: '2.5rem',
      }}>
        {/* Search bar */}
        <div style={{ position: 'relative', maxWidth: '480px' }}>
          <svg
            style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Cari artikel..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.75rem',
              border: '1.5px solid #e2e8f0',
              borderRadius: '999px',
              fontSize: '0.9rem',
              background: 'white',
              color: '#0f172a',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = '#0f2d6b')}
            onBlur={e => (e.currentTarget.style.borderColor = '#e2e8f0')}
          />
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
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
      </div>

      {/* Result count */}
      <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        Menampilkan <strong style={{ color: '#0f2d6b' }}>{filtered.length}</strong> artikel
        {activeCategory !== 'Semua' && ` dalam kategori "${activeCategory}"`}
        {search && ` untuk "${search}"`}
      </p>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: '#94a3b8' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <p style={{ fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Artikel tidak ditemukan</p>
          <p style={{ fontSize: '0.875rem' }}>Coba kata kunci atau kategori lain.</p>
        </div>
      )}

      {/* Grid */}
      <div className="artikel-grid">
        {paginated.map((article) => (
          <a
            key={article.id}
            href={`/artikel/${article.id}`}
            style={{ textDecoration: 'none' }}
          >
          <article
            className="artikel-card"
            style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '1.75rem',
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: '0.75rem',
              transition: 'all 0.25s ease',
              height: '100%',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow = '0 12px 40px rgba(15,45,107,0.12)';
              el.style.transform = 'translateY(-4px)';
              el.style.borderColor = 'rgba(15,45,107,0.18)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow = 'none';
              el.style.transform = 'translateY(0)';
              el.style.borderColor = '#e2e8f0';
            }}
          >
            {/* Meta */}
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
                  background: article.tagColor! + '20',
                  color: article.tagColor!,
                  borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700,
                }}>
                  {article.tag}
                </span>
              )}
              <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                ⏱ {article.readTime}
              </span>
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: '1.05rem', fontWeight: 800,
              color: '#0f2d6b', lineHeight: 1.4, margin: 0,
            }}>
              {article.title}
            </h2>

            {/* Excerpt */}
            <p style={{
              color: '#64748b', fontSize: '0.875rem',
              lineHeight: 1.7, margin: 0, flex: 1,
            }}>
              {article.excerpt}
            </p>

            {/* Footer */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginTop: '0.5rem',
              paddingTop: '1rem', borderTop: '1px solid #f1f5f9',
            }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>📅 {article.date}</span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                color: '#0f2d6b', fontWeight: 700, fontSize: '0.8rem',
              }}>
                Baca
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </article>
          </a>
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button
            onClick={() => setPage(p => p + 1)}
            style={{
              padding: '0.85rem 2.5rem',
              border: '1.5px solid #0f2d6b',
              borderRadius: '999px',
              background: 'white', color: '#0f2d6b',
              fontWeight: 700, fontSize: '0.9rem',
              cursor: 'pointer', transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#0f2d6b';
              (e.currentTarget as HTMLButtonElement).style.color = 'white';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'white';
              (e.currentTarget as HTMLButtonElement).style.color = '#0f2d6b';
            }}
          >
            Muat Lebih Banyak ({filtered.length - paginated.length} artikel lagi)
          </button>
        </div>
      )}

      <style>{`
        .artikel-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 1024px) {
          .artikel-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .artikel-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
