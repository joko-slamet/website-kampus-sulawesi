'use client';

import { useEffect, useRef, useState } from 'react';

const MAPS = [
  {
    title: 'Kampus 1',
    address: 'Jl. Baji Gau No.19, Makassar',
    src: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1199.0394592952434!2d119.4114401!3d-5.1812601!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbf1d82442670bf%3A0xa1128be2535f575b!2sSekolah%20Tinggi%20Ilmu%20Administrasi%20Abdul%20Haris!5e1!3m2!1sen!2sid!4v1780831324251!5m2!1sen!2sid',
  },
  {
    title: 'Kampus 2',
    address: 'Jl. Gn. Bawakaraeng No.72, Makassar',
    src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4796.501269540452!2d119.41463687578566!3d-5.135816251952472!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbf02a9d276342b%3Axbc2d7705c08319a7!2sJl.%20Gn.%20Bawakaraeng%20No.72%2C%20Pisang%20Utara%2C%20Kec.%20Ujung%20Pandang%2C%20Kota%20Makassar%2C%20Sulawesi%20Selatan%2090156!5e1!3m2!1sen!2sid!4v1780831421222!5m2!1sen!2sid',
  },
];

export default function MapsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ padding: '5rem 0', background: '#f8fafc' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

        <div style={{
          textAlign: 'center', marginBottom: '3rem',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.6s ease',
        }}>
          <span className="section-label" style={{ marginBottom: '1rem', display: 'inline-block' }}>
            ✦ Lokasi Kampus
          </span>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            fontWeight: 800, color: '#0f2d6b',
            lineHeight: 1.2, marginBottom: '0.75rem',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          }}>
            Temukan Kami di{' '}
            <span style={{
              background: 'linear-gradient(135deg, #0f2d6b 0%, #f5a623 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Makassar
            </span>
          </h2>
          <p style={{ color: '#64748b', maxWidth: '480px', margin: '0 auto', lineHeight: 1.75, fontSize: '1rem' }}>
            STIA YPA-AH &ldquo;Abdul Haris&rdquo; hadir di dua lokasi strategis di Kota Makassar.
          </p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)',
          transition: 'all 0.65s ease 0.15s',
        }} className="maps-grid">
          {MAPS.map((m) => (
            <div key={m.title} style={{
              background: 'white', borderRadius: '20px', overflow: 'hidden',
              border: '1px solid rgba(15,45,107,0.08)',
              boxShadow: '0 4px 20px rgba(15,45,107,0.07)',
            }}>
              <div style={{
                padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.65rem',
                borderBottom: '1px solid #f0f4fa',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                  background: 'linear-gradient(135deg, #0f2d6b, #1a4aad)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
                }}>
                  📍
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f2d6b' }}>{m.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{m.address}</div>
                </div>
              </div>
              <iframe
                src={m.src}
                width="100%"
                height="300"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Peta lokasi ${m.title}`}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .maps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
