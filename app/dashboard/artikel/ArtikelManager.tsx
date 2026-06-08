'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../../lib/api';

interface Article {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  tag: string | null;
  tagColor: string | null;
  date: string;
  createdAt: string;
  views: number;
  published: boolean;
  image: string | null;
}

function fmtDateTime(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Makassar' });
  const time = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Makassar' });
  return { date, time };
}

function isNew(iso: string, now: number) {
  return now - new Date(iso).getTime() < 5 * 60 * 1000;
}

const PAGE_SIZE = 10;

function paginBtn(disabled: boolean, active = false): React.CSSProperties {
  return {
    minWidth: '32px', height: '32px', padding: '0 0.4rem',
    borderRadius: '7px', border: '1px solid',
    borderColor: active ? '#6366f1' : '#e2e8f0',
    background: active ? '#6366f1' : disabled ? '#f8fafc' : 'white',
    color: active ? 'white' : disabled ? '#cbd5e1' : '#374151',
    fontSize: '0.8rem', fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };
}

export default function ArtikelManager() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [categorySet, setCategorySet] = useState<string[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async (p: number, cat: string, q: string) => {
    setLoading(true);
    try {
      const res = await api.articles.list({
        all: true,
        page: p,
        limit: PAGE_SIZE,
        category: cat !== 'Semua' ? cat : undefined,
        search: q || undefined,
      });
      setArticles(res.data as Article[]);
      setTotal(res.total);
      // accumulate category list only from unfiltered loads
      if (cat === 'Semua' && !q) {
        const cats = [...new Set((res.data as Article[]).map(a => a.category))];
        setCategorySet(prev => [...new Set([...prev, ...cats])].sort());
      }
    } catch {
      // keep existing list
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page, activeCategory, search); }, [load, page, activeCategory, search]);

  // Auto-refresh every 1 minute
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      load(page, activeCategory, search);
      setNow(Date.now());
    }, 60_000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [load, page, activeCategory, search]);

  // Update `now` every 30s so the "Baru" badge disappears on time
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const categories = ['Semua', ...categorySet];
  const filtered = articles;

  function handleSearch(q: string) { setSearch(q); setPage(1); }
  function handleCategory(cat: string) { setActiveCategory(cat); setPage(1); }

  async function handleTogglePublish(article: Article) {
    setTogglingId(article.id);
    try {
      await api.articles.update(article.id, { published: !article.published });
      setArticles(prev => prev.map(a => a.id === article.id ? { ...a, published: !a.published } : a));
    } catch {
      // noop
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus artikel ini?')) return;
    setDeletingId(id);
    try {
      await api.articles.delete(id);
      setArticles(prev => prev.filter(a => a.id !== id));
    } catch {
      // noop
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>Kelola Artikel</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            {loading ? '…' : `${articles.length} artikel`}
            {!loading && articles.filter(a => !a.published).length > 0 && (
              <span style={{ color: '#f97316', marginLeft: '0.4rem' }}>
                ({articles.filter(a => !a.published).length} draft)
              </span>
            )}
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
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <svg style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Cari artikel..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            style={{
              width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.25rem',
              border: '1.5px solid #e2e8f0', borderRadius: '8px',
              fontSize: '0.85rem', background: '#f8fafc', boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              style={{
                padding: '0.35rem 0.85rem', borderRadius: '999px',
                fontSize: '0.75rem', fontWeight: 600, border: '1.5px solid', cursor: 'pointer',
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
        <div style={{
          display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1.4fr) 160px 90px 165px',
          padding: '0.75rem 1.25rem',
          background: '#f8fafc', borderBottom: '1px solid #e2e8f0',
          fontSize: '0.72rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em',
        }} className="artikel-table-header">
          <span>JUDUL</span>
          <span>KATEGORI</span>
          <span>WAKTU DIBUAT</span>
          <span>STATUS</span>
          <span>AKSI</span>
        </div>

        {loading && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ width: '28px', height: '28px', border: '3px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 0.75rem' }} />
            <p style={{ fontSize: '0.85rem' }}>Memuat artikel...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
            <p style={{ fontWeight: 600 }}>Artikel tidak ditemukan</p>
          </div>
        )}

        {!loading && filtered.map((article, i) => (
          <div
            key={article.id}
            style={{
              display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1.4fr) 160px 90px 165px',
              padding: '1rem 1.25rem', alignItems: 'center',
              borderBottom: i < filtered.length - 1 ? '1px solid #f8fafc' : 'none',
            }}
            className="artikel-table-row"
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#f8fafc'}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'white'}
          >
            {/* Title */}
            <div style={{ minWidth: 0, paddingRight: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {article.title}
                </p>
                {isNew(article.createdAt, now) && (
                  <span style={{
                    flexShrink: 0, fontSize: '0.6rem', fontWeight: 800,
                    padding: '0.15rem 0.45rem', borderRadius: '999px',
                    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                    color: 'white', letterSpacing: '0.04em', animation: 'pulse-badge 2s ease infinite',
                  }}>BARU</span>
                )}
              </div>
              {article.tag && (
                <span style={{
                  fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem',
                  background: (article.tagColor ?? '#f5a623') + '20',
                  color: article.tagColor ?? '#f5a623',
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
            <div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{fmtDateTime(article.createdAt).date}</div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.1rem' }}>{fmtDateTime(article.createdAt).time} WITA</div>
            </div>

            {/* Status */}
            <span style={{
              fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem',
              borderRadius: '999px', width: 'fit-content',
              background: article.published ? '#dcfce7' : '#fff7ed',
              color: article.published ? '#16a34a' : '#f97316',
            }}>
              {article.published ? 'Tayang' : 'Draft'}
            </span>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                onClick={() => handleTogglePublish(article)}
                disabled={togglingId === article.id}
                title={article.published ? 'Jadikan draft' : 'Tayangkan'}
                style={{
                  padding: '0.35rem 0.55rem', borderRadius: '7px',
                  background: article.published ? '#fff7ed' : '#f0fdf4',
                  border: `1px solid ${article.published ? '#fed7aa' : '#bbf7d0'}`,
                  color: article.published ? '#f97316' : '#16a34a',
                  fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
                  opacity: togglingId === article.id ? 0.5 : 1,
                }}
              >
                {article.published ? 'Tarik' : 'Tayang'}
              </button>
              {article.published && (
                <a
                  href={`/article/${article.id}`}
                  target="_blank"
                  style={{
                    padding: '0.35rem 0.55rem', borderRadius: '7px',
                    background: '#f1f5f9', border: '1px solid #e2e8f0',
                    fontSize: '0.72rem', color: '#475569', fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Lihat
                </a>
              )}
              <button
                onClick={() => handleDelete(article.id)}
                disabled={deletingId === article.id}
                title="Hapus artikel"
                style={{
                  padding: '0.35rem 0.55rem', borderRadius: '7px',
                  background: '#fef2f2', border: '1px solid #fecaca',
                  color: '#ef4444', fontSize: '0.72rem', fontWeight: 600,
                  cursor: 'pointer', opacity: deletingId === article.id ? 0.5 : 1,
                }}
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            Halaman {page} dari {totalPages} · {total} artikel
          </span>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              style={paginBtn(page === 1)}
            >«</button>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={paginBtn(page === 1)}
            >‹</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 2, totalPages - 4));
              const p = start + i;
              return (
                <button key={p} onClick={() => setPage(p)} style={paginBtn(false, p === page)}>{p}</button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={paginBtn(page === totalPages)}
            >›</button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              style={paginBtn(page === totalPages)}
            >»</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse-badge { 0%,100%{opacity:1} 50%{opacity:0.65} }
        @media (max-width: 768px) {
          .artikel-table-header { grid-template-columns: 1fr 90px !important; }
          .artikel-table-header span:not(:first-child):not(:last-child) { display: none; }
          .artikel-table-row { grid-template-columns: 1fr 90px !important; }
          .artikel-table-row > *:not(:first-child):not(:last-child) { display: none; }
        }
      `}</style>
    </div>
  );
}
