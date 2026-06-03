'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const navLinks = [
  { label: 'Beranda', href: '#hero' },
  { label: 'Tentang', href: '#tentang' },
  { label: 'Program Studi', href: '#program' },
  { label: 'Fasilitas', href: '#fasilitas' },
  { label: 'Artikel', href: '/artikel' },
  { label: 'Berita', href: '#berita' },
  { label: 'Kontak', href: '#kontak' },
];

export default function Navbar({ variant = 'transparent' }: { variant?: 'transparent' | 'dark' }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const pathname = usePathname();
  const isLanding = pathname === '/';

  // When variant='dark', navbar starts with dark blue bg; both variants turn white on scroll
  const atTop = !scrolled;
  const darkAtTop = atTop && variant === 'dark';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLinkClick = (href: string) => {
    setMenuOpen(false);
    if (!href.startsWith('#')) {
      window.location.href = href;
      return;
    }
    const id = href.replace('#', '');
    if (!isLanding) {
      window.location.href = `/${href}`;
      return;
    }
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header
        id="navbar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: 'all 0.35s ease',
          padding: scrolled ? '0.65rem 0' : '1.1rem 0',
          background: scrolled ? 'rgba(255,255,255,0.95)' : darkAtTop ? 'rgba(7,26,64,0.97)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(15,45,107,0.08)' : darkAtTop ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 24px rgba(15,45,107,0.06)' : 'none',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link href="/" id="navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #0f2d6b 0%, #1a4aad 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(15,45,107,0.25)',
              flexShrink: 0,
            }}>
              <span style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>S</span>
            </div>
            <div>
              <div style={{
                fontWeight: 800, fontSize: '1rem', lineHeight: 1.1,
                color: scrolled ? '#0f2d6b' : 'white',
                transition: 'color 0.3s',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}>STIMIK Nusantara</div>
              <div style={{
                fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.05em',
                color: scrolled ? '#64748b' : 'rgba(255,255,255,0.75)',
                transition: 'color 0.3s',
              }}>SULAWESI</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="desktop-nav">
            {navLinks.map((link) => (
              <button
                key={link.href}
                id={`nav-${link.href.replace('#', '')}`}
                onClick={() => handleLinkClick(link.href)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '0.5rem 0.85rem',
                  fontSize: '0.875rem', fontWeight: 500,
                  color: scrolled
                    ? (activeSection === link.href.replace('#', '') || pathname.startsWith(link.href) && !link.href.startsWith('#') ? '#0f2d6b' : '#475569')
                    : 'rgba(255,255,255,0.9)',
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.color = scrolled ? '#0f2d6b' : 'white';
                  (e.currentTarget as HTMLButtonElement).style.background = scrolled ? 'rgba(15,45,107,0.07)' : 'rgba(255,255,255,0.12)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.color = scrolled
                    ? (activeSection === link.href.replace('#', '') ? '#0f2d6b' : '#475569')
                    : 'rgba(255,255,255,0.9)';
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* CTA + Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <a
              href="#daftar"
              id="navbar-cta-daftar"
              onClick={(e) => { e.preventDefault(); handleLinkClick('#daftar'); }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.55rem 1.25rem',
                background: 'linear-gradient(135deg, #f5a623 0%, #fbbf24 100%)',
                color: '#0f2d6b',
                fontWeight: 700, fontSize: '0.875rem',
                borderRadius: '999px', textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(245,166,35,0.35)',
                transition: 'all 0.2s ease',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 24px rgba(245,166,35,0.45)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 14px rgba(245,166,35,0.35)';
              }}
            >
              Daftar Sekarang
            </a>

            {/* Hamburger */}
            <button
              id="navbar-hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
              style={{
                display: 'none', background: 'none', border: 'none', cursor: 'pointer',
                padding: '0.4rem', borderRadius: '8px',
                color: scrolled ? '#0f2d6b' : 'white',
              }}
              className="hamburger-btn"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {menuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="7" x2="21" y2="7" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="17" x2="21" y2="17" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 999,
            background: 'rgba(7,26,64,0.97)',
            display: 'flex', flexDirection: 'column',
            padding: '5rem 2rem 2rem',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
          className="mobile-menu-overlay"
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navLinks.map((link, i) => (
              <button
                key={link.href}
                id={`mobile-nav-${link.href.replace('#', '')}`}
                onClick={() => handleLinkClick(link.href)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left',
                  padding: '1rem 1.25rem',
                  fontSize: '1.25rem', fontWeight: 600,
                  color: 'white',
                  borderRadius: '12px',
                  transition: 'all 0.2s',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  borderLeft: '3px solid transparent',
                  animation: `fadeInLeft 0.4s ease ${i * 0.05}s both`,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)';
                  (e.currentTarget as HTMLButtonElement).style.borderLeftColor = '#f5a623';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.borderLeftColor = 'transparent';
                }}
              >
                {link.label}
              </button>
            ))}
          </nav>
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <a
              href="#daftar"
              id="mobile-cta-daftar"
              onClick={(e) => { e.preventDefault(); handleLinkClick('#daftar'); }}
              style={{
                display: 'block', textAlign: 'center',
                padding: '1rem',
                background: 'linear-gradient(135deg, #f5a623 0%, #fbbf24 100%)',
                color: '#0f2d6b',
                fontWeight: 700, fontSize: '1rem',
                borderRadius: '12px', textDecoration: 'none',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            >
              Daftar Mahasiswa Baru →
            </a>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
