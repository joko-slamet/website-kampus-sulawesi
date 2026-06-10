'use client';

import { useEffect, useRef, useState } from 'react';
import { programs } from '../data/programs';
import { useLanguage } from '../i18n/LanguageContext';

function ProgramCard({ program, index, visible, detailLabel }: {
  program: typeof programs[0]; index: number; visible: boolean; detailLabel: string;
}) {
  const [hovered, setHovered] = useState(false);
  const careers = program.careerPaths;

  return (
    <div
      id={`program-card-${program.id}`}
      style={{
        background: 'var(--bg-card)',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: hovered ? '0 24px 64px rgba(15,45,107,0.18)' : '0 6px 32px rgba(15,45,107,0.09)',
        transform: visible ? (hovered ? 'translateY(-6px)' : 'translateY(0)') : 'translateY(36px)',
        opacity: visible ? 1 : 0,
        transition: `all 0.55s ease ${index * 0.12}s`,
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(15,45,107,0.07)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Colored header */}
      <div style={{
        background: program.bgGradient,
        padding: '2.25rem 2rem 2.75rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '40%', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.75rem',
          }}>
            {program.icon}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
            <span style={{
              padding: '0.25rem 0.85rem',
              background: program.badgeColor,
              color: '#ffffff',
              borderRadius: '999px',
              fontSize: '0.7rem', fontWeight: 700,
              letterSpacing: '0.04em',
            }}>
              {program.badge}
            </span>
            <span style={{
              padding: '0.2rem 0.75rem',
              background: 'rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.9)',
              borderRadius: '999px',
              fontSize: '0.68rem', fontWeight: 600,
            }}>
              ✓ {program.accreditation}
            </span>
          </div>
        </div>

        <h3 style={{
          fontSize: '1.35rem', fontWeight: 800, color: '#ffffff',
          marginBottom: '0.4rem', lineHeight: 1.2,
        }}>
          {program.name}
        </h3>
        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
          {program.degree}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '1.75rem 2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Description */}
        <p style={{ color: 'var(--text-body)', lineHeight: 1.75, fontSize: '0.9rem', margin: 0 }}>
          {program.description}
        </p>

        {/* Highlights */}
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-subtle)', letterSpacing: '0.07em', marginBottom: '0.6rem' }}>
            BIDANG KAJIAN
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {program.highlights.map((h) => (
              <span key={h} style={{
                padding: '0.3rem 0.8rem',
                background: 'var(--bg-muted)',
                color: 'var(--text-heading)',
                borderRadius: '999px',
                fontSize: '0.75rem', fontWeight: 500,
                border: '1px solid var(--border)',
              }}>
                {h}
              </span>
            ))}
          </div>
        </div>

        {/* Career Paths */}
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-subtle)', letterSpacing: '0.07em', marginBottom: '0.6rem' }}>
            PROSPEK KARIER
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {careers.map((c) => (
              <div key={c} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-body)' }}>
                <span style={{ color: program.color, fontWeight: 700, fontSize: '0.8rem' }}>→</span>
                {c}
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
          <a
            href={`/program/${program.id}`}
            id={`program-detail-${program.id}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.65rem 1.5rem',
              background: program.bgGradient,
              color: '#ffffff', fontWeight: 600, fontSize: '0.85rem',
              borderRadius: '999px', textDecoration: 'none',
              transition: 'all 0.2s',
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.22)';
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 14px rgba(0,0,0,0.15)';
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
            }}
          >
            {detailLabel}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ProgramsSection() {
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

  return (
    <section id="program" ref={ref} style={{ padding: '6rem 0', background: 'var(--bg-card)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <div style={{
          textAlign: 'center', marginBottom: '3.5rem',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.6s ease',
        }}>
          <span className="section-label" style={{ marginBottom: '1rem', display: 'inline-block' }}>
            {t.programs.label}
          </span>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            fontWeight: 800, color: 'var(--text-primary)',
            lineHeight: 1.2, marginBottom: '1rem',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          }}>
            {t.programs.title}{' '}
            <span className="title-gradient">
              {t.programs.titleGradient}
            </span>
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto', lineHeight: 1.75, fontSize: '1rem' }}>
            {t.programs.subtitle}
          </p>
        </div>

        {/* 2-card grid — centered at 900px */}
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '2rem',
          }} className="programs-grid">
            {programs.map((prog, i) => (
              <ProgramCard
                key={prog.id}
                program={prog}
                index={i}
                visible={visible}
                detailLabel={t.programs.detail}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{
          textAlign: 'center', marginTop: '3rem',
          opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 0.4s',
        }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {t.programs.noProgram}
          </p>
          <a
            href="#kontak"
            id="programs-consult"
            onClick={(e) => { e.preventDefault(); document.getElementById('kontak')?.scrollIntoView({ behavior: 'smooth' }); }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.75rem',
              border: '2px solid #0f2d6b', color: 'var(--text-primary)',
              fontWeight: 600, fontSize: '0.9rem',
              borderRadius: '999px', textDecoration: 'none',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#0f2d6b';
              (e.currentTarget as HTMLAnchorElement).style.color = 'white';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)';
            }}
          >
            {t.programs.consult}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M8 12h8M12 8l4 4-4 4" />
            </svg>
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .programs-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
