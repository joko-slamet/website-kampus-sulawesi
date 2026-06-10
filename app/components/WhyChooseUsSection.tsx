'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const reasonsMeta = [
  { id: 'akreditasi', icon: '🏆', color: '#f5a623' },
  { id: 'dosen',      icon: '👨‍🏫', color: 'var(--text-primary)' },
  { id: 'karir',      icon: '💼', color: '#10b981' },
  { id: 'fasilitas',  icon: '🔬', color: '#7c3aed' },
  { id: 'beasiswa',   icon: '🎓', color: '#dc2626' },
  { id: 'komunitas',  icon: '🌐', color: '#0891b2' },
];

type ReasonItem = {
  id: string;
  icon: string;
  color: string;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
};

function ReasonCard({ reason, index, visible }: { reason: ReasonItem; index: number; visible: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      id={`reason-${reason.id}`}
      style={{
        background: hovered ? reason.color : 'var(--bg-card)',
        border: `1px solid ${hovered ? reason.color : 'var(--border)'}`,
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: hovered ? `0 16px 48px ${reason.color}40` : 'var(--card-shadow)',
        transform: visible
          ? (hovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)')
          : 'translateY(32px)',
        opacity: visible ? 1 : 0,
        transition: `all 0.45s ease ${index * 0.08}s`,
        cursor: 'default',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon */}
      <div style={{
        width: '56px', height: '56px', borderRadius: '14px',
        background: hovered ? 'rgba(255,255,255,0.2)' : `${reason.color}14`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.75rem', marginBottom: '1.25rem',
        transition: 'all 0.3s ease',
      }}>
        {reason.icon}
      </div>

      {/* Metric */}
      <div style={{
        fontSize: '1.75rem', fontWeight: 900,
        color: hovered ? '#ffffff' : reason.color,
        lineHeight: 1, marginBottom: '0.2rem',
        transition: 'color 0.3s',
      }}>{reason.metric}</div>
      <div style={{
        fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em',
        color: hovered ? 'rgba(255,255,255,0.75)' : 'var(--text-subtle)',
        marginBottom: '1rem',
        transition: 'color 0.3s',
      }}>{reason.metricLabel}</div>

      <h3 style={{
        fontSize: '1rem', fontWeight: 700,
        color: hovered ? '#ffffff' : 'var(--text-primary)',
        marginBottom: '0.6rem',
        transition: 'color 0.3s',
      }}>{reason.title}</h3>

      <p style={{
        fontSize: '0.85rem',
        color: hovered ? 'rgba(255,255,255,0.85)' : 'var(--text-body)',
        lineHeight: 1.7,
        transition: 'color 0.3s',
      }}>{reason.description}</p>
    </div>
  );
}

export default function WhyChooseUsSection() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const reasons: ReasonItem[] = t.why.reasons.map((r, i) => ({
    id: reasonsMeta[i].id,
    icon: reasonsMeta[i].icon,
    color: reasonsMeta[i].color,
    title: r.title,
    description: r.desc,
    metric: r.stat,
    metricLabel: r.statLabel,
  }));

  return (
    <section
      id="fasilitas"
      ref={ref}
      style={{
        padding: '6rem 0',
        background: 'var(--bg-muted)',
        backgroundImage: 'radial-gradient(circle, rgba(15,45,107,0.04) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header */}
        <div style={{
          textAlign: 'center', marginBottom: '3.5rem',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.6s ease',
        }}>
          <span className="section-label" style={{ marginBottom: '1rem', display: 'inline-block' }}>{t.why.label}</span>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            fontWeight: 800, color: 'var(--text-primary)',
            lineHeight: 1.2, marginBottom: '1rem',
          }}>
            {t.why.title}{' '}
            <span className="title-gradient">
              {t.why.titleGradient}
            </span>
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '540px', margin: '0 auto', lineHeight: 1.75 }}>
            {t.why.subtitle}
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
        }} className="reasons-grid">
          {reasons.map((reason, i) => (
            <ReasonCard key={reason.id} reason={reason} index={i} visible={visible} />
          ))}
        </div>


      </div>

      <style>{`
        @media (max-width: 900px) { .reasons-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) { .reasons-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
