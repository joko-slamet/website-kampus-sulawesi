"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { resolveImage } from "../lib/imageUrl";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://stiaahmakassar.ac.id";
const PAGE_SIZE = 9;

interface ApiArticle {
  id: string;
  title: string;
  titleEn: string | null;
  excerpt: string;
  excerptEn: string | null;
  category: string;
  categoryColor: string;
  tag: string | null;
  tagColor: string | null;
  readTime: string;
  date: string;
  image: string | null;
}

export default function ArticlesList() {
  const { t, lang } = useLanguage();
  const [articles, setArticles] = useState<ApiArticle[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [categorySet, setCategorySet] = useState<string[]>([]);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchArticles = useCallback(
    async (p: number, cat: string, q: string, append = false) => {
      if (p === 1) setLoading(true);
      else setLoadingMore(true);
      try {
        const qs = new URLSearchParams({
          page: String(p),
          limit: String(PAGE_SIZE),
        });
        if (cat !== "Semua") qs.set("category", cat);
        if (q) qs.set("search", q);

        const res = await fetch(`${API_URL}/api/articles?${qs}`);
        const data: { data: ApiArticle[]; total: number } = await res.json();

        setArticles((prev) =>
          append ? [...prev, ...(data.data ?? [])] : (data.data ?? []),
        );
        setTotal(data.total ?? 0);

        if (cat === "Semua" && !q) {
          const cats = (data.data ?? []).map((a) => a.category);
          setCategorySet((prev) =>
            Array.from(new Set([...prev, ...cats])).sort(),
          );
        }
      } catch {
        // keep existing list
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  useEffect(() => {
    setPage(1);
    setArticles([]);
    fetchArticles(1, activeCategory, search);
  }, [activeCategory, search, fetchArticles]);

  const handleSearch = (v: string) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => setSearch(v), 350);
  };

  const handleCategory = (cat: string) => {
    setActiveCategory(cat);
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchArticles(next, activeCategory, search, true);
  };

  const categories = ["Semua", ...categorySet];
  const hasMore = articles.length < total;

  return (
    <>
      {/* Search + Filter */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          marginBottom: "2.5rem",
        }}
      >
        <div style={{ position: "relative", maxWidth: "480px" }}>
          <svg
            style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
            }}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder={t.articles.searchPlaceholder}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 1rem 0.75rem 2.75rem",
              border: "1.5px solid var(--border)",
              borderRadius: "999px",
              fontSize: "0.9rem",
              background: "var(--bg-card)",
              color: "var(--text-heading)",
              transition: "border-color 0.2s ease",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#0f2d6b")}
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "var(--border)")
            }
          />
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              style={{
                padding: "0.45rem 1.1rem",
                borderRadius: "999px",
                fontSize: "0.8rem",
                fontWeight: 600,
                border: "1.5px solid",
                cursor: "pointer",
                transition: "all 0.2s ease",
                borderColor:
                  activeCategory === cat ? "#0f2d6b" : "var(--border)",
                background:
                  activeCategory === cat ? "#0f2d6b" : "var(--bg-card)",
                color: activeCategory === cat ? "#ffffff" : "var(--text-muted)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      {!loading && (
        <p
          style={{
            color: "var(--text-subtle)",
            fontSize: "0.85rem",
            marginBottom: "1.5rem",
          }}
        >
          {t.articles.showing}{" "}
          <strong style={{ color: "var(--text-primary)" }}>{total}</strong>{" "}
          {t.articles.articleWord}
          {activeCategory !== "Semua" &&
            ` ${t.articles.inCategory} "${activeCategory}"`}
          {search && ` ${t.articles.forKeyword} "${search}"`}
        </p>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="artikel-grid" style={{ marginBottom: "2rem" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "20px",
                height: "260px",
                animation: "pulse 1.5s ease infinite",
              }}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && articles.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "5rem 0",
            color: "var(--text-subtle)",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
          <p
            style={{
              fontWeight: 600,
              color: "var(--text-muted)",
              marginBottom: "0.5rem",
            }}
          >
            {t.articles.notFound}
          </p>
          <p style={{ fontSize: "0.875rem" }}>{t.articles.notFoundDesc}</p>
        </div>
      )}

      {/* Grid */}
      {!loading && articles.length > 0 && (
        <div className="artikel-grid">
          {articles.map((article) => (
            <a
              key={article.id}
              href={`/article/${article.id}`}
              style={{ textDecoration: "none" }}
            >
              <article
                className="artikel-card"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "20px",
                  overflow: "hidden",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.25s ease",
                  height: "100%",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = "0 12px 40px rgba(15,45,107,0.12)";
                  el.style.transform = "translateY(-4px)";
                  el.style.borderColor = "rgba(15,45,107,0.18)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = "none";
                  el.style.transform = "translateY(0)";
                  el.style.borderColor = "var(--border)";
                }}
              >
                {/* Thumbnail */}
                {article.image && (
                  <div
                    style={{
                      height: "180px",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={resolveImage(article.image)}
                      alt={article.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      loading="lazy"
                    />
                  </div>
                )}

                <div
                  style={{
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    flex: 1,
                  }}
                >
                  {/* Meta */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        padding: "0.25rem 0.75rem",
                        background: article.categoryColor + "18",
                        color: article.categoryColor,
                        borderRadius: "999px",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                      }}
                    >
                      {article.category}
                    </span>
                    {article.tag && (
                      <span
                        style={{
                          padding: "0.25rem 0.75rem",
                          background: (article.tagColor ?? "#f5a623") + "20",
                          color: article.tagColor ?? "#f5a623",
                          borderRadius: "999px",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                        }}
                      >
                        {article.tag}
                      </span>
                    )}
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: "0.72rem",
                        color: "var(--text-subtle)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      ⏱ {article.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 800,
                      color: "var(--text-primary)",
                      lineHeight: 1.4,
                      margin: 0,
                    }}
                  >
                    {lang === "en"
                      ? article.titleEn || article.title
                      : article.title}
                  </h2>

                  {/* Excerpt */}
                  <p
                    style={{
                      color: "var(--text-body)",
                      fontSize: "0.875rem",
                      lineHeight: 1.7,
                      margin: 0,
                      flex: 1,
                    }}
                  >
                    {lang === "en"
                      ? article.excerptEn || article.excerpt
                      : article.excerpt}
                  </p>

                  {/* Footer */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "0.5rem",
                      paddingTop: "1rem",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-subtle)",
                      }}
                    >
                      📅 {article.date}
                    </span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        color: "var(--text-primary)",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                      }}
                    >
                      {t.articles.readBtn}
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
              </article>
            </a>
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && !loading && (
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <button
            onClick={loadMore}
            disabled={loadingMore}
            style={{
              padding: "0.85rem 2.5rem",
              border: "1.5px solid var(--text-primary)",
              borderRadius: "999px",
              background: "var(--bg-card)",
              color: "var(--text-primary)",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: loadingMore ? "not-allowed" : "pointer",
              opacity: loadingMore ? 0.6 : 1,
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              if (!loadingMore) {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "var(--text-primary)";
                (e.currentTarget as HTMLButtonElement).style.color = "white";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--bg-card)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--text-primary)";
            }}
          >
            {loadingMore
              ? "Memuat..."
              : `${t.articles.loadMore} (${total - articles.length} ${t.articles.moreArticles})`}
          </button>
        </div>
      )}

      <style>{`
        .artikel-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 1024px) {
          .artikel-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .artikel-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </>
  );
}
