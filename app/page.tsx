import type { Metadata } from 'next';
import Navbar from './components/Navbar';

export const metadata: Metadata = {
  alternates: { canonical: 'https://stiaabdulharis.ac.id' },
};
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import VisiMisiSection from './components/VisiMisiSection';
import ProgramsSection from './components/ProgramsSection';
import TujuanSection from './components/TujuanSection';
import WhyChooseUsSection from './components/WhyChooseUsSection';
import NewsSection from './components/NewsSection';
import ArticlesSection from './components/ArticlesSection';
import PMBSection from './components/PMBSection';
import ContactSection from './components/ContactSection';
import MapsSection from './components/MapsSection';
import Footer from './components/Footer';
import FloatingCTA from './components/FloatingCTA';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <VisiMisiSection />
        <ProgramsSection />
        <TujuanSection />
        <WhyChooseUsSection />
        <NewsSection />
        <ArticlesSection />
        <PMBSection />
        <ContactSection />
        <MapsSection />
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
