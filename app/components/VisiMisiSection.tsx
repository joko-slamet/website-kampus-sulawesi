'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

function useVisible(threshold = 0.12) {
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

export default function VisiMisiSection() {
  const { t } = useLanguage();
  const p = t.profil;
  const { ref, visible } = useVisible();

  return (
    <section id="visi-misi" ref={ref} style={{ padding: '6rem 0', background: '#f8fafc', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <div style={{
          textAlign: 'center', marginBottom: '3.5rem',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.6s ease',
        }}>
          <span className="section-label" style={{ marginBottom: '1rem', display: 'inline-block' }}>
            ✦ Visi &amp; Misi
          </span>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            fontWeight: 800, color: '#0f2d6b',
            lineHeight: 1.2, marginBottom: '1rem',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          }}>
            Arah &amp;{' '}
            <span style={{
              background: 'linear-gradient(135deg, #0f2d6b 0%, #f5a623 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Komitmen Kami
            </span>
          </h2>
          <p style={{ color: '#64748b', maxWidth: '520px', margin: '0 auto', lineHeight: 1.75, fontSize: '1rem' }}>
            Landasan nilai dan arah pengembangan STIA YPA-AH &ldquo;Abdul Haris&rdquo; Makassar dalam mewujudkan pendidikan administrasi berkualitas.
          </p>
        </div>

        {/* Visi + Misi */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem',
          marginBottom: '2rem',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)',
          transition: 'all 0.65s ease 0.1s',
        }} className="visi-misi-grid">

          {/* Visi */}
          <div style={{
            background: 'linear-gradient(135deg, #071a40 0%, #0f2d6b 100%)',
            borderRadius: '24px', padding: '2.5rem',
            position: 'relative', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', gap: '1.25rem',
          }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(245,166,35,0.06)', pointerEvents: 'none' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(245,166,35,0.2)', border: '1px solid rgba(245,166,35,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                🎯
              </div>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: '#fbbf24', letterSpacing: '0.04em' }}>
                {p.visiLabel.toUpperCase()}
              </span>
            </div>

            <div style={{ width: '2.5rem', height: '3px', background: 'linear-gradient(90deg, #f5a623, #fbbf24)', borderRadius: '2px' }} />

            <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.85, fontSize: '1rem', fontStyle: 'italic', position: 'relative' }}>
              &ldquo;{p.visiBody}&rdquo;
            </p>
          </div>

          {/* Misi */}
          <div style={{
            background: 'white', borderRadius: '24px', padding: '2.5rem',
            border: '1px solid rgba(15,45,107,0.08)',
            boxShadow: '0 4px 24px rgba(15,45,107,0.06)',
            display: 'flex', flexDirection: 'column', gap: '1.25rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(15,45,107,0.07)', border: '1px solid rgba(15,45,107,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                🚀
              </div>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0f2d6b', letterSpacing: '0.04em' }}>
                {p.misiLabel.toUpperCase()}
              </span>
            </div>

            <div style={{ width: '2.5rem', height: '3px', background: 'linear-gradient(90deg, #f5a623, #fbbf24)', borderRadius: '2px' }} />

            <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {p.misiItems.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                  <span style={{
                    minWidth: '26px', height: '26px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0f2d6b, #1a4aad)',
                    color: 'white', fontWeight: 700, fontSize: '0.75rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: '2px',
                  }}>
                    {i + 1}
                  </span>
                  <span style={{ color: '#374151', lineHeight: 1.75, fontSize: '0.9rem' }}>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Campus Addresses */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.65s ease 0.2s',
        }} className="campus-grid">
          {[
            { title: p.campus1Title, desc: p.campus1Desc, address: p.campus1Address },
            { title: p.campus2Title, desc: p.campus2Desc, address: p.campus2Address },
          ].map((c, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: '16px', padding: '1.5rem 1.75rem',
              border: '1px solid rgba(15,45,107,0.08)',
              boxShadow: '0 2px 12px rgba(15,45,107,0.05)',
              display: 'flex', gap: '1rem', alignItems: 'flex-start',
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                background: 'linear-gradient(135deg, #0f2d6b, #1a4aad)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem',
              }}>
                📍
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f2d6b', marginBottom: '0.2rem' }}>{c.title}</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.4rem', fontStyle: 'italic' }}>{c.desc}</div>
                <div style={{ fontSize: '0.88rem', color: '#374151', fontWeight: 600, lineHeight: 1.5 }}>{c.address}</div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .visi-misi-grid { grid-template-columns: 1fr !important; }
          .campus-grid    { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
