'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const testimonials = [
  {
    id: 'rina',
    name: 'Rina Safitri',
    program: 'S1 Sistem Informasi, 2021',
    company: 'Software Engineer — Tokopedia',
    avatar: '👩‍💻',
    avatarBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    quote:
      'Dosen-dosennya luar biasa. Mereka bukan hanya akademisi, tapi praktisi yang aktif di industri. Saya mendapat pekerjaan di Tokopedia bahkan sebelum wisuda, berkat koneksi dari career center kampus.',
    rating: 5,
  },
  {
    id: 'budi',
    name: 'Budi Santoso',
    program: 'S1 Teknik Informatika, 2019',
    company: 'Lead Developer — Gojek',
    avatar: '👨‍💼',
    avatarBg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    quote:
      'Fasilitas labnya setara perusahaan teknologi besar. Saya bisa belajar cloud computing, AI, dan cybersecurity dengan peralatan terkini. Pengalaman itu yang membedakan saya dari kandidat lain saat melamar kerja.',
    rating: 5,
  },
  {
    id: 'siti',
    name: 'Siti Rahmawati',
    program: 'D3 Manajemen Informatika, 2022',
    company: 'IT Project Manager — BNI',
    avatar: '👩‍🎓',
    avatarBg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    quote:
      'Saya awalnya ragu memilih kampus ini, tapi ternyata keputusan terbaik! Programnya sangat praktis dan langsung bisa diaplikasikan di dunia kerja. Dalam 3 bulan setelah lulus, saya sudah diterima di BNI.',
    rating: 5,
  },
  {
    id: 'andi',
    name: 'Andi Firmansyah',
    program: 'S1 Sistem Informasi, 2020',
    company: 'Data Analyst — Pertamina',
    avatar: '👨‍🔬',
    avatarBg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    quote:
      'Kurikulum yang selalu update mengikuti tren industri membuat saya selangkah lebih maju. Mata kuliah Big Data dan Business Intelligence sangat relevan dengan pekerjaan saya sekarang di Pertamina.',
    rating: 5,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="16" height="16" viewBox="0 0 24 24"
          fill={s <= rating ? '#f5a623' : '#e2e8f0'}
          stroke={s <= rating ? '#f5a623' : '#e2e8f0'}
          strokeWidth="1">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Auto-rotate
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="alumni"
      ref={ref}
      style={{
        padding: '6rem 0',
        background: '#0f2d6b',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <div style={{
        position: 'absolute', top: '-20%', right: '-10%',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', left: '-5%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(26,74,173,0.3) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{
          textAlign: 'center', marginBottom: '3.5rem',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.6s ease',
        }}>
          <span style={{
            display: 'inline-block',
            padding: '0.35rem 1rem',
            background: 'rgba(245,166,35,0.15)',
            border: '1px solid rgba(245,166,35,0.25)',
            color: '#fbbf24', borderRadius: '999px',
            fontSize: '0.75rem', fontWeight: 700,
            letterSpacing: '0.08em', marginBottom: '1rem',
          }}>{t.testimonials.label}</span>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            fontWeight: 800, color: 'white',
            lineHeight: 1.2, marginBottom: '1rem',
          }}>
            {t.testimonials.title}{' '}
            <span style={{
              background: 'linear-gradient(90deg, #f5a623 0%, #fbbf24 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>{t.testimonials.titleGradient}</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.75 }}>
            {t.testimonials.subtitle}
          </p>
        </div>

        {/* Featured testimonial */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 2fr',
          gap: '2rem', marginBottom: '2rem',
          opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 0.2s',
        }} className="testimonials-main-grid">
          {/* Sidebar: all testimonials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                id={`testimonial-tab-${t.id}`}
                onClick={() => setActive(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1rem 1.25rem',
                  background: active === i ? 'rgba(245,166,35,0.15)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${active === i ? 'rgba(245,166,35,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: t.avatarBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.25rem', flexShrink: 0,
                  border: active === i ? '2px solid #f5a623' : '2px solid transparent',
                  transition: 'border 0.3s',
                }}>
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'white' }}>{t.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', marginTop: '0.15rem' }}>{t.company}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Active testimonial card */}
          <div style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '20px',
            padding: '2.5rem',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            position: 'relative',
          }}>
            {/* Quote mark */}
            <div style={{
              position: 'absolute', top: '1.5rem', right: '2rem',
              fontSize: '6rem', lineHeight: 1, color: 'rgba(245,166,35,0.12)',
              fontFamily: 'Georgia, serif', pointerEvents: 'none',
            }}>"</div>

            <StarRating rating={testimonials[active].rating} />

            <p style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
              color: 'rgba(255,255,255,0.9)',
              lineHeight: 1.8, marginTop: '1.5rem', marginBottom: '2rem',
              fontStyle: 'italic', position: 'relative', zIndex: 1,
            }}>
              "{testimonials[active].quote}"
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: testimonials[active].avatarBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', flexShrink: 0,
                border: '3px solid rgba(245,166,35,0.4)',
              }}>
                {testimonials[active].avatar}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'white' }}>{testimonials[active].name}</div>
                <div style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 500 }}>{testimonials[active].company}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.15rem' }}>{testimonials[active].program}</div>
              </div>
            </div>

            {/* Dot indicator */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  style={{
                    width: active === i ? '24px' : '8px', height: '8px',
                    borderRadius: '999px',
                    background: active === i ? '#f5a623' : 'rgba(255,255,255,0.25)',
                    border: 'none', cursor: 'pointer',
                    transition: 'all 0.3s ease', padding: 0,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1px', background: 'rgba(255,255,255,0.08)',
          borderRadius: '16px', overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 0.4s',
        }} className="alumni-stats">
          {[
            { v: '94%', l: 'Terserap Kerja' },
            { v: '< 6 bln', l: 'Rata-rata Waktu Kerja' },
            { v: '200+', l: 'Mitra Perusahaan' },
          ].map((s) => (
            <div key={s.l} style={{ padding: '1.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fbbf24', marginBottom: '0.25rem' }}>{s.v}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .testimonials-main-grid { grid-template-columns: 1fr !important; }
          .alumni-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
