import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "STIMIK Nusantara Sulawesi — Sekolah Tinggi Manajemen Informatika & Komputer",
    template: "%s | STIMIK Nusantara Sulawesi",
  },
  description:
    "STIMIK Nusantara Sulawesi adalah perguruan tinggi terkemuka di Sulawesi yang mencetak lulusan kompeten di bidang Informatika, Manajemen, dan Teknologi. Daftar sekarang dan raih masa depan bersama kami.",
  keywords: [
    "STIMIK Nusantara Sulawesi",
    "sekolah tinggi sulawesi",
    "kampus makassar",
    "kuliah informatika sulawesi",
    "pendaftaran mahasiswa baru",
    "perguruan tinggi sulawesi",
    "S1 informatika",
    "S1 manajemen",
    "kampus terbaik sulawesi",
  ],
  authors: [{ name: "STIMIK Nusantara Sulawesi" }],
  creator: "STIMIK Nusantara Sulawesi",
  publisher: "STIMIK Nusantara Sulawesi",
  metadataBase: new URL("https://stimik-nusantara.ac.id"),
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://stimik-nusantara.ac.id",
    siteName: "STIMIK Nusantara Sulawesi",
    title: "STIMIK Nusantara Sulawesi — Kampus Terbaik di Sulawesi",
    description:
      "Bergabunglah bersama ribuan mahasiswa di STIMIK Nusantara Sulawesi. Raih karier impianmu dengan pendidikan berkualitas tinggi di jantung Sulawesi.",
    images: [
      {
        url: "/hero-campus.png",
        width: 1200,
        height: 630,
        alt: "Kampus STIMIK Nusantara Sulawesi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "STIMIK Nusantara Sulawesi",
    description:
      "Perguruan tinggi terkemuka di Sulawesi. Daftar sekarang!",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://stimik-nusantara.ac.id",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f2d6b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
