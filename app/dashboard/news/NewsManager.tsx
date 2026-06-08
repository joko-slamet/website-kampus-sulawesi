'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';
import NewsEditor, { type NewsDraft } from './NewsEditor';

interface NewsItem {
  id: string;
  type: 'news' | 'announcement';
  title: string;
  category: string;
  image: string | null;
  pinned: boolean;
  published: boolean;
  createdAt: string;
}

type View = { mode: 'list' } | { mode: 'editor'; item?: NewsItem };

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
const PAGE_SIZE = 15;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    timeZone: 'Asia/Makassar',
  });
}

function resolveImage(image: string | null): string | null {
  if (!image) return null;
  if (image.startsWith('http') || image.startsWith('blob:')) return image;
  return `${API_URL}${image}`;
}

export default function NewsManager() {
  const [view, setView] = useState<View>({ mode: 'list' });
  const [items, setItems] = useState<NewsItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'news' | 'announcement'>('all');
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async (p: number, f: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.news.list({
        all: true,
        type: f !== 'all' ? f : undefined,
        page: p,
        limit: PAGE_SIZE,
      });
      setItems(res.data as NewsItem[]);
      setTotal(res.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page, filter); }, [load, page, filter]);

  const handleSave = async (data: NewsDraft, publish: boolean) => {
    if (view.mode !== 'editor') return;
    const existing = view.item;

    if (existing) {
      await api.news.update(existing.id, {
        type: data.type,
        title: data.title,
        image: data.image ?? null,
        content: data.content,
        category: data.category,
        tag: data.tag || null,
        pinned: data.type === 'announcement' ? data.pinned : false,
        published: publish,
      });
    } else {
      const id = `${slugify(data.title || 'berita')}-${Date.now()}`;
      await api.news.create({
        id,
        type: data.type,
        title: data.title || 'Tanpa Judul',
        image: data.image ?? null,
        content: data.content,
        category: data.category,
        tag: data.tag || null,
        pinned: data.type === 'announcement' ? data.pinned : false,
        published: publish,
      });
    }

    setView({ mode: 'list' });
    load(1, filter);
    setPage(1);
  };

  const handleTogglePin = async (item: NewsItem) => {
    setActionId(item.id);
    try {
      await api.news.update(item.id, { pinned: !item.pinned });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, pinned: !i.pinned } : i));
    } catch { /* noop */ } finally { setActionId(null); }
  };

  const handleTogglePublish = async (item: NewsItem) => {
    setActionId(item.id);
    try {
      await api.news.update(item.id, { published: !item.published });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, published: !i.published } : i));
    } catch { /* noop */ } finally { setActionId(null); }
  };

  const handleDelete = async (item: NewsItem) => {
    if (!confirm(`Hapus "${item.title}"?`)) return;
    setActionId(item.id);
    try {
      await api.news.delete(item.id);
      setItems(prev => prev.filter(i => i.id !== item.id));
      setTotal(t => t - 1);
    } catch { /* noop */ } finally { setActionId(null); }
  };

  if (view.mode === 'editor') {
    const initial: NewsDraft | undefined = view.item
      ? {
          id: view.item.id,
          type: view.item.type,
          title: view.item.title,
          image: view.item.image,
          content: '',
          category: view.item.category,
          tag: '',
          pinned: view.item.pinned,
          published: view.item.published,
        }
      : undefined;

    return (
      <NewsEditor
        initial={initial}
        onBack={() => setView({ mode: 'list' })}
        onSave={handleSave}
      />
    );
  }

  const newsCount = items.filter(i => i.type === 'news').length;
  const annCount = items.filter(i => i.type === 'announcement').length;
  const pinnedCount = items.filter(i => i.pinned).length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>Berita & Pengumuman</h1>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { label: `${total} Total`, color: '#64748b', bg: '#f1f5f9' },
              { label: `${newsCount} Berita`, color: '#1d4ed8', bg: '#eff6ff' },
              { label: `${annCount} Pengumuman`, color: '#b45309', bg: '#fffbeb' },
              ...(pinnedCount > 0 ? [{ label: `${pinnedCount} Disematkan`, color: '#d97706', bg: '#fef3c7' }] : []),
            ].map(s => (
              <span key={s.label} style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.65rem', borderRadius: '999px', background: s.bg, color: s.color }}>
                {s.label}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => setView({ mode: 'editor' })}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.65rem 1.1rem',
            background: 'linear-gradient(135deg, #0f2d6b, #1e40af)',
            color: 'white', border: 'none', borderRadius: '10px',
            fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(15,45,107,0.25)', whiteSpace: 'nowrap',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Tulis Baru
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.35rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.35rem', marginBottom: '1.25rem', width: 'fit-content' }}>
        {([
          { key: 'all', label: 'Semua' },
          { key: 'news', label: '📰 Berita' },
          { key: 'announcement', label: '📢 Pengumuman' },
        ] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => { setFilter(tab.key); setPage(1); }}
            style={{
              padding: '0.4rem 0.9rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontSize: '0.8rem', fontWeight: 600,
              background: filter === tab.key ? '#0f2d6b' : 'transparent',
              color: filter === tab.key ? 'white' : '#64748b', transition: 'all 0.15s',
            }}
          >{tab.label}</button>
        ))}
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.85rem', color: '#dc2626' }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '3rem', textAlign: 'center' }}>
          <div style={{ width: '28px', height: '28px', border: '3px solid #e2e8f0', borderTopColor: '#0f2d6b', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 0.75rem' }} />
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Memuat...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Empty state */}
      {!loading && items.length === 0 && (
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '4rem 2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📭</div>
          <p style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>Belum ada konten</p>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.25rem' }}>Mulai dengan menulis berita atau pengumuman.</p>
          <button
            onClick={() => setView({ mode: 'editor' })}
            style={{ padding: '0.65rem 1.5rem', background: 'linear-gradient(135deg, #0f2d6b, #1e40af)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}
          >Tulis Sekarang</button>
        </div>
      )}

      {/* Table */}
      {!loading && items.length > 0 && (
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'minmax(0,2.5fr) 140px minmax(0,1fr) 130px 80px 170px',
            padding: '0.75rem 1.25rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0',
            fontSize: '0.72rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em',
          }} className="news-table-header">
            <span>JUDUL</span>
            <span>TIPE</span>
            <span>KATEGORI</span>
            <span>TANGGAL</span>
            <span>STATUS</span>
            <span>AKSI</span>
          </div>

          {items.map((item, i) => (
            <div
              key={item.id}
              style={{
                display: 'grid', gridTemplateColumns: 'minmax(0,2.5fr) 140px minmax(0,1fr) 130px 80px 170px',
                padding: '0.9rem 1.25rem', alignItems: 'center',
                borderBottom: i < items.length - 1 ? '1px solid #f8fafc' : 'none',
                transition: 'all 0.15s',
                opacity: actionId === item.id ? 0.5 : 1,
                background: item.pinned ? 'linear-gradient(90deg, #fffbeb 0%, white 100%)' : 'white',
              }}
              className="news-table-row"
              onMouseEnter={e => { if (!item.pinned) (e.currentTarget as HTMLDivElement).style.background = '#f8fafc'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = item.pinned ? 'linear-gradient(90deg, #fffbeb 0%, white 100%)' : 'white'; }}
            >
              {/* Title + thumbnail */}
              <div style={{ minWidth: 0, paddingRight: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={resolveImage(item.image) ?? ''} alt="" style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }} />
                )}
                {item.pinned && <span title="Disematkan" style={{ fontSize: '0.85rem', flexShrink: 0 }}>📌</span>}
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                  {item.title}
                </p>
              </div>

              {/* Type badge */}
              <div>
                {item.type === 'announcement' ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', fontWeight: 700, padding: '0.22rem 0.55rem', background: '#fffbeb', color: '#b45309', borderRadius: '999px', border: '1px solid #fde68a' }}>
                    📢 Pengumuman
                  </span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', fontWeight: 700, padding: '0.22rem 0.55rem', background: '#eff6ff', color: '#1d4ed8', borderRadius: '999px', border: '1px solid #bfdbfe' }}>
                    📰 Berita
                  </span>
                )}
              </div>

              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.category}</span>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{fmtDate(item.createdAt)}</span>

              <span style={{
                fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '999px', width: 'fit-content',
                background: item.published ? '#dcfce7' : '#fff7ed',
                color: item.published ? '#16a34a' : '#f97316',
              }}>{item.published ? 'Tayang' : 'Draft'}</span>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                {item.type === 'announcement' && (
                  <button
                    onClick={() => handleTogglePin(item)}
                    disabled={actionId === item.id}
                    title={item.pinned ? 'Lepas sematan' : 'Sematkan'}
                    style={{
                      width: '28px', height: '28px', borderRadius: '6px',
                      background: item.pinned ? '#fef3c7' : '#f1f5f9',
                      border: `1px solid ${item.pinned ? '#fde68a' : '#e2e8f0'}`,
                      color: item.pinned ? '#d97706' : '#94a3b8',
                      fontSize: '0.8rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >📌</button>
                )}
                <button
                  onClick={() => handleTogglePublish(item)}
                  disabled={actionId === item.id}
                  style={{
                    padding: '0.3rem 0.5rem', borderRadius: '6px',
                    background: item.published ? '#fff7ed' : '#f0fdf4',
                    border: `1px solid ${item.published ? '#fed7aa' : '#bbf7d0'}`,
                    color: item.published ? '#f97316' : '#16a34a',
                    fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer',
                  }}
                >{item.published ? 'Tarik' : 'Tayang'}</button>
                <button
                  onClick={() => setView({ mode: 'editor', item })}
                  style={{ padding: '0.3rem 0.5rem', borderRadius: '6px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer' }}
                >Edit</button>
                <button
                  onClick={() => handleDelete(item)}
                  disabled={actionId === item.id}
                  style={{ padding: '0.3rem 0.5rem', borderRadius: '6px', background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer' }}
                >Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Halaman {page} dari {totalPages} · {total} item</span>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {[
              { label: '«', disabled: page === 1, action: () => setPage(1) },
              { label: '‹', disabled: page === 1, action: () => setPage(p => Math.max(1, p - 1)) },
              { label: '›', disabled: page === totalPages, action: () => setPage(p => Math.min(totalPages, p + 1)) },
              { label: '»', disabled: page === totalPages, action: () => setPage(totalPages) },
            ].map(btn => (
              <button
                key={btn.label}
                onClick={btn.action}
                disabled={btn.disabled}
                style={{
                  minWidth: '32px', height: '32px', padding: '0 0.4rem',
                  borderRadius: '7px', border: '1px solid #e2e8f0',
                  background: btn.disabled ? '#f8fafc' : 'white',
                  color: btn.disabled ? '#cbd5e1' : '#374151',
                  fontSize: '0.8rem', fontWeight: 600,
                  cursor: btn.disabled ? 'not-allowed' : 'pointer',
                }}
              >{btn.label}</button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .news-table-header { grid-template-columns: 1fr 100px !important; }
          .news-table-header span:nth-child(n+2):not(:last-child) { display: none; }
          .news-table-row { grid-template-columns: 1fr 100px !important; }
          .news-table-row > *:nth-child(n+2):not(:last-child) { display: none; }
        }
      `}</style>
    </div>
  );
}
