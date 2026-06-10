'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';

interface Lecturer {
  name: string;
  qualifications: string;
}

interface Program {
  id: string;
  icon: string;
  badge: string;
  badgeColor: string;
  name: string;
  degree: string;
  degreeTitle: string;
  accreditation: string;
  description: string;
  highlights: string[];
  careerPaths: string[];
  lecturers: Lecturer[];
  color: string;
  bgGradient: string;
  status: 'aktif' | 'nonaktif';
}

const EMPTY_FORM: Program = {
  id: '',
  icon: '🎓',
  badge: '',
  badgeColor: '#0f2d6b',
  name: '',
  degree: 'S1 — 4 Tahun',
  degreeTitle: '',
  accreditation: 'Terakreditasi',
  description: '',
  highlights: [],
  careerPaths: [],
  lecturers: [],
  color: '#0f2d6b',
  bgGradient: 'linear-gradient(135deg, #0f2d6b 0%, #1a4aad 100%)',
  status: 'aktif',
};

const degreeOptions = ['S1 — 4 Tahun', 'S2 — 2 Tahun', 'D3 — 3 Tahun', 'D4 — 4 Tahun'];
const accreditationOptions = ['Terakreditasi', 'Akreditasi A', 'Akreditasi B', 'Akreditasi C', 'Unggul', 'Baik Sekali'];
const gradientPresets = [
  { label: 'Navy', value: 'linear-gradient(135deg, #0f2d6b 0%, #1a4aad 100%)', color: '#0f2d6b' },
  { label: 'Hijau', value: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)', color: '#065f46' },
  { label: 'Ungu', value: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)', color: '#4c1d95' },
  { label: 'Merah', value: 'linear-gradient(135deg, #7f1d1d 0%, #ef4444 100%)', color: '#7f1d1d' },
  { label: 'Oranye', value: 'linear-gradient(135deg, #92400e 0%, #f59e0b 100%)', color: '#92400e' },
  { label: 'Biru', value: 'linear-gradient(135deg, #1e3a5f 0%, #0ea5e9 100%)', color: '#1e3a5f' },
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40);
}

