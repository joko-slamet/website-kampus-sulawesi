"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";

export default function AboutSection() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const milestones = t.about.milestones;

  const icons = ["🎯", "🔬", "🌐"];
  const values = t.about.features.map((f, i) => ({
    icon: icons[i],
    title: f.title,
    desc: f.desc,
  }));

  return (
    <section
      id="tentang"
      ref={ref}
      style={{
        padding: "6rem 0",
        background: "var(--bg-muted)",
        overflow: "hidden",
      }}
    >
      <div
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}
      >
        {/* Section Label */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1rem",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s ease",
          }}
        >
          <span className="section-label">{t.about.label}</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "5rem",
            alignItems: "center",
          }}
          className="about-grid"
        >
          {/* Left: Image collage */}
          <div
            style={{
              position: "relative",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-40px)",
              transition: "all 0.75s ease 0.15s",
            }}
          >
            <div
              style={{
                position: "relative",
                height: "480px",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 24px 64px rgba(15,45,107,0.18)",
              }}
            >
              <Image
                src="/stia-brosur.jpg"
                alt="Mahasiswa STIA YPA-AH MAKASSAR Sulawesi"
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                }}
              />
            </div>
          </div>

          {/* Right: Content */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(40px)",
              transition: "all 0.75s ease 0.25s",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                fontWeight: 800,
                color: "var(--text-primary)",
                lineHeight: 1.2,
                marginBottom: "1rem",
                fontFamily: "Plus Jakarta Sans, sans-serif",
              }}
            >
              {t.about.title}{" "}
              <span className="title-gradient">{t.about.titleGradient}</span>
            </h2>

            <div
              style={{
                width: "3rem",
                height: "3px",
                background: "linear-gradient(90deg, #f5a623, #fbbf24)",
                borderRadius: "2px",
                marginBottom: "1.5rem",
              }}
            />

            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.8,
                marginBottom: "1.5rem",
                fontSize: "1rem",
              }}
            >
              {t.about.body1}
            </p>

            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.8,
                marginBottom: "2rem",
                fontSize: "1rem",
              }}
            >
              {t.about.body2}
            </p>

            {/* Value pillars */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              {values.map((v, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "flex-start",
                    padding: "1rem 1.25rem",
                    background: "var(--bg-card)",
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                    boxShadow: "0 2px 8px rgba(15,45,107,0.05)",
                    transition: "all 0.25s ease",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "rgba(15,45,107,0.25)";
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateX(4px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 8px 24px rgba(15,45,107,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "#e2e8f0";
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateX(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 2px 8px rgba(15,45,107,0.05)";
                  }}
                >
                  <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>
                    {v.icon}
                  </span>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        color: "var(--text-primary)",
                        marginBottom: "0.2rem",
                      }}
                    >
                      {v.title}
                    </div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-muted)",
                        lineHeight: 1.6,
                      }}
                    >
                      {v.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="#visi-misi"
              id="about-learn-more"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("visi-misi")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.75rem",
                background: "#0f2d6b",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "0.9rem",
                borderRadius: "999px",
                textDecoration: "none",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "#1a4aad";
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(-2px)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 8px 24px rgba(15,45,107,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "#0f2d6b";
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(0)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
              }}
            >
              {t.about.cta}
              <svg
                width="16"
                height="16"
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
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
        }
      `}</style>
    </section>
  );
}
