'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';

interface Lead {
  id: string;
  name: string;
  phone: string;
  program: string | null;
  school: string | null;
  message: string | null;
  source: string;
  createdAt: string;
}

function fmtDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Asia/Makassar',
  });
}

const PAGE_SIZE = 20;

export default function LeadsManager() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await api.leads.list(p, PAGE_SIZE);
      setLeads(res.data as Lead[]);
      setTotal(res.total);
    } catch { /* noop */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page); }, [load, page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.25rem' }}>Leads & Inquiry</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {loading ? '…' : `${total} total inquiry masuk`}
        </p>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) 130px minmax(0,1fr) minmax(0,1fr) 160px',
          padding: '0.75rem 1.25rem', background: 'var(--bg-muted)', borderBottom: '1px solid var(--border)',
          fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em',
        }} className="leads-header">
          <span>NAMA</span>
          <span>NO. HP</span>
          <span>PROGRAM</span>
          <span>ASAL SEKOLAH</span>
          <span>WAKTU</span>
        </div>

        {loading && (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-subtle)' }}>
            <div style={{ width: '28px', height: '28px', border: '3px solid #e2e8f0', borderTopColor: '#0f2d6b', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 0.75rem' }} />
            <p style={{ fontSize: '0.85rem' }}>Memuat...</p>
          </div>
        )}

        {!loading && leads.length === 0 && (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-subtle)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
            <p style={{ fontWeight: 600 }}>Belum ada inquiry masuk</p>
          </div>
        )}

        {!loading && leads.map((lead, i) => (
          <div
            key={lead.id}
            style={{
              display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) 130px minmax(0,1fr) minmax(0,1fr) 160px',
              padding: '1rem 1.25rem', alignItems: 'start',
              borderBottom: i < leads.length - 1 ? '1px solid #f8fafc' : 'none',
              background: 'var(--bg-card)',
            }}
            className="leads-row"
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-muted)'}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-card)'}
          >
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-heading)', margin: '0 0 0.2rem' }}>{lead.name}</p>
              {lead.message && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {lead.message}
                </p>
              )}
            </div>
            <a
              href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}
            >
              {lead.phone}
            </a>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-body)' }}>{lead.program ?? '—'}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-body)' }}>{lead.school ?? '—'}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{fmtDateTime(lead.createdAt)}</span>
          </div>
        ))}
      </div>

      {totalPages > 1 && !loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>Halaman {page} dari {totalPages} · {total} leads</span>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {[
              { label: '‹', disabled: page === 1, action: () => setPage(p => Math.max(1, p - 1)) },
              { label: '›', disabled: page === totalPages, action: () => setPage(p => Math.min(totalPages, p + 1)) },
            ].map(btn => (
              <button key={btn.label} onClick={btn.action} disabled={btn.disabled}
                style={{ minWidth: '32px', height: '32px', padding: '0 0.4rem', borderRadius: '7px', border: '1px solid var(--border)', background: btn.disabled ? '#f8fafc' : 'white', color: btn.disabled ? '#cbd5e1' : '#374151', fontSize: '0.9rem', fontWeight: 600, cursor: btn.disabled ? 'not-allowed' : 'pointer' }}
              >{btn.label}</button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .leads-header { grid-template-columns: 1fr 130px !important; }
          .leads-header span:not(:first-child):not(:nth-child(2)) { display: none; }
          .leads-row { grid-template-columns: 1fr 130px !important; }
          .leads-row > *:not(:first-child):not(:nth-child(2)) { display: none; }
        }
      `}</style>
    </div>
  );
}
