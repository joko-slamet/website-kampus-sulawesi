'use client';

import Image from 'next/image';
import { useLanguage } from '../i18n/LanguageContext';

const programHrefs = ['/program/adm-negara', '/program/adm-niaga'];

const servicesHrefs = ['/#daftar', '/news', '/article'];
const institutionHrefs = ['/#tentang', '/#program', '/#kontak'];


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
            <h4 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem', color: '#ffffff', letterSpacing: '0.03em' }}>
              {t.footer.colPrograms}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[t.footer.programLink1, t.footer.programLink2].map((label, i) => (
                <li key={label}>
                  <a href={programHrefs[i]} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s, padding-left 0.2s', display: 'inline-block' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fbbf24'; (e.currentTarget as HTMLAnchorElement).style.paddingLeft = '4px'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.55)'; (e.currentTarget as HTMLAnchorElement).style.paddingLeft = '0'; }}
                  >{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services column */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem', color: '#ffffff', letterSpacing: '0.03em' }}>
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
            <h4 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem', color: '#ffffff', letterSpacing: '0.03em' }}>
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
            {[
              { label: t.footer.linkNews, href: '/news' },
              { label: t.footer.linkArticles, href: '/article' },
              { label: t.footer.linkContact, href: '#kontak' },
            ].map(({ label, href }) => (
              <a key={href} href={href} style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.7)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.35)'; }}
              >{label}</a>
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
