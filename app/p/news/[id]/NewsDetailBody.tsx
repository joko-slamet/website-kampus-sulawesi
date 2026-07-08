"use client";

import { useState } from "react";
import { resolveImage } from "../../../lib/imageUrl";
import type { NewsForPage } from "./page";

const CATEGORY_COLORS: Record<string, string> = {
  Akademik: "#2563eb",
  Keuangan: "#16a34a",
  Kemahasiswaan: "#7c3aed",
  Kepegawaian: "#0891b2",
  Penelitian: "#d97706",
  Kegiatan: "#db2777",
  Umum: "#64748b",
};
function catColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? "#64748b";
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Makassar",
  });
}

function fmtDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Makassar",
  });
}

interface Props {
  news: NewsForPage;
  related: NewsForPage[];
}

function CopyButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.5rem 1rem",
        background: copied ? "#10b981" : "var(--bg-muted)",
        color: copied ? "#ffffff" : "var(--text-body)",
        borderRadius: "999px",
        border: "none",
        fontSize: "0.8rem",
        fontWeight: 700,
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      {copied ? "✓ Tersalin!" : "🔗 Salin Link"}
    </button>
  );
}

export default function NewsDetailBody({ news, related }: Props) {
  const color = catColor(news.category);

  return (
    <>
      {/* Hero */}
      <section
        style={{
          background: "var(--bg)",
          padding: "7rem 1.5rem 0",
          position: "relative",
        }}
      >
        <div
          style={{ maxWidth: "1280px", margin: "0 auto", position: "relative" }}
        >
          {/* Breadcrumb */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1.75rem",
              fontSize: "0.8rem",
              flexWrap: "wrap",
            }}
          >
            <a
              href="/"
              style={{ color: "var(--text-subtle)", textDecoration: "none" }}
            >
              Beranda
            </a>
            <span style={{ color: "var(--border)" }}>›</span>
            <a
              href="/news"
              style={{ color: "var(--text-subtle)", textDecoration: "none" }}
            >
              Berita & Pengumuman
            </a>
            <span style={{ color: "var(--border)" }}>›</span>
            <span
              style={{
                color: "var(--text-primary)",
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {news.title}
            </span>
          </nav>

          {/* Badges */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              marginBottom: "1.25rem",
              flexWrap: "wrap",
            }}
          >
            {news.type === "announcement" ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  padding: "0.3rem 0.85rem",
                  background: "#fffbeb",
                  color: "#b45309",
                  border: "1px solid #fde68a",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                }}
              >
                📢 Pengumuman
              </span>
            ) : (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  padding: "0.3rem 0.85rem",
                  background: "#eff6ff",
                  color: "#1d4ed8",
                  border: "1px solid #bfdbfe",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                }}
              >
                📰 Berita
              </span>
            )}
            <span
              style={{
                padding: "0.3rem 0.85rem",
                background: catColor(news.category) + "12",
                color: catColor(news.category),
                border: `1px solid ${catColor(news.category)}30`,
                borderRadius: "999px",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              {news.category}
            </span>
            {news.pinned && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  padding: "0.3rem 0.85rem",
                  background: "#fef3c7",
                  color: "#d97706",
                  border: "1px solid #fde68a",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                }}
              >
                📌 Disematkan
              </span>
            )}
            {news.tag && (
              <span
                style={{
                  padding: "0.3rem 0.85rem",
                  background: "#fff7ed",
                  color: "#d97706",
                  border: "1px solid #fed7aa",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                }}
              >
                {news.tag}
              </span>
            )}
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
              fontWeight: 800,
              color: "var(--text-heading)",
              lineHeight: 1.25,
              marginBottom: "1.5rem",
            }}
          >
            {news.title}
          </h1>

          {/* Meta */}
          <div
            style={{
              display: "flex",
              gap: "0.65rem",
              flexWrap: "wrap",
              marginBottom: "2.5rem",
            }}
          >
            {[
              { icon: "📅", text: fmtDate(news.createdAt) },
              {
                icon: "👁",
                text: `${news.views.toLocaleString("id-ID")} dilihat`,
              },
            ].map((m) => (
              <span
                key={m.text}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.35rem 0.85rem",
                  background: "var(--bg-muted)",
                  border: "1px solid var(--border)",
                  borderRadius: "999px",
                  fontSize: "0.78rem",
                  color: "var(--text-muted)",
                }}
              >
                {m.icon} {m.text}
              </span>
            ))}
          </div>

          {/* Hero image — max height capped, flexible width, no cropping */}
          {news.image && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                maxHeight: "520px",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveImage(news.image)}
                alt={news.title}
                style={{
                  maxWidth: "100%",
                  maxHeight: "520px",
                  width: "auto",
                  height: "auto",
                  display: "block",
                  borderRadius: "20px",
                }}
              />
            </div>
          )}
        </div>
      </section>

      {/* Content section */}
      <section
        style={{ background: "var(--bg-muted)", padding: "2.5rem 1.5rem 6rem" }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "grid",
            gap: "2rem",
          }}
          className="news-detail-layout"
        >
          {/* Main content */}
          <article>
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "20px",
                padding: "2.5rem",
              }}
            >
              {news.content ? (
                <div
                  className="news-content"
                  dangerouslySetInnerHTML={{ __html: news.content }}
                />
              ) : (
                <p
                  style={{
                    color: "#94a3b8",
                    fontStyle: "italic",
                    textAlign: "center",
                    padding: "3rem 0",
                  }}
                >
                  Konten belum tersedia.
                </p>
              )}
            </div>

            {/* Share bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                flexWrap: "wrap",
                marginTop: "1.25rem",
                padding: "1.25rem 1.5rem",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
              }}
            >
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  marginRight: "0.25rem",
                }}
              >
                Bagikan:
              </span>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(news.title + " " + (typeof window !== "undefined" ? window.location.href : ""))}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.5rem 1rem",
                  background: "#25d366",
                  color: "white",
                  borderRadius: "999px",
                  textDecoration: "none",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.948-1.42A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                </svg>
                WhatsApp
              </a>
              <CopyButton title={news.title} />
              <a
                href="/news"
                style={{
                  marginLeft: "auto",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "0.8rem",
                  color: "var(--text-primary)",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                ← Semua Berita
              </a>
            </div>
          </article>

          {/* Sidebar */}
          <aside>
            {/* Info card */}
            <div
              style={{
                background:
                  news.type === "announcement"
                    ? "linear-gradient(135deg, #78350f 0%, #b45309 100%)"
                    : "linear-gradient(135deg, #0f2d6b 0%, #1a4aad 100%)",
                borderRadius: "20px",
                padding: "1.75rem",
                color: "white",
                marginBottom: "1.25rem",
                position: "sticky",
                top: "5.5rem",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                {news.type === "announcement" ? "📢" : "📰"}
              </div>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 800,
                  marginBottom: "0.5rem",
                  lineHeight: 1.3,
                }}
              >
                {news.type === "announcement"
                  ? "Pengumuman Resmi"
                  : "Berita Kampus"}
              </h3>
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "rgba(255,255,255,0.72)",
                  lineHeight: 1.6,
                  marginBottom: "1.25rem",
                }}
              >
                {news.type === "announcement"
                  ? "Informasi ini merupakan pengumuman resmi dari STIA YPA-AH MAKASSAR."
                  : "Temukan informasi dan liputan kegiatan kampus STIA YPA-AH MAKASSAR."}
              </p>

              {/* Meta details */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                  padding: "1rem",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  marginBottom: "1.25rem",
                }}
              >
                {[
                  { label: "Kategori", value: news.category },
                  { label: "Tanggal", value: fmtDateShort(news.createdAt) },
                  {
                    label: "Dilihat",
                    value: `${news.views.toLocaleString("id-ID")} kali`,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.72rem",
                        color: "rgba(255,255,255,0.55)",
                        fontWeight: 600,
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      style={{
                        fontSize: "0.78rem",
                        color: "white",
                        fontWeight: 700,
                      }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
                {news.tag && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.72rem",
                        color: "rgba(255,255,255,0.55)",
                        fontWeight: 600,
                      }}
                    >
                      Tag
                    </span>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        padding: "0.2rem 0.55rem",
                        background: "rgba(245,166,35,0.3)",
                        color: "#fbbf24",
                        borderRadius: "999px",
                        fontWeight: 700,
                      }}
                    >
                      {news.tag}
                    </span>
                  </div>
                )}
              </div>

              <a
                href="/#daftar"
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "0.85rem",
                  background:
                    "linear-gradient(135deg, #f5a623 0%, #fbbf24 100%)",
                  color: "#0f2d6b",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  borderRadius: "12px",
                  textDecoration: "none",
                }}
              >
                Daftar Sekarang
              </a>

              {/* Related */}
              {related.length > 0 && (
                <div
                  style={{
                    marginTop: "1.5rem",
                    paddingTop: "1.5rem",
                    borderTop: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: 800,
                      color: "rgba(255,255,255,0.85)",
                      marginBottom: "0.85rem",
                    }}
                  >
                    Konten Terkait
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.65rem",
                    }}
                  >
                    {related.map((item) => (
                      <a
                        key={item.id}
                        href={`/p/news/${item.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <div
                          style={{
                            padding: "0.75rem",
                            background: "rgba(255,255,255,0.08)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: "10px",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) =>
                            ((
                              e.currentTarget as HTMLDivElement
                            ).style.background = "rgba(255,255,255,0.15)")
                          }
                          onMouseLeave={(e) =>
                            ((
                              e.currentTarget as HTMLDivElement
                            ).style.background = "rgba(255,255,255,0.08)")
                          }
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.4rem",
                              marginBottom: "0.3rem",
                            }}
                          >
                            <span style={{ fontSize: "0.65rem" }}>
                              {item.type === "announcement" ? "📢" : "📰"}
                            </span>
                            <span
                              style={{
                                fontSize: "0.62rem",
                                color: "rgba(255,255,255,0.5)",
                                fontWeight: 600,
                              }}
                            >
                              {item.category}
                            </span>
                          </div>
                          <p
                            style={{
                              fontSize: "0.78rem",
                              fontWeight: 600,
                              color: "white",
                              lineHeight: 1.4,
                              margin: 0,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {item.title}
                          </p>
                          <p
                            style={{
                              fontSize: "0.65rem",
                              color: "rgba(255,255,255,0.45)",
                              margin: "0.25rem 0 0",
                            }}
                          >
                            {fmtDateShort(item.createdAt)}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                  <a
                    href="/news"
                    style={{
                      display: "block",
                      textAlign: "center",
                      marginTop: "0.85rem",
                      fontSize: "0.78rem",
                      color: "rgba(255,255,255,0.55)",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    Lihat semua →
                  </a>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      <style>{`
        .news-detail-layout { grid-template-columns: 1fr 300px; }
        @media (max-width: 960px) { .news-detail-layout { grid-template-columns: 1fr !important; } }

        .news-content { font-size: 1rem; line-height: 1.85; color: var(--text-body); }
        .news-content h2 { font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin: 2rem 0 0.75rem; line-height: 1.3; }
        .news-content h3 { font-size: 1.1rem; font-weight: 700; color: var(--text-heading); margin: 1.5rem 0 0.6rem; }
        .news-content h4 { font-size: 1rem; font-weight: 700; color: var(--text-heading); margin: 1.25rem 0 0.5rem; }
        .news-content p { margin-bottom: 1rem; }
        .news-content ul, .news-content ol { padding-left: 1.5rem; margin-bottom: 1rem; }
        .news-content li { margin-bottom: 0.4rem; line-height: 1.7; }
        .news-content blockquote {
          border-left: 3px solid var(--text-primary); padding: 0.65rem 1.25rem;
          margin: 1.5rem 0; color: var(--text-body); font-style: italic;
          background: var(--bg-muted); border-radius: 0 10px 10px 0;
        }
        .news-content hr { border: none; border-top: 1px solid var(--border); margin: 1.75rem 0; }
        .news-content strong { font-weight: 700; color: var(--text-heading); }
        .news-content em { font-style: italic; }
        .news-content a { color: var(--text-primary); text-decoration: underline; }
        .news-content img { max-width: 100%; border-radius: 10px; margin: 1rem 0; }
      `}</style>
    </>
  );
}
