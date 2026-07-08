import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingCTA from "../components/FloatingCTA";
import ArticlesList from "./ArticlesList";
import ArtikelHero from "./ArtikelHero";

export const metadata: Metadata = {
  title: "Artikel & Insight",
  description:
    "Tips kuliah, info karier, dan beasiswa — konten edukatif untuk calon dan mahasiswa aktif STIA YPA-AH MAKASSAR. Diperbarui setiap hari.",
  alternates: { canonical: "https://stiaahmakassar.ac.id/article" },
  openGraph: {
    title: "Artikel & Insight | STIA YPA-AH MAKASSAR",
    description:
      "Tips kuliah, info karier, dan beasiswa untuk mahasiswa STIA YPA-AH MAKASSAR.",
    url: "https://stiaahmakassar.ac.id/article",
  },
};

export default function ArtikelPage() {
  return (
    <>
      <Navbar variant="dark" />
      <main>
        <ArtikelHero />
        <section
          style={{ background: "var(--bg-muted)", padding: "4rem 1.5rem 6rem" }}
        >
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <ArticlesList />
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
