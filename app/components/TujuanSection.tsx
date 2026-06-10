'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { translations } from '../i18n/translations';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

interface TujuanContent {
  tujuanAkadLabel: string;
  tujuanAkadItems: string[];
  tujuanProfLabel: string;
  tujuanProfItems: string[];
  sasaranLabel: string;
  sasaranItems: string[];
  sasaranSpecsLabel: string;
  sasaranSpecs: string[];
}

function getDefault(lang: 'id' | 'en'): TujuanContent {
  const p = translations[lang].profil;
  return {
    tujuanAkadLabel: p.tujuanAkadLabel,
    tujuanAkadItems: [...p.tujuanAkadItems],
    tujuanProfLabel: p.tujuanProfLabel,
    tujuanProfItems: [...p.tujuanProfItems],
    sasaranLabel: p.sasaranLabel,
    sasaranItems: [...p.sasaranItems],
    sasaranSpecsLabel: p.sasaranSpecsLabel,
    sasaranSpecs: [...p.sasaranSpecs],
  };
}

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

function ListCard({
  icon, label, color, dotColor, items, delay, visible,
}: {
  icon: string; label: string; color: string; dotColor: string;
  items: string[]; delay: number; visible: boolean;
}) {
  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: '20px', padding: '2rem',
      border: '1px solid rgba(15,45,107,0.07)',
      boxShadow: '0 4px 24px rgba(15,45,107,0.06)',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(28px)',
      transition: `all 0.6s ease ${delay}s`,
      display: 'flex', flexDirection: 'column', gap: '1.25rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '12px',
          background: color, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '1.15rem', flexShrink: 0,
        }}>
          {icon}
        </div>
        <h3 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>{label}</h3>
      </div>
      <div style={{ width: '2.5rem', height: '3px', background: 'linear-gradient(90deg, #f5a623, #fbbf24)', borderRadius: '2px' }} />
      <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <span style={{
              minWidth: '24px', height: '24px', borderRadius: '50%',
              background: dotColor, color: '#ffffff', fontWeight: 700,
              fontSize: '0.72rem', display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0, marginTop: '2px',
            }}>
              {i + 1}
            </span>
            <span style={{ color: 'var(--text-body)', lineHeight: 1.75, fontSize: '0.875rem' }}>{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function TujuanSection() {
  const { lang } = useLanguage();
  const [content, setContent] = useState<TujuanContent>(() => getDefault(lang));
  const { ref, visible } = useVisible();

  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then(r => r.json())
      .then((data: Record<string, { id: TujuanContent; en: TujuanContent }>) => {
        const saved = data?.tujuan?.[lang];
        if (saved) {
          setContent({ ...getDefault(lang), ...saved });
        }
      })
      .catch(() => {});
  }, [lang]);

  const p = content;

  return (
    <section id="tujuan" ref={ref} style={{ padding: '6rem 0', background: 'var(--bg-card)', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <div style={{
          textAlign: 'center', marginBottom: '3.5rem',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.6s ease',
        }}>
          <span className="section-label" style={{ marginBottom: '1rem', display: 'inline-block' }}>
            ✦ Tujuan &amp; Sasaran
          </span>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            fontWeight: 800, color: 'var(--text-primary)',
            lineHeight: 1.2, marginBottom: '1rem',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          }}>
            Orientasi{' '}
            <span className="title-gradient">
              Pendidikan Kami
            </span>
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.75, fontSize: '1rem' }}>
            Tujuan akademis dan profesional yang ingin dicapai, serta sasaran konkret bagi setiap lulusan STIA Abdul Haris.
          </p>
        </div>

        {/* Tujuan Akademis + Profesional */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem', marginBottom: '1.75rem',
        }} className="tujuan-grid">
          <ListCard
            icon="🎯"
            label={p.tujuanAkadLabel}
            color="rgba(245,166,35,0.12)"
            dotColor="#f5a623"
            items={p.tujuanAkadItems}
            delay={0.05}
            visible={visible}
          />
          <ListCard
            icon="💡"
            label={p.tujuanProfLabel}
            color="rgba(99,102,241,0.1)"
            dotColor="#6366f1"
            items={p.tujuanProfItems}
            delay={0.12}
            visible={visible}
          />
        </div>

        {/* Sasaran */}
        <div style={{
          background: 'var(--bg-muted)', borderRadius: '20px', padding: '2rem 2.25rem',
          border: '1px solid rgba(15,45,107,0.07)',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)',
          transition: 'all 0.6s ease 0.2s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(15,45,107,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem', flexShrink: 0 }}>
              🏆
            </div>
            <h3 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>{p.sasaranLabel}</h3>
          </div>
          <div style={{ width: '2.5rem', height: '3px', background: 'linear-gradient(90deg, #f5a623, #fbbf24)', borderRadius: '2px', marginBottom: '1.5rem' }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="sasaran-grid">
            {/* Sasaran list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {p.sasaranItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: 'var(--bg-card)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #e9eef5' }}>
                  <span style={{ minWidth: '24px', height: '24px', borderRadius: '50%', background: '#0f2d6b', color: '#ffffff', fontWeight: 700, fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    {i + 1}
                  </span>
                  <span style={{ color: 'var(--text-heading)', lineHeight: 1.7, fontSize: '0.875rem' }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Spesifikasi Capaian */}
            <div style={{ background: 'linear-gradient(135deg, #071a40 0%, #0f2d6b 100%)', borderRadius: '14px', padding: '1.5rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.06em', marginBottom: '1rem' }}>
                📋 {p.sasaranSpecsLabel.toUpperCase()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {p.sasaranSpecs.map((spec, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                    <span style={{ color: '#fbbf24', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>✦</span>
                    <span style={{ color: 'rgba(255,255,255,0.82)', fontSize: '0.875rem', lineHeight: 1.65 }}>{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .tujuan-grid { grid-template-columns: 1fr !important; }
          .sasaran-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
