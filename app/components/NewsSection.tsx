"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { resolveImage } from "../lib/imageUrl";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://stiaahmakassar.ac.id";

interface NewsItem {
  id: string;
  type: "news" | "announcement";
  title: string;
  image: string | null;
  content: string | null;
  category: string;
  tag: string | null;
  pinned: boolean;
  views: number;
  createdAt: string;
}

function stripHtml(html: string | null, maxLen = 130): string {
  if (!html) return "";
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > maxLen ? text.slice(0, maxLen) + "..." : text;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Makassar",
  });
}

const CATEGORY_COLORS: Record<string, string> = {
  Akademik: "#2563eb",
  Keuangan: "#16a34a",
  Kemahasiswaan: "#7c3aed",
  Kepegawaian: "#0891b2",
  Penelitian: "#d97706",
  Kegiatan: "#db2777",
  Umum: "#64748b",
};

function getCategoryColor(cat: string): string {
  return CATEGORY_COLORS[cat] ?? "#64748b";
}

function TypeBadge({
  type,
  pinned,
}: {
  type: "news" | "announcement";
  pinned: boolean;
}) {
  const { t } = useLanguage();
  return (
    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
      {type === "announcement" ? (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            padding: "0.22rem 0.65rem",
            borderRadius: "999px",
            background: "#fffbeb",
            color: "#b45309",
            border: "1px solid #fde68a",
            fontSize: "0.7rem",
            fontWeight: 700,
          }}
        >
          {t.news.typeBadgeAnnouncement}
        </span>
      ) : (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            padding: "0.22rem 0.65rem",
            borderRadius: "999px",
            background: "#eff6ff",
            color: "#1d4ed8",
            border: "1px solid #bfdbfe",
            fontSize: "0.7rem",
            fontWeight: 700,
          }}
        >
          {t.news.typeBadgeNews}
        </span>
      )}
      {pinned && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.2rem",
            padding: "0.22rem 0.65rem",
            borderRadius: "999px",
            background: "#fef3c7",
            color: "#d97706",
            border: "1px solid #fde68a",
            fontSize: "0.7rem",
            fontWeight: 700,
          }}
        >
          {t.news.typeBadgePinned}
        </span>
      )}
    </div>
  );
}

