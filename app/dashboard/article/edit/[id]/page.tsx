import type { Metadata } from 'next';
import ArtikelForm from '../../ArtikelForm';

export const metadata: Metadata = { title: 'Edit Artikel' };

type Props = { params: Promise<{ id: string }> };

export default async function EditArtikelPage({ params }: Props) {
  const { id } = await params;
  return <ArtikelForm mode="edit" articleId={id} />;
}
