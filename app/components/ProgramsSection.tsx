'use client';

import { useEffect, useRef, useState } from 'react';
import { programs } from '../data/programs';

function ProgramCard({ program, index, visible }: { program: typeof programs[0]; index: number; visible: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      id={`program-card-${program.id}`}
      style={{
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: hovered ? '0 16px 48px rgba(15,45,107,0.16)' : '0 4px 24px rgba(15,45,107,0.07)',
        transform: visible
          ? (hovered ? 'translateY(-8px)' : 'translateY(0)')
          : 'translateY(32px)',
        opacity: visible ? 1 : 0,
        transition: `all 0.5s ease ${index * 0.1}s`,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card Top */}
      <div style={{
        background: program.bgGradient,
        padding: '1.75rem 1.75rem 2.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circle */}
        <div style={{
          position: 'absolute', top: '-20px', right: '-20px',
          width: '120px', height: '120px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.07)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-30px', left: '30%',
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <span style={{ fontSize: '2.25rem' }}>{program.icon}</span>
          <div style={{
            padding: '0.25rem 0.75rem',
            background: program.badgeColor,
            color: 'white',
            borderRadius: '999px',
            fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.04em',
          }}>
            {program.badge}
          </div>
        </div>

        <h3 style={{
          fontSize: '1.2rem', fontWeight: 800, color: 'white',
          marginBottom: '0.35rem', lineHeight: 1.2,
        }}>{program.name}</h3>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)' }}>{program.degree}</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>|</span>
          <span style={{
            fontSize: '0.7rem', color: 'rgba(255,255,255,0.9)',
            background: 'rgba(255,255,255,0.15)', padding: '0.15rem 0.6rem',
            borderRadius: '999px', fontWeight: 600,
          }}>{program.accreditation}</span>
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '0.875rem', marginBottom: '1.25rem' }}>
          {program.description}
        </p>

        {/* Highlights */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
          {program.highlights.map((h) => (
            <span key={h} style={{
              padding: '0.25rem 0.65rem',
              background: '#f1f5f9',
              color: '#475569',
              borderRadius: '999px',
              fontSize: '0.72rem', fontWeight: 500,
            }}>{h}</span>
          ))}
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 'auto', paddingTop: '1rem',
          borderTop: '1px solid #f1f5f9',
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Alumni Berhasil</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: program.color }}>{program.alumni}</div>
          </div>
          <a
            href={`#program-${program.id}`}
            id={`program-detail-${program.id}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.5rem 1.1rem',
              background: program.bgGradient,
              color: 'white', fontWeight: 600, fontSize: '0.8rem',
              borderRadius: '999px', textDecoration: 'none',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            Detail
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
    <section id="program" ref={ref} style={{ padding: '6rem 0', background: 'white' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header */}
        <div style={{
          textAlign: 'center', marginBottom: '3.5rem',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.6s ease',
        }}>
          <span className="section-label" style={{ marginBottom: '1rem', display: 'inline-block' }}>✦ Program Studi</span>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            fontWeight: 800, color: '#0f2d6b',
            lineHeight: 1.2, marginBottom: '1rem',
          }}>
            Pilih Jalanmu,{' '}
            <span style={{
              background: 'linear-gradient(135deg, #0f2d6b 0%, #f5a623 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Raih Puncaknya
            </span>
          </h2>
          <p style={{ color: '#64748b', maxWidth: '560px', margin: '0 auto', lineHeight: 1.75, fontSize: '1rem' }}>
            4 program studi unggulan dengan kurikulum berbasis industri,
            dosen praktisi berpengalaman, dan jalur karier yang telah terbukti.
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.5rem',
        }} className="programs-grid">
          {programs.map((prog, i) => (
            <ProgramCard key={prog.id} program={prog} index={i} visible={visible} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          textAlign: 'center', marginTop: '3rem',
          opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 0.5s',
        }}>
          <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Belum menemukan program yang tepat?
          </p>
          <a
            href="#kontak"
            id="programs-consult"
            onClick={(e) => { e.preventDefault(); document.getElementById('kontak')?.scrollIntoView({ behavior: 'smooth' }); }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.75rem',
              border: '2px solid #0f2d6b', color: '#0f2d6b',
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
              (e.currentTarget as HTMLAnchorElement).style.color = '#0f2d6b';
            }}
          >
            Konsultasi Gratis
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M8 12h8M12 8l4 4-4 4" />
            </svg>
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .programs-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 600px)  { .programs-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
