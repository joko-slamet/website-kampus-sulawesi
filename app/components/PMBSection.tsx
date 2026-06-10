'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { trackWA, WA_HREF } from '../lib/trackWA';
import InquiryForm from './InquiryForm';

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
    <section id="daftar" ref={ref} style={{ padding: '6rem 0', background: 'var(--bg-muted)' }}>
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
            fontWeight: 800, color: 'var(--text-primary)',
            lineHeight: 1.2, marginBottom: '1rem',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          }}>
            {p.title}{' '}
            <span className="title-gradient">
              {p.titleGradient}
            </span>
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.75, fontSize: '1rem' }}>
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
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff', marginBottom: '0.2rem' }}>
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
            background: 'var(--bg-card)', borderRadius: '20px', padding: '2rem',
            border: '1px solid rgba(15,45,107,0.07)',
            boxShadow: '0 4px 24px rgba(15,45,107,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(15,45,107,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem', flexShrink: 0 }}>
                📋
              </div>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>{p.reqLabel}</h3>
            </div>
            <div style={{ width: '2.5rem', height: '3px', background: 'linear-gradient(90deg, #f5a623, #fbbf24)', borderRadius: '2px', marginBottom: '1.25rem' }} />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {p.reqItems.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{
                    minWidth: '22px', height: '22px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0f2d6b, #1a4aad)',
                    color: '#ffffff', fontWeight: 700, fontSize: '0.7rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: '2px',
                  }}>
                    {i + 1}
                  </span>
                  <span style={{ color: 'var(--text-heading)', lineHeight: 1.7, fontSize: '0.9rem' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Biaya */}
          <div style={{
            background: 'var(--bg-card)', borderRadius: '20px', padding: '2rem',
            border: '1px solid rgba(15,45,107,0.07)',
            boxShadow: '0 4px 24px rgba(15,45,107,0.06)',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(245,166,35,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem', flexShrink: 0 }}>
                💰
              </div>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>{p.costLabel}</h3>
            </div>
            <div style={{ width: '2.5rem', height: '3px', background: 'linear-gradient(90deg, #f5a623, #fbbf24)', borderRadius: '2px', marginBottom: '1.25rem' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
              {p.costItems.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '1rem 1.25rem',
                  background: i === 0 ? 'rgba(245,166,35,0.06)' : 'var(--bg-muted)',
                  borderRadius: '12px',
                  border: `1px solid ${i === 0 ? 'rgba(245,166,35,0.2)' : 'var(--border)'}`,
                  gap: '1rem',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-heading)' }}>{item.label}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '0.15rem' }}>{item.note}</div>
                  </div>
                  <div style={{
                    fontWeight: 800, fontSize: '1rem',
                    color: i === 0 ? '#b45309' : 'var(--text-primary)',
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


        {/* Inquiry Form — 2 column */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '0',
          marginTop: '2.5rem', borderRadius: '20px', overflow: 'hidden',
          border: '1px solid rgba(15,45,107,0.08)',
          boxShadow: '0 8px 32px rgba(15,45,107,0.1)',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)',
          transition: 'all 0.6s ease 0.3s',
        }} className="inquiry-layout">
          {/* Left: Info panel */}
          <div style={{
            background: 'linear-gradient(150deg, #071a40 0%, #0f2d6b 60%, #1a4aad 100%)',
            padding: '2.5rem 2rem',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Decoration blobs */}
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(245,166,35,0.08)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', color: '#fbbf24', marginBottom: '0.75rem', display: 'block' }}>
                MULAI PERJALANANMU
              </span>
              <h3 style={{ fontSize: 'clamp(1.3rem, 2vw, 1.65rem)', fontWeight: 800, color: '#ffffff', lineHeight: 1.25, marginBottom: '1rem' }}>
                Tertarik Bergabung<br />Bersama Kami?
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, marginBottom: '1.75rem' }}>
                Isi formulir dan tim kami akan menghubungi kamu dalam <strong style={{ color: 'white' }}>1×24 jam</strong> untuk informasi lengkap.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  'Konsultasi gratis tanpa syarat',
                  'Informasi biaya & beasiswa',
                  'Panduan proses pendaftaran',
                  'Jadwal orientasi mahasiswa baru',
                ].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(245,166,35,0.2)', border: '1px solid rgba(245,166,35,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href={WA_HREF}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWA()}
              style={{
                marginTop: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                background: '#25d366', borderRadius: '10px',
                color: '#ffffff', fontWeight: 700, fontSize: '0.85rem',
                textDecoration: 'none', width: 'fit-content',
                boxShadow: '0 4px 16px rgba(37,211,102,0.35)',
                position: 'relative',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Tanya via WhatsApp
            </a>
          </div>

          {/* Right: Form */}
          <div style={{ background: 'var(--bg-card)', padding: '2.5rem 2rem' }}>
            <InquiryForm embedded />
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .pmb-waves-grid { grid-template-columns: 1fr !important; }
          .pmb-main-grid  { grid-template-columns: 1fr !important; }
          .inquiry-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
