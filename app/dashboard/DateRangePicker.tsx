'use client';

import { useState, useRef, useEffect } from 'react';

export type PresetKey = 'kemarin' | 'hari-ini' | 'bulan-ini' | 'bulan-lalu' | '7-hari' | '30-hari' | '90-hari' | 'custom';
export interface DateRange { from: Date; to: Date }

const PRESETS: { key: PresetKey; label: string }[] = [
  { key: 'kemarin', label: 'Kemarin' },
  { key: 'hari-ini', label: 'Hari ini' },
  { key: 'bulan-ini', label: 'Bulan ini' },
  { key: 'bulan-lalu', label: 'Bulan lalu' },
  { key: '7-hari', label: '7 Hari Terakhir' },
  { key: '30-hari', label: '30 Hari Terakhir' },
  { key: '90-hari', label: '90 Hari Terakhir' },
];

const ID_MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const ID_MONTHS_SHORT = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];
const ID_DAYS = ['Sen','Sel','Rab','Kam','Jum','Sab','Min'];

function sod(d: Date): Date { const r = new Date(d); r.setHours(0,0,0,0); return r; }
function eod(d: Date): Date { const r = new Date(d); r.setHours(23,59,59,999); return r; }
function sameDay(a: Date, b: Date) {
  return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
}

export function getPresetRange(key: PresetKey): DateRange {
  const today = sod(new Date());
  switch (key) {
    case 'kemarin': { const d = new Date(today); d.setDate(d.getDate()-1); return { from: d, to: eod(new Date(d)) }; }
    case 'hari-ini': return { from: today, to: eod(today) };
    case 'bulan-ini': return { from: new Date(today.getFullYear(), today.getMonth(), 1), to: eod(today) };
    case 'bulan-lalu': return {
      from: new Date(today.getFullYear(), today.getMonth()-1, 1),
      to: eod(new Date(today.getFullYear(), today.getMonth(), 0)),
    };
    case '7-hari': { const f = new Date(today); f.setDate(f.getDate()-6); return { from: f, to: eod(today) }; }
    case '30-hari': { const f = new Date(today); f.setDate(f.getDate()-29); return { from: f, to: eod(today) }; }
    case '90-hari': { const f = new Date(today); f.setDate(f.getDate()-89); return { from: f, to: eod(today) }; }
    default: return { from: today, to: eod(today) };
  }
}

