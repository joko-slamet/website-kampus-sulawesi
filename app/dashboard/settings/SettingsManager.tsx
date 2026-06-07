'use client';

import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface SchedulerConfig {
  times: string[];
}

const DEFAULT_CONFIG: SchedulerConfig = {
  times: ['06:00', '12:00', '18:00'],
};

function nextRunLabel(times: string[]): string {
  if (times.length === 0) return '—';
  const now = new Date();
  const sorted = [...times].sort();
  for (const t of sorted) {
    const [h, m] = t.split(':').map(Number);
    const candidate = new Date(now);
    candidate.setHours(h, m, 0, 0);
    if (candidate > now) return `Hari ini pukul ${t}`;
  }
  return `Besok pukul ${sorted[0]}`;
}

export default function SettingsManager() {
  const [times, setTimes] = useState<string[]>(DEFAULT_CONFIG.times);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.scheduler.get()
      .then(data => setTimes(data.times))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function updateTime(index: number, value: string) {
    setTimes(prev => { const t = [...prev]; t[index] = value; return t; });
    setSaved(false);
  }

  function addTime() {
    setTimes(prev => [...prev, '08:00']);
    setSaved(false);
  }

  function removeTime(index: number) {
    setTimes(prev => prev.filter((_, i) => i !== index));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      const updated = await api.scheduler.update(true, times);
      setTimes(updated.times);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
        <div style={{ width: '28px', height: '28px', border: '3px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>Pengaturan</h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Konfigurasi jadwal posting artikel otomatis AI</p>
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>

        {/* Card header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
          }}>🤖</div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', lineHeight: 1.2 }}>Auto-Generate Artikel</p>
            <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Jadwal berikutnya: {nextRunLabel(times)}
            </p>
          </div>
        </div>

        {/* Schedule list */}
        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <label style={labelStyle}>
                  Jadwal posting
                  <span style={{ fontWeight: 400, color: '#94a3b8', marginLeft: '0.4rem' }}>
                    ({times.length} jadwal/hari)
                  </span>
                </label>
                <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                  🕐 Semua jam menggunakan zona waktu <strong style={{ color: '#64748b' }}>WITA (UTC+8)</strong>
                </p>
              </div>
              <button
                onClick={addTime}
                disabled={times.length >= 10}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.35rem',
                  padding: '0.35rem 0.75rem', borderRadius: '7px',
                  background: '#eef2ff', border: '1px solid #c7d2fe',
                  color: '#4338ca', fontSize: '0.78rem', fontWeight: 700,
                  cursor: times.length >= 10 ? 'not-allowed' : 'pointer',
                  opacity: times.length >= 10 ? 0.5 : 1,
                }}
              >
                + Tambah Jadwal
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {times.map((t, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.65rem 0.9rem',
                  background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '10px',
                }}>
                  <span style={{
                    width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                    background: '#eef2ff', color: '#6366f1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.68rem', fontWeight: 800,
                  }}>{i + 1}</span>
                  <input
                    type="time"
                    value={t}
                    onChange={e => updateTime(i, e.target.value)}
                    style={{
                      padding: '0.4rem 0.6rem', border: '1.5px solid #e2e8f0',
                      borderRadius: '7px', fontSize: '0.9rem', fontWeight: 600,
                      color: '#0f172a', background: 'white', outline: 'none', cursor: 'pointer',
                    }}
                  />
                  <span style={{ flex: 1 }} />
                  <button
                    onClick={() => removeTime(i)}
                    disabled={times.length <= 1}
                    style={{
                      width: '28px', height: '28px', borderRadius: '7px',
                      background: 'none', border: '1px solid #fee2e2',
                      color: '#ef4444', cursor: times.length <= 1 ? 'not-allowed' : 'pointer',
                      opacity: times.length <= 1 ? 0.35 : 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.9rem', flexShrink: 0,
                    }}
                  >×</button>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.65rem 0.85rem', fontSize: '0.82rem', color: '#dc2626' }}>
              {error}
            </div>
          )}

          <div>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '0.7rem 1.5rem',
                background: saved ? '#16a34a' : '#0f2d6b',
                color: 'white', border: 'none', borderRadius: '10px',
                fontSize: '0.875rem', fontWeight: 700,
                cursor: saving ? 'wait' : 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {saving ? 'Menyimpan...' : saved ? '✓ Tersimpan' : 'Simpan Pengaturan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.8rem', fontWeight: 700,
  color: '#374151', marginBottom: 0,
};
