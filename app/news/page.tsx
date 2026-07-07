import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingCTA from "../components/FloatingCTA";
import NewsHero from "./NewsHero";
import NewsList from "./NewsList";

export const metadata: Metadata = {
  title: "Berita & Pengumuman - STIA Abdul Haris Makassar",
  description:
    "Informasi terkini, pengumuman resmi, dan liputan kegiatan kampus STIA YPA-AH Abdul Haris Makassar.",
  alternates: { canonical: "https://stiaahmakassar.ac.id/news" },
  openGraph: {
    title: "Berita & Pengumuman - STIA Abdul Haris Makassar",
    description: "Informasi terkini dan pengumuman resmi kampus.",
    url: "https://stiaahmakassar.ac.id/news",
    type: "website",
  },
};

export default function BeritaPage() {
  return (
    <>
      <Navbar variant="dark" />
      <main>
        <NewsHero />
        <section
          style={{ background: "var(--bg-muted)", padding: "3rem 1.5rem 6rem" }}
        >
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <NewsList />
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