function MonthGrid({ year, month, rangeFrom, rangeTo, hoverDate, onDayClick, onDayHover }: {
  year: number; month: number;
  rangeFrom: Date | null; rangeTo: Date | null; hoverDate: Date | null;
  onDayClick: (d: Date) => void; onDayHover: (d: Date | null) => void;
}) {
  const today = sod(new Date());
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;

  // Effective range (include hover preview when picking second date)
  let effFrom = rangeFrom;
  let effTo = rangeTo;
  if (rangeFrom && !rangeTo && hoverDate) {
    if (hoverDate >= rangeFrom) { effTo = hoverDate; }
    else { effFrom = hoverDate; effTo = rangeFrom; }
  }
  const isSameEndpoints = effFrom && effTo ? sameDay(effFrom, effTo) : false;

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div style={{ minWidth: 220 }}>
      <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.6rem', color: '#0f172a' }}>
        {ID_MONTHS[month]} {year}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 32px)' }}>
        {ID_DAYS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.68rem', fontWeight: 600, color: '#94a3b8', paddingBottom: 6 }}>
            {d}
          </div>
        ))}
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} style={{ height: 32 }} />;
          const date = new Date(year, month, day);
          const isToday = sameDay(date, today);
          const isStart = effFrom ? sameDay(date, effFrom) : false;
          const isEnd = effTo ? sameDay(date, effTo) : false;
          const isEndpoint = isStart || isEnd;
          const isInRange = effFrom && effTo && !isSameEndpoints
            ? date > effFrom && date < effTo
            : false;
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;

          // Half-cell gradient for start/end to bridge with middle cells
          let cellBg = 'transparent';
          if (!isSameEndpoints) {
            if (isStart && effTo) cellBg = 'linear-gradient(to right, transparent 50%, #dbeafe 50%)';
            else if (isEnd && effFrom) cellBg = 'linear-gradient(to left, transparent 50%, #dbeafe 50%)';
            else if (isInRange) cellBg = '#dbeafe';
          }

          const circleBg = isEndpoint ? '#2563eb' : (isToday ? '#2563eb' : 'transparent');
          const textColor = isEndpoint ? '#fff' : (isToday ? '#fff' : (isWeekend ? '#ef4444' : '#0f172a'));

          return (
            <div
              key={idx}
              onClick={() => onDayClick(date)}
              onMouseEnter={() => onDayHover(date)}
              onMouseLeave={() => onDayHover(null)}
              style={{ height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: cellBg, cursor: 'pointer' }}
            >
              <span style={{
                width: 28, height: 28, borderRadius: '50%',
                background: circleBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.78rem', fontWeight: isEndpoint || isToday ? 700 : 400,
                color: textColor,
              }}>
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface Props {
  defaultPreset?: PresetKey;
  onChange: (range: DateRange) => void;
}

export function DateRangePicker({ defaultPreset = '30-hari', onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [appliedPreset, setAppliedPreset] = useState<PresetKey>(defaultPreset);
  const [appliedRange, setAppliedRange] = useState<DateRange | null>(null);

  // Temp state (inside the open dropdown, before Terapkan)
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>(defaultPreset);
  const [tempFrom, setTempFrom] = useState<Date | null>(null);
  const [tempTo, setTempTo] = useState<Date | null>(null);
  const [pickingSecond, setPickingSecond] = useState(false);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  // Calendar navigation (left month)
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => {
    const r = getPresetRange(defaultPreset);
    const m = r.to.getMonth();
    return m > 0 ? m - 1 : 0;
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Emit initial range on mount
  useEffect(() => {
    const range = getPresetRange(defaultPreset);
    setAppliedRange(range);
    onChange(range);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const setCalendarToRange = (range: DateRange) => {
    const m = range.to.getMonth();
    const y = range.to.getFullYear();
    if (m > 0) { setViewYear(y); setViewMonth(m - 1); }
    else { setViewYear(y - 1); setViewMonth(11); }
  };

  const handleOpen = () => {
    if (!open) {
      // Reset temp state to currently applied
      setSelectedPreset(appliedPreset);
      const range = appliedRange ?? getPresetRange(appliedPreset);
      setTempFrom(sod(range.from));
      setTempTo(sod(range.to));
      setPickingSecond(false);
      setHoverDate(null);
      setCalendarToRange(range);
    }
    setOpen(o => !o);
  };

  const handlePresetClick = (key: PresetKey) => {
    setSelectedPreset(key);
    const range = getPresetRange(key);
    setTempFrom(sod(range.from));
    setTempTo(sod(range.to));
    setPickingSecond(false);
    setHoverDate(null);
    setCalendarToRange(range);
  };

  const handleDayClick = (date: Date) => {
    if (!pickingSecond) {
      setTempFrom(date);
      setTempTo(null);
      setPickingSecond(true);
      setSelectedPreset('custom');
    } else {
      const [f, t] = date < tempFrom! ? [date, tempFrom!] : [tempFrom!, date];
      setTempFrom(f);
      setTempTo(t);
      setPickingSecond(false);
      setSelectedPreset('custom');
    }
  };

  const handleApply = () => {
    if (!tempFrom || !tempTo) return;
    const range: DateRange = { from: tempFrom, to: eod(tempTo) };
    setAppliedPreset(selectedPreset);
    setAppliedRange(range);
    onChange(range);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handlePrev = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const handleNext = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const secondMonth = viewMonth === 11 ? 0 : viewMonth + 1;
  const secondYear = viewMonth === 11 ? viewYear + 1 : viewYear;

  // Button label
  const presetLabel = PRESETS.find(p => p.key === appliedPreset)?.label;
  const buttonLabel = appliedPreset === 'custom' && appliedRange
    ? `${appliedRange.from.getDate()} ${ID_MONTHS_SHORT[appliedRange.from.getMonth()]} – ${appliedRange.to.getDate()} ${ID_MONTHS_SHORT[appliedRange.to.getMonth()]}`
    : (presetLabel ?? '30 Hari Terakhir');

  const navBtnStyle: React.CSSProperties = {
    background: 'none', border: '1px solid #e2e8f0', borderRadius: 6,
    width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: '#64748b', flexShrink: 0,
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Trigger button */}
      <button
        onClick={handleOpen}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 0.875rem',
          background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px',
          cursor: 'pointer', fontSize: '0.825rem', fontWeight: 600, color: '#0f172a',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        {buttonLabel}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round">
          {open ? <path d="M18 15l-6-6-6 6"/> : <path d="M6 9l6 6 6-6"/>}
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 100,
          background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
          display: 'flex', overflow: 'hidden', minWidth: 580,
        }}>
          {/* Left: presets */}
          <div style={{ width: 156, borderRight: '1px solid #f1f5f9', padding: '0.5rem 0', flexShrink: 0 }}>
            {PRESETS.map(p => (
              <button
                key={p.key}
                onClick={() => handlePresetClick(p.key)}
                style={{
                  width: '100%', textAlign: 'left',
                  padding: '0.55rem 1rem',
                  background: selectedPreset === p.key ? '#2563eb' : 'transparent',
                  color: selectedPreset === p.key ? 'white' : '#374151',
                  border: 'none', cursor: 'pointer',
                  fontSize: '0.825rem', fontWeight: selectedPreset === p.key ? 600 : 400,
                  transition: 'background 0.15s',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Right: calendar */}
          <div style={{ flex: 1, padding: '1rem 1.25rem', minWidth: 0 }}>
            {/* Navigation row */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              {/* Left calendar with prev button */}
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                <button onClick={handlePrev} style={navBtnStyle}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <MonthGrid
                  year={viewYear} month={viewMonth}
                  rangeFrom={tempFrom} rangeTo={tempTo} hoverDate={hoverDate}
                  onDayClick={handleDayClick} onDayHover={setHoverDate}
                />
              </div>
              {/* Right calendar with next button */}
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                <MonthGrid
                  year={secondYear} month={secondMonth}
                  rangeFrom={tempFrom} rangeTo={tempTo} hoverDate={hoverDate}
                  onDayClick={handleDayClick} onDayHover={setHoverDate}
                />
                <button onClick={handleNext} style={navBtnStyle}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
              <button
                onClick={handleCancel}
                style={{ padding: '0.45rem 1.25rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontSize: '0.825rem', fontWeight: 600, color: '#374151' }}
              >
                Batal
              </button>
              <button
                onClick={handleApply}
                disabled={!tempFrom || !tempTo}
                style={{ padding: '0.45rem 1.25rem', background: '#2563eb', border: 'none', borderRadius: '8px', cursor: !tempFrom || !tempTo ? 'not-allowed' : 'pointer', fontSize: '0.825rem', fontWeight: 600, color: 'white', opacity: !tempFrom || !tempTo ? 0.5 : 1 }}
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
