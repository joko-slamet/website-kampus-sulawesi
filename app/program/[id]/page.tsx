import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { programs } from '../../data/programs';
import { lecturers } from '../../data/lecturers';
import ProgramDetail from './ProgramDetail';

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
    alternates: { canonical: `https://stia-abdulharis.ac.id/program/${id}` },
    openGraph: {
      title: `${program.name} — STIA Abdul Haris Makassar`,
      description: program.description,
    },
  };
}

export default async function ProgramDetailPage({ params }: Props) {
  const { id } = await params;
  const program = programs.find(p => p.id === id);
  if (!program) notFound();

  const programLecturers = lecturers[id] ?? [];

  return (
    <>
      <Navbar variant="dark" />
      <main>
        <ProgramDetail program={program} lecturers={programLecturers} />
      </main>
      <Footer />
    </>
  );
}
