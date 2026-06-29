'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../i18n/ThemeContext';

export default function Navbar({ variant = 'transparent' }: { variant?: 'transparent' | 'dark' | 'light' }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const { t, lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { label: t.nav.home, href: '#hero' },
    { label: t.nav.about, href: '#tentang' },
    { label: t.nav.programs, href: '#program' },
    { label: t.nav.articles, href: '#artikel' },
    { label: t.nav.news, href: '#berita' },
    { label: t.nav.contact, href: '#kontak' },
  ];

  const atTop = !scrolled;
  const darkAtTop = atTop && variant === 'dark';
  const lightAtTop = atTop && variant === 'light';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLinkClick = (href: string) => {
    setMenuOpen(false);
    if (!href.startsWith('#')) { window.location.href = href; return; }
    const id = href.replace('#', '');
    if (!isLanding) { window.location.href = `/${href}`; return; }
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const isActive = (link: { href: string }) =>
    link.href.startsWith('#')
      ? activeSection === link.href.replace('#', '')
      : pathname.startsWith(link.href);

  const activeColor = 'var(--text-primary)';

  return (
    <>
      <header
        id="navbar"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          transition: 'all 0.35s ease',
          padding: scrolled ? '0.65rem 0' : '1.1rem 0',
          background: scrolled || lightAtTop ? (theme === 'dark' ? 'rgba(15,23,42,0.97)' : 'rgba(255,255,255,0.95)') : darkAtTop ? 'rgba(7,26,64,0.97)' : 'transparent',
          backdropFilter: scrolled || lightAtTop ? 'blur(24px)' : 'none',
          WebkitBackdropFilter: scrolled || lightAtTop ? 'blur(24px)' : 'none',
          borderBottom: scrolled || lightAtTop ? '1px solid rgba(15,45,107,0.08)' : darkAtTop ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 24px rgba(15,45,107,0.06)' : 'none',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <Image
              src="/logo.png"
              alt="Logo STIA YPA-AH Abdul Haris Makassar"
              width={42}
              height={42}
              style={{ borderRadius: '6px', flexShrink: 0 }}
              priority
            />
            <div style={{ fontWeight: 800, fontSize: '1rem', lineHeight: 1.1, color: scrolled || lightAtTop ? 'var(--text-primary)' : '#ffffff', transition: 'color 0.3s' }}>
              STIA YPA-AH MAKASSAR
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="desktop-nav">
            {navLinks.map(link => (
              <button
                key={link.href}
                onClick={() => handleLinkClick(link.href)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '0.5rem 0.85rem', fontSize: '0.875rem', fontWeight: 500,
                  color: scrolled || lightAtTop ? (isActive(link) ? activeColor : 'var(--text-body)') : 'rgba(255,255,255,0.9)',
                  borderRadius: '8px', transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.color = scrolled || lightAtTop ? activeColor : 'white';
                  (e.currentTarget as HTMLButtonElement).style.background = scrolled || lightAtTop ? 'rgba(15,45,107,0.07)' : 'rgba(255,255,255,0.12)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.color = scrolled || lightAtTop ? (isActive(link) ? activeColor : 'var(--text-body)') : 'rgba(255,255,255,0.9)';
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right: lang toggle + CTA + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Language toggle */}
            <div
              className="navbar-extras"
              style={{
              display: 'flex', borderRadius: '999px', overflow: 'hidden',
              border: scrolled || lightAtTop ? '1.5px solid var(--border)' : '1.5px solid rgba(255,255,255,0.25)',
              flexShrink: 0,
            }}>
              {(['id', 'en'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  style={{
                    padding: '0.3rem 0.65rem',
                    background: lang === l ? (scrolled || lightAtTop ? '#0f2d6b' : 'rgba(255,255,255,0.2)') : 'transparent',
                    border: 'none', cursor: 'pointer',
                    fontSize: '0.72rem', fontWeight: 700,
                    color: lang === l ? '#ffffff' : (scrolled || lightAtTop ? '#64748b' : 'rgba(255,255,255,0.6)'),
                    letterSpacing: '0.05em', transition: 'all 0.2s',
                  }}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Dark mode toggle */}
            <button
              className="navbar-extras"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '0.35rem',
                borderRadius: '8px',
                color: scrolled || lightAtTop ? 'var(--text-body)' : 'rgba(255,255,255,0.8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = scrolled || lightAtTop ? 'rgba(15,45,107,0.07)' : 'rgba(255,255,255,0.12)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
            >
              {theme === 'dark' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.166 17.834a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 6.166a.75.75 0 001.06 1.06l-1.59 1.591a.75.75 0 001.061 1.06L5.106 7.227a.75.75 0 00-1.061-1.061L6.166 6.166z"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd"/>
                </svg>
              )}
            </button>

            {/* CTA */}
            <a
              className="navbar-extras"
              href="#daftar"
              onClick={e => { e.preventDefault(); handleLinkClick('#daftar'); }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.55rem 1.25rem',
                background: 'linear-gradient(135deg, #f5a623 0%, #fbbf24 100%)',
                color: '#0f2d6b', fontWeight: 700, fontSize: '0.875rem',
                borderRadius: '999px', textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(245,166,35,0.35)',
                transition: 'all 0.2s ease', whiteSpace: 'nowrap',
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
              {t.nav.apply}
            </a>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem', borderRadius: '8px', color: scrolled || lightAtTop ? '#0f2d6b' : 'white' }}
              className="hamburger-btn"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {menuOpen ? (<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>) : (<><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" /></>)}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(7,26,64,0.97)', display: 'flex', flexDirection: 'column', padding: '5rem 2rem 2rem', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navLinks.map((link, i) => (
              <button
                key={link.href}
                onClick={() => handleLinkClick(link.href)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                  padding: '1rem 1.25rem', fontSize: '1.25rem', fontWeight: 600, color: '#ffffff',
                  borderRadius: '12px', transition: 'all 0.2s', borderLeft: '3px solid transparent',
                  animation: `fadeInLeft 0.4s ease ${i * 0.05}s both`,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLButtonElement).style.borderLeftColor = '#f5a623'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.borderLeftColor = 'transparent'; }}
              >
                {link.label}
              </button>
            ))}
          </nav>
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Mobile lang + theme toggles */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['id', 'en'] as const).map(l => (
                <button key={l} onClick={() => setLang(l)} style={{ flex: 1, padding: '0.65rem', borderRadius: '10px', border: '1.5px solid rgba(255,255,255,0.2)', background: lang === l ? 'rgba(255,255,255,0.15)' : 'transparent', color: '#ffffff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
                  {l === 'id' ? '🇮🇩 Indonesia' : '🇬🇧 English'}
                </button>
              ))}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                style={{ padding: '0.65rem 1rem', borderRadius: '10px', border: '1.5px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#ffffff', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
            <a href="#daftar" onClick={e => { e.preventDefault(); handleLinkClick('#daftar'); }} style={{ display: 'block', textAlign: 'center', padding: '1rem', background: 'linear-gradient(135deg, #f5a623 0%, #fbbf24 100%)', color: '#0f2d6b', fontWeight: 700, fontSize: '1rem', borderRadius: '12px', textDecoration: 'none' }}>
              {t.nav.apply} →
            </a>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .navbar-extras { display: none !important; }
        }
      `}</style>
    </>
  );
}
