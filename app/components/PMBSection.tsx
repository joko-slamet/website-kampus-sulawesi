'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

function useVisible(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export default function PMBSection() {
  const { t } = useLanguage();
  const p = t.pmb;
  const { ref, visible } = useVisible();

  return (
    <section id="daftar" ref={ref} style={{ padding: '6rem 0', background: '#f8fafc' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <div style={{
          textAlign: 'center', marginBottom: '3.5rem',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.6s ease',
        }}>
          <span className="section-label" style={{ marginBottom: '1rem', display: 'inline-block' }}>
            {p.label}
          </span>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            fontWeight: 800, color: '#0f2d6b',
            lineHeight: 1.2, marginBottom: '1rem',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          }}>
            {p.title}{' '}
            <span style={{
              background: 'linear-gradient(135deg, #0f2d6b 0%, #f5a623 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {p.titleGradient}
            </span>
          </h2>
          <p style={{ color: '#64748b', maxWidth: '560px', margin: '0 auto', lineHeight: 1.75, fontSize: '1rem' }}>
            {p.subtitle}
          </p>
        </div>

        {/* Jadwal — 2 wave cards */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem',
          marginBottom: '1.75rem',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)',
          transition: 'all 0.6s ease 0.05s',
        }} className="pmb-waves-grid">
          {p.waves.map((wave, i) => (
            <div key={i} style={{
              background: i === 0
                ? 'linear-gradient(135deg, #0f2d6b 0%, #1a4aad 100%)'
                : 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
              borderRadius: '18px', padding: '1.75rem 2rem',
              display: 'flex', alignItems: 'center', gap: '1.25rem',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px', flexShrink: 0,
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem',
              }}>
                📅
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                  {p.scheduleLabel.toUpperCase()}
                </div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'white', marginBottom: '0.2rem' }}>
                  {wave.name}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                  {wave.period}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Syarat + Biaya */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem',
          marginBottom: '2rem',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)',
          transition: 'all 0.6s ease 0.12s',
        }} className="pmb-main-grid">

          {/* Syarat Administrasi */}
          <div style={{
            background: 'white', borderRadius: '20px', padding: '2rem',
            border: '1px solid rgba(15,45,107,0.07)',
            boxShadow: '0 4px 24px rgba(15,45,107,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(15,45,107,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem', flexShrink: 0 }}>
                📋
              </div>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#0f2d6b', margin: 0 }}>{p.reqLabel}</h3>
            </div>
            <div style={{ width: '2.5rem', height: '3px', background: 'linear-gradient(90deg, #f5a623, #fbbf24)', borderRadius: '2px', marginBottom: '1.25rem' }} />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {p.reqItems.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{
                    minWidth: '22px', height: '22px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0f2d6b, #1a4aad)',
                    color: 'white', fontWeight: 700, fontSize: '0.7rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: '2px',
                  }}>
                    {i + 1}
                  </span>
                  <span style={{ color: '#374151', lineHeight: 1.7, fontSize: '0.9rem' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Biaya */}
          <div style={{
            background: 'white', borderRadius: '20px', padding: '2rem',
            border: '1px solid rgba(15,45,107,0.07)',
            boxShadow: '0 4px 24px rgba(15,45,107,0.06)',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(245,166,35,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem', flexShrink: 0 }}>
                💰
              </div>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#0f2d6b', margin: 0 }}>{p.costLabel}</h3>
            </div>
            <div style={{ width: '2.5rem', height: '3px', background: 'linear-gradient(90deg, #f5a623, #fbbf24)', borderRadius: '2px', marginBottom: '1.25rem' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
              {p.costItems.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '1rem 1.25rem',
                  background: i === 0 ? 'rgba(245,166,35,0.06)' : '#f8fafc',
                  borderRadius: '12px',
                  border: `1px solid ${i === 0 ? 'rgba(245,166,35,0.2)' : '#e9eef5'}`,
                  gap: '1rem',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1e293b' }}>{item.label}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.15rem' }}>{item.note}</div>
                  </div>
                  <div style={{
                    fontWeight: 800, fontSize: '1rem',
                    color: i === 0 ? '#b45309' : '#0f2d6b',
                    whiteSpace: 'nowrap',
                  }}>
                    {item.amount}
                  </div>
                </div>
              ))}
            </div>

            {/* Total hint */}
            <div style={{ marginTop: '1.25rem', padding: '0.85rem 1.25rem', background: 'linear-gradient(135deg, #071a40, #0f2d6b)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Total awal masuk</span>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fbbf24' }}>Rp 3.850.000</span>
            </div>
          </div>
        </div>

        {/* CTA buttons */}
        <div style={{
          display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap',
          opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 0.25s',
        }}>
          <a
            href="#kontak"
            onClick={(e) => { e.preventDefault(); document.getElementById('kontak')?.scrollIntoView({ behavior: 'smooth' }); }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.9rem 2.25rem',
              background: 'linear-gradient(135deg, #f5a623 0%, #fbbf24 100%)',
              color: '#0f2d6b', fontWeight: 700, fontSize: '0.95rem',
              borderRadius: '999px', textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(245,166,35,0.4)',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 10px 28px rgba(245,166,35,0.5)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 20px rgba(245,166,35,0.4)'; }}
          >
            {p.registerBtn} →
          </a>
          <a
            href="https://wa.me/6289685894351"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.9rem 2.25rem',
              background: 'white',
              color: '#0f2d6b', fontWeight: 600, fontSize: '0.95rem',
              borderRadius: '999px', textDecoration: 'none',
              border: '2px solid rgba(15,45,107,0.2)',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#0f2d6b'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(15,45,107,0.2)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'; }}
          >
            💬 {p.infoBtn}
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .pmb-waves-grid { grid-template-columns: 1fr !important; }
          .pmb-main-grid  { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
