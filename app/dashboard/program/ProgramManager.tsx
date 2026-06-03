'use client';

import { useState } from 'react';
import { programs as initialPrograms, type Program } from '../../data/programs';

const degreeOptions = ['S1 — 4 Tahun', 'S2 — 2 Tahun', 'D3 — 3 Tahun', 'D4 — 4 Tahun'];
const accreditationOptions = ['Akreditasi A', 'Akreditasi B', 'Akreditasi C', 'Unggul', 'Baik Sekali'];

export default function ProgramManager() {
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [highlightInput, setHighlightInput] = useState('');

  const openEdit = (program: Program) => {
    setEditingProgram({ ...program, highlights: [...program.highlights] });
    setHighlightInput('');
  };

  const closeEdit = () => setEditingProgram(null);

  const handleSave = () => {
    if (!editingProgram) return;
    setPrograms(prev => prev.map(p => p.id === editingProgram.id ? editingProgram : p));
    closeEdit();
  };

  const toggleStatus = (id: string) => {
    setPrograms(prev => prev.map(p =>
      p.id === id ? { ...p, status: p.status === 'aktif' ? 'nonaktif' : 'aktif' } : p
    ));
  };

  const addHighlight = () => {
    const val = highlightInput.trim();
    if (!val || !editingProgram) return;
    setEditingProgram({ ...editingProgram, highlights: [...editingProgram.highlights, val] });
    setHighlightInput('');
  };

  const removeHighlight = (i: number) => {
    if (!editingProgram) return;
    setEditingProgram({ ...editingProgram, highlights: editingProgram.highlights.filter((_, idx) => idx !== i) });
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>Program Studi</h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{programs.filter(p => p.status === 'aktif').length} program aktif dari {programs.length} total</p>
      </div>

      {/* Program cards */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {programs.map(program => (
          <div
            key={program.id}
            style={{
              background: 'white', border: '1px solid #e2e8f0',
              borderRadius: '16px', overflow: 'hidden',
              opacity: program.status === 'nonaktif' ? 0.6 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
              {/* Color strip */}
              <div style={{
                width: '6px', flexShrink: 0,
                background: program.bgGradient,
              }} />

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
                    <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem' }}>{program.name}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{program.degree}</span>
                      <span style={{ color: '#e2e8f0' }}>·</span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{program.accreditation}</span>
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div style={{ flex: 1, display: 'flex', gap: '0.4rem', flexWrap: 'wrap', minWidth: '200px' }}>
                  {program.highlights.map(h => (
                    <span key={h} style={{
                      padding: '0.2rem 0.6rem',
                      background: '#f1f5f9', color: '#475569',
                      borderRadius: '999px', fontSize: '0.7rem', fontWeight: 500,
                    }}>{h}</span>
                  ))}
                </div>

                {/* Alumni */}
                <div style={{ textAlign: 'center', minWidth: '80px' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: program.color }}>{program.alumni}</div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>alumni</div>
                </div>

                {/* Badge */}
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

                {/* Status + actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginLeft: 'auto' }}>
                  <button
                    onClick={() => toggleStatus(program.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                      padding: '0.35rem 0.85rem',
                      borderRadius: '999px', border: '1.5px solid', cursor: 'pointer',
                      fontSize: '0.72rem', fontWeight: 700, transition: 'all 0.2s',
                      borderColor: program.status === 'aktif' ? '#bbf7d0' : '#e2e8f0',
                      background: program.status === 'aktif' ? '#f0fdf4' : '#f8fafc',
                      color: program.status === 'aktif' ? '#16a34a' : '#94a3b8',
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
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingProgram && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={e => { if (e.target === e.currentTarget) closeEdit(); }}
        >
          <div style={{
            background: 'white', borderRadius: '20px',
            width: '100%', maxWidth: '580px',
            boxShadow: '0 32px 80px rgba(0,0,0,0.2)',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            {/* Modal header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '1.5rem 1.75rem', borderBottom: '1px solid #f1f5f9',
              position: 'sticky', top: 0, background: 'white', zIndex: 1,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: editingProgram.bgGradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem',
                }}>
                  {editingProgram.icon}
                </div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Edit Program Studi</h2>
              </div>
              <button onClick={closeEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '1.25rem', lineHeight: 1 }}>✕</button>
            </div>

            {/* Form */}
            <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

              {/* Name */}
              <Field label="Nama Program">
                <input
                  value={editingProgram.name}
                  onChange={e => setEditingProgram({ ...editingProgram, name: e.target.value })}
                  style={inputStyle}
                />
              </Field>

              {/* Degree + Accreditation */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Jenjang">
                  <select
                    value={editingProgram.degree}
                    onChange={e => setEditingProgram({ ...editingProgram, degree: e.target.value })}
                    style={inputStyle}
                  >
                    {degreeOptions.map(d => <option key={d}>{d}</option>)}
                  </select>
                </Field>
                <Field label="Akreditasi">
                  <select
                    value={editingProgram.accreditation}
                    onChange={e => setEditingProgram({ ...editingProgram, accreditation: e.target.value })}
                    style={inputStyle}
                  >
                    {accreditationOptions.map(a => <option key={a}>{a}</option>)}
                  </select>
                </Field>
              </div>

              {/* Badge + Alumni */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Badge">
                  <input
                    value={editingProgram.badge}
                    onChange={e => setEditingProgram({ ...editingProgram, badge: e.target.value })}
                    style={inputStyle}
                  />
                </Field>
                <Field label="Jumlah Alumni">
                  <input
                    value={editingProgram.alumni}
                    onChange={e => setEditingProgram({ ...editingProgram, alumni: e.target.value })}
                    placeholder="mis. 3.100+"
                    style={inputStyle}
                  />
                </Field>
              </div>

              {/* Description */}
              <Field label="Deskripsi">
                <textarea
                  value={editingProgram.description}
                  onChange={e => setEditingProgram({ ...editingProgram, description: e.target.value })}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                />
              </Field>

              {/* Highlights */}
              <Field label="Highlight Keahlian">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.6rem' }}>
                  {editingProgram.highlights.map((h, i) => (
                    <span key={i} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                      padding: '0.25rem 0.65rem',
                      background: '#f1f5f9', color: '#475569',
                      borderRadius: '999px', fontSize: '0.75rem',
                    }}>
                      {h}
                      <button
                        onClick={() => removeHighlight(i)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '0.75rem', padding: 0, lineHeight: 1 }}
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
                      padding: '0.65rem 1rem', background: '#f1f5f9',
                      border: '1.5px solid #e2e8f0', borderRadius: '10px',
                      fontSize: '0.8rem', fontWeight: 600, color: '#475569', cursor: 'pointer',
                    }}
                  >
                    + Tambah
                  </button>
                </div>
              </Field>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
                <button
                  onClick={closeEdit}
                  style={{ padding: '0.7rem 1.5rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', background: 'white', color: '#475569', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  style={{ padding: '0.7rem 1.75rem', background: 'linear-gradient(135deg, #0f2d6b 0%, #1a4aad 100%)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.7rem 1rem',
  border: '1.5px solid #e2e8f0', borderRadius: '10px',
  fontSize: '0.875rem', color: '#0f172a',
  background: '#f8fafc', boxSizing: 'border-box',
};
