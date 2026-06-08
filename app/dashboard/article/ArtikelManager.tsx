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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Article | null>(null);
  const [modalClosing, setModalClosing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [sort, setSort] = useState<'terbaru' | 'trending'>('terbaru');
  const [now, setNow] = useState(() => Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async (p: number, q: string, s: string) => {
    setLoading(true);
    try {
      const res = await api.articles.list({
        all: true,
        page: p,
        limit: PAGE_SIZE,
        search: q || undefined,
        sort: s === 'trending' ? 'views' : undefined,
      });
      setArticles(res.data as Article[]);
      setTotal(res.total);
    } catch {
      // keep existing list
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page, search, sort); }, [load, page, search, sort]);

  // Auto-refresh every 1 minute
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      load(page, search, sort);
      setNow(Date.now());
    }, 60_000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [load, page, search, sort]);

  // Update `now` every 30s so the "Baru" badge disappears on time
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const filtered = articles;

  function handleSearch(q: string) { setSearch(q); setPage(1); }

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

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function closeModal() {
    setModalClosing(true);
    setTimeout(() => {
      setConfirmDelete(null);
      setModalClosing(false);
    }, 200);
  }

  async function handleDelete(article: Article) {
    setConfirmDelete(article);
  }

  async function confirmDeleteExec() {
    if (!confirmDelete) return;
    const toDelete = confirmDelete;
    closeModal();
    setDeletingId(toDelete.id);
    try {
      await api.articles.delete(toDelete.id);
      setArticles(prev => prev.filter(a => a.id !== toDelete.id));
      showToast(`Artikel "${toDelete.title}" berhasil dihapus`);
    } catch {
      showToast('Gagal menghapus artikel');
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
              width: '100%', height: '36px', padding: '0 0.75rem 0 2.25rem',
              border: '1.5px solid #e2e8f0', borderRadius: '8px',
              fontSize: '0.85rem', background: '#f8fafc', boxSizing: 'border-box',
            }}
          />
        </div>
        <select
          value={sort}
          onChange={e => { setSort(e.target.value as 'terbaru' | 'trending'); setPage(1); }}
          style={{
            height: '36px', padding: '0 0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '8px',
            fontSize: '0.8rem', fontWeight: 600, color: '#374151',
            background: 'white', cursor: 'pointer', outline: 'none', flexShrink: 0, boxSizing: 'border-box',
          }}
        >
          <option value="terbaru">🕐 Terbaru</option>
          <option value="trending">🔥 Trending</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1.4fr) 160px 90px 70px 165px',
          padding: '0.75rem 1.25rem',
          background: '#f8fafc', borderBottom: '1px solid #e2e8f0',
          fontSize: '0.72rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em',
        }} className="artikel-table-header">
          <span>JUDUL</span>
          <span>KATEGORI</span>
          <span>WAKTU DIBUAT</span>
          <span>STATUS</span>
          <span>VIEWS</span>
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
              display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1.4fr) 160px 90px 70px 165px',
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
              {article.published ? 'Published' : 'Draft'}
            </span>

            {/* Views */}
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
              {article.views.toLocaleString('id-ID')}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                onClick={() => handleTogglePublish(article)}
                disabled={togglingId === article.id}
                data-tip={article.published ? 'Jadikan Draft' : 'Tayangkan'}
                className="icon-btn"
                style={{
                  width: '32px', height: '32px', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: article.published ? '#fff7ed' : '#f0fdf4',
                  border: `1px solid ${article.published ? '#fed7aa' : '#bbf7d0'}`,
                  color: article.published ? '#f97316' : '#16a34a',
                  cursor: 'pointer', opacity: togglingId === article.id ? 0.5 : 1, flexShrink: 0,
                }}
              >
                {article.published ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
              {article.published && (
                <a
                  href={`/article/${article.id}`}
                  target="_blank"
                  data-tip="Lihat Artikel"
                  className="icon-btn"
                  style={{
                    width: '32px', height: '32px', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#f1f5f9', border: '1px solid #e2e8f0',
                    color: '#475569', textDecoration: 'none', flexShrink: 0,
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
              )}
              <button
                onClick={() => handleDelete(article)}
                disabled={deletingId === article.id}
                data-tip="Hapus Artikel"
                className="icon-btn"
                style={{
                  width: '32px', height: '32px', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#fef2f2', border: '1px solid #fecaca',
                  color: '#ef4444', cursor: 'pointer', opacity: deletingId === article.id ? 0.5 : 1, flexShrink: 0,
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
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

      {/* Delete confirmation modal */}
      {(confirmDelete || modalClosing) && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', animation: `${modalClosing ? 'backdrop-out' : 'backdrop-in'} 0.2s ease both` }}
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '420px', boxShadow: '0 24px 60px rgba(0,0,0,0.18)', overflow: 'hidden', animation: `${modalClosing ? 'modal-out' : 'modal-in'} 0.2s ease both` }}>
            <div style={{ padding: '1.75rem 1.75rem 0' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '1.25rem' }}>🗑️</div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Hapus Artikel?</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6, marginBottom: '0.35rem' }}>
                Artikel berikut akan dihapus permanen dan tidak dapat dikembalikan:
              </p>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', background: '#f8fafc', borderRadius: '8px', padding: '0.65rem 0.85rem', border: '1px solid #e2e8f0' }}>
                &ldquo;{confirmDelete?.title}&rdquo;
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.65rem', padding: '1.25rem 1.75rem 1.75rem' }}>
              <button
                onClick={closeModal}
                style={{ flex: 1, padding: '0.7rem', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}
              >Batal</button>
              <button
                onClick={confirmDeleteExec}
                style={{ flex: 1, padding: '0.7rem', background: '#ef4444', border: 'none', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 700, color: 'white', cursor: 'pointer', boxShadow: '0 4px 14px rgba(239,68,68,0.35)' }}
              >Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '1.75rem', left: '50%', transform: 'translateX(-50%)', zIndex: 2000, background: '#0f172a', color: 'white', padding: '0.75rem 1.25rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '0.6rem', whiteSpace: 'nowrap', animation: 'toast-in 0.25s ease' }}>
          <span style={{ fontSize: '1rem' }}>✅</span>
          {toast}
        </div>
      )}

      <style>{`
        .icon-btn { position: relative; }
        .icon-btn[data-tip]:hover::after {
          content: attr(data-tip);
          position: absolute;
          bottom: calc(100% + 7px);
          left: 50%;
          transform: translateX(-50%);
          background: #0f172a;
          color: white;
          padding: 0.28rem 0.6rem;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 600;
          white-space: nowrap;
          pointer-events: none;
          z-index: 50;
          opacity: 1;
          animation: tip-in 0.15s ease;
        }
        .icon-btn[data-tip]:hover::before {
          content: '';
          position: absolute;
          bottom: calc(100% + 3px);
          left: 50%;
          transform: translateX(-50%);
          border: 4px solid transparent;
          border-top-color: #0f172a;
          pointer-events: none;
          z-index: 50;
          animation: tip-in 0.15s ease;
        }
        @keyframes tip-in { from { opacity:0; transform:translateX(-50%) translateY(4px) } to { opacity:1; transform:translateX(-50%) translateY(0) } }
        @keyframes pulse-badge { 0%,100%{opacity:1} 50%{opacity:0.65} }
        @keyframes toast-in { from { opacity:0; transform:translateX(-50%) translateY(8px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
        @keyframes backdrop-in { from { opacity:0 } to { opacity:1 } }
        @keyframes backdrop-out { from { opacity:1 } to { opacity:0 } }
        @keyframes modal-in { from { opacity:0; transform:scale(0.95) translateY(10px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes modal-out { from { opacity:1; transform:scale(1) translateY(0) } to { opacity:0; transform:scale(0.95) translateY(10px) } }
        @media (max-width: 768px) {
          .artikel-table-header { grid-template-columns: 1fr 90px !important; }
          .artikel-table-header span:not(:first-child):not(:last-child) { display: none; }
          .artikel-table-row { grid-template-columns: 1fr 90px !important; }
          .artikel-table-row > *:not(:first-child):not(:last-child) { display: none; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .artikel-table-header { grid-template-columns: minmax(0,2fr) minmax(0,1.4fr) 90px 70px 165px !important; }
          .artikel-table-row { grid-template-columns: minmax(0,2fr) minmax(0,1.4fr) 90px 70px 165px !important; }
          .artikel-table-header span:nth-child(3), .artikel-table-row > *:nth-child(3) { display: none; }
        }
      `}</style>
    </div>
  );
}
