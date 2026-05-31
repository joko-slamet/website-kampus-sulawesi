'use client';

import { useState, useRef, useEffect } from 'react';

export default function CTASection() {
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({ nama: '', email: '', phone: '', program: '', pesan: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1500);
  };

  const steps = [
    { num: '01', title: 'Isi Formulir', desc: 'Lengkapi data dirimu secara online dengan mudah', icon: '📝' },
    { num: '02', title: 'Seleksi Berkas', desc: 'Tim kami memproses berkas dalam 1-2 hari kerja', icon: '📋' },
    { num: '03', title: 'Ujian Masuk', desc: 'Ikuti tes online yang fleksibel sesuai jadwalmu', icon: '📚' },
    { num: '04', title: 'Diterima!', desc: 'Selamat bergabung! Mulai perjalanan akademikmu', icon: '🎉' },
  ];

  return (
    <section id="daftar" ref={ref} style={{ padding: '6rem 0', background: '#f8fafc' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Registration steps */}
        <div style={{
          textAlign: 'center', marginBottom: '3.5rem',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.6s ease',
        }}>
          <span className="section-label" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>✦ Pendaftaran</span>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            fontWeight: 800, color: '#0f2d6b', lineHeight: 1.2, marginBottom: '0.75rem',
          }}>
            Mulai Perjalananmu{' '}
            <span style={{
              background: 'linear-gradient(135deg, #f5a623 0%, #fbbf24 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Hari Ini</span>
          </h2>
          <p style={{ color: '#64748b', maxWidth: '500px', margin: '0 auto', lineHeight: 1.75 }}>
            Proses pendaftaran mudah, cepat, dan bisa dilakukan dari mana saja. Slot terbatas — daftar sekarang!
          </p>
        </div>

        {/* Steps */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem', marginBottom: '4rem',
          opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 0.2s',
        }} className="steps-grid">
          {steps.map((step, i) => (
            <div key={step.num} style={{
              background: 'white', border: '1px solid #e2e8f0',
              borderRadius: '16px', padding: '1.5rem',
              boxShadow: '0 4px 16px rgba(15,45,107,0.06)',
              textAlign: 'center', position: 'relative',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
              transition: `all 0.5s ease ${i * 0.1 + 0.3}s`,
            }}>
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div style={{
                  position: 'absolute', top: '2rem', right: '-1.5rem',
                  width: '2rem', height: '2px',
                  background: 'linear-gradient(90deg, #e2e8f0, #0f2d6b)',
                  zIndex: 1,
                }} className="step-connector" />
              )}
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{step.icon}</div>
              <div style={{
                display: 'inline-block',
                padding: '0.2rem 0.65rem',
                background: 'rgba(15,45,107,0.08)',
                color: '#0f2d6b', borderRadius: '999px',
                fontSize: '0.7rem', fontWeight: 800,
                letterSpacing: '0.06em', marginBottom: '0.65rem',
              }}>LANGKAH {step.num}</div>
              <h4 style={{ fontWeight: 700, color: '#0f2d6b', fontSize: '0.95rem', marginBottom: '0.4rem' }}>{step.title}</h4>
              <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Main content: form + info */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1.1fr',
          gap: '3rem', alignItems: 'flex-start',
          opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 0.4s',
        }} className="cta-main-grid">

          {/* Left: Info */}
          <div style={{
            background: 'linear-gradient(135deg, #0f2d6b 0%, #1a4aad 100%)',
            borderRadius: '24px', padding: '2.5rem',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Decorative */}
            <div style={{
              position: 'absolute', top: '-40px', right: '-40px',
              width: '200px', height: '200px', borderRadius: '50%',
              background: 'rgba(245,166,35,0.1)', pointerEvents: 'none',
            }} />

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>
              Informasi Pendaftaran
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              Tahun akademik 2025/2026 — gelombang I
            </p>

            {[
              { icon: '📅', label: 'Batas Pendaftaran', val: '30 Juli 2025' },
              { icon: '💰', label: 'Biaya Pendaftaran', val: 'Rp 150.000' },
              { icon: '📞', label: 'Hotline PMB', val: '0411-123456' },
              { icon: '📧', label: 'Email', val: 'pmb@stimik-nusantara.ac.id' },
              { icon: '📍', label: 'Lokasi Kampus', val: 'Jl. Nusantara No.1, Makassar' },
            ].map((item) => (
              <div key={item.label} style={{
                display: 'flex', gap: '1rem', alignItems: 'flex-start',
                marginBottom: '1.25rem',
              }}>
                <span style={{ fontSize: '1.2rem', flexShrink: 0, marginTop: '0.1rem' }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{item.label}</div>
                  <div style={{ fontSize: '0.9rem', color: 'white', fontWeight: 600 }}>{item.val}</div>
                </div>
              </div>
            ))}

            {/* Beasiswa alert */}
            <div style={{
              marginTop: '1.5rem', padding: '1rem 1.25rem',
              background: 'rgba(245,166,35,0.15)',
              border: '1px solid rgba(245,166,35,0.3)',
              borderRadius: '12px',
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24', marginBottom: '0.3rem' }}>
                🎁 Bonus Pendaftar Gelombang I
              </div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                Diskon SPP 20% + Bebas biaya pendaftaran untuk 50 pendaftar pertama
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/6281234567890"
              id="cta-whatsapp"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                marginTop: '1.5rem', padding: '0.85rem',
                background: '#25d366', color: 'white',
                fontWeight: 700, fontSize: '0.9rem',
                borderRadius: '12px', textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = '#1fba59';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = '#25d366';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat via WhatsApp
            </a>
          </div>

          {/* Right: Form */}
          <div style={{
            background: 'white', borderRadius: '24px', padding: '2.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 8px 32px rgba(15,45,107,0.08)',
          }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f2d6b', marginBottom: '0.75rem' }}>
                  Terima Kasih!
                </h3>
                <p style={{ color: '#64748b', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  Data kamu berhasil dikirim. Tim kami akan menghubungi kamu dalam waktu 1x24 jam.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  style={{
                    padding: '0.75rem 1.75rem',
                    background: '#0f2d6b', color: 'white',
                    border: 'none', borderRadius: '999px',
                    fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                  }}
                >
                  Kembali ke Formulir
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f2d6b', marginBottom: '0.35rem' }}>
                  Formulir Pendaftaran
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
                  Isi form di bawah dan tim kami akan segera menghubungi kamu.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  {[
                    { id: 'form-nama', label: 'Nama Lengkap', type: 'text', key: 'nama', placeholder: 'Masukkan nama lengkap', required: true },
                    { id: 'form-email', label: 'Email', type: 'email', key: 'email', placeholder: 'nama@email.com', required: true },
                    { id: 'form-phone', label: 'Nomor WhatsApp', type: 'tel', key: 'phone', placeholder: '08xxxxxxxxxx', required: true },
                  ].map((field) => (
                    <div key={field.key}>
                      <label htmlFor={field.id} style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
                        {field.label} {field.required && <span style={{ color: '#dc2626' }}>*</span>}
                      </label>
                      <input
                        id={field.id}
                        type={field.type}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={formData[field.key as keyof typeof formData]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        style={{
                          width: '100%', padding: '0.7rem 1rem',
                          border: '1.5px solid #e2e8f0', borderRadius: '10px',
                          fontSize: '0.9rem', fontFamily: 'Plus Jakarta Sans, sans-serif',
                          transition: 'border-color 0.2s',
                          background: '#fafafa',
                        }}
                      />
                    </div>
                  ))}

                  <div>
                    <label htmlFor="form-program" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
                      Program Studi <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <select
                      id="form-program"
                      required
                      value={formData.program}
                      onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                      style={{
                        width: '100%', padding: '0.7rem 1rem',
                        border: '1.5px solid #e2e8f0', borderRadius: '10px',
                        fontSize: '0.9rem', fontFamily: 'Plus Jakarta Sans, sans-serif',
                        background: '#fafafa', cursor: 'pointer',
                      }}
                    >
                      <option value="">-- Pilih Program Studi --</option>
                      <option value="SI">S1 Sistem Informasi</option>
                      <option value="TI">S1 Teknik Informatika</option>
                      <option value="MI">D3 Manajemen Informatika</option>
                      <option value="KA">D3 Komputerisasi Akuntansi</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="form-pesan" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
                      Pesan / Pertanyaan
                    </label>
                    <textarea
                      id="form-pesan"
                      rows={3}
                      placeholder="Ada yang ingin ditanyakan? (opsional)"
                      value={formData.pesan}
                      onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                      style={{
                        width: '100%', padding: '0.7rem 1rem',
                        border: '1.5px solid #e2e8f0', borderRadius: '10px',
                        fontSize: '0.9rem', fontFamily: 'Plus Jakarta Sans, sans-serif',
                        resize: 'vertical', background: '#fafafa',
                      }}
                    />
                  </div>

                  <button
                    id="form-submit"
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '0.9rem',
                      background: loading ? '#94a3b8' : 'linear-gradient(135deg, #f5a623 0%, #fbbf24 100%)',
                      color: '#0f2d6b', fontWeight: 800, fontSize: '1rem',
                      border: 'none', borderRadius: '12px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      boxShadow: loading ? 'none' : '0 8px 24px rgba(245,166,35,0.4)',
                      transition: 'all 0.25s ease',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    }}
                  >
                    {loading ? (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin-slow 1s linear infinite' }}>
                          <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                          <path d="M12 2a10 10 0 0 1 10 10" />
                        </svg>
                        Mengirim...
                      </>
                    ) : (
                      <>
                        Kirim Pendaftaran
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>

                  <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
                    🔒 Data kamu aman dan tidak akan dibagikan kepada pihak ketiga
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cta-main-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .step-connector { display: none !important; }
        }
        @media (max-width: 480px) {
          .steps-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}
