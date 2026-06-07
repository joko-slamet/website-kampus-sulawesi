import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientProviders from "./components/ClientProviders";
import GoogleAnalytics from "./components/GoogleAnalytics";
import SchemaOrg from "./components/SchemaOrg";

export const metadata: Metadata = {
  title: {
    default: 'STIA YPA-AH "Abdul Haris" Makassar — Sekolah Tinggi Ilmu Administrasi',
    template: '%s | STIA Abdul Haris Makassar',
  },
  description:
    'STIA YPA-AH "Abdul Haris" Makassar adalah perguruan tinggi terakreditasi BAIK oleh BAN-PT yang mencetak sarjana profesional di bidang Ilmu Administrasi Negara (Publik) dan Ilmu Administrasi Niaga (Bisnis). Beroperasi sejak 2004, berlokasi di Makassar, Sulawesi Selatan.',
  keywords: [
    "STIA Abdul Haris Makassar",
    "STIA YPA-AH Makassar",
    "sekolah tinggi ilmu administrasi makassar",
    "kampus administrasi makassar",
    "S1 administrasi negara makassar",
    "S1 administrasi niaga makassar",
    "perguruan tinggi makassar",
    "kuliah administrasi sulawesi",
    "pendaftaran mahasiswa baru makassar",
    "akreditasi BAIK BAN-PT",
  ],
  authors: [{ name: 'STIA YPA-AH "Abdul Haris" Makassar' }],
  creator: 'STIA YPA-AH "Abdul Haris" Makassar',
  publisher: 'STIA YPA-AH "Abdul Haris" Makassar',
  metadataBase: new URL("https://stia-abdulharis.ac.id"),
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://stia-abdulharis.ac.id",
    siteName: 'STIA Abdul Haris Makassar',
    title: 'STIA YPA-AH "Abdul Haris" Makassar — Terakreditasi BAIK BAN-PT',
    description:
      'Bergabunglah bersama STIA YPA-AH "Abdul Haris" Makassar. Raih gelar Sarjana Administrasi Negara atau Niaga dengan pendidikan berkualitas, terakreditasi BAIK oleh BAN-PT, di jantung Kota Makassar.',
    images: [
      {
        url: "/hero-campus.png",
        width: 1200,
        height: 630,
        alt: 'Kampus STIA YPA-AH "Abdul Haris" Makassar',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: 'STIA Abdul Haris Makassar',
    description:
      'Perguruan tinggi administrasi terakreditasi BAIK BAN-PT di Makassar. Daftar sekarang!',
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
    canonical: "https://stia-abdulharis.ac.id",
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
      <body className="min-h-screen antialiased">
        <ClientProviders>{children}</ClientProviders>
        <SchemaOrg />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
