'use client';

import { allArticles } from '../artikel/data';

const stats = [
  { icon: '📝', label: 'Total Artikel', value: String(allArticles.length), change: '+3', changeType: 'up', sub: 'hari ini' },
  { icon: '📬', label: 'Inquiry Masuk', value: '47', change: '+8', changeType: 'up', sub: '7 hari terakhir' },
  { icon: '👁️', label: 'Pengunjung Bulan Ini', value: '12.841', change: '+18%', changeType: 'up', sub: 'vs bulan lalu' },
];

const recentArticles = [
  { title: '7 Tips Lulus Tepat Waktu dengan IPK Tinggi di Kampus IT', category: 'Tips Kuliah', date: '1 Jun 2025', views: '2.1rb', status: 'published' },
  { title: 'Prospek Kerja Lulusan Teknik Informatika di Era AI 2025', category: 'Dunia IT', date: '30 Mei 2025', views: '1.8rb', status: 'published' },
  { title: 'Panduan Lengkap Beasiswa Mahasiswa Baru 2025', category: 'Beasiswa', date: '28 Mei 2025', views: '3.4rb', status: 'published' },
  { title: 'Mulai Freelance Sejak Kuliah', category: 'Karier', date: '25 Mei 2025', views: '980', status: 'published' },
  { title: 'AI Tools Gratis untuk Mahasiswa IT 2025', category: 'Dunia IT', date: '20 Mei 2025', views: '1.2rb', status: 'published' },
];

const recentInquiries = [
  { name: 'Andi Pratama', from: 'Makassar', program: 'Teknik Informatika', time: '2 jam lalu' },
  { name: 'Siti Rahma', from: 'Gowa', program: 'Sistem Informasi', time: '4 jam lalu' },
  { name: 'Budi Santoso', from: 'Bone', program: 'Teknik Informatika', time: '6 jam lalu' },
  { name: 'Dewi Lestari', from: 'Makassar', program: 'Manajemen Informatika', time: '1 hari lalu' },
];

export default function DashboardOverview() {
  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>Overview</h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Selasa, 3 Juni 2025 — Selamat datang kembali 👋</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem', marginBottom: '2rem' }} className="stats-grid">
        {stats.map(s => (
          <div key={s.label} style={{
            background: 'white', border: '1px solid #e2e8f0',
            borderRadius: '16px', padding: '1.4rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
              <span style={{
                fontSize: '0.72rem', fontWeight: 700,
                padding: '0.2rem 0.6rem', borderRadius: '999px',
                background: '#dcfce7', color: '#16a34a',
              }}>
                {s.change}
              </span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, marginBottom: '0.3rem' }}>
              {s.value}
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.15rem' }}>{s.label}</div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Two-column */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem' }} className="dashboard-two-col">
        {/* Recent articles */}
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{
            padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Artikel Terbaru</h2>
            <a href="/dashboard/artikel" style={{ fontSize: '0.78rem', color: '#0f2d6b', fontWeight: 600, textDecoration: 'none' }}>
              Kelola semua →
            </a>
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

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Quick actions */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Aksi Cepat</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { icon: '✍️', label: 'Tulis Artikel Baru', href: '/dashboard/artikel', color: '#0f2d6b' },
                { icon: '📢', label: 'Buat Pengumuman', href: '/dashboard/berita', color: '#7c3aed' },
                { icon: '🤖', label: 'Generate Artikel AI', href: '/dashboard/artikel', color: '#0891b2' },
                { icon: '📊', label: 'Lihat Laporan', href: '/dashboard', color: '#10b981' },
              ].map(action => (
                <a
                  key={action.label}
                  href={action.href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.75rem 0.9rem',
                    background: '#f8fafc', border: '1px solid #e2e8f0',
                    borderRadius: '10px', textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = action.color + '40';
                    (e.currentTarget as HTMLAnchorElement).style.background = action.color + '08';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = '#e2e8f0';
                    (e.currentTarget as HTMLAnchorElement).style.background = '#f8fafc';
                  }}
                >
                  <span style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: action.color + '15',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.95rem', flexShrink: 0,
                  }}>{action.icon}</span>
                  <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#0f172a' }}>{action.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Recent inquiries */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid #f1f5f9' }}>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Inquiry Terbaru</h2>
            </div>
            {recentInquiries.map((inq, i) => (
              <div key={i} style={{
                padding: '0.85rem 1.25rem',
                borderBottom: i < recentInquiries.length - 1 ? '1px solid #f8fafc' : 'none',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                  background: `hsl(${200 + i * 30},60%,50%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: '0.75rem',
                }}>
                  {inq.name.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.1rem' }}>{inq.name}</p>
                  <p style={{ fontSize: '0.7rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {inq.program} · {inq.from}
                  </p>
                </div>
                <span style={{ fontSize: '0.68rem', color: '#cbd5e1', whiteSpace: 'nowrap' }}>{inq.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .dashboard-two-col { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 540px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
