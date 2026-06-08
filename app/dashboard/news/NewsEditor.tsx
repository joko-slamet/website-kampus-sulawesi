'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';

export interface NewsDraft {
  id?: string;
  type: 'news' | 'announcement';
  title: string;
  image: string | null;
  content: string;
  category: string;
  tag: string;
  pinned: boolean;
  published: boolean;
}

interface Props {
  initial?: NewsDraft;
  onBack: () => void;
  onSave: (data: NewsDraft, publish: boolean) => Promise<void>;
}

function execCmd(cmd: string, value?: string) {
  document.execCommand(cmd, false, value);
}

const CATEGORIES = ['Akademik', 'Keuangan', 'Kemahasiswaan', 'Kepegawaian', 'Penelitian', 'Kegiatan', 'Umum'];

const TOOLBAR: Array<Array<{ cmd: string; val?: string; label: string; icon: string; mono?: boolean }>> = [
  [
    { cmd: 'bold', label: 'Bold', icon: 'B', mono: true },
    { cmd: 'italic', label: 'Italic', icon: 'I', mono: true },
    { cmd: 'underline', label: 'Underline', icon: 'U', mono: true },
    { cmd: 'strikeThrough', label: 'Strikethrough', icon: 'S', mono: true },
  ],
  [
    { cmd: 'formatBlock', val: 'h2', label: 'Heading 1', icon: 'H1' },
    { cmd: 'formatBlock', val: 'h3', label: 'Heading 2', icon: 'H2' },
    { cmd: 'formatBlock', val: 'h4', label: 'Heading 3', icon: 'H3' },
    { cmd: 'formatBlock', val: 'p', label: 'Paragraf', icon: 'P' },
  ],
  [
    { cmd: 'insertUnorderedList', label: 'Bullet list', icon: '≡•' },
    { cmd: 'insertOrderedList', label: 'Numbered list', icon: '1.' },
    { cmd: 'formatBlock', val: 'blockquote', label: 'Kutipan', icon: '❝' },
    { cmd: 'insertHorizontalRule', label: 'Garis pemisah', icon: '—' },
  ],
  [
    { cmd: 'undo', label: 'Undo', icon: '↩' },
    { cmd: 'redo', label: 'Redo', icon: '↪' },
  ],
];

const TYPE_OPTIONS = [
  { value: 'news', label: 'Berita', icon: '📰', desc: 'Informasi & liputan kegiatan' },
  { value: 'announcement', label: 'Pengumuman', icon: '📢', desc: 'Dapat disematkan di halaman utama' },
] as const;

