import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientProviders from "./components/ClientProviders";
import GoogleAnalytics from "./components/GoogleAnalytics";
import SchemaOrg from "./components/SchemaOrg";
import type { SiteSettingsOverrides } from "./i18n/LanguageContext";

async function fetchSiteSettings(): Promise<SiteSettingsOverrides> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
    const res = await fetch(`${apiUrl}/api/settings`, {
      next: { revalidate: 0 },
    });
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

export const metadata: Metadata = {
  title: {
    default: "STIA YPA-AH MAKASSAR — Sekolah Tinggi Ilmu Administrasi",
    template: "%s | STIA Abdul Haris Makassar",
  },
  description:
    "STIA YPA-AH MAKASSAR adalah perguruan tinggi terakreditasi BAIK oleh BAN-PT yang mencetak sarjana profesional di bidang Ilmu Administrasi Negara (Publik) dan Ilmu Administrasi Niaga (Bisnis). Beroperasi sejak 2004, berlokasi di Makassar, Sulawesi Selatan.",
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
  authors: [{ name: "STIA YPA-AH MAKASSAR" }],
  creator: "STIA YPA-AH MAKASSAR",
  publisher: "STIA YPA-AH MAKASSAR",
  metadataBase: new URL("https://stiaahmakassar.ac.id"),
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://stiaahmakassar.ac.id",
    siteName: "STIA Abdul Haris Makassar",
    title: "STIA YPA-AH MAKASSAR — Terakreditasi BAIK BAN-PT",
    description:
      "Bergabunglah bersama STIA YPA-AH MAKASSAR. Raih gelar Sarjana Administrasi Negara atau Niaga dengan pendidikan berkualitas, terakreditasi BAIK oleh BAN-PT, di jantung Kota Makassar.",
    images: [
      {
        url: "/hero-campus.png",
        width: 1200,
        height: 630,
        alt: "Kampus STIA YPA-AH MAKASSAR",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "STIA Abdul Haris Makassar",
    description:
      "Perguruan tinggi administrasi terakreditasi BAIK BAN-PT di Makassar. Daftar sekarang!",
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
    canonical: "https://stiaahmakassar.ac.id",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f2d6b",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await fetchSiteSettings();

  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('stia_theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <ClientProviders settings={settings}>{children}</ClientProviders>
        <SchemaOrg />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
