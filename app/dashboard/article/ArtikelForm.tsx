'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { resolveImage } from '../../lib/imageUrl';
import { markdownToHtml } from '../../lib/legacyMarkdown';
import ArtikelEditor from './ArtikelEditor';

interface ArticleDetail {
  id: string;
  image: string | null;
  category: string;
  categoryColor: string;
  tag: string | null;
  tagColor: string | null;
  title: string;
  excerpt: string;
  titleEn: string;
  excerptEn: string;
  content: string | null;
  contentEn: string | null;
  contentFormat: string;
  readTime: string;
  published: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  Teknologi: '#3b82f6',
  Akademik: '#10b981',
  Mahasiswa: '#8b5cf6',
  Berita: '#f97316',
  Prestasi: '#eab308',
  Kegiatan: '#ec4899',
  Riset: '#6366f1',
  Pengabdian: '#14b8a6',
};
const CATEGORIES = Object.keys(CATEGORY_COLORS);

function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
  return `${base || 'artikel'}-${Date.now()}`;
}

function htmlToPlainText(html: string): string {
  return html.replace(/<[^>]*>/g, ' ');
}

function estimateReadTime(html: string): string {
  const words = htmlToPlainText(html).trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} menit`;
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.65rem 0.8rem', border: '1.5px solid var(--border)',
  borderRadius: '8px', fontSize: '0.85rem', background: 'var(--bg-card)',
  color: 'var(--text-heading)', boxSizing: 'border-box', fontFamily: 'inherit',
};
const labelStyle: React.CSSProperties = {
  fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.35rem', display: 'block',
};
const sectionStyle: React.CSSProperties = {
  background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px',
  padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.1rem',
};

interface Props {
  mode: 'create' | 'edit';
  articleId?: string;
}

export default function ArtikelForm({ mode, articleId }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [excerptEn, setExcerptEn] = useState('');
  const [content, setContent] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [tag, setTag] = useState('');
  const [readTime, setReadTime] = useState('');
  const [readTimeTouched, setReadTimeTouched] = useState(false);
  const [showEn, setShowEn] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(mode === 'edit');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode !== 'edit' || !articleId) return;
    (async () => {
      try {
        const article = await api.articles.get(articleId) as ArticleDetail;
        setTitle(article.title);
        setTitleEn(article.titleEn);
        setExcerpt(article.excerpt);
        setExcerptEn(article.excerptEn);
        const isLegacyMarkdown = article.contentFormat !== 'html';
        setContent(article.content ? (isLegacyMarkdown ? markdownToHtml(article.content) : article.content) : '');
        setContentEn(article.contentEn ? (isLegacyMarkdown ? markdownToHtml(article.contentEn) : article.contentEn) : '');
        if (CATEGORIES.includes(article.category)) {
          setCategory(article.category);
        } else {
          setCategory('__custom__');
          setCustomCategory(article.category);
        }
        setTag(article.tag ?? '');
        setReadTime(article.readTime);
        setReadTimeTouched(true);
        setImageUrl(article.image ?? '');
        if (article.titleEn !== article.title || article.excerptEn !== article.excerpt || article.contentEn) {
          setShowEn(true);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Gagal memuat artikel');
      } finally {
        setLoading(false);
      }
    })();
  }, [mode, articleId]);

  const effectiveCategory = category === '__custom__' ? customCategory.trim() : category;
  const categoryColor = CATEGORY_COLORS[effectiveCategory] ?? '#3b82f6';
  const displayedReadTime = readTimeTouched ? readTime : (estimateReadTime(content) || readTime);

  const isValid = useMemo(
    () => title.trim().length > 0 && excerpt.trim().length > 0 && htmlToPlainText(content).trim().length > 0 && effectiveCategory.length > 0,
    [title, excerpt, content, effectiveCategory]
  );

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
    if (!isValid || saving) return;
    setSaving(true);
    setError('');
    try {
      const body = {
        image: imageUrl || null,
        title: title.trim(),
        excerpt: excerpt.trim(),
        titleEn: (titleEn.trim() || title.trim()),
        excerptEn: (excerptEn.trim() || excerpt.trim()),
        content,
        contentEn: htmlToPlainText(contentEn).trim() ? contentEn : undefined,
        contentFormat: 'html',
        category: effectiveCategory,
        categoryColor,
        tag: tag.trim() || null,
        tagColor: tag.trim() ? categoryColor : null,
        readTime: displayedReadTime,
        published: publish,
      };

      if (mode === 'edit' && articleId) {
        await api.articles.update(articleId, body);
      } else {
        const now = new Date();
        const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        await api.articles.create({ ...body, id: slugify(title), date: dateStr });
      }
      router.push('/dashboard/article');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menyimpan artikel');
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-subtle)' }}>
        <p style={{ fontSize: '0.85rem' }}>Memuat artikel...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          href="/dashboard/article"
          style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-subtle)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.75rem' }}
        >← Kembali ke Kelola Artikel</Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.25rem' }}>
          {mode === 'edit' ? 'Edit Artikel' : 'Tulis Artikel'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {mode === 'edit' ? 'Ubah konten artikel yang sudah ada' : 'Buat artikel sendiri tanpa AI'}
        </p>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.65rem 0.85rem', fontSize: '0.82rem', color: '#dc2626', marginBottom: '1.25rem' }}>
          {error}
        </div>
      )}

      <div className="tulis-artikel-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Kolom utama */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minWidth: 0 }}>
          <div style={sectionStyle}>
            <div>
              <label style={labelStyle}>Judul *</label>
              <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="Judul artikel" />
            </div>

            <div>
              <label style={labelStyle}>Ringkasan *</label>
              <textarea
                style={{ ...inputStyle, resize: 'vertical', minHeight: '56px' }}
                value={excerpt} onChange={e => setExcerpt(e.target.value)}
                placeholder="Ringkasan singkat yang tampil di daftar artikel"
              />
            </div>

            <div>
              <label style={labelStyle}>Konten *</label>
              <ArtikelEditor value={content} onChange={setContent} minHeight="380px" />
            </div>
          </div>

          {/* Versi Inggris */}
          <div style={sectionStyle}>
            <button
              onClick={() => setShowEn(v => !v)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                fontSize: '0.8rem', fontWeight: 700, color: '#6366f1', display: 'flex', alignItems: 'center', gap: '0.3rem',
              }}
            >
              {showEn ? '▾' : '▸'} Versi Bahasa Inggris (opsional)
            </button>
            {showEn && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Title (EN)</label>
                  <input style={inputStyle} value={titleEn} onChange={e => setTitleEn(e.target.value)} placeholder="Ikut judul Indonesia jika dikosongkan" />
                </div>
                <div>
                  <label style={labelStyle}>Excerpt (EN)</label>
                  <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '56px' }} value={excerptEn} onChange={e => setExcerptEn(e.target.value)} placeholder="Ikut ringkasan Indonesia jika dikosongkan" />
                </div>
                <div>
                  <label style={labelStyle}>Content (EN)</label>
                  <ArtikelEditor value={contentEn} onChange={setContentEn} minHeight="180px" placeholder="Kosongkan jika tidak ada versi Inggris" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="tulis-artikel-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'sticky', top: '1.5rem' }}>
          {/* Actions */}
          <div style={{ ...sectionStyle, flexDirection: 'row', gap: '0.6rem' }}>
            <button
              onClick={() => handleSave(false)}
              disabled={!isValid || saving}
              style={{
                flex: 1, padding: '0.75rem',
                background: 'var(--bg-muted)', border: '1.5px solid var(--border)',
                borderRadius: '10px', fontSize: '0.85rem',
                fontWeight: 700, color: 'var(--text-body)', cursor: (!isValid || saving) ? 'not-allowed' : 'pointer',
                opacity: (!isValid || saving) ? 0.6 : 1,
              }}
            >{saving ? '...' : 'Simpan Draft'}</button>
            <button
              onClick={() => handleSave(true)}
              disabled={!isValid || saving}
              style={{
                flex: 1, padding: '0.75rem',
                background: 'linear-gradient(135deg,#0f2d6b,#1e40af)',
                border: 'none', borderRadius: '10px', fontSize: '0.85rem',
                fontWeight: 700, color: 'white', cursor: (!isValid || saving) ? 'not-allowed' : 'pointer',
                opacity: (!isValid || saving) ? 0.6 : 1,
              }}
            >{saving ? '...' : 'Publikasikan'}</button>
          </div>

          {/* Gambar */}
          <div style={sectionStyle}>
            <label style={labelStyle}>Gambar Artikel (opsional)</label>
            {imageUrl ? (
              <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', aspectRatio: '16/9' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resolveImage(imageUrl)} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                  background: 'var(--bg-muted)', cursor: uploading ? 'wait' : 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem',
                }}
              >
                <span style={{ fontSize: '1.4rem' }}>{uploading ? '⏳' : '🖼️'}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {uploading ? 'Mengupload...' : 'Upload gambar'}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>JPEG, PNG, WebP — maks 5 MB</span>
              </button>
            )}
            <input
              ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }}
            />
          </div>

          {/* Meta */}
          <div style={sectionStyle}>
            <div>
              <label style={labelStyle}>Kategori *</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                <option value="__custom__">Lainnya...</option>
              </select>
              {category === '__custom__' && (
                <input
                  style={{ ...inputStyle, marginTop: '0.5rem' }}
                  value={customCategory} onChange={e => setCustomCategory(e.target.value)}
                  placeholder="Nama kategori"
                />
              )}
            </div>
            <div>
              <label style={labelStyle}>Tag (opsional)</label>
              <input style={inputStyle} value={tag} onChange={e => setTag(e.target.value)} placeholder="Contoh: Trending" />
            </div>
            <div>
              <label style={labelStyle}>Waktu Baca</label>
              <input
                style={inputStyle}
                value={displayedReadTime}
                onChange={e => { setReadTime(e.target.value); setReadTimeTouched(true); }}
                placeholder="5 menit"
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .tulis-artikel-grid { grid-template-columns: 1fr !important; }
          .tulis-artikel-sidebar { position: static !important; }
        }
      `}</style>
    </div>
  );
}
