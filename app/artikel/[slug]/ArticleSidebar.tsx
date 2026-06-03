'use client';

type RelatedArticle = {
  id: string;
  title: string;
  readTime: string;
};

type Props = {
  related: RelatedArticle[];
};

export default function ArticleSidebar({ related }: Props) {
  return (
    <aside>
      {/* CTA Card */}
      <div style={{
        background: 'linear-gradient(135deg, #0f2d6b 0%, #1a4aad 100%)',
        borderRadius: '20px', padding: '2rem',
        color: 'white', marginBottom: '1.5rem',
        position: 'sticky', top: '6rem',
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🎓</div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.3 }}>
          Tertarik Kuliah di STIMIK Nusantara?
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Bergabunglah bersama 5.200+ mahasiswa aktif. PMB 2025/2026 masih terbuka.
        </p>
        <a
          href="/#daftar"
          style={{
            display: 'block', textAlign: 'center',
            padding: '0.85rem',
            background: 'linear-gradient(135deg, #f5a623 0%, #fbbf24 100%)',
            color: '#0f2d6b', fontWeight: 700, fontSize: '0.9rem',
            borderRadius: '12px', textDecoration: 'none',
          }}
        >
          Daftar Sekarang →
        </a>

        {/* Related articles */}
        {related.length > 0 && (
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255,255,255,0.15)',
          }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'rgba(255,255,255,0.9)', marginBottom: '1rem' }}>
              Artikel Terkait
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {related.map(r => (
                <a
                  key={r.id}
                  href={`/artikel/${r.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      padding: '0.85rem',
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '12px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.15)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.08)';
                    }}
                  >
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white', lineHeight: 1.4, marginBottom: '0.3rem' }}>
                      {r.title}
                    </p>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)' }}>⏱ {r.readTime}</span>
                  </div>
                </a>
              ))}
            </div>
            <a
              href="/artikel"
              style={{
                display: 'block', textAlign: 'center', marginTop: '1rem',
                fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Lihat semua artikel →
            </a>
          </div>
        )}
      </div>
    </aside>
  );
}
