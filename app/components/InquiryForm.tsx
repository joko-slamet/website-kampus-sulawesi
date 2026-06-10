'use client';

import { useState } from 'react';
import { api } from '../lib/api';
import { gtagEvent } from '../lib/gtag';

const PROGRAMS = [
  'S1 Ilmu Administrasi Negara',
  'S1 Ilmu Administrasi Niaga',
];

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function InquiryForm({ embedded = false }: { embedded?: boolean }) {
  const [form, setForm] = useState({ name: '', phone: '', program: '', school: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      await api.leads.create({
        name: form.name,
        phone: form.phone,
        program: form.program || undefined,
        school: form.school || undefined,
        message: form.message || undefined,
      });
      gtagEvent('generate_lead', {
        method: 'inquiry_form',
        program: form.program || 'unspecified',
      });
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg('Gagal mengirim. Silakan coba lagi atau hubungi via WhatsApp.');
    }
  }

  if (status === 'success') {
    return (
      <div style={{
        ...(!embedded ? { background: '#ffffff', borderRadius: '20px', border: '1px solid rgba(15,45,107,0.08)', boxShadow: '0 4px 24px rgba(15,45,107,0.07)' } : {}),
        padding: '2.5rem',
        textAlign: 'center',
        animation: 'fade-in-up 0.4s ease',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Pesan Terkirim!
        </h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.75, fontSize: '0.95rem' }}>
          Terima kasih, <strong style={{ color: 'var(--text-primary)' }}>{form.name}</strong>. Tim kami akan menghubungi kamu di nomor <strong style={{ color: 'var(--text-primary)' }}>{form.phone}</strong> dalam 1×24 jam.
        </p>
        <button
          onClick={() => { setStatus('idle'); setForm({ name: '', phone: '', program: '', school: '', message: '' }); }}
          style={{ marginTop: '1.5rem', padding: '0.6rem 1.5rem', borderRadius: '999px', background: 'var(--bg-muted)', border: '1px solid var(--border)', color: 'var(--text-body)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
        >Kirim Lagi</button>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.75rem 1rem',
    border: '1.5px solid var(--border)', borderRadius: '10px',
    fontSize: '0.9rem', color: 'var(--text-heading)', background: 'var(--bg-muted)',
    boxSizing: 'border-box', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.78rem', fontWeight: 700,
    color: 'var(--text-body)', marginBottom: '0.35rem', letterSpacing: '0.02em',
  };

  return (
    <div style={{
      ...(!embedded ? { background: '#ffffff', borderRadius: '20px', padding: '2rem', border: '1px solid rgba(15,45,107,0.08)', boxShadow: '0 4px 24px rgba(15,45,107,0.07)' } : {}),
    }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
          Formulir Pendaftaran
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', lineHeight: 1.6 }}>
          Isi form di bawah dan tim kami akan menghubungi kamu.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="inquiry-2col">
          <div>
            <label style={labelStyle}>Nama Lengkap <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              name="name" value={form.name} onChange={handleChange}
              placeholder="Contoh: Andi Firmansyah"
              required style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = '#0f2d6b'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(15,45,107,0.08)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>
          <div>
            <label style={labelStyle}>Nomor HP/WhatsApp <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              name="phone" value={form.phone} onChange={handleChange}
              placeholder="08xxxxxxxxxx"
              required type="tel" style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = '#0f2d6b'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(15,45,107,0.08)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="inquiry-2col">
          <div>
            <label style={labelStyle}>Program Studi</label>
            <select
              name="program" value={form.program} onChange={handleChange}
              style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#0f2d6b'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(15,45,107,0.08)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <option value="">-- Pilih Program --</option>
              {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Asal Sekolah</label>
            <input
              name="school" value={form.school} onChange={handleChange}
              placeholder="Nama SMA/SMK/MA"
              style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = '#0f2d6b'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(15,45,107,0.08)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Pesan / Pertanyaan</label>
          <textarea
            name="message" value={form.message} onChange={handleChange}
            placeholder="Tuliskan pertanyaan atau pesan kamu di sini..."
            rows={3}
            style={{ ...inputStyle, resize: 'vertical', minHeight: '80px', fontFamily: 'inherit' }}
            onFocus={e => { e.currentTarget.style.borderColor = '#0f2d6b'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(15,45,107,0.08)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
          />
        </div>

        {status === 'error' && (
          <p style={{ fontSize: '0.82rem', color: '#dc2626', background: '#fef2f2', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #fecaca' }}>
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          style={{
            padding: '0.85rem',
            background: status === 'loading'
              ? '#94a3b8'
              : 'linear-gradient(135deg, #0f2d6b 0%, #1a4aad 100%)',
            color: '#ffffff', border: 'none', borderRadius: '10px',
            fontSize: '0.95rem', fontWeight: 700, cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            boxShadow: status === 'loading' ? 'none' : '0 4px 16px rgba(15,45,107,0.3)',
            transition: 'all 0.2s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          }}
        >
          {status === 'loading' ? (
            <>
              <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#ffffff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
              Mengirim...
            </>
          ) : (
            'Kirim Sekarang →'
          )}
        </button>
      </form>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fade-in-up { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
        @media (max-width: 560px) { .inquiry-2col { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
