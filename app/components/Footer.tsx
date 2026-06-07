'use client';

import Image from 'next/image';
import { useLanguage } from '../i18n/LanguageContext';

const programLinks = [
  { label: 'S1 Ilmu Administrasi Negara', href: '#program-adm-negara' },
  { label: 'S1 Ilmu Administrasi Niaga', href: '#program-adm-niaga' },
];

const servicesHrefs = ['#daftar', '#beasiswa', '#karir', '#elearning', '#perpustakaan'];
const institutionHrefs = ['/profil', '/profil#visi', '/profil#akreditasi', '#program', '#kontak'];

const socialLinks = [
  {
    id: 'social-instagram',
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    id: 'social-youtube',
    label: 'YouTube',
    href: 'https://youtube.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    id: 'social-facebook',
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: 'social-tiktok',
    label: 'TikTok',
    href: 'https://tiktok.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer id="kontak" style={{ background: '#071a40', color: 'white' }}>
      {/* Top section */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1.5rem 3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '3rem' }} className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <Image
                src="/logo.png"
                alt="Logo STIA YPA-AH Abdul Haris Makassar"
                width={48}
                height={48}
                style={{ borderRadius: '8px', flexShrink: 0 }}
              />
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.1 }}>STIA Abdul Haris</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em' }}>MAKASSAR</div>
              </div>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              {t.footer.tagline}
            </p>

            {/* Social */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {socialLinks.map((s) => (
                <a
                  key={s.id}
                  id={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: '38px', height: '38px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(245,166,35,0.2)';
                    (e.currentTarget as HTMLAnchorElement).style.color = '#fbbf24';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(245,166,35,0.3)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.07)';
                    (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.7)';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.1)';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Akreditasi badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.4rem 0.85rem',
              background: 'rgba(245,166,35,0.12)',
              border: '1px solid rgba(245,166,35,0.2)',
              borderRadius: '999px',
            }}>
              <span style={{ color: '#fbbf24', fontSize: '0.8rem', fontWeight: 700 }}>🏅 {t.footer.accred}</span>
            </div>
          </div>

          {/* Programs column */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem', color: 'white', letterSpacing: '0.03em' }}>
              {t.footer.colPrograms}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {programLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s, padding-left 0.2s', display: 'inline-block' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fbbf24'; (e.currentTarget as HTMLAnchorElement).style.paddingLeft = '4px'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.55)'; (e.currentTarget as HTMLAnchorElement).style.paddingLeft = '0'; }}
                  >{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services column */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem', color: 'white', letterSpacing: '0.03em' }}>
              {t.footer.colServices}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {t.footer.services.map((label, i) => (
                <li key={label}>
                  <a href={servicesHrefs[i]} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s, padding-left 0.2s', display: 'inline-block' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fbbf24'; (e.currentTarget as HTMLAnchorElement).style.paddingLeft = '4px'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.55)'; (e.currentTarget as HTMLAnchorElement).style.paddingLeft = '0'; }}
                  >{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Institution column */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem', color: 'white', letterSpacing: '0.03em' }}>
              {t.footer.colInstitution}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {t.footer.institution.map((label, i) => (
                <li key={label}>
                  <a href={institutionHrefs[i]} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s, padding-left 0.2s', display: 'inline-block' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fbbf24'; (e.currentTarget as HTMLAnchorElement).style.paddingLeft = '4px'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.55)'; (e.currentTarget as HTMLAnchorElement).style.paddingLeft = '0'; }}
                  >{label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Map / Contact strip */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(0,0,0,0.2)',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between', alignItems: 'center' }}>
            {[
              { icon: '📍', label: 'Jl. Tanggul Patompo No. 19, Makassar 90224 (Kampus 1)' },
              { icon: '📍', label: 'Jl. Gunung Bawakaraeng No. 72, Makassar (Kampus 2)' },
              { icon: '📞', label: '089685894351 – 0882022506660' },
              { icon: '📧', label: 'stiaabdulharis14@gmail.com' },
              { icon: '🕐', label: t.footer.hours },
            ].map((c) => (
              <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1rem' }}>{c.icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto', padding: '1.25rem 1.5rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '0.75rem',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>
            {t.footer.copyright}
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {[t.footer.privacy, t.footer.terms, t.footer.sitemap].map((link) => (
              <a key={link} href="#" style={{
                color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem',
                textDecoration: 'none', transition: 'color 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.7)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.35)'; }}
              >{link}</a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 640px)  { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}
