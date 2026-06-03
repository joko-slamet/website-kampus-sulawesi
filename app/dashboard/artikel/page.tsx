import type { Metadata } from 'next';
import ArtikelManager from './ArtikelManager';

export const metadata: Metadata = { title: 'Kelola Artikel' };

export default function DashboardArtikelPage() {
  return <ArtikelManager />;
}
