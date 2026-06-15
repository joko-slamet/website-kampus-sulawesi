'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function StrukturOrganisasiSection() {
  const { t } = useLanguage();
  const s = t.struktur;
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
    <section ref={ref} style={{ padding: '6rem 0', background: 'var(--bg-card)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <div style={{
          textAlign: 'center', marginBottom: '3rem',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease',
        }}>
          <span className="section-label" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>
            {s.sectionLabel}
          </span>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2,
          }}>
            {s.heading}{' '}
            <span className="title-gradient">{s.headingGradient}</span>
          </h2>
        </div>

        {/* Image */}
        <div style={{
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)',
          transition: 'all 0.7s ease 0.15s',
        }}>
          <div style={{
            borderRadius: '20px', overflow: 'hidden',
            boxShadow: '0 12px 48px rgba(15,45,107,0.14)',
            border: '1px solid rgba(15,45,107,0.08)',
          }}>
            <Image
              src="/struktur-organisasi.jpeg"
              alt="Struktur Organisasi STIA YPA-AH Abdul Haris Makassar"
              width={1600}
              height={900}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              sizes="(max-width: 768px) 100vw, 1100px"
            />
          </div>

          {/* Caption */}
          <p style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            color: 'var(--text-muted)',
            fontSize: '0.95rem',
            lineHeight: 1.7,
            maxWidth: '680px',
            margin: '1.5rem auto 0',
          }}>
            {s.caption}
          </p>
        </div>
      </div>
    </section>
  );
}
