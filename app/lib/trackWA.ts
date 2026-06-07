const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? '';
export const WA_DEFAULT_MSG = 'Halo, saya ingin bertanya tentang informasi pendaftaran kampus STIA Abdul Haris Makassar';
export const WA_HREF = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_DEFAULT_MSG)}`;

export function trackWA(page?: string): void {
  fetch(`${BACKEND_URL}/api/whatsapp/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page: page ?? (typeof window !== 'undefined' ? window.location.pathname : '/') }),
  }).catch(() => {});
}
