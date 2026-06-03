import type { Metadata } from 'next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingCTA from '../components/FloatingCTA';
import ArticlesList from './ArticlesList';
import ArtikelHero from './ArtikelHero';

export const metadata: Metadata = {
  title: 'Artikel & Insight',
  description: 'Tips kuliah, dunia IT, info karier, dan beasiswa — konten edukatif untuk calon dan mahasiswa aktif STIMIK Nusantara Sulawesi. Diperbarui setiap hari.',
  alternates: { canonical: 'https://stimik-nusantara.ac.id/artikel' },
  openGraph: {
    title: 'Artikel & Insight | STIMIK Nusantara Sulawesi',
    description: 'Tips kuliah, dunia IT, info karier, dan beasiswa untuk mahasiswa STIMIK Nusantara.',
    url: 'https://stimik-nusantara.ac.id/artikel',
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