export default function NewsEditor({ initial, onBack, onSave }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');
  const [form, setForm] = useState<NewsDraft>({
    type: 'news',
    title: '',
    image: null,
    content: '',
    category: 'Umum',
    tag: '',
    pinned: false,
    published: false,
    ...initial,
  });

  useEffect(() => {
    if (editorRef.current && initial?.content && editorRef.current.innerHTML === '') {
      editorRef.current.innerHTML = initial.content;
    }
  }, [initial?.content]);

  const set = <K extends keyof NewsDraft>(k: K, v: NewsDraft[K]) =>
    setForm(p => ({ ...p, [k]: v }));

  const pickImage = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploading(true);
    setUploadError('');
    // optimistic preview
    const preview = URL.createObjectURL(file);
    setForm(p => ({ ...p, image: preview }));
    try {
      const { url } = await api.news.uploadImage(file);
      setForm(p => ({ ...p, image: url }));
      URL.revokeObjectURL(preview);
    } catch (e) {
      setForm(p => ({ ...p, image: null }));
      URL.revokeObjectURL(preview);
      setUploadError(e instanceof Error ? e.message : 'Gagal upload gambar');
    } finally {
      setUploading(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) pickImage(file);
  }, [pickImage]);

  const handleGenerate = async () => {
    if (!form.title.trim() || generating) return;
    setGenerating(true);
    setGenerateError('');
    try {
      const result = await api.news.generate(form.title, form.type);
      if (editorRef.current) editorRef.current.innerHTML = result.content;
      setForm(p => ({ ...p, category: result.category, tag: result.tag }));
    } catch (e) {
      setGenerateError(e instanceof Error ? e.message : 'Gagal generate konten');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async (publish: boolean) => {
    setSaving(true);
    try {
      await onSave({ ...form, content: editorRef.current?.innerHTML ?? '', published: publish }, publish);
    } finally {
      setSaving(false);
    }
  };

  const isNew = !initial?.id;

  return (
    <div>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '1rem', marginBottom: '1.75rem', flexWrap: 'wrap',
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '10px',
            padding: '0.5rem 0.9rem', fontSize: '0.82rem', fontWeight: 600,
            color: '#475569', cursor: 'pointer',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Daftar Berita & Pengumuman
        </button>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => handleSave(false)}
            disabled={saving || uploading}
            style={{
              padding: '0.6rem 1.1rem', background: 'white',
              border: '1.5px solid #e2e8f0', borderRadius: '10px',
              fontSize: '0.83rem', fontWeight: 700, color: '#64748b',
              cursor: (saving || uploading) ? 'not-allowed' : 'pointer',
              opacity: (saving || uploading) ? 0.7 : 1,
            }}
          >{saving ? 'Menyimpan...' : 'Simpan Draft'}</button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving || uploading}
            style={{
              padding: '0.6rem 1.25rem',
              background: 'linear-gradient(135deg, #0f2d6b, #1e40af)',
              border: 'none', borderRadius: '10px',
              fontSize: '0.83rem', fontWeight: 700, color: 'white',
              cursor: (saving || uploading) ? 'not-allowed' : 'pointer',
              opacity: (saving || uploading) ? 0.7 : 1,
              boxShadow: '0 4px 14px rgba(15,45,107,0.25)',
            }}
          >{saving ? 'Menyimpan...' : (isNew ? 'Publikasikan' : 'Perbarui & Tayang')}</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }} className="news-editor-layout">

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Type selector */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1rem 1.25rem' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
              Jenis Konten
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              {TYPE_OPTIONS.map(opt => {
                const active = form.type === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => { set('type', opt.value); if (opt.value === 'news') set('pinned', false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.6rem',
                      padding: '0.7rem 0.9rem', borderRadius: '10px', cursor: 'pointer',
                      border: `1.5px solid ${active ? '#0f2d6b' : '#e2e8f0'}`,
                      background: active ? '#eff6ff' : 'white', textAlign: 'left', transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{opt.icon}</span>
                    <div>
                      <p style={{ fontSize: '0.82rem', fontWeight: 700, color: active ? '#0f2d6b' : '#374151', margin: 0, lineHeight: 1.2 }}>{opt.label}</p>
                      <p style={{ fontSize: '0.68rem', color: active ? '#3b82f6' : '#94a3b8', margin: 0, marginTop: '0.1rem' }}>{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem 1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Judul
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder={form.type === 'announcement' ? 'Judul pengumuman...' : 'Judul berita'}
              style={{
                width: '100%', border: 'none', outline: 'none',
                fontSize: '1.5rem', fontWeight: 800, color: '#0f172a',
                lineHeight: 1.3, background: 'transparent', fontFamily: 'inherit', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Rich text editor */}
          <div style={{ background: 'white', border: `1px solid ${generating ? '#a5b4fc' : '#e2e8f0'}`, borderRadius: '14px', overflow: 'hidden', position: 'relative', transition: 'border-color 0.2s' }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              padding: '0.6rem 0.75rem', borderBottom: '1px solid #f1f5f9',
              background: '#fafafa', flexWrap: 'wrap', rowGap: '0.25rem', gap: '0',
            }}>
              {TOOLBAR.map((group, gi) => (
                <div key={gi} style={{ display: 'flex', alignItems: 'center' }}>
                  {gi > 0 && <div style={{ width: '1px', height: '18px', background: '#e2e8f0', margin: '0 0.35rem' }} />}
                  {group.map(btn => (
                    <button
                      key={btn.icon}
                      title={btn.label}
                      onMouseDown={e => { e.preventDefault(); execCmd(btn.cmd, btn.val); }}
                      style={{
                        width: '30px', height: '30px', borderRadius: '6px',
                        border: 'none', background: 'transparent', cursor: 'pointer',
                        color: '#374151', fontSize: btn.mono ? '0.85rem' : '0.75rem',
                        fontWeight: 700, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontFamily: btn.mono ? 'monospace' : 'inherit',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f1f5f9')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >{btn.icon}</button>
                  ))}
                </div>
              ))}

              {/* AI generate button */}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {generateError && (
                  <span style={{ fontSize: '0.7rem', color: '#ef4444' }}>{generateError}</span>
                )}
                <div style={{ width: '1px', height: '18px', background: '#e2e8f0' }} />
                <button
                  onClick={handleGenerate}
                  disabled={!form.title.trim() || generating || saving}
                  title={!form.title.trim() ? 'Tulis judul terlebih dahulu' : 'Generate konten dengan AI berdasarkan judul'}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                    padding: '0.3rem 0.7rem', borderRadius: '7px', border: 'none',
                    cursor: (!form.title.trim() || generating || saving) ? 'not-allowed' : 'pointer',
                    background: (!form.title.trim() || generating || saving) ? '#f1f5f9' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                    color: (!form.title.trim() || generating || saving) ? '#94a3b8' : 'white',
                    fontSize: '0.72rem', fontWeight: 700, transition: 'all 0.2s',
                    opacity: (!form.title.trim() || generating || saving) ? 0.6 : 1,
                    boxShadow: (!form.title.trim() || generating || saving) ? 'none' : '0 2px 8px rgba(99,102,241,0.3)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {generating ? (
                    <>
                      <div style={{ width: '11px', height: '11px', border: '2px solid rgba(255,255,255,0.35)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
                      Generating...
                    </>
                  ) : (
                    <>✨ Generate AI</>
                  )}
                </button>
              </div>
            </div>
            <div
              ref={editorRef}
              contentEditable={!generating}
              suppressContentEditableWarning
              data-placeholder="Mulai menulis konten di sini..."
              style={{ minHeight: '400px', padding: '1.5rem', outline: 'none', color: '#1e293b', fontSize: '0.95rem', lineHeight: 1.8, fontFamily: 'inherit' }}
            />
            {generating && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(238,242,255,0.85)', backdropFilter: 'blur(2px)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
              }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', animation: 'pulse-spin 1.4s ease-in-out infinite' }}>✨</div>
                <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#4f46e5' }}>AI sedang menulis konten...</p>
                <p style={{ fontSize: '0.75rem', color: '#818cf8' }}>Berdasarkan judul yang kamu tulis</p>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Image upload */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Gambar Utama
            </label>

            {uploadError && (
              <p style={{ fontSize: '0.75rem', color: '#ef4444', marginBottom: '0.5rem', background: '#fef2f2', padding: '0.4rem 0.65rem', borderRadius: '6px' }}>
                {uploadError}
              </p>
            )}

            {form.image ? (
              <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', aspectRatio: '16/9' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.image.startsWith('http') || form.image.startsWith('blob:') ? form.image : `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'}${form.image}`} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                {uploading && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '28px', height: '28px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  </div>
                )}
                {!uploading && (
                  <div
                    style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'background 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.4)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0)')}
                  >
                    <button onClick={() => fileRef.current?.click()} style={{ padding: '0.4rem 0.85rem', background: 'white', border: 'none', borderRadius: '7px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', color: '#0f172a' }}>Ganti</button>
                    <button onClick={() => setForm(p => ({ ...p, image: null }))} style={{ padding: '0.4rem 0.85rem', background: '#ef4444', border: 'none', borderRadius: '7px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', color: 'white' }}>Hapus</button>
                  </div>
                )}
              </div>
            ) : (
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => !uploading && fileRef.current?.click()}
                style={{
                  border: `2px dashed ${dragging ? '#0f2d6b' : '#e2e8f0'}`,
                  borderRadius: '10px', padding: '2rem 1rem', textAlign: 'center',
                  cursor: uploading ? 'wait' : 'pointer',
                  background: dragging ? '#eff6ff' : '#f8fafc', transition: 'all 0.2s',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{uploading ? '⏳' : '🖼️'}</div>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
                  {uploading ? 'Mengupload...' : 'Klik atau seret gambar'}
                </p>
                <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>JPG, PNG, WebP · maks 5 MB</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) pickImage(f); e.target.value = ''; }} />
          </div>

          {/* Settings */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Pengaturan</p>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Kategori</label>
              <select
                value={form.category}
                onChange={e => set('category', e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', color: '#0f172a', background: 'white', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
                Tag <span style={{ color: '#94a3b8', fontWeight: 400 }}>(opsional)</span>
              </label>
              <input
                type="text" value={form.tag} onChange={e => set('tag', e.target.value)}
                placeholder="cth: Penting, Terbaru..."
                style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', color: '#0f172a', background: 'white', fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#0f2d6b')}
                onBlur={e => (e.currentTarget.style.borderColor = '#e2e8f0')}
              />
            </div>

            {/* Pin toggle — announcements only */}
            {form.type === 'announcement' && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.75rem 0.9rem', borderRadius: '10px',
                background: form.pinned ? '#fefce8' : '#f8fafc',
                border: `1px solid ${form.pinned ? '#fde68a' : '#e2e8f0'}`, transition: 'all 0.2s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>📌</span>
                  <div>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Sematkan</p>
                    <p style={{ fontSize: '0.68rem', color: '#94a3b8', margin: 0 }}>Tampil paling atas</p>
                  </div>
                </div>
                <button
                  onClick={() => set('pinned', !form.pinned)}
                  style={{
                    width: '40px', height: '22px', borderRadius: '999px', border: 'none',
                    cursor: 'pointer', padding: '2px',
                    background: form.pinned ? '#f59e0b' : '#e2e8f0', transition: 'background 0.2s',
                    flexShrink: 0, display: 'flex', alignItems: 'center',
                    justifyContent: form.pinned ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                </button>
              </div>
            )}

            {/* Status */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Status Publikasi</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {([
                  { val: false, label: 'Draft', color: '#f97316', bg: '#fff7ed', border: '#fed7aa' },
                  { val: true, label: 'Tayang', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
                ] as const).map(opt => (
                  <button
                    key={String(opt.val)}
                    onClick={() => set('published', opt.val)}
                    style={{
                      flex: 1, padding: '0.55rem', borderRadius: '8px', border: '1.5px solid',
                      borderColor: form.published === opt.val ? opt.border : '#e2e8f0',
                      background: form.published === opt.val ? opt.bg : 'white',
                      color: form.published === opt.val ? opt.color : '#94a3b8',
                      fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >{opt.label}</button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '1rem' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0369a1', marginBottom: '0.5rem' }}>💡 Tips</p>
            <ul style={{ margin: 0, paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {['Pengumuman penting bisa disematkan agar tampil paling atas', 'Gambar disarankan rasio 16:9', 'Draft tidak tampil di halaman publik'].map(tip => (
                <li key={tip} style={{ fontSize: '0.72rem', color: '#0369a1', lineHeight: 1.5 }}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-spin { 0%,100%{transform:rotate(0deg) scale(1)} 50%{transform:rotate(180deg) scale(1.1)} }
        [contenteditable]:empty:before { content: attr(data-placeholder); color: #cbd5e1; pointer-events: none; }
        [contenteditable] h2 { font-size: 1.4rem; font-weight: 800; color: #0f172a; margin: 1.25rem 0 0.5rem; line-height: 1.3; }
        [contenteditable] h3 { font-size: 1.15rem; font-weight: 700; color: #0f172a; margin: 1rem 0 0.4rem; }
        [contenteditable] h4 { font-size: 1rem; font-weight: 700; color: #374151; margin: 0.85rem 0 0.3rem; }
        [contenteditable] p { margin: 0 0 0.75rem; }
        [contenteditable] ul, [contenteditable] ol { padding-left: 1.5rem; margin: 0.5rem 0 0.75rem; }
        [contenteditable] li { margin-bottom: 0.25rem; }
        [contenteditable] blockquote { border-left: 3px solid #0f2d6b; padding: 0.5rem 1rem; margin: 1rem 0; color: #475569; font-style: italic; background: #f8fafc; border-radius: 0 8px 8px 0; }
        [contenteditable] hr { border: none; border-top: 1px solid #e2e8f0; margin: 1.25rem 0; }
        @media (max-width: 900px) { .news-editor-layout { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
