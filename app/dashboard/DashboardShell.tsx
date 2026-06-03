'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const sidebarLinks = [
  { icon: '🏠', label: 'Overview', href: '/dashboard' },
  { icon: '📝', label: 'Artikel', href: '/dashboard/artikel' },
  { icon: '📰', label: 'Berita', href: '/dashboard/berita' },
  { icon: '🎓', label: 'Program Studi', href: '/dashboard/program' },
  { icon: '👥', label: 'Mahasiswa', href: '/dashboard/mahasiswa' },
  { icon: '⚙️', label: 'Pengaturan', href: '/dashboard/pengaturan' },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem('stimik_auth');
    if (!stored) {
      window.location.href = '/login';
      return;
    }
    setUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('stimik_auth');
    window.location.href = '/login';
  };

  if (!user) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#0f2d6b', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }}
          className="sidebar-overlay"
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: '240px', flexShrink: 0,
        background: 'linear-gradient(180deg, #071a40 0%, #0f2d6b 100%)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
        transition: 'transform 0.3s ease',
      }} className={`dashboard-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Sidebar header */}
        <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '9px',
              background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ color: 'white', fontWeight: 800, fontSize: '1rem' }}>S</span>
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '0.875rem', lineHeight: 1.2 }}>STIMIK Nusantara</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.65rem' }}>Admin Panel</div>
            </div>
          </a>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {sidebarLinks.map(link => {
            const active = pathname === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '10px', textDecoration: 'none',
                  background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: active ? 'white' : 'rgba(255,255,255,0.6)',
                  fontWeight: active ? 600 : 400,
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                  borderLeft: active ? '3px solid #f5a623' : '3px solid transparent',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.07)';
                    (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.85)';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                    (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.6)';
                  }
                }}
              >
                <span style={{ fontSize: '1rem', width: '20px', textAlign: 'center' }}>{link.icon}</span>
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.65rem',
            padding: '0.75rem 0.9rem', marginBottom: '0.5rem',
            background: 'rgba(255,255,255,0.06)', borderRadius: '10px',
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #f5a623, #fbbf24)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ color: '#0f2d6b', fontWeight: 800, fontSize: '0.8rem' }}>
                {user.name.charAt(0)}
              </span>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: 'white', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.65rem' }}>{user.role}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '0.6rem',
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '8px', color: '#fca5a5',
              fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.2)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.12)';
            }}
          >
            Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, marginLeft: '240px', display: 'flex', flexDirection: 'column', minWidth: 0 }} className="dashboard-main">
        {/* Topbar */}
        <header style={{
          background: 'white', borderBottom: '1px solid #e2e8f0',
          padding: '0 1.5rem', height: '60px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 30,
        }}>
          <button
            onClick={() => setSidebarOpen(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.25rem' }}
            className="sidebar-toggle"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a href="/" target="_blank" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              fontSize: '0.8rem', color: '#0f2d6b', fontWeight: 600, textDecoration: 'none',
              padding: '0.4rem 0.85rem', border: '1.5px solid #e2e8f0', borderRadius: '999px',
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Lihat Website
            </a>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '2rem 1.5rem' }}>
          {children}
        </main>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .dashboard-sidebar { transform: translateX(-100%); }
          .dashboard-sidebar.sidebar-open { transform: translateX(0); }
          .dashboard-main { margin-left: 0 !important; }
          .sidebar-toggle { display: flex !important; }
        }
        @media (min-width: 769px) {
          .sidebar-toggle { display: none; }
          .sidebar-overlay { display: none; }
        }
      `}</style>
    </div>
  );
}
