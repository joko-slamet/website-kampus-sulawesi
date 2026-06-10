'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from '../../lib/api';
import { translations } from '../../i18n/translations';

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeroContent {
  badge: string;
  titleLine1: string;
  titleGradient: string;
  titleLine2: string;
  subtitle: string;
  stats: Array<{ value: string; label: string }>;
}

interface AboutContent {
  body1: string;
  body2: string;
  milestones: Array<{ year: string; label: string }>;
  features: Array<{ title: string; desc: string }>;
}

interface VisiMisiContent {
  visiBody: string;
  misiItems: string[];
  campus1Title: string;
  campus1Desc: string;
  campus1Address: string;
  campus2Title: string;
  campus2Desc: string;
  campus2Address: string;
}

interface WhyContent {
  subtitle: string;
  reasons: Array<{ stat: string; statLabel: string; title: string; desc: string }>;
}

interface PmbContent {
  titleGradient: string;
  subtitle: string;
  waves: Array<{ name: string; period: string }>;
  reqItems: string[];
  costItems: Array<{ label: string; amount: string; note: string }>;
}

interface ContactContent {
  phone: string;
  email: string;
  address1: string;
  address2: string;
  facebook: string;
  instagram: string;
  website: string;
}

interface FooterContent {
  tagline: string;
  hours: string;
  copyright: string;
}

interface AllSections {
  hero: { id: HeroContent; en: HeroContent };
  about: { id: AboutContent; en: AboutContent };
  visiMisi: { id: VisiMisiContent; en: VisiMisiContent };
  why: { id: WhyContent; en: WhyContent };
  pmb: { id: PmbContent; en: PmbContent };
  contact: { id: ContactContent; en: ContactContent };
  footer: { id: FooterContent; en: FooterContent };
}

// ─── Defaults pulled from translations.ts ─────────────────────────────────────

function defaultHero(lang: 'id' | 'en'): HeroContent {
  const t = translations[lang].hero;
  return {
    badge: t.badge,
    titleLine1: t.titleLine1,
    titleGradient: t.titleGradient,
    titleLine2: t.titleLine2,
    subtitle: t.subtitle,
    stats: t.stats.map(s => ({ value: s.value, label: s.label })),
  };
}

function defaultAbout(lang: 'id' | 'en'): AboutContent {
  const t = translations[lang].about;
  return {
    body1: t.body1,
    body2: t.body2,
    milestones: t.milestones.map(m => ({ year: m.year, label: m.label })),
    features: t.features.map(f => ({ title: f.title, desc: f.desc })),
  };
}

function defaultVisiMisi(lang: 'id' | 'en'): VisiMisiContent {
  const p = translations[lang].profil;
  return {
    visiBody: p.visiBody,
    misiItems: [...p.misiItems],
    campus1Title: p.campus1Title,
    campus1Desc: p.campus1Desc,
    campus1Address: p.campus1Address,
    campus2Title: p.campus2Title,
    campus2Desc: p.campus2Desc,
    campus2Address: p.campus2Address,
  };
}

function defaultWhy(lang: 'id' | 'en'): WhyContent {
  const t = translations[lang].why;
  return {
    subtitle: t.subtitle,
    reasons: t.reasons.map(r => ({ stat: r.stat, statLabel: r.statLabel, title: r.title, desc: r.desc })),
  };
}

function defaultPmb(lang: 'id' | 'en'): PmbContent {
  const t = translations[lang].pmb;
  return {
    titleGradient: t.titleGradient,
    subtitle: t.subtitle,
    waves: t.waves.map(w => ({ name: w.name, period: w.period })),
    reqItems: [...t.reqItems],
    costItems: t.costItems.map(c => ({ label: c.label, amount: c.amount, note: c.note })),
  };
}

function defaultContact(lang: 'id' | 'en'): ContactContent {
  const t = translations[lang].contact;
  return {
    phone: t.phone,
    email: t.email,
    address1: t.address1,
    address2: t.address2,
    facebook: t.facebook,
    instagram: t.instagram,
    website: t.website,
  };
}

function defaultFooter(lang: 'id' | 'en'): FooterContent {
  const t = translations[lang].footer;
  return { tagline: t.tagline, hours: t.hours, copyright: t.copyright };
}

