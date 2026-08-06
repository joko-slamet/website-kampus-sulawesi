import type { Metadata } from 'next';
import ArtikelForm from '../ArtikelForm';

export const metadata: Metadata = { title: 'Tulis Artikel' };

export default function TulisArtikelPage() {
  return <ArtikelForm mode="create" />;
}
