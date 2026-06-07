import type { Metadata } from 'next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingCTA from '../components/FloatingCTA';
import ArticlesList from './ArticlesList';
import ArtikelHero from './ArtikelHero';

export const metadata: Metadata = {
  title: 'Artikel & Insight',
  description: 'Tips kuliah, info karier, dan beasiswa — konten edukatif untuk calon dan mahasiswa aktif STIA Abdul Haris Makassar. Diperbarui setiap hari.',
  alternates: { canonical: 'https://stiaabdulharis.ac.id/artikel' },
  openGraph: {
    title: 'Artikel & Insight | STIA Abdul Haris Makassar',
    description: 'Tips kuliah, info karier, dan beasiswa untuk mahasiswa STIA Abdul Haris Makassar.',
    url: 'https://stiaabdulharis.ac.id/artikel',
  },
};

export default function ArtikelPage() {
  return (
    <>
      <Navbar variant="dark" />
      <main>
        <ArtikelHero />
        <section style={{ background: '#f8fafc', padding: '4rem 1.5rem 6rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <ArticlesList />
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
