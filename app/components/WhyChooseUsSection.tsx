'use client';

import { useEffect, useRef, useState } from 'react';

const reasons = [
  {
    id: 'akreditasi',
    icon: '🏆',
    title: 'Akreditasi A BAN-PT',
    description: 'Diakui secara nasional dengan peringkat akreditasi tertinggi. Jaminan kualitas pendidikan berstandar nasional.',
    metric: '100%',
    metricLabel: 'Prodi Terakreditasi',
    color: '#f5a623',
  },
  {
    id: 'dosen',
    icon: '👨‍🏫',
    title: 'Dosen Praktisi',
    description: 'Lebih dari 80% dosen kami adalah praktisi aktif di industri, memastikan materi kuliah selalu relevan dan up-to-date.',
    metric: '120+',
    metricLabel: 'Dosen Berpengalaman',
    color: '#0f2d6b',
  },
  {
    id: 'karir',
    icon: '💼',
    title: 'Karier Terjamin',
    description: 'Career center aktif dengan 200+ mitra perusahaan siap merekrut lulusan kami. Tingkat keterserapan kerja 94%.',
    metric: '94%',
    metricLabel: 'Terserap Kerja < 6 Bulan',
    color: '#10b981',
  },
  {
    id: 'fasilitas',
    icon: '🔬',
    title: 'Fasilitas Modern',
    description: 'Lab komputer generasi terbaru, perpustakaan digital, studio kreatif, dan co-working space untuk mendukung produktivitas.',
    metric: '25+',
    metricLabel: 'Lab & Fasilitas',
    color: '#7c3aed',
  },
  {
    id: 'beasiswa',
    icon: '🎓',
    title: 'Beasiswa Berlimpah',
    description: 'Tersedia beasiswa KIP-K, beasiswa prestasi, beasiswa tidak mampu, dan program cicilan 0% untuk semua mahasiswa.',
    metric: '40%',
    metricLabel: 'Mahasiswa Penerima Beasiswa',
    color: '#dc2626',
  },
  {
    id: 'komunitas',
    icon: '🌐',
    title: 'Komunitas Aktif',
    description: '50+ UKM aktif, komunitas riset, hackathon tahunan, dan program pertukaran mahasiswa internasional.',
    metric: '50+',
    metricLabel: 'Unit Kegiatan Mahasiswa',
    color: '#0891b2',
  },
];

function ReasonCard({ reason, index, visible }: { reason: typeof reasons[0]; index: number; visible: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      id={`reason-${reason.id}`}
      style={{
        background: hovered ? reason.color : 'white',
        border: `1px solid ${hovered ? reason.color : '#e2e8f0'}`,
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: hovered ? `0 16px 48px ${reason.color}40` : '0 4px 20px rgba(15,45,107,0.06)',
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
        color: hovered ? 'white' : reason.color,
        lineHeight: 1, marginBottom: '0.2rem',
        transition: 'color 0.3s',
      }}>{reason.metric}</div>
      <div style={{
        fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em',
        color: hovered ? 'rgba(255,255,255,0.75)' : '#94a3b8',
        marginBottom: '1rem',
        transition: 'color 0.3s',
      }}>{reason.metricLabel}</div>

      <h3 style={{
        fontSize: '1rem', fontWeight: 700,
        color: hovered ? 'white' : '#0f2d6b',
        marginBottom: '0.6rem',
        transition: 'color 0.3s',
      }}>{reason.title}</h3>

      <p style={{
        fontSize: '0.85rem',
        color: hovered ? 'rgba(255,255,255,0.85)' : '#64748b',
        lineHeight: 1.7,
        transition: 'color 0.3s',
      }}>{reason.description}</p>
    </div>
  );
}

export default function WhyChooseUsSection() {
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
    <section
      id="fasilitas"
      ref={ref}
      style={{
        padding: '6rem 0',
        background: '#f8fafc',
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
          <span className="section-label" style={{ marginBottom: '1rem', display: 'inline-block' }}>✦ Keunggulan Kami</span>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            fontWeight: 800, color: '#0f2d6b',
            lineHeight: 1.2, marginBottom: '1rem',
          }}>
            Mengapa Memilih{' '}
            <span style={{
              background: 'linear-gradient(135deg, #0f2d6b 0%, #f5a623 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              STIMIK Nusantara?
            </span>
          </h2>
          <p style={{ color: '#64748b', maxWidth: '540px', margin: '0 auto', lineHeight: 1.75 }}>
            Kami tidak hanya mendidik — kami mempersiapkan generasi pemimpin digital Indonesia yang siap bersaing di tingkat global.
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

        {/* Partner logos strip */}
        <div style={{
          marginTop: '4rem',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.6s ease 0.6s',
        }}>
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500, letterSpacing: '0.08em', marginBottom: '1.5rem' }}>
            MITRA PERUSAHAAN & INSTITUSI KAMI
          </p>
          <div style={{
            display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.75rem',
          }}>
            {['Telkom Indonesia', 'BNI', 'Pertamina', 'PLN', 'Bank Mandiri', 'Gojek', 'Tokopedia', 'Bukalapak', 'XL Axiata', 'Indosat'].map((company) => (
              <div key={company} style={{
                padding: '0.5rem 1.25rem',
                background: 'white', border: '1px solid #e2e8f0',
                borderRadius: '999px', fontSize: '0.8rem',
                fontWeight: 600, color: '#475569',
                boxShadow: '0 2px 8px rgba(15,45,107,0.05)',
              }}>{company}</div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .reasons-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) { .reasons-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
