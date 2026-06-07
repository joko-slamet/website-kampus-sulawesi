'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const news = [
  {
    id: 'pmb-2025',
    category: 'Pengumuman',
    categoryColor: '#f5a623',
    date: '28 Mei 2025',
    title: 'Pendaftaran Mahasiswa Baru 2025/2026 Resmi Dibuka',
    excerpt:
      'STIA Abdul Haris Makassar membuka pendaftaran mahasiswa baru gelombang I untuk tahun akademik 2025/2026. Daftar sekarang dan dapatkan beasiswa awal semester.',
    readTime: '3 menit',
    views: '2.4rb',
    emoji: '🎓',
    bgColor: '#fef3c7',
  },
  {
    id: 'mou-telkom',
    category: 'Kemitraan',
    categoryColor: '#10b981',
    date: '22 Mei 2025',
    title: 'STIA Abdul Haris Jalin MoU dengan Telkom Indonesia untuk Program Magang',
    excerpt:
      'Penandatanganan MoU strategis antara STIA Abdul Haris Makassar dan Telkom Indonesia membuka peluang magang bagi 200 mahasiswa per tahun.',
    readTime: '4 menit',
    views: '1.8rb',
    emoji: '🤝',
    bgColor: '#d1fae5',
  },
  {
    id: 'hackathon-2025',
    category: 'Prestasi',
    categoryColor: '#7c3aed',
    date: '15 Mei 2025',
    title: 'Mahasiswa STIA Raih Juara 1 Hackathon Nasional 2025',
    excerpt:
      'Tim mahasiswa Teknik Informatika berhasil merebut juara pertama dalam kompetisi hackathon nasional dengan solusi smart city berbasis AI.',
    readTime: '5 menit',
    views: '3.1rb',
    emoji: '🏆',
    bgColor: '#ede9fe',
  },
  {
    id: 'lab-ai',
    category: 'Fasilitas',
    categoryColor: '#0891b2',
    date: '8 Mei 2025',
    title: 'Peresmian Laboratorium AI & Machine Learning Terbaru',
    excerpt:
      'Laboratorium AI terbaru senilai 5 miliar rupiah resmi beroperasi, dilengkapi GPU cluster untuk training model AI dan fasilitas riset terkini.',
    readTime: '3 menit',
    views: '1.5rb',
    emoji: '🔬',
    bgColor: '#cffafe',
  },
];

export default function NewsSection() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="berita" ref={ref} style={{ padding: '6rem 0', background: 'white' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease',
        }}>
          <div>
            <span className="section-label" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>{t.news.label}</span>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight: 800, color: '#0f2d6b', lineHeight: 1.2,
            }}>
              {t.news.title}{' '}
              <span style={{
                background: 'linear-gradient(135deg, #0f2d6b 0%, #f5a623 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>{t.news.titleGradient}</span>
            </h2>
          </div>
          <a
            href="/berita"
            id="news-view-all"
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
            {t.news.viewAll}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Featured + Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: '1.5rem',
        }} className="news-main-grid">
          {/* Featured card */}
          <div
            id="news-featured"
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              overflow: 'hidden',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(28px)',
              transition: 'all 0.6s ease 0.1s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 48px rgba(15,45,107,0.14)';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
            }}
          >
            {/* Image placeholder with emoji */}
            <div style={{
              height: '220px',
              background: news[0].bgColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '5rem', position: 'relative',
            }}>
              {news[0].emoji}
              <div style={{
                position: 'absolute', top: '1rem', left: '1rem',
                padding: '0.3rem 0.8rem',
                background: news[0].categoryColor,
                color: 'white', borderRadius: '999px',
                fontSize: '0.72rem', fontWeight: 700,
              }}>{news[0].category}</div>
            </div>
            <div style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>📅 {news[0].date}</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>⏱ {news[0].readTime}</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>👁 {news[0].views}</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f2d6b', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                {news[0].title}
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.7 }}>{news[0].excerpt}</p>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                marginTop: '1.25rem', color: '#0f2d6b', fontWeight: 600, fontSize: '0.875rem',
              }}>
                {t.news.readMore}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Smaller cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {news.slice(1).map((item, i) => (
              <div
                key={item.id}
                id={`news-card-${item.id}`}
                style={{
                  display: 'flex', gap: '1rem', alignItems: 'flex-start',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.5s ease ${(i + 1) * 0.1 + 0.2}s`,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(15,45,107,0.1)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(15,45,107,0.2)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateX(4px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLDivElement).style.borderColor = '#e2e8f0';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateX(0)';
                }}
              >
                {/* Emoji box */}
                <div style={{
                  width: '56px', height: '56px', borderRadius: '12px',
                  background: item.bgColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.75rem', flexShrink: 0,
                }}>
                  {item.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{
                      padding: '0.15rem 0.6rem',
                      background: item.categoryColor, color: 'white',
                      borderRadius: '999px', fontSize: '0.65rem', fontWeight: 700,
                    }}>{item.category}</span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{item.date}</span>
                  </div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f2d6b', lineHeight: 1.4, marginBottom: '0.3rem' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.775rem', color: '#64748b', lineHeight: 1.5 }}>
                    {item.excerpt.substring(0, 90)}...
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .news-main-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