function ImagePlaceholder({
  type,
  category,
}: {
  type: "news" | "announcement";
  category: string;
}) {
  const color = getCategoryColor(category);
  const bg = type === "announcement" ? "#fffbeb" : "#eff6ff";
  const icon = type === "announcement" ? "📢" : "📰";
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(135deg, ${bg} 0%, white 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "14px",
          background: color + "18",
          border: `1px solid ${color}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.75rem",
        }}
      >
        {icon}
      </div>
      <span
        style={{
          fontSize: "0.7rem",
          fontWeight: 600,
          color: color,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {category}
      </span>
    </div>
  );
}

type TabType = "all" | "news" | "announcement";

export default function NewsSection() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/news?limit=8`)
      .then((r) => r.json())
      .then((res: { data: NewsItem[] }) => setItems(res.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered: NewsItem[] = (
    activeTab === "all" ? items : items.filter((i) => i.type === activeTab)
  ).slice(0, 4);

  const hasPinned = items.some((i) => i.pinned);
  const featured = filtered[0] ?? null;
  const sideItems = filtered.slice(1, 4);

  const tabs: { key: TabType; label: string }[] = [
    { key: "all", label: t.news.tabAll },
    { key: "news", label: t.news.typeBadgeNews },
    { key: "announcement", label: t.news.typeBadgeAnnouncement },
  ];

  return (
    <section
      id="berita"
      ref={ref}
      style={{ padding: "6rem 0", background: "var(--bg-body)" }}
    >
      <div
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s ease",
          }}
        >
          <div>
            <span
              className="section-label"
              style={{ marginBottom: "0.75rem", display: "inline-block" }}
            >
              {t.news.label}
            </span>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                fontWeight: 800,
                color: "var(--text-primary)",
                lineHeight: 1.2,
              }}
            >
              {t.news.title}{" "}
              <span className="title-gradient">{t.news.titleGradient}</span>
            </h2>
          </div>
          <a
            href="/news"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.65rem 1.5rem",
              border: "1.5px solid #0f2d6b",
              color: "var(--text-primary)",
              fontWeight: 600,
              fontSize: "0.875rem",
              borderRadius: "999px",
              textDecoration: "none",
              transition: "all 0.25s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "#0f2d6b";
              (e.currentTarget as HTMLAnchorElement).style.color = "white";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "transparent";
              (e.currentTarget as HTMLAnchorElement).style.color =
                "var(--text-primary)";
            }}
          >
            {t.news.viewAll}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Pinned announcement banner */}
        {!loading && hasPinned && activeTab !== "news" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
              border: "1px solid #fde68a",
              borderRadius: "12px",
              padding: "0.75rem 1.1rem",
              marginBottom: "1.5rem",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.6s ease 0.1s",
            }}
          >
            <span style={{ fontSize: "1rem", flexShrink: 0 }}>📌</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "#92400e",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginRight: "0.6rem",
                }}
              >
                {t.news.pinnedLabel}
              </span>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--text-heading)",
                }}
              >
                {items.find((i) => i.pinned)?.title}
              </span>
            </div>
            <a
              href={`/p/news/${items.find((i) => i.pinned)?.id}`}
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#d97706",
                textDecoration: "none",
                whiteSpace: "nowrap",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              {t.news.readShort}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        )}

        {/* Tab filter */}
        <div
          style={{
            display: "flex",
            gap: "0.35rem",
            background: "var(--bg-muted)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "0.35rem",
            marginBottom: "1.5rem",
            width: "fit-content",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.6s ease 0.15s",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "0.4rem 1rem",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontWeight: 600,
                background: activeTab === tab.key ? "#0f2d6b" : "transparent",
                color: activeTab === tab.key ? "#ffffff" : "#64748b",
                transition: "all 0.15s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: "1.5rem",
            }}
            className="news-main-grid"
          >
            <div
              style={{
                height: "420px",
                borderRadius: "20px",
                background: "var(--bg-muted)",
                animation: "pulse 1.5s ease infinite",
              }}
            />
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    height: "120px",
                    borderRadius: "16px",
                    background: "var(--bg-muted)",
                    animation: "pulse 1.5s ease infinite",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 0",
              color: "var(--text-subtle)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>📭</div>
            <p style={{ fontWeight: 600, color: "var(--text-muted)" }}>
              {activeTab === "announcement"
                ? t.news.emptyAnnouncement
                : t.news.emptyNews}
            </p>
          </div>
        )}

        {/* Featured + Side cards */}
        {!loading && featured && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: "1.5rem",
            }}
            className="news-main-grid"
          >
            {/* Featured card */}
            <a href={`/p/news/${featured.id}`} style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: "var(--bg-muted)",
                  border: `1.5px solid ${featured.pinned ? "#fde68a" : "#e2e8f0"}`,
                  borderRadius: "20px",
                  overflow: "hidden",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(28px)",
                  transition: "all 0.6s ease 0.1s",
                  height: "100%",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.boxShadow = "0 16px 48px rgba(15,45,107,0.12)";
                  el.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.boxShadow = "none";
                  el.style.transform = "translateY(0)";
                }}
              >
                {/* Image / placeholder */}
                <div
                  style={{
                    height: "220px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {featured.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={resolveImage(featured.image)}
                      alt={featured.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : (
                    <ImagePlaceholder
                      type={featured.type}
                      category={featured.category}
                    />
                  )}
                  {/* Overlay badge */}
                  <div
                    style={{ position: "absolute", top: "1rem", left: "1rem" }}
                  >
                    <TypeBadge type={featured.type} pinned={featured.pinned} />
                  </div>
                  {featured.image && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%)",
                      }}
                    />
                  )}
                </div>

                <div style={{ padding: "1.5rem" }}>
                  {/* Category + date */}
                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "center",
                      marginBottom: "0.75rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        padding: "0.2rem 0.65rem",
                        borderRadius: "999px",
                        background: getCategoryColor(featured.category) + "18",
                        color: getCategoryColor(featured.category),
                        fontSize: "0.7rem",
                        fontWeight: 700,
                      }}
                    >
                      {featured.category}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-subtle)",
                      }}
                    >
                      📅 {fmtDate(featured.createdAt)}
                    </span>
                    {featured.views > 0 && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-subtle)",
                        }}
                      >
                        👁 {featured.views.toLocaleString("id-ID")}
                      </span>
                    )}
                  </div>

                  <h3
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 800,
                      color: "var(--text-primary)",
                      marginBottom: "0.65rem",
                      lineHeight: 1.35,
                    }}
                  >
                    {featured.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.875rem",
                      lineHeight: 1.7,
                      marginBottom: "1rem",
                    }}
                  >
                    {stripHtml(featured.content)}
                  </p>

                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      color: "var(--text-primary)",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                    }}
                  >
                    {t.news.readMore}
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>

            {/* Side cards */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {sideItems.map((item, i) => (
                <a
                  key={item.id}
                  href={`/p/news/${item.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "0.85rem",
                      alignItems: "flex-start",
                      background: item.pinned
                        ? "linear-gradient(135deg, #fffbeb 0%, white 100%)"
                        : "#f8fafc",
                      border: `1px solid ${item.pinned ? "#fde68a" : "#e2e8f0"}`,
                      borderRadius: "16px",
                      padding: "1rem",
                      opacity: visible ? 1 : 0,
                      transform: visible ? "translateY(0)" : "translateY(20px)",
                      transition: `all 0.5s ease ${(i + 1) * 0.08 + 0.2}s`,
                      flex: 1,
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.boxShadow = "0 8px 24px rgba(15,45,107,0.1)";
                      el.style.borderColor = item.pinned
                        ? "#fde68a"
                        : "rgba(15,45,107,0.2)";
                      el.style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.boxShadow = "none";
                      el.style.borderColor = item.pinned
                        ? "#fde68a"
                        : "#e2e8f0";
                      el.style.transform = "translateX(0)";
                    }}
                  >
                    {/* Thumbnail / placeholder icon */}
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        flexShrink: 0,
                        position: "relative",
                      }}
                    >
                      {item.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={resolveImage(item.image)}
                          alt={item.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            background:
                              item.type === "announcement"
                                ? "#fef3c7"
                                : getCategoryColor(item.category) + "18",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.4rem",
                          }}
                        >
                          {item.type === "announcement" ? "📢" : "📰"}
                        </div>
                      )}
                      {item.pinned && (
                        <div
                          style={{
                            position: "absolute",
                            top: "2px",
                            right: "2px",
                            fontSize: "0.65rem",
                          }}
                        >
                          📌
                        </div>
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Type + category + date */}
                      <div
                        style={{
                          display: "flex",
                          gap: "0.4rem",
                          alignItems: "center",
                          marginBottom: "0.35rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            padding: "0.15rem 0.5rem",
                            borderRadius: "999px",
                            background: getCategoryColor(item.category) + "18",
                            color: getCategoryColor(item.category),
                            fontSize: "0.62rem",
                            fontWeight: 700,
                          }}
                        >
                          {item.category}
                        </span>
                        <span
                          style={{
                            fontSize: "0.68rem",
                            color: "var(--text-subtle)",
                          }}
                        >
                          {fmtDate(item.createdAt)}
                        </span>
                      </div>

                      <h4
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          color: "var(--text-primary)",
                          lineHeight: 1.4,
                          marginBottom: "0.3rem",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.title}
                      </h4>

                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                          lineHeight: 1.55,
                          margin: 0,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {stripHtml(item.content, 90)}
                      </p>
                    </div>
                  </div>
                </a>
              ))}

              {/* View all CTA at bottom of side column */}
              {filtered.length > 0 && (
                <a
                  href="/news"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.85rem",
                    border: "1.5px dashed #e2e8f0",
                    borderRadius: "14px",
                    textDecoration: "none",
                    color: "var(--text-muted)",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    transition: "all 0.2s",
                    marginTop: "auto",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "#0f2d6b";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--text-primary)";
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "#f8fafc";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "#e2e8f0";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--text-muted)";
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "transparent";
                  }}
                >
                  {t.news.viewAllLabel}
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
        @media (max-width: 768px) { .news-main-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