function buildDefaults(): AllSections {
  return {
    hero: { id: defaultHero('id'), en: defaultHero('en') },
    about: { id: defaultAbout('id'), en: defaultAbout('en') },
    visiMisi: { id: defaultVisiMisi('id'), en: defaultVisiMisi('en') },
    why: { id: defaultWhy('id'), en: defaultWhy('en') },
    pmb: { id: defaultPmb('id'), en: defaultPmb('en') },
    contact: { id: defaultContact('id'), en: defaultContact('en') },
    footer: { id: defaultFooter('id'), en: defaultFooter('en') },
  };
}

// ─── Scheduler helpers (preserved from original) ──────────────────────────────

interface SchedulerConfig {
  enabled: boolean;
  times: string[];
}

function nextRunLabel(enabled: boolean, times: string[]): string {
  if (!enabled) return 'Nonaktif';
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

// ─── Reusable form primitives ──────────────────────────────────────────────────

function Field({
  label, hint, children,
}: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151' }}>{label}</label>
      {hint && <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: 0 }}>{hint}</p>}
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '0.55rem 0.75rem',
  border: '1.5px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '0.875rem',
  color: '#0f172a',
  background: 'white',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: '80px',
  fontFamily: 'inherit',
  lineHeight: 1.6,
};

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={inputStyle}
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{ ...textareaStyle, minHeight: `${rows * 1.6 + 1}rem` }}
    />
  );
}

function AddRemoveBtn({ onClick, remove }: { onClick: () => void; remove?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '0.3rem 0.7rem',
        borderRadius: '6px',
        border: remove ? '1px solid #fee2e2' : '1px solid #c7d2fe',
        background: remove ? '#fef2f2' : '#eef2ff',
        color: remove ? '#ef4444' : '#4338ca',
        fontSize: '0.75rem',
        fontWeight: 700,
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      {remove ? '−' : '+ Tambah'}
    </button>
  );
}

function SectionRow({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>{children}</div>;
}

// ─── Language + Translate bar ─────────────────────────────────────────────────

function LangBar({
  activeLang,
  onSwitch,
  onTranslate,
  translating,
}: {
  activeLang: 'id' | 'en';
  onSwitch: (l: 'id' | 'en') => void;
  onTranslate: () => void;
  translating: boolean;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '3px' }}>
        {(['id', 'en'] as const).map(l => (
          <button
            key={l}
            type="button"
            onClick={() => onSwitch(l)}
            style={{
              padding: '0.3rem 0.8rem',
              borderRadius: '6px',
              border: 'none',
              background: activeLang === l ? 'white' : 'transparent',
              fontWeight: 700,
              fontSize: '0.78rem',
              color: activeLang === l ? '#0f2d6b' : '#64748b',
              cursor: 'pointer',
              boxShadow: activeLang === l ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            {l === 'id' ? '🇮🇩 Indonesia' : '🇬🇧 English'}
          </button>
        ))}
      </div>
      {activeLang === 'en' && (
        <button
          type="button"
          onClick={onTranslate}
          disabled={translating}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '8px',
            border: '1px solid #a5b4fc',
            background: '#eef2ff',
            color: '#4338ca',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: translating ? 'wait' : 'pointer',
            opacity: translating ? 0.6 : 1,
          }}
        >
          {translating ? '⏳ Menerjemahkan...' : '🤖 Terjemahkan Otomatis dari ID'}
        </button>
      )}
    </div>
  );
}

// ─── Section: Scheduler ───────────────────────────────────────────────────────