export default function ProgramManager() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [form, setForm] = useState<Program>({ ...EMPTY_FORM });
  const [highlightInput, setHighlightInput] = useState('');
  const [careerInput, setCareerInput] = useState('');
  const [lecturerForm, setLecturerForm] = useState({ name: '', qualifications: '' });
  const [editingLecturerIdx, setEditingLecturerIdx] = useState<number | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Program | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.programs.list();
      setPrograms(data as Program[]);
    } catch {
      setError('Gagal memuat data program studi');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPrograms(); }, [fetchPrograms]);

  const openAdd = () => {
    setForm({ ...EMPTY_FORM });
    setHighlightInput('');
    setCareerInput('');
    setLecturerForm({ name: '', qualifications: '' });
    setEditingLecturerIdx(null);
    setError(null);
    setModalMode('add');
  };

  const openEdit = (p: Program) => {
    setForm({ ...p, highlights: [...p.highlights], careerPaths: [...(p.careerPaths ?? [])], lecturers: [...(p.lecturers ?? [])] });
    setHighlightInput('');
    setCareerInput('');
    setLecturerForm({ name: '', qualifications: '' });
    setEditingLecturerIdx(null);
    setError(null);
    setModalMode('edit');
  };

  const closeModal = () => { setModalMode(null); setError(null); };

  const handleSave = async () => {
    if (!form.name.trim() || !form.degree || !form.description.trim()) {
      setError('Nama, jenjang, dan deskripsi wajib diisi');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (modalMode === 'add') {
        const id = form.id.trim() || slugify(form.name);
        await api.programs.create({ ...form, id });
      } else {
        await api.programs.update(form.id, form);
      }
      await fetchPrograms();
      closeModal();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (p: Program) => {
    const next: 'aktif' | 'nonaktif' = p.status === 'aktif' ? 'nonaktif' : 'aktif';
    setPrograms(prev => prev.map(x => x.id === p.id ? { ...x, status: next } : x));
    try {
      await api.programs.patchStatus(p.id, next);
    } catch {
      setPrograms(prev => prev.map(x => x.id === p.id ? { ...x, status: p.status } : x));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    try {
      await api.programs.delete(deleteTarget.id);
      setPrograms(prev => prev.filter(p => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Gagal menghapus');
    } finally {
      setDeleting(false);
    }
  };

  const addHighlight = () => {
    const val = highlightInput.trim();
    if (!val) return;
    setForm(f => ({ ...f, highlights: [...f.highlights, val] }));
    setHighlightInput('');
  };

  const removeHighlight = (i: number) => {
    setForm(f => ({ ...f, highlights: f.highlights.filter((_, idx) => idx !== i) }));
  };

  const addCareer = () => {
    const val = careerInput.trim();
    if (!val) return;
    setForm(f => ({ ...f, careerPaths: [...(f.careerPaths ?? []), val] }));
    setCareerInput('');
  };

  const removeCareer = (i: number) => {
    setForm(f => ({ ...f, careerPaths: (f.careerPaths ?? []).filter((_, idx) => idx !== i) }));
  };

  const saveLecturer = () => {
    if (!lecturerForm.name.trim()) return;
    setForm(f => {
      const list = [...(f.lecturers ?? [])];
      if (editingLecturerIdx !== null) {
        list[editingLecturerIdx] = { ...lecturerForm };
      } else {
        list.push({ ...lecturerForm });
      }
      return { ...f, lecturers: list };
    });
    setLecturerForm({ name: '', qualifications: '' });
    setEditingLecturerIdx(null);
  };

  const startEditLecturer = (i: number) => {
    setLecturerForm({ ...(form.lecturers ?? [])[i] });
    setEditingLecturerIdx(i);
  };

  const removeLecturer = (i: number) => {
    setForm(f => ({ ...f, lecturers: (f.lecturers ?? []).filter((_, idx) => idx !== i) }));
    if (editingLecturerIdx === i) { setLecturerForm({ name: '', qualifications: '' }); setEditingLecturerIdx(null); }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.25rem' }}>Program Studi</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {loading ? 'Memuat...' : `${programs.filter(p => p.status === 'aktif').length} program aktif dari ${programs.length} total`}
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.65rem 1.25rem',
            background: 'linear-gradient(135deg, #0f2d6b 0%, #1a4aad 100%)',
            border: 'none', borderRadius: '10px',
            color: 'white', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '1rem' }}>+</span> Tambah Program
        </button>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {[1, 2].map(i => (
            <div key={i} style={{ height: '88px', background: 'var(--bg-muted)', borderRadius: '16px', animation: 'pulse 1.5s ease infinite' }} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && programs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-subtle)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
          <p style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Belum ada program studi</p>
          <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>Klik "Tambah Program" untuk menambahkan program studi baru</p>
        </div>
      )}

      {/* Program cards */}
      {!loading && programs.length > 0 && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {programs.map(program => (
            <div
              key={program.id}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '16px', overflow: 'hidden',
                opacity: program.status === 'nonaktif' ? 0.6 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
                {/* Color strip */}
                <div style={{ width: '6px', flexShrink: 0, background: program.bgGradient }} />

                {/* Content */}
                <div style={{ flex: 1, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                  {/* Icon + name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: '220px' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                      background: program.bgGradient,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.25rem',
                    }}>
                      {program.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.2rem' }}>{program.name}</p>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{program.degree}</span>
                        <span style={{ color: 'var(--border)' }}>·</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{program.accreditation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div style={{ flex: 1, display: 'flex', gap: '0.4rem', flexWrap: 'wrap', minWidth: '200px' }}>
                    {program.highlights.map(h => (
                      <span key={h} style={{
                        padding: '0.2rem 0.6rem',
                        background: 'var(--bg-muted)', color: 'var(--text-body)',
                        borderRadius: '999px', fontSize: '0.7rem', fontWeight: 500,
                      }}>{h}</span>
                    ))}
                  </div>

                  {/* Lecturers count */}
                  <div style={{ textAlign: 'center', minWidth: '60px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)' }}>{(program.lecturers ?? []).length}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-subtle)' }}>dosen</div>
                  </div>

                  {/* Badge */}
                  {program.badge && (
                    <div style={{ minWidth: '70px', textAlign: 'center' }}>
                      <span style={{
                        padding: '0.25rem 0.7rem',
                        background: program.badgeColor + '18',
                        color: program.badgeColor,
                        borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700,
                      }}>
                        {program.badge}
                      </span>
                    </div>
                  )}

                  {/* Status + actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginLeft: 'auto' }}>
                    <button
                      onClick={() => toggleStatus(program)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.35rem 0.85rem',
                        borderRadius: '999px', border: '1.5px solid', cursor: 'pointer',
                        fontSize: '0.72rem', fontWeight: 700, transition: 'all 0.2s',
                        borderColor: program.status === 'aktif' ? '#bbf7d0' : 'var(--border)',
                        background: program.status === 'aktif' ? '#f0fdf4' : 'var(--bg-muted)',
                        color: program.status === 'aktif' ? '#16a34a' : 'var(--text-muted)',
                      }}
                    >
                      <span style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: program.status === 'aktif' ? '#16a34a' : '#94a3b8',
                      }} />
                      {program.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                    </button>

                    <button
                      onClick={() => openEdit(program)}
                      style={{
                        padding: '0.4rem 1rem',
                        background: '#0f2d6b', border: 'none',
                        borderRadius: '8px', color: 'white',
                        fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setDeleteTarget(program)}
                      style={{
                        padding: '0.4rem 0.75rem',
                        background: 'var(--bg-muted)', border: '1px solid var(--border)',
                        borderRadius: '8px', color: '#ef4444',
                        fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalMode && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div style={{
            background: 'var(--bg-card)', borderRadius: '20px',
            width: '100%', maxWidth: '600px',
            boxShadow: '0 32px 80px rgba(0,0,0,0.2)',
            maxHeight: '92vh', overflowY: 'auto',
          }}>
            {/* Modal header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '1.5rem 1.75rem', borderBottom: '1px solid var(--border)',
              position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 1,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: form.bgGradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem',
                }}>
                  {form.icon}
                </div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  {modalMode === 'add' ? 'Tambah Program Studi' : 'Edit Program Studi'}
                </h2>
              </div>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)', fontSize: '1.25rem', lineHeight: 1 }}>✕</button>
            </div>

            {/* Form */}
            <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

              {/* ID (only for add) */}
              {modalMode === 'add' && (
                <Field label="ID Program (slug, opsional — otomatis dari nama jika kosong)">
                  <input
                    value={form.id}
                    onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
                    placeholder="mis. adm-negara"
                    style={inputStyle}
                  />
                </Field>
              )}

              {/* Icon + Name */}
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1rem', alignItems: 'end' }}>
                <Field label="Ikon">
                  <input
                    value={form.icon}
                    onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                    style={{ ...inputStyle, textAlign: 'center', fontSize: '1.5rem' }}
                  />
                </Field>
                <Field label="Nama Program *">
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="mis. Ilmu Administrasi Negara"
                    style={inputStyle}
                  />
                </Field>
              </div>

              {/* Degree + Accreditation */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Jenjang *">
                  <select value={form.degree} onChange={e => setForm(f => ({ ...f, degree: e.target.value }))} style={inputStyle}>
                    {degreeOptions.map(d => <option key={d}>{d}</option>)}
                  </select>
                </Field>
                <Field label="Akreditasi *">
                  <select value={form.accreditation} onChange={e => setForm(f => ({ ...f, accreditation: e.target.value }))} style={inputStyle}>
                    {accreditationOptions.map(a => <option key={a}>{a}</option>)}
                  </select>
                </Field>
              </div>

              {/* Badge */}
              <Field label="Badge (opsional)">
                <input
                  value={form.badge}
                  onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                  placeholder="mis. Unggulan"
                  style={inputStyle}
                />
              </Field>

              {/* Degree title */}
              <Field label="Gelar Lulusan (mis. Sarjana Administrasi Publik (S.AP))">
                <input
                  value={form.degreeTitle}
                  onChange={e => setForm(f => ({ ...f, degreeTitle: e.target.value }))}
                  placeholder="mis. Sarjana Administrasi Publik (S.AP)"
                  style={inputStyle}
                />
              </Field>

              {/* Description */}
              <Field label="Deskripsi *">
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                />
              </Field>

              {/* Gradient preset */}
              <Field label="Warna Tema">
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {gradientPresets.map(g => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, bgGradient: g.value, color: g.color }))}
                      style={{
                        width: '36px', height: '36px', borderRadius: '8px',
                        background: g.value,
                        border: form.bgGradient === g.value ? '3px solid var(--text-primary)' : '2px solid transparent',
                        cursor: 'pointer',
                        outline: form.bgGradient === g.value ? '2px solid var(--bg-card)' : 'none',
                        outlineOffset: '-4px',
                      }}
                      title={g.label}
                    />
                  ))}
                </div>
              </Field>

              {/* Highlights */}
              <Field label="Highlight Keahlian">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.6rem' }}>
                  {form.highlights.map((h, i) => (
                    <span key={i} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                      padding: '0.25rem 0.65rem',
                      background: 'var(--bg-muted)', color: 'var(--text-body)',
                      borderRadius: '999px', fontSize: '0.75rem',
                    }}>
                      {h}
                      <button
                        onClick={() => removeHighlight(i)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)', fontSize: '0.75rem', padding: 0, lineHeight: 1 }}
                      >✕</button>
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    value={highlightInput}
                    onChange={e => setHighlightInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addHighlight(); } }}
                    placeholder="Tambah highlight, tekan Enter..."
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button
                    onClick={addHighlight}
                    style={{
                      padding: '0.65rem 1rem', background: 'var(--bg-muted)',
                      border: '1.5px solid var(--border)', borderRadius: '10px',
                      fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-body)', cursor: 'pointer',
                    }}
                  >
                    + Tambah
                  </button>
                </div>
              </Field>

              {/* Career Paths */}
              <Field label="Prospek Karier">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.6rem' }}>
                  {(form.careerPaths ?? []).map((c, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.65rem', background: 'var(--bg-muted)', borderRadius: '8px', fontSize: '0.82rem', color: 'var(--text-body)' }}>
                      <span style={{ color: form.color, fontWeight: 700 }}>→</span>
                      <span style={{ flex: 1 }}>{c}</span>
                      <button onClick={() => removeCareer(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)', fontSize: '0.75rem', padding: 0, lineHeight: 1 }}>✕</button>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    value={careerInput}
                    onChange={e => setCareerInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCareer(); } }}
                    placeholder="Tambah prospek karier, tekan Enter..."
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button
                    onClick={addCareer}
                    style={{ padding: '0.65rem 1rem', background: 'var(--bg-muted)', border: '1.5px solid var(--border)', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-body)', cursor: 'pointer' }}
                  >
                    + Tambah
                  </button>
                </div>
              </Field>

              {/* Lecturers */}
              <Field label={`Tenaga Pengajar (${(form.lecturers ?? []).length} dosen)`}>
                {/* Lecturer list */}
                {(form.lecturers ?? []).length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.75rem' }}>
                    {(form.lecturers ?? []).map((lec, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.6rem 0.85rem',
                        background: editingLecturerIdx === i ? form.bgGradient + '22' : 'var(--bg-muted)',
                        border: editingLecturerIdx === i ? `1.5px solid ${form.color}40` : '1px solid var(--border)',
                        borderRadius: '10px',
                      }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                          background: form.bgGradient,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontWeight: 800, fontSize: '0.7rem',
                        }}>
                          {lec.name.replace(/^Dr\.\s*/i, '').trim().split(' ').filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lec.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{lec.qualifications}</div>
                        </div>
                        <button onClick={() => startEditLecturer(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.75rem', padding: '0.2rem 0.4rem' }}>✏️</button>
                        <button onClick={() => removeLecturer(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '0.75rem', padding: '0.2rem 0.4rem' }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add / edit form */}
                <div style={{ background: 'var(--bg-muted)', border: '1.5px solid var(--border)', borderRadius: '10px', padding: '0.85rem' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '0.6rem' }}>
                    {editingLecturerIdx !== null ? `Edit Dosen #${editingLecturerIdx + 1}` : 'Tambah Dosen'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      value={lecturerForm.name}
                      onChange={e => setLecturerForm(f => ({ ...f, name: e.target.value }))}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); saveLecturer(); } }}
                      placeholder="Nama dosen *"
                      style={{ ...inputStyle, padding: '0.6rem 0.85rem', fontSize: '0.82rem' }}
                    />
                    <input
                      value={lecturerForm.qualifications}
                      onChange={e => setLecturerForm(f => ({ ...f, qualifications: e.target.value }))}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); saveLecturer(); } }}
                      placeholder="Kualifikasi (mis. S.AP., M.AP)"
                      style={{ ...inputStyle, padding: '0.6rem 0.85rem', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={saveLecturer}
                      disabled={!lecturerForm.name.trim()}
                      style={{ padding: '0.5rem 1rem', background: form.bgGradient, border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, fontSize: '0.78rem', cursor: lecturerForm.name.trim() ? 'pointer' : 'not-allowed', opacity: lecturerForm.name.trim() ? 1 : 0.5 }}
                    >
                      {editingLecturerIdx !== null ? 'Simpan' : '+ Tambah'}
                    </button>
                    {editingLecturerIdx !== null && (
                      <button onClick={() => { setLecturerForm({ name: '', qualifications: '' }); setEditingLecturerIdx(null); }} style={{ padding: '0.5rem 1rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-body)', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}>
                        Batal
                      </button>
                    )}
                  </div>
                </div>
              </Field>

              {/* Error */}
              {error && (
                <div style={{ padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '0.85rem' }}>
                  {error}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
                <button
                  onClick={closeModal}
                  style={{ padding: '0.7rem 1.5rem', border: '1.5px solid var(--border)', borderRadius: '10px', background: 'var(--bg-card)', color: 'var(--text-body)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{ padding: '0.7rem 1.75rem', background: 'linear-gradient(135deg, #0f2d6b 0%, #1a4aad 100%)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 700, fontSize: '0.875rem', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? 'Menyimpan...' : (modalMode === 'add' ? 'Tambah Program' : 'Simpan Perubahan')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={e => { if (e.target === e.currentTarget) setDeleteTarget(null); }}
        >
          <div style={{
            background: 'var(--bg-card)', borderRadius: '20px',
            width: '100%', maxWidth: '420px',
            padding: '2rem',
            boxShadow: '0 32px 80px rgba(0,0,0,0.2)',
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem' }}>
                🗑️
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.5rem' }}>Hapus Program Studi?</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Program <strong style={{ color: 'var(--text-primary)' }}>{deleteTarget.name}</strong> akan dihapus secara permanen dan tidak bisa dipulihkan.
              </p>
            </div>

            {error && (
              <div style={{ padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => { setDeleteTarget(null); setError(null); }}
                style={{ flex: 1, padding: '0.75rem', border: '1.5px solid var(--border)', borderRadius: '10px', background: 'var(--bg-card)', color: 'var(--text-body)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{ flex: 1, padding: '0.75rem', background: '#ef4444', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 700, fontSize: '0.875rem', cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.7 : 1 }}
              >
                {deleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-heading)', marginBottom: '0.4rem' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.7rem 1rem',
  border: '1.5px solid var(--border)', borderRadius: '10px',
  fontSize: '0.875rem', color: 'var(--text-heading)',
  background: 'var(--bg-muted)', boxSizing: 'border-box',
  outline: 'none',
};
