'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { DateRangePicker, DateRange } from './DateRangePicker';

interface RecentArticle { id: string; title: string; category: string; categoryColor: string; date: string; views: number; published: boolean; createdAt: string; }
interface RecentLead { id: string; name: string; phone: string; program: string | null; createdAt: string; }
interface DailyPoint { day: string; count: number; }
interface SiteStats { articles: { total: number; published: number; draft: number }; totalViews: number; news: number; leads: number; }

function fmt(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', timeZone: 'Asia/Makassar' });
}

function TrendChart({ data, loading, color = '#6366f1' }: { data: DailyPoint[]; loading: boolean; color?: string }) {
  if (loading) return (
    <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '20px', height: '20px', border: `2px solid #e2e8f0`, borderTopColor: color, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
  if (data.length === 0) return (
    <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.78rem' }}>
      Belum ada data
    </div>
  );

  const W = 500; const H = 70;
  const max = Math.max(...data.map(d => d.count), 1);
  const n = data.length;
  const px = (i: number) => (i / Math.max(n - 1, 1)) * W;
  const py = (c: number) => H - (c / max) * H;
  const area = `M0,${H} L${data.map((d, i) => `${px(i).toFixed(1)},${py(d.count).toFixed(1)}`).join(' L')} L${W},${H} Z`;
  const line = `M${data.map((d, i) => `${px(i).toFixed(1)},${py(d.count).toFixed(1)}`).join(' L')}`;
  const gradId = `g${color.replace('#', '')}`;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H + 18}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => (
        <circle key={d.day} cx={px(i)} cy={py(d.count)} r="3" fill={color} stroke="white" strokeWidth="1.5">
          <title>{d.day}: {d.count}</title>
        </circle>
      ))}
      {data.filter((_, i) => i % Math.ceil(n / 7) === 0 || i === n - 1).map((d, _, arr) => (
        <text key={d.day} x={px(data.indexOf(d))} y={H + 13} textAnchor="middle" fontSize="8" fill="#94a3b8">
          {d.day.slice(5)}
        </text>
      ))}
    </svg>
  );
}

