"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import FloatingCTA from "../../../components/FloatingCTA";
import NewsDetailBody from "./NewsDetailBody";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://stiaahmakassar.ac.id";

export interface NewsForPage {
  id: string;
  type: "news" | "announcement";
  title: string;
  image: string | null;
  content: string | null;
  category: string;
  tag: string | null;
  pinned: boolean;
  published: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

async function fetchNews(id: string): Promise<NewsForPage | null> {
  try {
    const res = await fetch(`${API_URL}/api/news/${id}`);
    if (!res.ok) return null;
    return res.json() as Promise<NewsForPage>;
  } catch {
    return null;
  }
}

async function fetchRelated(
  category: string,
  excludeId: string,
): Promise<NewsForPage[]> {
  try {
    const qs = new URLSearchParams({ category, limit: "5" });
    const res = await fetch(`${API_URL}/api/news?${qs}`);
    if (!res.ok) return [];
    const data = (await res.json()) as { data: NewsForPage[] };
    return data.data.filter((n) => n.id !== excludeId).slice(0, 4);
  } catch {
    return [];
  }
}

export default function NewsDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [news, setNews] = useState<NewsForPage | null>(null);
  const [related, setRelated] = useState<NewsForPage[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "notfound">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    fetchNews(id).then(async (item) => {
      if (cancelled) return;
      if (!item) {
        setStatus("notfound");
        return;
      }
      setNews(item);
      const relatedItems = await fetchRelated(item.category, item.id);
      if (cancelled) return;
      setRelated(relatedItems);
      setStatus("ready");
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (status === "loading") {
    return (
      <>
        <Navbar variant="light" />
        <main>
          <div style={{ padding: "10rem 1.5rem", textAlign: "center", color: "var(--text-muted)" }}>
            Memuat...
          </div>
        </main>
        <Footer />
        <FloatingCTA />
      </>
    );
  }

  if (status === "notfound" || !news) {
    return (
      <>
        <Navbar variant="light" />
        <main>
          <div style={{ padding: "10rem 1.5rem", textAlign: "center" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.75rem" }}>
              Berita tidak ditemukan
            </h1>
            <a href="/news" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
              ← Kembali ke Berita & Pengumuman
            </a>
          </div>
        </main>
        <Footer />
        <FloatingCTA />
      </>
    );
  }

  return (
    <>
      <Navbar variant="light" />
      <main>
        <NewsDetailBody news={news} related={related} />
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
