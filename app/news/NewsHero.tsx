'use client';

export default function NewsHero() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #071a40 0%, #0f2d6b 60%, #1a4aad 100%)',
      padding: '7rem 1.5rem 3.5rem',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: '10%', right: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(26,74,173,0.3) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.8rem' }}>
          <a href="/" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Beranda</a>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>›</span>
          <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>Berita & Pengumuman</span>
        </nav>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.75rem', background: 'rgba(245,166,35,0.18)', color: '#fbbf24', border: '1px solid rgba(245,166,35,0.3)', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>
            📰 Berita
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.75rem', background: 'rgba(245,166,35,0.18)', color: '#fbbf24', border: '1px solid rgba(245,166,35,0.3)', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>
            📢 Pengumuman
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: '1rem', maxWidth: '640px' }}>
          Berita &{' '}
          <span style={{ background: 'linear-gradient(90deg, #f5a623 0%, #fbbf24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Pengumuman
          </span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '1rem', lineHeight: 1.75, maxWidth: '520px' }}>
          Informasi terkini, pengumuman resmi, dan liputan kegiatan kampus STIA Abdul Haris Makassar.
        </p>
      </div>
    </section>
  );
}