function StatCard({ icon, label, value, sub, color, href }: { icon: React.ReactNode; label: string; value: string; sub?: string; color: string; href?: string }) {
  const inner = (
    <div style={{
      background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem 1.4rem',
      display: 'flex', flexDirection: 'column', gap: '0.5rem',
      height: '100%', boxSizing: 'border-box',
      transition: 'box-shadow 0.2s, transform 0.2s',
    }}
      onMouseEnter={e => { if (href) { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; } }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = ''; (e.currentTarget as HTMLDivElement).style.transform = ''; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        {href && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        )}
      </div>
      <div>
        <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', marginTop: '0.25rem' }}>{label}</div>
        {sub && <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.15rem' }}>{sub}</div>}
      </div>
    </div>
  );
  return href ? <Link href={href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>{inner}</Link> : inner;
}

const QuickAction = ({ href, icon, label, color }: { href: string; icon: string; label: string; color: string }) => (
  <Link href={href} style={{ textDecoration: 'none' }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.6rem',
      padding: '0.65rem 1rem', borderRadius: '10px',
      background: color + '12', border: `1px solid ${color}30`,
      transition: 'all 0.15s', cursor: 'pointer',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = color + '20'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = color + '12'; }}
    >
      <span style={{ fontSize: '1rem' }}>{icon}</span>
      <span style={{ fontSize: '0.8rem', fontWeight: 700, color }}>{label}</span>
    </div>
  </Link>
);

export default function DashboardOverview() {
  const [siteStats, setSiteStats] = useState<SiteStats | null>(null);
  const [waTotal, setWaTotal] = useState<number | null>(null);
  const [waLast7, setWaLast7] = useState<number | null>(null);
  const [dailyData, setDailyData] = useState<DailyPoint[]>([]);
  const [dailyLoading, setDailyLoading] = useState(false);
  const [leadsDaily, setLeadsDaily] = useState<DailyPoint[]>([]);
  const [leadsDailyLoading, setLeadsDailyLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([]);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);

  useEffect(() => {
    api.articles.stats().then(setSiteStats).catch(() => {});
    api.articles.list({ all: true, page: 1, limit: 5 }).then(res => setRecentArticles(res.data as RecentArticle[])).catch(() => {});
    api.leads.list(1, 5).then(res => setRecentLeads(res.data as RecentLead[])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!dateRange) return;
    setWaTotal(null);
    setDailyLoading(true);
    setLeadsDailyLoading(true);
    Promise.all([
      api.whatsapp.stats(dateRange.from, dateRange.to),
      api.whatsapp.daily(dateRange.from, dateRange.to),
      api.leads.daily(dateRange.from.toISOString(), dateRange.to.toISOString()),
    ])
      .then(([stats, daily, leadsD]) => {
        setWaTotal(stats.total); setWaLast7(stats.last7Days);
        setDailyData(daily);
        setLeadsDaily(leadsD);
      })
      .catch(() => {})
      .finally(() => { setDailyLoading(false); setLeadsDailyLoading(false); });
  }, [dateRange]);

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Selamat Pagi' : now.getHours() < 17 ? 'Selamat Siang' : 'Selamat Malam';
  const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const S = siteStats;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.2rem' }}>{greeting} 👋</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{dateStr}</p>
        </div>
        <DateRangePicker defaultPreset="30-hari" onChange={setDateRange} />
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
        <QuickAction href="/dashboard/article" icon="📰" label="Artikel" color="#6366f1" />
        <QuickAction href="/dashboard/news" icon="✏️" label="Buat Berita/Pengumuman" color="#0f2d6b" />
        <QuickAction href="/dashboard/leads" icon="📬" label="Lihat Leads" color="#16a34a" />
        <QuickAction href="/dashboard/settings" icon="⚙️" label="Pengaturan" color="#64748b" />
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', alignItems: 'stretch' }} className="stat-cards">
        <StatCard
          href="/dashboard/article"
          color="#6366f1"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
          label="Total Artikel"
          value={S ? fmt(S.articles.total) : '…'}
          sub={S ? `${S.articles.published} tayang · ${S.articles.draft} draft` : undefined}
        />
        <StatCard
          href="/dashboard/news"
          color="#0f2d6b"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f2d6b" strokeWidth="2" strokeLinecap="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/></svg>}
          label="Berita & Pengumuman"
          value={S ? fmt(S.news) : '…'}
        />
        <StatCard
          color="#f59e0b"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
          label="Total Views Artikel"
          value={S ? fmt(S.totalViews) : '…'}
        />
        <StatCard
          href="/dashboard/leads"
          color="#16a34a"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
          label="Form Leads"
          value={S ? fmt(S.leads) : '…'}
          sub="inquiry masuk"
        />
        <StatCard
          color="#25d366"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="#25d366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>}
          label="WA Inquiry"
          value={waTotal === null ? '…' : fmt(waTotal)}
          sub={waLast7 !== null ? `+${waLast7} 7 hari terakhir` : undefined}
        />
      </div>

      {/* Charts — 2 kolom */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="chart-grid">
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Tren WA Inquiry</p>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.1rem' }}>Klik WhatsApp per hari</p>
            </div>
            {waTotal !== null && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>{fmt(waTotal)}</div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>periode ini</div>
              </div>
            )}
          </div>
          <div style={{ padding: '1rem 1.4rem' }}>
            <TrendChart data={dailyData} loading={dailyLoading} color="#25d366" />
          </div>
        </div>

        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Tren Form Leads</p>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.1rem' }}>Inquiry form per hari</p>
            </div>
            {siteStats !== null && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>{fmt(siteStats.leads)}</div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>total leads</div>
              </div>
            )}
          </div>
          <div style={{ padding: '1rem 1.4rem' }}>
            <TrendChart data={leadsDaily} loading={leadsDailyLoading} color="#16a34a" />
          </div>
        </div>
      </div>

      {/* Bottom: 2 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="bottom-grid">

        {/* Artikel Terbaru */}
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Artikel Terbaru</p>
            <Link href="/dashboard/article" style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>Lihat semua →</Link>
          </div>
          {recentArticles.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem' }}>Belum ada artikel</div>
          ) : recentArticles.map((a, i) => (
            <div key={a.id} style={{ padding: '0.85rem 1.4rem', borderBottom: i < recentArticles.length - 1 ? '1px solid #f8fafc' : 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '0.2rem' }}>{a.title}</p>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.1rem 0.45rem', background: (a.categoryColor || '#6366f1') + '18', color: a.categoryColor || '#6366f1', borderRadius: '999px' }}>{a.category}</span>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{fmtDate(a.createdAt)}</span>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>👁 {a.views}</span>
                </div>
              </div>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', background: a.published ? '#dcfce7' : '#fff7ed', color: a.published ? '#16a34a' : '#f97316', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                {a.published ? 'Published' : 'Draft'}
              </span>
            </div>
          ))}
        </div>

        {/* Leads Terbaru */}
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Leads Terbaru</p>
            <Link href="/dashboard/leads" style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>Lihat semua →</Link>
          </div>
          {recentLeads.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem' }}>Belum ada leads masuk</div>
          ) : recentLeads.map((lead, i) => (
            <div key={lead.id} style={{ padding: '0.85rem 1.4rem', borderBottom: i < recentLeads.length - 1 ? '1px solid #f8fafc' : 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#16a34a,#4ade80)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>
                {lead.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.15rem' }}>{lead.name}</p>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.68rem', color: '#25d366', fontWeight: 600, textDecoration: 'none' }}>{lead.phone}</a>
                  {lead.program && <span style={{ fontSize: '0.65rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.program.replace('S1 Ilmu Administrasi ', '')}</span>}
                </div>
              </div>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>{fmtDate(lead.createdAt)}</span>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 1100px) { .stat-cards { grid-template-columns: repeat(3,1fr) !important; } }
        @media (max-width: 700px) {
          .stat-cards { grid-template-columns: repeat(2,1fr) !important; }
          .chart-grid { grid-template-columns: 1fr !important; }
          .bottom-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
