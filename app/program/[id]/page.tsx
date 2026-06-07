import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { programs } from '../../data/programs';
import { lecturers } from '../../data/lecturers';
import ProgramDetail from './ProgramDetail';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://stiaabdulharis.ac.id';

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return programs.map(p => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const program = programs.find(p => p.id === id);
  if (!program) return {};
  return {
    title: `${program.name} — STIA Abdul Haris Makassar`,
    description: program.description,
    alternates: { canonical: `${BASE_URL}/program/${id}` },
    openGraph: {
      title: `${program.name} — STIA Abdul Haris Makassar`,
      description: program.description,
      url: `${BASE_URL}/program/${id}`,
    },
  };
}

export default async function ProgramDetailPage({ params }: Props) {
  const { id } = await params;
  const program = programs.find(p => p.id === id);
  if (!program) notFound();

  const programLecturers = lecturers[id] ?? [];

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: program.name,
    description: program.description,
    url: `${BASE_URL}/program/${id}`,
    educationalCredentialAwarded: program.degreeTitle,
    provider: {
      '@type': 'CollegeOrUniversity',
      '@id': `${BASE_URL}/#organization`,
      name: 'STIA YPA-AH "Abdul Haris" Makassar',
    },
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Program Studi', item: `${BASE_URL}/#program` },
      { '@type': 'ListItem', position: 3, name: program.name, item: `${BASE_URL}/program/${id}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Navbar variant="dark" />
      <main>
        <ProgramDetail program={program} lecturers={programLecturers} />
      </main>
      <Footer />
    </>
  );
}
