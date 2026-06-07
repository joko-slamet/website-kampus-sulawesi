'use client';

import { useState } from 'react';
import { api } from '../lib/api';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { token, user } = await api.auth.login(email, password);
      localStorage.setItem('stia_token', token);
      localStorage.setItem('stia_auth', JSON.stringify(user));
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      setLoading(false);
    }
  };
  return (
    <div style={{
      background: 'white',
      borderRadius: '24px',
      padding: '2.5rem',
      boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
    }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
        Selamat Datang
      </h1>
      <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '2rem' }}>
        Masuk ke panel admin STIA Abdul Haris
      </p>

      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca',
          borderRadius: '10px', padding: '0.85rem 1rem',
          marginBottom: '1.25rem',
          display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
        }}>
          <span style={{ fontSize: '0.875rem' }}>⚠️</span>
          <p style={{ color: '#dc2626', fontSize: '0.825rem', lineHeight: 1.5 }}>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        {/* Email */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@stiaabdulharis.ac.id"
            required
            style={{
              width: '100%', padding: '0.75rem 1rem',
              border: '1.5px solid #e2e8f0', borderRadius: '10px',
              fontSize: '0.9rem', color: '#0f172a',
              background: '#f8fafc',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              boxSizing: 'border-box',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = '#0f2d6b';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(15,45,107,0.1)';
              e.currentTarget.style.background = 'white';
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.background = '#f8fafc';
            }}
          />
        </div>

        {/* Password */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%', padding: '0.75rem 2.75rem 0.75rem 1rem',
                border: '1.5px solid #e2e8f0', borderRadius: '10px',
                fontSize: '0.9rem', color: '#0f172a',
                background: '#f8fafc',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = '#0f2d6b';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(15,45,107,0.1)';
                e.currentTarget.style.background = 'white';
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = '#f8fafc';
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              style={{
                position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#94a3b8', padding: '0.2rem',
              }}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: '0.5rem',
            padding: '0.85rem',
            background: loading ? '#94a3b8' : 'linear-gradient(135deg, #0f2d6b 0%, #1a4aad 100%)',
            color: 'white', fontWeight: 700, fontSize: '0.95rem',
            borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          }}
        >
          {loading ? (
            <>
              <svg style={{ animation: 'spin 1s linear infinite' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Masuk...
            </>
          ) : 'Masuk ke Dashboard'}
        </button>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