function SchedulerTab() {
  const [enabled, setEnabled] = useState(false);
  const [times, setTimes] = useState<string[]>(['06:00', '12:00', '18:00']);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.scheduler.get()
      .then(d => { setEnabled(d.enabled); setTimes(d.times); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Auto-Generate Artikel</div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            Berikutnya: {nextRunLabel(enabled, times)}
          </div>
        </div>
        <Toggle checked={enabled} onChange={setEnabled} />
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151' }}>
            Jadwal posting ({times.length}/hari) · Zona WITA (UTC+8)
          </label>
          <AddRemoveBtn onClick={() => setTimes(p => [...p, '08:00'])} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {times.map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', padding: '0.5rem 0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <span style={{ width: '20px', fontSize: '0.7rem', fontWeight: 800, color: '#6366f1', textAlign: 'center' }}>{i + 1}</span>
              <input
                type="time"
                value={t}
                onChange={e => setTimes(p => { const n = [...p]; n[i] = e.target.value; return n; })}
                style={{ ...inputStyle, width: 'auto' }}
              />
              <span style={{ flex: 1 }} />
              <AddRemoveBtn remove onClick={() => setTimes(p => p.filter((_, j) => j !== i))} />
            </div>
          ))}
        </div>
      </div>

      {error && <ErrorBox msg={error} />}
      <SaveBar
        saving={saving}
        saved={saved}
        onSave={async () => {
          setSaving(true); setError('');
          try {
            const u = await api.scheduler.update(enabled, times);
            setEnabled(u.enabled); setTimes(u.times);
            setSaved(true); setTimeout(() => setSaved(false), 2500);
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Gagal menyimpan');
          } finally { setSaving(false); }
        }}
      />
    </div>
  );
}

// ─── Section: Hero ─────────────────────────────────────────────────────────────

function HeroTab({ data, onChange, onTranslate, translating }: SectionTabProps<HeroContent>) {
  const d = data;
  return (
    <div style={formGrid}>
      <Field label="Badge Teks" hint="Teks di pil atas hero. Gunakan {year} untuk tahun otomatis.">
        <Input value={d.badge} onChange={v => onChange({ ...d, badge: v })} />
      </Field>
      <Field label="Judul Baris 1"><Input value={d.titleLine1} onChange={v => onChange({ ...d, titleLine1: v })} /></Field>
      <Field label="Judul Gradient (warna emas)"><Input value={d.titleGradient} onChange={v => onChange({ ...d, titleGradient: v })} /></Field>
      <Field label="Judul Baris 2"><Input value={d.titleLine2} onChange={v => onChange({ ...d, titleLine2: v })} /></Field>
      <Field label="Subjudul" hint="Mendukung tag HTML seperti <strong>.">
        <Textarea value={d.subtitle} onChange={v => onChange({ ...d, subtitle: v })} rows={3} />
      </Field>
      <Field label="Statistik">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {d.stats.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="text" value={s.value} placeholder="Nilai" onChange={e => { const n = [...d.stats]; n[i] = { ...n[i], value: e.target.value }; onChange({ ...d, stats: n }); }} style={{ ...inputStyle, flex: 1 }} />
              <input type="text" value={s.label} placeholder="Label" onChange={e => { const n = [...d.stats]; n[i] = { ...n[i], label: e.target.value }; onChange({ ...d, stats: n }); }} style={{ ...inputStyle, flex: 2 }} />
            </div>
          ))}
        </div>
      </Field>
    </div>
  );
}

// ─── Section: About ────────────────────────────────────────────────────────────

function AboutTab({ data, onChange }: SectionTabProps<AboutContent>) {
  const d = data;
  return (
    <div style={formGrid}>
      <Field label="Paragraf 1">
        <Textarea value={d.body1} onChange={v => onChange({ ...d, body1: v })} rows={4} />
      </Field>
      <Field label="Paragraf 2">
        <Textarea value={d.body2} onChange={v => onChange({ ...d, body2: v })} rows={4} />
      </Field>
      <Field label="Milestone Perjalanan">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {d.milestones.map((m, i) => (
            <SectionRow key={i}>
              <input type="text" value={m.year} placeholder="Tahun" onChange={e => { const n = [...d.milestones]; n[i] = { ...n[i], year: e.target.value }; onChange({ ...d, milestones: n }); }} style={{ ...inputStyle, width: '90px' }} />
              <input type="text" value={m.label} placeholder="Label" onChange={e => { const n = [...d.milestones]; n[i] = { ...n[i], label: e.target.value }; onChange({ ...d, milestones: n }); }} style={{ ...inputStyle, flex: 1 }} />
              <AddRemoveBtn remove onClick={() => onChange({ ...d, milestones: d.milestones.filter((_, j) => j !== i) })} />
            </SectionRow>
          ))}
          <AddRemoveBtn onClick={() => onChange({ ...d, milestones: [...d.milestones, { year: '', label: '' }] })} />
        </div>
      </Field>
      <Field label="Pilar Nilai (3 item)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {d.features.map((f, i) => (
            <div key={i} style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <input type="text" value={f.title} placeholder="Judul" onChange={e => { const n = [...d.features]; n[i] = { ...n[i], title: e.target.value }; onChange({ ...d, features: n }); }} style={inputStyle} />
              <textarea value={f.desc} placeholder="Deskripsi" rows={2} onChange={e => { const n = [...d.features]; n[i] = { ...n[i], desc: e.target.value }; onChange({ ...d, features: n }); }} style={{ ...textareaStyle, minHeight: '3rem' }} />
            </div>
          ))}
        </div>
      </Field>
    </div>
  );
}

