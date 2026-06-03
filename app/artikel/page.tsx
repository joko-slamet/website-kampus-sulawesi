import type { Metadata } from 'next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingCTA from '../components/FloatingCTA';
import ArticlesList from './ArticlesList';

export const metadata: Metadata = {
  title: 'Artikel & Insight',
  description:
    'Tips kuliah, dunia IT, info karier, dan beasiswa — konten edukatif untuk calon dan mahasiswa aktif STIMIK Nusantara Sulawesi. Diperbarui setiap hari.',
  alternates: { canonical: 'https://stimik-nusantara.ac.id/artikel' },
  openGraph: {
    title: 'Artikel & Insight | STIMIK Nusantara Sulawesi',
    description: 'Tips kuliah, dunia IT, info karier, dan beasiswa untuk mahasiswa STIMIK Nusantara.',
    url: 'https://stimik-nusantara.ac.id/artikel',
  },
};

export default function ArtikelPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Page Hero */}
        <section style={{
          background: 'linear-gradient(135deg, #071a40 0%, #0f2d6b 60%, #1a4aad 100%)',
          padding: '9rem 1.5rem 5rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative blobs */}
          <div style={{
            position: 'absolute', top: '10%', right: '5%',
            width: '400px', height: '400px',
            background: 'radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 70%)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '-10%', left: '-5%',
            width: '350px', height: '350px',
            background: 'radial-gradient(circle, rgba(26,74,173,0.3) 0%, transparent 70%)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />

          <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
            {/* Breadcrumb */}
            <nav style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              marginBottom: '1.5rem', fontSize: '0.8rem',
            }}>
              <a href="/" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Beranda</a>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>›</span>
              <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>Artikel</span>
            </nav>

            <span className="section-label" style={{
              background: 'rgba(245,166,35,0.18)',
              color: '#fbbf24',
              border: '1px solid rgba(245,166,35,0.3)',
              marginBottom: '1.25rem', display: 'inline-block',
            }}>
              ✦ Artikel & Insight
            </span>

            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800, color: 'white',
              lineHeight: 1.2, marginBottom: '1rem',
              maxWidth: '640px',
            }}>
              Wawasan untuk{' '}
              <span style={{
                background: 'linear-gradient(90deg, #f5a623 0%, #fbbf24 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Masa Depanmu
              </span>
            </h1>

            <p style={{
              color: 'rgba(255,255,255,0.72)',
              fontSize: '1rem', lineHeight: 1.75,
              maxWidth: '500px',
            }}>
              Tips kuliah, dunia IT, info karier, dan beasiswa — diperbarui setiap hari oleh tim STIMIK Nusantara.
            </p>

            {/* Stats strip */}
            <div style={{
              display: 'flex', gap: '2.5rem', marginTop: '2.5rem',
              flexWrap: 'wrap',
            }}>
              {[
                { value: '100+', label: 'Total Artikel' },
                { value: '3×', label: 'Update per Hari' },
                { value: '5 Topik', label: 'Kategori' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24' }}>{s.value}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', marginTop: '0.1rem' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Articles Content */}
        <section style={{ background: '#f8fafc', padding: '4rem 1.5rem 6rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <ArticlesList />
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
