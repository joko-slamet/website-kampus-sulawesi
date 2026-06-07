'use client';

import { useState } from 'react';
import { allArticles, categories } from '../../artikel/data';
import GenerateArtikelModal from './GenerateArtikelModal';

export default function ArtikelManager() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [showGenerate, setShowGenerate] = useState(false);

  const filtered = allArticles.filter(a => {
    const matchCategory = activeCategory === 'Semua' || a.category === activeCategory;
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>Kelola Artikel</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{allArticles.length} artikel tersedia</p>
        </div>
        <button
          onClick={() => setShowGenerate(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.65rem 1.1rem',
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            color: 'white', border: 'none', borderRadius: '10px',
            fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontSize: '1rem' }}>✨</span>
          Generate Artikel
        </button>
      </div>

      {showGenerate && (
        <GenerateArtikelModal
          onClose={() => setShowGenerate(false)}
          onSaved={() => setShowGenerate(false)}
        />
      )}

      {/* AI info banner */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: '0.85rem',
        background: '#f0f9ff', border: '1px solid #bae6fd',
        borderRadius: '12px', padding: '1rem 1.25rem',
        marginBottom: '1.75rem',
      }}>
        <span style={{ fontSize: '1.25rem', flexShrink: 0, marginTop: '0.05rem' }}>🤖</span>
        <div>
          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0369a1', marginBottom: '0.2rem' }}>
            Artikel ditulis otomatis oleh AI
          </p>
          <p style={{ fontSize: '0.8rem', color: '#0284c7', lineHeight: 1.6 }}>
            Sistem akan mempublikasikan <strong>3 artikel baru setiap hari</strong> secara otomatis.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{
        background: 'white', border: '1px solid #e2e8f0',
        borderRadius: '14px', padding: '1rem 1.25rem',
        display: 'flex', gap: '1rem', alignItems: 'center',
        marginBottom: '1.25rem', flexWrap: 'wrap',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <svg style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Cari artikel..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.25rem',
              border: '1.5px solid #e2e8f0', borderRadius: '8px',
              fontSize: '0.85rem', background: '#f8fafc', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.35rem 0.85rem', borderRadius: '999px',
                fontSize: '0.75rem', fontWeight: 600, border: '1.5px solid', cursor: 'pointer',
                transition: 'all 0.15s',
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

      {/* Table */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 140px 110px 80px 100px',
          padding: '0.75rem 1.25rem',
          background: '#f8fafc', borderBottom: '1px solid #e2e8f0',
          fontSize: '0.72rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em',
        }} className="artikel-table-header">
          <span>JUDUL</span>
          <span>KATEGORI</span>
          <span>TANGGAL</span>
          <span>VIEWS</span>
          <span>AKSI</span>
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
            <p style={{ fontWeight: 600 }}>Artikel tidak ditemukan</p>
          </div>
        )}

        {filtered.map((article, i) => (
          <div
            key={article.id}
            style={{
              display: 'grid', gridTemplateColumns: '1fr 140px 110px 80px 100px',
              padding: '1rem 1.25rem', alignItems: 'center',
              borderBottom: i < filtered.length - 1 ? '1px solid #f8fafc' : 'none',
              transition: 'background 0.15s',
            }}
            className="artikel-table-row"
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#f8fafc'}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'white'}
          >
            {/* Title */}
            <div style={{ minWidth: 0, paddingRight: '1rem' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {article.title}
              </p>
              {article.tag && (
                <span style={{
                  fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem',
                  background: (article.tagColor || '#f5a623') + '20',
                  color: article.tagColor || '#f5a623',
                  borderRadius: '999px',
                }}>{article.tag}</span>
              )}
            </div>

            {/* Category */}
            <span style={{
              fontSize: '0.72rem', fontWeight: 700, padding: '0.25rem 0.65rem',
              background: article.categoryColor + '12',
              color: article.categoryColor,
              borderRadius: '999px', width: 'fit-content',
            }}>
              {article.category}
            </span>

            {/* Date */}
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{article.date}</span>

            {/* Views */}
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>—</span>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <a
                href={`/artikel/${article.id}`}
                target="_blank"
                style={{
                  padding: '0.35rem 0.65rem', borderRadius: '7px',
                  background: '#f1f5f9', border: '1px solid #e2e8f0',
                  fontSize: '0.72rem', color: '#475569', fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Lihat
              </a>
            </div>
          </div>
        ))}
      </div>


      <style>{`
        @media (max-width: 768px) {
          .artikel-table-header { grid-template-columns: 1fr 100px !important; }
          .artikel-table-header span:not(:first-child):not(:last-child) { display: none; }
          .artikel-table-row { grid-template-columns: 1fr 100px !important; }
          .artikel-table-row > *:not(:first-child):not(:last-child) { display: none; }
        }
      `}</style>
    </div>
  );
}
