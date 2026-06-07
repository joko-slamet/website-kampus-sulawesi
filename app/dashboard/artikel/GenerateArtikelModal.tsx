'use client';

import { useEffect, useRef, useState } from 'react';
import { api, GeneratedArticle } from '../../lib/api';

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

export default function GenerateArtikelModal({ onClose, onSaved }: Props) {
  const [result, setResult] = useState<GeneratedArticle | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    runGenerate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runGenerate() {
    setResult(null);
    setImageUrl('');
    setError('');
    try {
      const data = await api.articles.generate();
      setResult(data);
      if (data.image) setImageUrl(data.image);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal generate artikel');
    }
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    setError('');
    try {
      const { url } = await api.articles.uploadImage(file);
      setImageUrl(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal upload gambar');
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(publish: boolean) {
    if (!result) return;
    setSaving(true);
    setError('');
    try {
      await api.articles.create({
        id: result.suggestedId,
        image: imageUrl || null,
        title: result.title,
        excerpt: result.excerpt,
        titleEn: result.titleEn,
        excerptEn: result.excerptEn,
        category: result.category,
        categoryColor: result.categoryColor,
        tag: result.tag || null,
        tagColor: result.tagColor || null,
        readTime: result.readTime,
        date: result.date,
        published: publish,
      });
      onSaved();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menyimpan artikel');
      setSaving(false);
    }
  }

  const isLoading = !result && !error;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={e => { if (e.target === e.currentTarget && !saving) onClose(); }}
    >
      <div style={{
        background: 'white', borderRadius: '20px', width: '100%', maxWidth: '520px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.18)', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
            }}>✨</div>
            <div>
              <p style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', lineHeight: 1.2 }}>Generate Artikel AI</p>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>AI memilih topik dan menulis otomatis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '1.4rem', lineHeight: 1, padding: '0.25rem' }}
          >×</button>
        </div>

        <div style={{ padding: '1.5rem', maxHeight: '80vh', overflowY: 'auto' }}>

          {/* Loading */}
          {isLoading && (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <div style={{
                width: '52px', height: '52px', margin: '0 auto 1.25rem', borderRadius: '50%',
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', animation: 'pulse-spin 1.4s ease-in-out infinite',
              }}>✨</div>
              <p style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', marginBottom: '0.35rem' }}>Sedang membuat artikel &amp; gambar...</p>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem' }}>AI memilih topik, menulis konten, dan generate gambar</p>
              <style>{`@keyframes pulse-spin { 0%,100%{transform:rotate(0deg) scale(1)} 50%{transform:rotate(180deg) scale(1.1)} }`}</style>
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚠️</p>
                <p style={{ fontSize: '0.85rem', color: '#dc2626', fontWeight: 600 }}>{error}</p>
              </div>
              <button
                onClick={runGenerate}
                style={{
                  width: '100%', padding: '0.75rem',
                  background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                  color: 'white', border: 'none', borderRadius: '10px',
                  fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
                }}
              >↺ Coba Lagi</button>
            </div>
          )}

          {/* Preview */}
          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {/* Gambar */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151' }}>
                    Gambar Artikel
                  </label>
                  {imageUrl && (
                    <span style={{ fontSize: '0.68rem', color: '#6366f1', fontWeight: 600, background: '#eef2ff', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                      ✨ Dibuat AI
                    </span>
                  )}
                </div>
                {imageUrl ? (
                  <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', aspectRatio: '16/7' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      onClick={() => fileRef.current?.click()}
                      style={{
                        position: 'absolute', top: '0.5rem', right: '0.5rem',
                        background: 'rgba(0,0,0,0.55)', color: 'white', border: 'none',
                        borderRadius: '6px', padding: '0.25rem 0.6rem',
                        fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600,
                      }}
                    >{uploading ? '⏳' : 'Ganti'}</button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    style={{
                      width: '100%', padding: '1.1rem',
                      border: '2px dashed #e2e8f0', borderRadius: '10px',
                      background: '#f8fafc', cursor: uploading ? 'wait' : 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem',
                    }}
                  >
                    <span style={{ fontSize: '1.4rem' }}>{uploading ? '⏳' : '🖼️'}</span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                      {uploading ? 'Mengupload...' : 'Upload gambar manual'}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>JPEG, PNG, WebP — maks 5 MB</span>
                  </button>
                )}
                <input
                  ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }}
                />
              </div>

              {/* Result fields */}
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <FieldRow label="Judul" value={result.title} />
                <FieldRow label="Ringkasan" value={result.excerpt} />
                <FieldRow label="Title (EN)" value={result.titleEn} />
                <FieldRow label="Excerpt (EN)" value={result.excerptEn} />
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', paddingTop: '0.25rem' }}>
                  <MetaChip label="Kategori" value={result.category} />
                  {result.tag && <MetaChip label="Tag" value={result.tag} />}
                  <MetaChip label="Baca" value={result.readTime} />
                  <MetaChip label="Tanggal" value={result.date} />
                </div>
              </div>

              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.65rem 0.85rem', fontSize: '0.82rem', color: '#dc2626' }}>
                  {error}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button
                  onClick={runGenerate}
                  disabled={saving}
                  style={{
                    padding: '0.75rem 1rem', background: 'white',
                    border: '1.5px solid #e2e8f0', borderRadius: '10px',
                    fontSize: '0.82rem', fontWeight: 600, color: '#64748b',
                    cursor: saving ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
                  }}
                >↺ Generate Ulang</button>
                <button
                  onClick={() => handleSave(false)}
                  disabled={saving}
                  style={{
                    flex: 1, padding: '0.75rem',
                    background: '#f1f5f9', border: '1.5px solid #e2e8f0',
                    borderRadius: '10px', fontSize: '0.85rem',
                    fontWeight: 700, color: '#475569', cursor: saving ? 'not-allowed' : 'pointer',
                  }}
                >{saving ? '...' : 'Simpan Draft'}</button>
                <button
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  style={{
                    flex: 1, padding: '0.75rem',
                    background: 'linear-gradient(135deg,#0f2d6b,#1e40af)',
                    border: 'none', borderRadius: '10px', fontSize: '0.85rem',
                    fontWeight: 700, color: 'white', cursor: saving ? 'not-allowed' : 'pointer',
                  }}
                >{saving ? '...' : 'Publikasikan'}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: '0.67rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.12rem' }}>{label}</p>
      <p style={{ fontSize: '0.82rem', color: '#0f172a', lineHeight: 1.55 }}>{value}</p>
    </div>
  );
}

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.28rem 0.65rem' }}>
      <p style={{ fontSize: '0.6rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{label}</p>
      <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#0f172a' }}>{value}</p>
    </div>
  );
}
