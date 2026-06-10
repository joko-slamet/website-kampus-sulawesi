'use client';

import { useEffect, useRef, useState } from 'react';
import { trackWA, WA_HREF } from '../lib/trackWA';
import { useLanguage } from '../i18n/LanguageContext';

const contactMeta = [
  {
    key: 'phone' as const,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
      </svg>
    ),
    label: 'Telepon / WhatsApp',
    getHref: (c: ReturnType<typeof useLanguage>['t']['contact']) =>
      `${WA_HREF}`,
    color: '#25D366',
    bg: 'rgba(37,211,102,0.08)',
    border: 'rgba(37,211,102,0.2)',
    isWA: true,
  },
  {
    key: 'email' as const,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
    ),
    label: 'Email',
    getHref: (c: ReturnType<typeof useLanguage>['t']['contact']) =>
      `mailto:${c.email}`,
    color: '#ea4335',
    bg: 'rgba(234,67,53,0.07)',
    border: 'rgba(234,67,53,0.18)',
    isWA: false,
  },
  {
    key: 'facebook' as const,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    label: 'Facebook',
    getHref: () => 'https://www.facebook.com',
    color: '#1877f2',
    bg: 'rgba(24,119,242,0.07)',
    border: 'rgba(24,119,242,0.18)',
    isWA: false,
  },
  {
    key: 'instagram' as const,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    label: 'Instagram',
    getHref: () => 'https://www.instagram.com',
    color: '#e1306c',
    bg: 'rgba(225,48,108,0.07)',
    border: 'rgba(225,48,108,0.18)',
    isWA: false,
  },
  {
    key: 'website' as const,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    ),
    label: 'Website',
    getHref: () => 'https://stiaabdulharis.ac.id/',
    color: 'var(--text-primary)',
    bg: 'rgba(15,45,107,0.07)',
    border: 'rgba(15,45,107,0.18)',
    isWA: false,
  },
];

type ContactItem = {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  color: string;
  bg: string;
  border: string;
  isWA: boolean;
};

function ContactCard({ item, index, visible }: { item: ContactItem; index: number; visible: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={item.href}
      target={item.href.startsWith('mailto') ? undefined : '_blank'}
      rel="noopener noreferrer"
      style={{
        display: 'flex', alignItems: 'center', gap: '1rem',
        padding: '1.25rem 1.5rem',
        background: hovered ? item.bg : 'var(--bg-card)',
        border: `1px solid ${hovered ? item.border : '#e9eef5'}`,
        borderRadius: '16px',
        textDecoration: 'none',
        boxShadow: hovered ? `0 8px 24px ${item.bg}` : '0 2px 12px rgba(15,45,107,0.05)',
        transform: visible ? (hovered ? 'translateY(-3px)' : 'translateY(0)') : 'translateY(28px)',
        opacity: visible ? 1 : 0,
        transition: `all 0.45s ease ${index * 0.07}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { if (item.isWA) trackWA(); }}
    >
      <div style={{
        width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
        background: item.bg, border: `1px solid ${item.border}`,
        color: item.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.3s ease',
      }}>
        {item.icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-subtle)', letterSpacing: '0.04em', marginBottom: '0.15rem' }}>
          {item.label}
        </div>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: hovered ? item.color : 'var(--text-heading)', transition: 'color 0.2s', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.value}
        </div>
      </div>
    </a>
  );
}

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { t } = useLanguage();
  const c = t.contact;

  const contacts: ContactItem[] = contactMeta.map(m => ({
    icon: m.icon,
    label: m.label,
    value: c[m.key],
    href: m.getHref(c),
    color: m.color,
    bg: m.bg,
    border: m.border,
    isWA: m.isWA,
  }));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="kontak" ref={ref} style={{ padding: '6rem 0', background: 'var(--bg-card)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

        <div style={{
          textAlign: 'center', marginBottom: '3.5rem',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.6s ease',
        }}>
          <span className="section-label" style={{ marginBottom: '1rem', display: 'inline-block' }}>
            ✦ Hubungi Kami
          </span>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            fontWeight: 800, color: 'var(--text-primary)',
            lineHeight: 1.2, marginBottom: '1rem',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          }}>
            Ada Pertanyaan?{' '}
            <span className="title-gradient">
              Kami Siap Membantu
            </span>
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.75, fontSize: '1rem' }}>
            Hubungi kami melalui salah satu kanal berikut. Tim kami siap menjawab pertanyaan seputar pendaftaran dan program studi.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          maxWidth: '960px',
          margin: '0 auto',
        }} className="contact-grid">
          {contacts.map((item, i) => (
            <ContactCard key={item.label} item={item} index={i} visible={visible} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 480px) { .contact-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