// ─── Section: Visi/Misi ────────────────────────────────────────────────────────

function VisiMisiTab({ data, onChange }: SectionTabProps<VisiMisiContent>) {
  const d = data;
  return (
    <div style={formGrid}>
      <Field label="Teks Visi">
        <Textarea value={d.visiBody} onChange={v => onChange({ ...d, visiBody: v })} rows={4} />
      </Field>
      <Field label="Butir-butir Misi">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {d.misiItems.map((item, i) => (
            <SectionRow key={i}>
              <Textarea value={item} onChange={v => { const n = [...d.misiItems]; n[i] = v; onChange({ ...d, misiItems: n }); }} rows={2} />
              <AddRemoveBtn remove onClick={() => onChange({ ...d, misiItems: d.misiItems.filter((_, j) => j !== i) })} />
            </SectionRow>
          ))}
          <AddRemoveBtn onClick={() => onChange({ ...d, misiItems: [...d.misiItems, ''] })} />
        </div>
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {([1, 2] as const).map(n => (
          <div key={n} style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#0f2d6b', marginBottom: '0.25rem' }}>📍 Kampus {n}</div>
            <Input value={d[`campus${n}Title`]} onChange={v => onChange({ ...d, [`campus${n}Title`]: v })} placeholder="Nama kampus" />
            <Input value={d[`campus${n}Desc`]} onChange={v => onChange({ ...d, [`campus${n}Desc`]: v })} placeholder="Deskripsi singkat" />
            <Textarea value={d[`campus${n}Address`]} onChange={v => onChange({ ...d, [`campus${n}Address`]: v })} rows={2} placeholder="Alamat lengkap" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section: Why ─────────────────────────────────────────────────────────────

function WhyTab({ data, onChange }: SectionTabProps<WhyContent>) {
  const d = data;
  return (
    <div style={formGrid}>
      <Field label="Subjudul Seksi">
        <Textarea value={d.subtitle} onChange={v => onChange({ ...d, subtitle: v })} rows={3} />
      </Field>
      <Field label="Kartu Keunggulan">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {d.reasons.map((r, i) => (
            <div key={i} style={{ padding: '0.85rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" value={r.stat} placeholder="Nilai (misal BAIK)" onChange={e => { const n = [...d.reasons]; n[i] = { ...n[i], stat: e.target.value }; onChange({ ...d, reasons: n }); }} style={{ ...inputStyle, flex: 1 }} />
                <input type="text" value={r.statLabel} placeholder="Label nilai" onChange={e => { const n = [...d.reasons]; n[i] = { ...n[i], statLabel: e.target.value }; onChange({ ...d, reasons: n }); }} style={{ ...inputStyle, flex: 2 }} />
              </div>
              <input type="text" value={r.title} placeholder="Judul kartu" onChange={e => { const n = [...d.reasons]; n[i] = { ...n[i], title: e.target.value }; onChange({ ...d, reasons: n }); }} style={inputStyle} />
              <textarea value={r.desc} placeholder="Deskripsi" rows={2} onChange={e => { const n = [...d.reasons]; n[i] = { ...n[i], desc: e.target.value }; onChange({ ...d, reasons: n }); }} style={{ ...textareaStyle, minHeight: '3rem' }} />
            </div>
          ))}
        </div>
      </Field>
    </div>
  );
}

// ─── Section: PMB ─────────────────────────────────────────────────────────────

function PmbTab({ data, onChange }: SectionTabProps<PmbContent>) {
  const d = data;
  return (
    <div style={formGrid}>
      <Field label="Judul Gradient (misal: PMB 2026/2027)">
        <Input value={d.titleGradient} onChange={v => onChange({ ...d, titleGradient: v })} />
      </Field>
      <Field label="Subjudul Seksi">
        <Textarea value={d.subtitle} onChange={v => onChange({ ...d, subtitle: v })} rows={2} />
      </Field>
      <Field label="Gelombang Pendaftaran">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {d.waves.map((w, i) => (
            <SectionRow key={i}>
              <input type="text" value={w.name} placeholder="Nama (Gelombang I)" onChange={e => { const n = [...d.waves]; n[i] = { ...n[i], name: e.target.value }; onChange({ ...d, waves: n }); }} style={{ ...inputStyle, flex: 1 }} />
              <input type="text" value={w.period} placeholder="Periode" onChange={e => { const n = [...d.waves]; n[i] = { ...n[i], period: e.target.value }; onChange({ ...d, waves: n }); }} style={{ ...inputStyle, flex: 2 }} />
              <AddRemoveBtn remove onClick={() => onChange({ ...d, waves: d.waves.filter((_, j) => j !== i) })} />
            </SectionRow>
          ))}
          <AddRemoveBtn onClick={() => onChange({ ...d, waves: [...d.waves, { name: '', period: '' }] })} />
        </div>
      </Field>
      <Field label="Syarat Administrasi">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {d.reqItems.map((item, i) => (
            <SectionRow key={i}>
              <Input value={item} onChange={v => { const n = [...d.reqItems]; n[i] = v; onChange({ ...d, reqItems: n }); }} />
              <AddRemoveBtn remove onClick={() => onChange({ ...d, reqItems: d.reqItems.filter((_, j) => j !== i) })} />
            </SectionRow>
          ))}
          <AddRemoveBtn onClick={() => onChange({ ...d, reqItems: [...d.reqItems, ''] })} />
        </div>
      </Field>
      <Field label="Biaya">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {d.costItems.map((c, i) => (
            <div key={i} style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" value={c.label} placeholder="Nama biaya" onChange={e => { const n = [...d.costItems]; n[i] = { ...n[i], label: e.target.value }; onChange({ ...d, costItems: n }); }} style={{ ...inputStyle, flex: 2 }} />
                <input type="text" value={c.amount} placeholder="Jumlah" onChange={e => { const n = [...d.costItems]; n[i] = { ...n[i], amount: e.target.value }; onChange({ ...d, costItems: n }); }} style={{ ...inputStyle, flex: 1 }} />
                <AddRemoveBtn remove onClick={() => onChange({ ...d, costItems: d.costItems.filter((_, j) => j !== i) })} />
              </div>
              <input type="text" value={c.note} placeholder="Catatan" onChange={e => { const n = [...d.costItems]; n[i] = { ...n[i], note: e.target.value }; onChange({ ...d, costItems: n }); }} style={inputStyle} />
            </div>
          ))}
          <AddRemoveBtn onClick={() => onChange({ ...d, costItems: [...d.costItems, { label: '', amount: '', note: '' }] })} />
        </div>
      </Field>
    </div>
  );
}

// ─── Section: Contact ─────────────────────────────────────────────────────────

function ContactTab({ data, onChange }: SectionTabProps<ContactContent>) {
  const d = data;
  return (
    <div style={formGrid}>
      <Field label="Nomor Telepon / WhatsApp"><Input value={d.phone} onChange={v => onChange({ ...d, phone: v })} /></Field>
      <Field label="Email"><Input value={d.email} onChange={v => onChange({ ...d, email: v })} /></Field>
      <Field label="Alamat Kampus 1"><Textarea value={d.address1} onChange={v => onChange({ ...d, address1: v })} rows={2} /></Field>
      <Field label="Alamat Kampus 2"><Textarea value={d.address2} onChange={v => onChange({ ...d, address2: v })} rows={2} /></Field>
      <Field label="Nama Facebook"><Input value={d.facebook} onChange={v => onChange({ ...d, facebook: v })} /></Field>
      <Field label="Nama Instagram"><Input value={d.instagram} onChange={v => onChange({ ...d, instagram: v })} /></Field>
      <Field label="URL Website"><Input value={d.website} onChange={v => onChange({ ...d, website: v })} /></Field>
    </div>
  );
}

// ─── Section: Footer ─────────────────────────────────────────────────────────

function FooterTab({ data, onChange }: SectionTabProps<FooterContent>) {
  const d = data;
  return (
    <div style={formGrid}>
      <Field label="Tagline Footer">
        <Textarea value={d.tagline} onChange={v => onChange({ ...d, tagline: v })} rows={3} />
      </Field>
      <Field label="Jam Operasional"><Input value={d.hours} onChange={v => onChange({ ...d, hours: v })} /></Field>
      <Field label="Teks Copyright"><Input value={d.copyright} onChange={v => onChange({ ...d, copyright: v })} /></Field>
    </div>
  );
}

// ─── Shared section tab props type ────────────────────────────────────────────

type SectionTabProps<T> = {
  data: T;
  onChange: (v: T) => void;
  onTranslate?: () => void;
  translating?: boolean;
};

// ─── Shared UI atoms ──────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '160px' }}>
      <div style={{ width: '26px', height: '26px', border: '3px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{ position: 'relative', width: '44px', height: '24px', borderRadius: '12px', border: 'none', background: checked ? '#6366f1' : '#cbd5e1', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0, padding: 0 }}
    >
      <span style={{ position: 'absolute', top: '3px', left: checked ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </button>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.6rem 0.85rem', fontSize: '0.82rem', color: '#dc2626' }}>{msg}</div>
  );
}

function SaveBar({ saving, saved, onSave, extra }: { saving: boolean; saved: boolean; onSave: () => void; extra?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9', marginTop: '0.5rem' }}>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        style={{ padding: '0.65rem 1.5rem', background: saved ? '#16a34a' : '#0f2d6b', color: 'white', border: 'none', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 700, cursor: saving ? 'wait' : 'pointer', transition: 'background 0.2s' }}
      >
        {saving ? 'Menyimpan...' : saved ? '✓ Tersimpan' : 'Simpan Pengaturan'}
      </button>
      {extra}
    </div>
  );
}

const formGrid: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: '1.25rem',
};

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  { key: 'scheduler', label: '🤖 Scheduler', section: null },
  { key: 'hero', label: '🦸 Hero', section: 'hero' as keyof AllSections },
  { key: 'about', label: 'ℹ️ Tentang', section: 'about' as keyof AllSections },
  { key: 'visiMisi', label: '🎯 Visi/Misi', section: 'visiMisi' as keyof AllSections },
  { key: 'why', label: '⭐ Keunggulan', section: 'why' as keyof AllSections },
  { key: 'pmb', label: '🎓 PMB', section: 'pmb' as keyof AllSections },
  { key: 'contact', label: '📞 Kontak', section: 'contact' as keyof AllSections },
  { key: 'footer', label: '🔗 Footer', section: 'footer' as keyof AllSections },
] as const;

// ─── Main component ───────────────────────────────────────────────────────────

export default function SettingsManager() {
  const [activeTab, setActiveTab] = useState<string>('scheduler');
  const [langTab, setLangTab] = useState<'id' | 'en'>('id');
  const [forms, setForms] = useState<AllSections>(buildDefaults());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load saved settings from API on mount and merge with defaults
  useEffect(() => {
    api.settings.getAll()
      .then(data => {
        if (!data) return;
        setForms(prev => {
          const next = { ...prev };
          for (const sectionKey of Object.keys(data) as Array<keyof AllSections>) {
            const stored = data[sectionKey];
            if (stored && stored.id && stored.en) {
              (next as Record<string, unknown>)[sectionKey] = {
                id: { ...(prev[sectionKey]?.id ?? {}), ...stored.id },
                en: { ...(prev[sectionKey]?.en ?? {}), ...stored.en },
              };
            }
          }
          return next;
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateSection = useCallback(<K extends keyof AllSections>(
    key: K,
    lang: 'id' | 'en',
    value: AllSections[K]['id'],
  ) => {
    setForms(prev => ({
      ...prev,
      [key]: { ...prev[key], [lang]: value },
    }));
    setSaved(null);
  }, []);

  const handleSave = async (key: keyof AllSections) => {
    setSaving(key);
    setErrors(prev => ({ ...prev, [key]: '' }));
    try {
      await api.settings.save(key, forms[key].id, forms[key].en);
      setSaved(key);
      setTimeout(() => setSaved(null), 2500);
    } catch (e) {
      setErrors(prev => ({ ...prev, [key]: e instanceof Error ? e.message : 'Gagal menyimpan' }));
    } finally {
      setSaving(null);
    }
  };

  const handleTranslate = async (key: keyof AllSections) => {
    setTranslating(true);
    try {
      const res = await api.settings.translate(key, forms[key].id);
      if (res.enContent) {
        setForms(prev => ({
          ...prev,
          [key]: { ...prev[key], en: { ...prev[key].en, ...(res.enContent as object) } },
        }));
      }
    } catch (e) {
      setErrors(prev => ({ ...prev, [key]: e instanceof Error ? e.message : 'Gagal menerjemahkan' }));
    } finally {
      setTranslating(false);
    }
  };

  if (loading) return <Spinner />;

  const currentTab = TABS.find(t => t.key === activeTab);
  const sectionKey = currentTab?.section as keyof AllSections | null | undefined;

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>Pengaturan</h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Kelola konten landing page dan konfigurasi sistem</p>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '1.5rem', background: '#f8fafc', padding: '0.35rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => { setActiveTab(tab.key); setLangTab('id'); }}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === tab.key ? 'white' : 'transparent',
              fontWeight: 700,
              fontSize: '0.8rem',
              color: activeTab === tab.key ? '#0f2d6b' : '#64748b',
              cursor: 'pointer',
              boxShadow: activeTab === tab.key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content card */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem' }}>

          {activeTab === 'scheduler' && <SchedulerTab />}

          {sectionKey && sectionKey !== null && (
            <>
              {sectionKey !== 'contact' && (
                <LangBar
                  activeLang={langTab}
                  onSwitch={setLangTab}
                  onTranslate={() => handleTranslate(sectionKey)}
                  translating={translating}
                />
              )}

              {sectionKey === 'hero' && (
                <HeroTab
                  data={forms.hero[langTab]}
                  onChange={v => updateSection('hero', langTab, v)}
                />
              )}
              {sectionKey === 'about' && (
                <AboutTab
                  data={forms.about[langTab]}
                  onChange={v => updateSection('about', langTab, v)}
                />
              )}
              {sectionKey === 'visiMisi' && (
                <VisiMisiTab
                  data={forms.visiMisi[langTab]}
                  onChange={v => updateSection('visiMisi', langTab, v)}
                />
              )}
              {sectionKey === 'why' && (
                <WhyTab
                  data={forms.why[langTab]}
                  onChange={v => updateSection('why', langTab, v)}
                />
              )}
              {sectionKey === 'pmb' && (
                <PmbTab
                  data={forms.pmb[langTab]}
                  onChange={v => updateSection('pmb', langTab, v)}
                />
              )}
              {sectionKey === 'contact' && (
                <>
                  <div style={{ marginBottom: '1rem', padding: '0.6rem 0.85rem', background: '#f0f9ff', borderRadius: '8px', fontSize: '0.78rem', color: '#0369a1', border: '1px solid #bae6fd' }}>
                    Info kontak berlaku untuk semua bahasa — hanya perlu diisi sekali.
                  </div>
                  <ContactTab
                    data={forms.contact.id}
                    onChange={v => { updateSection('contact', 'id', v); updateSection('contact', 'en', v); }}
                  />
                </>
              )}
              {sectionKey === 'footer' && (
                <FooterTab
                  data={forms.footer[langTab]}
                  onChange={v => updateSection('footer', langTab, v)}
                />
              )}

              {errors[sectionKey] && <div style={{ marginTop: '0.75rem' }}><ErrorBox msg={errors[sectionKey]} /></div>}

              <div style={{ marginTop: '1.25rem' }}>
                <SaveBar
                  saving={saving === sectionKey}
                  saved={saved === sectionKey}
                  onSave={() => handleSave(sectionKey)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
