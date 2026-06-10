'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { ProgramForPage, Lecturer } from './page';

function getInitials(name: string): string {
  const clean = name.replace(/^Dr\.\s*/i, '').trim();
  const parts = clean.split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function parseDegree(degree: string): { level: string; duration: string } {
  const map: Record<string, { level: string; duration: string }> = {
    'S1': { level: 'Sarjana (S1)', duration: '4 Tahun' },
    'S2': { level: 'Magister (S2)', duration: '2 Tahun' },
    'D3': { level: 'Diploma (D3)', duration: '3 Tahun' },
    'D4': { level: 'Diploma IV (D4)', duration: '4 Tahun' },
  };
  for (const [key, val] of Object.entries(map)) {
    if (degree.startsWith(key)) return val;
  }
  return { level: degree, duration: '-' };
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

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useVisible();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: '20px',
      padding: '2rem',
      border: '1px solid var(--border)',
      boxShadow: '0 4px 24px rgba(15,45,107,0.06)',
    }}>
      {children}
    </div>
  );
}

const divider: React.CSSProperties = {
  width: '2.5rem', height: '3px',
  background: 'linear-gradient(90deg, #f5a623, #fbbf24)',
  borderRadius: '2px', margin: '0.75rem 0 1.25rem',
};

function CardHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0' }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '12px',
        background: 'var(--bg-muted)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.1rem', flexShrink: 0,
      }}>
        {icon}
      </div>
      <h3 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-heading)', margin: 0 }}>{title}</h3>
    </div>
  );
}

export default function ProgramDetail({ program, lecturers }: { program: ProgramForPage; lecturers: Lecturer[] }) {
  const { level, duration } = parseDegree(program.degree);

  const infoItems = [
    { label: 'Jenjang', value: level },
    { label: 'Masa Studi', value: duration },
    { label: 'Gelar Lulusan', value: program.degreeTitle || '-' },
    { label: 'Akreditasi', value: program.accreditation },
    { label: 'Status', value: program.status === 'aktif' ? 'Aktif' : 'Nonaktif' },
    { label: 'Lembaga Akreditasi', value: 'BAN-PT' },
  ];

  return (
    <>
      {/* ── Hero ── */}
      <section style={{
        background: program.bgGradient,
        padding: '9rem 1.5rem 5rem',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(0,0,0,0.08)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
          <Link
            href="/#program"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', textDecoration: 'none', marginBottom: '1.5rem', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.95)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
          >
            ← Kembali ke Program Studi
          </Link>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 1rem', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '999px', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.04em' }}>✦ {level}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '3rem' }}>{program.icon}</div>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, margin: 0, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {program.name}
            </h1>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', marginBottom: '2rem', maxWidth: '600px', lineHeight: 1.75 }}>
            {program.description}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
            {[program.degreeTitle || level, program.degree, `✓ ${program.accreditation}`]
              .filter(Boolean)
              .map(label => (
                <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '999px', color: 'rgba(255,255,255,0.9)', fontSize: '0.82rem', fontWeight: 500 }}>
                  {label}
                </span>
              ))}
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <div style={{ background: 'var(--bg-muted)', padding: '4rem 1.5rem 6rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Bidang Kajian + Prospek Karier */}
          <FadeIn delay={0}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="prog-two-col">
              {/* Bidang Kajian */}
              <SectionCard>
                <CardHeader icon="📚" title="Bidang Kajian" />
                <div style={divider} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {(program.highlights ?? []).length > 0
                    ? program.highlights.map(h => (
                        <span key={h} style={{ padding: '0.35rem 0.9rem', background: 'var(--bg-muted)', color: 'var(--text-body)', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 500, border: '1px solid var(--border)' }}>
                          {h}
                        </span>
                      ))
                    : <span style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>Belum ada data</span>
                  }
                </div>
              </SectionCard>

              {/* Prospek Karier */}
              <SectionCard>
                <CardHeader icon="💼" title="Prospek Karier" />
                <div style={divider} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {(program.careerPaths ?? []).length > 0
                    ? program.careerPaths.map(c => (
                        <div key={c} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span style={{ color: program.color, fontWeight: 700 }}>→</span>
                          <span style={{ color: 'var(--text-body)', fontSize: '0.875rem', lineHeight: 1.6 }}>{c}</span>
                        </div>
                      ))
                    : <span style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>Belum ada data</span>
                  }
                </div>
              </SectionCard>
            </div>
          </FadeIn>

          {/* Info Program */}
          <FadeIn delay={0.05}>
            <SectionCard>
              <CardHeader icon="ℹ️" title="Informasi Program" />
              <div style={divider} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }} className="prog-info-grid">
                {infoItems.map(item => (
                  <div key={item.label} style={{ background: 'var(--bg-muted)', borderRadius: '12px', padding: '1rem 1.25rem', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-subtle)', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>{item.label.toUpperCase()}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-heading)' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </FadeIn>

          {/* Dosen */}
          {lecturers.length > 0 && (
            <FadeIn delay={0.08}>
              <SectionCard>
                <CardHeader icon="👨‍🏫" title={`Tenaga Pengajar — ${lecturers.length} Dosen`} />
                <div style={divider} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.85rem' }}>
                  {lecturers.map((lec, i) => (
                    <LecturerCard key={i} lecturer={lec} color={program.color} bgGradient={program.bgGradient} />
                  ))}
                </div>
              </SectionCard>
            </FadeIn>
          )}

          {/* CTA */}
          <FadeIn delay={0.1}>
            <div style={{ background: program.bgGradient, borderRadius: '20px', border: 'none', textAlign: 'center', padding: '2.5rem 2rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🎓</div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'white', marginBottom: '0.75rem' }}>
                Tertarik dengan Program Ini?
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.75rem', lineHeight: 1.7 }}>
                Daftarkan diri kamu sekarang dan jadilah bagian dari generasi administrator profesional berbasis digital.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/#daftar" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.8rem 2rem', background: 'linear-gradient(135deg, #f5a623, #fbbf24)', color: '#0f2d6b', fontWeight: 700, fontSize: '0.9rem', borderRadius: '999px', textDecoration: 'none', boxShadow: '0 4px 16px rgba(245,166,35,0.4)' }}>
                  Daftar Sekarang →
                </Link>
                <Link href="/#kontak" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.8rem 2rem', background: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 600, fontSize: '0.9rem', borderRadius: '999px', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.3)' }}>
                  Hubungi Kami
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      <style>{`
        .prog-two-col  { grid-template-columns: 1fr 1fr; }
        .prog-info-grid { grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 640px) {
          .prog-two-col   { grid-template-columns: 1fr !important; }
          .prog-info-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </>
  );
}

function LecturerCard({ lecturer, color, bgGradient }: { lecturer: Lecturer; color: string; bgGradient: string }) {
  const [hovered, setHovered] = useState(false);
  const initials = getInitials(lecturer.name);

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: '0.85rem',
        padding: '0.9rem 1rem',
        background: hovered ? 'var(--bg-muted)' : 'var(--bg-card)',
        borderRadius: '14px',
        border: `1px solid ${hovered ? 'rgba(15,45,107,0.18)' : 'var(--border)'}`,
        transition: 'all 0.2s ease',
        cursor: 'default',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
        background: hovered ? bgGradient : `${color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: '0.9rem',
        color: hovered ? 'white' : color,
        transition: 'all 0.25s ease',
      }}>
        {initials}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-heading)', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {lecturer.name}
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
          {lecturer.qualifications}
        </div>
      </div>
    </div>
  );
}
