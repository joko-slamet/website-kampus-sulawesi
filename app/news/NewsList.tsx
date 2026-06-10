'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { resolveImage } from '../lib/imageUrl';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
const PAGE_SIZE = 9;

interface NewsItem {
  id: string;
  type: 'news' | 'announcement';
  title: string;
  image: string | null;
  content: string | null;
  category: string;
  tag: string | null;
  pinned: boolean;
  views: number;
  createdAt: string;
}

type TabType = 'all' | 'news' | 'announcement';

function stripHtml(html: string | null, maxLen = 120): string {
  if (!html) return '';
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
    timeZone: 'Asia/Makassar',
  });
}

const CATEGORY_COLORS: Record<string, string> = {
  Akademik: '#2563eb', Keuangan: '#16a34a', Kemahasiswaan: '#7c3aed',
  Kepegawaian: '#0891b2', Penelitian: '#d97706', Kegiatan: '#db2777', Umum: '#64748b',
};
function catColor(cat: string) { return CATEGORY_COLORS[cat] ?? '#64748b'; }

export default function NewsList() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [search, setSearch] = useState('');
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchItems = useCallback(async (
    p: number, tab: TabType, q: string, append = false
  ) => {
    if (p === 1) setLoading(true); else setLoadingMore(true);
    try {
      const qs = new URLSearchParams({ page: String(p), limit: String(PAGE_SIZE) });
      if (tab !== 'all') qs.set('type', tab);
      if (q) qs.set('search', q);
      const res = await fetch(`${API_URL}/api/news?${qs}`);
      const data: { data: NewsItem[]; total: number } = await res.json();
      setItems(prev => append ? [...prev, ...(data.data ?? [])] : (data.data ?? []));
      setTotal(data.total ?? 0);
    } catch { /* keep existing */ } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    setItems([]);
    fetchItems(1, activeTab, search);
  }, [activeTab, search, fetchItems]);

  const handleSearch = (v: string) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => setSearch(v), 350);
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchItems(next, activeTab, search, true);
  };

  const hasMore = items.length < total;

  const tabs: { key: TabType; label: string }[] = [
    { key: 'all', label: 'Semua' },
    { key: 'news', label: '📰 Berita' },
    { key: 'announcement', label: '📢 Pengumuman' },
  ];

  return (
    <div>
      {/* Search + filter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', maxWidth: '480px' }}>
          <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Cari berita atau pengumuman..."
            onChange={e => handleSearch(e.target.value)}
            style={{
              width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem',
              border: '1.5px solid var(--border)', borderRadius: '999px',
              fontSize: '0.9rem', background: 'var(--bg-card)', color: 'var(--text-heading)',
              outline: 'none', boxSizing: 'border-box',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = '#0f2d6b')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.35rem', width: 'fit-content' }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '0.45rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
                fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.15s',
                background: activeTab === tab.key ? '#0f2d6b' : 'transparent',
                color: activeTab === tab.key ? '#ffffff' : 'var(--text-muted)',
              }}
            >{tab.label}</button>
          ))}
        </div>
      </div>

      {/* Result count */}
      {!loading && (
        <p style={{ color: 'var(--text-subtle)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
          Menampilkan <strong style={{ color: 'var(--text-primary)' }}>{total}</strong> konten
          {activeTab !== 'all' && ` · ${activeTab === 'news' ? 'Berita' : 'Pengumuman'}`}
          {search && ` · pencarian "${search}"`}
        </p>
      )}

      {/* Skeleton */}
      {loading && (
        <div className="news-list-grid" style={{ marginBottom: '2rem' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ height: '260px', background: 'var(--bg-muted)', borderRadius: '20px', animation: 'pulse 1.5s ease infinite' }} />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-subtle)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
          <p style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Tidak ada konten ditemukan</p>
          <p style={{ fontSize: '0.875rem' }}>Coba ubah filter atau kata kunci pencarian</p>
        </div>
      )}

      {/* All items as card grid */}
      {!loading && items.length > 0 && (
        <div className="news-list-grid">
          {items.map((item) => (
            <a key={item.id} href={`/news/${item.id}`} style={{ textDecoration: 'none' }}>
              <article
                style={{
                  background: item.pinned ? 'linear-gradient(135deg, #fffbeb 0%, #fefce8 100%)' : 'var(--bg-card)',
                  border: item.pinned ? '1.5px solid #fde68a' : '1px solid var(--border)',
                  borderRadius: '20px', overflow: 'hidden',
                  display: 'flex', flexDirection: 'column', height: '100%',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = item.pinned
                    ? '0 12px 40px rgba(217,119,6,0.15)'
                    : '0 12px 40px rgba(15,45,107,0.12)';
                  el.style.transform = 'translateY(-4px)';
                  el.style.borderColor = item.pinned ? '#f59e0b' : 'rgba(15,45,107,0.18)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = 'none';
                  el.style.transform = 'translateY(0)';
                  el.style.borderColor = item.pinned ? '#fde68a' : 'var(--border)';
                }}
              >
                {/* Thumbnail */}
                <div style={{ height: '180px', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={resolveImage(item.image)} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      background: item.type === 'announcement'
                        ? 'linear-gradient(135deg, #fffbeb, #fef3c7)'
                        : `linear-gradient(135deg, ${catColor(item.category)}12, ${catColor(item.category)}08)`,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                    }}>
                      <span style={{ fontSize: '2.5rem' }}>{item.type === 'announcement' ? '📢' : '📰'}</span>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: catColor(item.category), textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.category}</span>
                    </div>
                  )}
                  {/* Badge overlay */}
                  <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', gap: '0.35rem' }}>
                    {item.pinned && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.2rem 0.55rem', background: '#fffbeb', color: '#92400e', border: '1px solid #fde68a', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 700 }}>📌 Disematkan</span>
                    )}
                    {!item.pinned && (item.type === 'announcement' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.2rem 0.55rem', background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 700 }}>📢 Pengumuman</span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.2rem 0.55rem', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 700 }}>📰 Berita</span>
                    ))}
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ padding: '0.2rem 0.6rem', background: catColor(item.category) + '18', color: catColor(item.category), borderRadius: '999px', fontSize: '0.65rem', fontWeight: 700 }}>
                      {item.category}
                    </span>
                    {item.tag && (
                      <span style={{ padding: '0.2rem 0.6rem', background: '#f5a62318', color: '#d97706', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 700 }}>
                        {item.tag}
                      </span>
                    )}
                    <span style={{ marginLeft: 'auto', fontSize: '0.68rem', color: '#94a3b8' }}>
                      👁 {item.views > 0 ? item.views.toLocaleString('id-ID') : '0'}
                    </span>
                  </div>

                  <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.4, margin: 0,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.title}
                  </h2>

                  <p style={{ color: 'var(--text-body)', fontSize: '0.82rem', lineHeight: 1.65, margin: 0, flex: 1,
                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {stripHtml(item.content)}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: `1px solid ${item.pinned ? '#fde68a' : 'var(--border)'}` }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>📅 {fmtDate(item.createdAt)}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.78rem' }}>
                      Baca
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </article>
            </a>
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && !loading && (
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button
            onClick={loadMore}
            disabled={loadingMore}
            style={{
              padding: '0.85rem 2.5rem', border: '1.5px solid var(--text-primary)',
              borderRadius: '999px', background: 'var(--bg-card)', color: 'var(--text-primary)',
              fontWeight: 700, fontSize: '0.9rem',
              cursor: loadingMore ? 'not-allowed' : 'pointer',
              opacity: loadingMore ? 0.6 : 1, transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => { if (!loadingMore) { (e.currentTarget as HTMLButtonElement).style.background = 'var(--text-primary)'; (e.currentTarget as HTMLButtonElement).style.color = '#ffffff'; } }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-card)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; }}
          >
            {loadingMore ? 'Memuat...' : `Muat lebih banyak (${total - items.length} lagi)`}
          </button>
        </div>
      )}

      <style>{`
        .news-list-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        @media (max-width: 1024px) { .news-list-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px) { .news-list-grid { grid-template-columns: 1fr !important; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
