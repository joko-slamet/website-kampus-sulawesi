'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { allArticles } from '../artikel/data';
import { api } from '../lib/api';
import { DateRangePicker, DateRange, getPresetRange } from './DateRangePicker';

const recentArticles = [
  { title: '7 Tips Lulus Tepat Waktu dengan IPK Tinggi di Kampus IT', category: 'Tips Kuliah', date: '1 Jun 2025', views: '2.1rb' },
  { title: 'Prospek Kerja Lulusan Teknik Informatika di Era AI 2025', category: 'Dunia IT', date: '30 Mei 2025', views: '1.8rb' },
  { title: 'Panduan Lengkap Beasiswa Mahasiswa Baru 2025', category: 'Beasiswa', date: '28 Mei 2025', views: '3.4rb' },
  { title: 'Mulai Freelance Sejak Kuliah', category: 'Karier', date: '25 Mei 2025', views: '980' },
  { title: 'AI Tools Gratis untuk Mahasiswa IT 2025', category: 'Dunia IT', date: '20 Mei 2025', views: '1.2rb' },
];

export default function DashboardOverview() {
  const [waTotal, setWaTotal] = useState<number | null>(null);
  const [waLast7, setWaLast7] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);

  useEffect(() => {
    if (!dateRange) return;
    setWaTotal(null);
    api.whatsapp.stats(dateRange.from, dateRange.to)
      .then((data) => { setWaTotal(data.total); setWaLast7(data.last7Days); })
      .catch(() => {});
  }, [dateRange]);

  const stats = [
    { icon: '📝', label: 'Total Artikel', value: String(allArticles.length), change: '+3', sub: 'hari ini' },
    {
      icon: 'wa', label: 'Inquiry Masuk',
      value: waTotal === null ? '…' : String(waTotal),
      change: waLast7 === null ? '' : `+${waLast7}`,
      sub: '7 hari terakhir',
    },
  ];

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>Overview</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Selamat datang kembali 👋</p>
        </div>
        <DateRangePicker defaultPreset="30-hari" onChange={setDateRange} />
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1.25rem', marginBottom: '2rem' }} className="stats-grid">
        {stats.map(s => (
          <div key={s.label} style={{
            background: 'white', border: '1px solid #e2e8f0',
            borderRadius: '16px', padding: '1.4rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              {s.icon === 'wa' ? (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#25d366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              ) : (
                <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
              )}
              {s.change && (
                <span style={{
                  fontSize: '0.72rem', fontWeight: 700,
                  padding: '0.2rem 0.6rem', borderRadius: '999px',
                  background: '#dcfce7', color: '#16a34a',
                }}>
                  {s.change}
                </span>
              )}
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, marginBottom: '0.3rem' }}>
              {s.value}
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.15rem' }}>{s.label}</div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Artikel Terbaru */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{
          padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Artikel Terbaru</h2>
          <Link href="/dashboard/artikel" style={{ fontSize: '0.78rem', color: '#0f2d6b', fontWeight: 600, textDecoration: 'none' }}>
            Kelola semua →
          </Link>
        </div>
        <div>
          {recentArticles.map((a, i) => (
            <div key={i} style={{
              padding: '1rem 1.5rem',
              borderBottom: i < recentArticles.length - 1 ? '1px solid #f8fafc' : 'none',
              display: 'flex', alignItems: 'center', gap: '1rem',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {a.title}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.5rem',
                    background: '#eff6ff', color: '#2563eb', borderRadius: '999px',
                  }}>{a.category}</span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{a.date}</span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>👁 {a.views}</span>
                </div>
              </div>
              <span style={{
                fontSize: '0.68rem', fontWeight: 700, padding: '0.2rem 0.6rem',
                background: '#dcfce7', color: '#16a34a', borderRadius: '999px', whiteSpace: 'nowrap',
              }}>
                Tayang
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 540px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
