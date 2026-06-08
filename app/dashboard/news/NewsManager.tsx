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
  views: number;
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
  const [confirmDelete, setConfirmDelete] = useState<NewsItem | null>(null);
  const [modalClosing, setModalClosing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

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

  function handleDelete(item: NewsItem) {
    setConfirmDelete(item);
  }

  async function confirmDeleteExec() {
    if (!confirmDelete) return;
    const toDelete = confirmDelete;
    closeModal();
    setActionId(toDelete.id);
    try {
      await api.news.delete(toDelete.id);
      setItems(prev => prev.filter(i => i.id !== toDelete.id));
      setTotal(t => t - 1);
      showToast(`"${toDelete.title}" berhasil dihapus`);
    } catch {
      showToast('Gagal menghapus item');
    } finally {
      setActionId(null);
    }
  }

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
            display: 'grid', gridTemplateColumns: 'minmax(0,2.5fr) 115px minmax(0,1fr) 100px 85px 55px 165px',
            padding: '0.75rem 1.25rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0',
            fontSize: '0.72rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em',
          }} className="news-table-header">
            <span>JUDUL</span>
            <span>TIPE</span>
            <span>KATEGORI</span>
            <span>TANGGAL</span>
            <span>STATUS</span>
            <span>VIEWS</span>
            <span>AKSI</span>
          </div>

          {items.map((item, i) => (
            <div
              key={item.id}
              style={{
                display: 'grid', gridTemplateColumns: 'minmax(0,2.5fr) 115px minmax(0,1fr) 100px 85px 55px 165px',
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
              }}>{item.published ? 'Published' : 'Draft'}</span>

              {/* Views */}
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                {(item.views ?? 0).toLocaleString('id-ID')}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {item.type === 'announcement' && (
                  <button
                    onClick={() => handleTogglePin(item)}
                    disabled={actionId === item.id}
                    data-tip={item.pinned ? 'Lepas Sematan' : 'Sematkan'}
                    className="icon-btn"
                    style={{
                      width: '28px', height: '28px', borderRadius: '6px',
                      background: item.pinned ? '#fef3c7' : '#f1f5f9',
                      border: `1px solid ${item.pinned ? '#fde68a' : '#e2e8f0'}`,
                      color: item.pinned ? '#d97706' : '#94a3b8',
                      fontSize: '0.8rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}
                  >📌</button>
                )}
                <button
                  onClick={() => handleTogglePublish(item)}
                  disabled={actionId === item.id}
                  data-tip={item.published ? 'Jadikan Draft' : 'Tayangkan'}
                  className="icon-btn"
                  style={{
                    width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: item.published ? '#fff7ed' : '#f0fdf4',
                    border: `1px solid ${item.published ? '#fed7aa' : '#bbf7d0'}`,
                    color: item.published ? '#f97316' : '#16a34a',
                    cursor: 'pointer', flexShrink: 0,
                  }}
                >
                  {item.published ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
                {item.published && (
                  <a
                    href={`/news/${item.id}`}
                    target="_blank"
                    data-tip="Lihat"
                    className="icon-btn"
                    style={{
                      width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569',
                      textDecoration: 'none', flexShrink: 0,
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>
                )}
                <button
                  onClick={() => setView({ mode: 'editor', item })}
                  data-tip="Edit"
                  className="icon-btn"
                  style={{
                    width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8',
                    cursor: 'pointer', flexShrink: 0,
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  disabled={actionId === item.id}
                  data-tip="Hapus"
                  className="icon-btn"
                  style={{
                    width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444',
                    cursor: 'pointer', flexShrink: 0,
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </button>
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

      {/* Delete confirmation modal */}
      {(confirmDelete || modalClosing) && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', animation: `${modalClosing ? 'backdrop-out' : 'backdrop-in'} 0.2s ease both` }}
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '420px', boxShadow: '0 24px 60px rgba(0,0,0,0.18)', overflow: 'hidden', animation: `${modalClosing ? 'modal-out' : 'modal-in'} 0.2s ease both` }}>
            <div style={{ padding: '1.75rem 1.75rem 0' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '1.25rem' }}>🗑️</div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Hapus Item?</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6, marginBottom: '0.35rem' }}>
                Item berikut akan dihapus permanen dan tidak dapat dikembalikan:
              </p>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', background: '#f8fafc', borderRadius: '8px', padding: '0.65rem 0.85rem', border: '1px solid #e2e8f0' }}>
                &ldquo;{confirmDelete?.title}&rdquo;
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.65rem', padding: '1.25rem 1.75rem 1.75rem' }}>
              <button onClick={closeModal} style={{ flex: 1, padding: '0.7rem', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>Batal</button>
              <button onClick={confirmDeleteExec} style={{ flex: 1, padding: '0.7rem', background: '#ef4444', border: 'none', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 700, color: 'white', cursor: 'pointer', boxShadow: '0 4px 14px rgba(239,68,68,0.35)' }}>Ya, Hapus</button>
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
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes toast-in { from { opacity:0; transform:translateX(-50%) translateY(8px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
        @keyframes backdrop-in { from { opacity:0 } to { opacity:1 } }
        @keyframes backdrop-out { from { opacity:1 } to { opacity:0 } }
        @keyframes modal-in { from { opacity:0; transform:scale(0.95) translateY(10px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes modal-out { from { opacity:1; transform:scale(1) translateY(0) } to { opacity:0; transform:scale(0.95) translateY(10px) } }
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
