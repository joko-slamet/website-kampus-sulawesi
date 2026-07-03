"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";

export default function HeroSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      ref={ref}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        overflow: "hidden",
      }}
    >
      {/* Background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Image
          src="/hero-campus.png"
          alt="Kampus STIA YPA-AH MAKASSAR"
          fill
          priority
          quality={90}
          style={{ objectFit: "cover", objectPosition: "center 30%" }}
          sizes="100vw"
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(7,26,64,0.90) 0%, rgba(15,45,107,0.78) 45%, rgba(15,45,107,0.40) 100%)",
          }}
        />
      </div>

      {/* Blobs */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(245,166,35,0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: "-5%",
          width: "350px",
          height: "350px",
          background:
            "radial-gradient(circle, rgba(26,74,173,0.2) 0%, transparent 70%)",
          borderRadius: "50%",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Main Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1280px",
          margin: "0 auto",
          width: "100%",
          padding: "0 1.5rem",
          paddingTop: "9rem",
          paddingBottom: "6rem",
        }}
      >
        <div style={{ maxWidth: "760px" }}>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 1rem",
              background: "rgba(245,166,35,0.18)",
              border: "1px solid rgba(245,166,35,0.35)",
              borderRadius: "999px",
              marginBottom: "1.5rem",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.7s ease 0.1s",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#f5a623",
                display: "inline-block",
              }}
            />
            <span
              style={{
                color: "#fbbf24",
                fontWeight: 600,
                fontSize: "0.8rem",
                letterSpacing: "0.06em",
              }}
            >
              {t.hero.badge}
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
              fontWeight: 800,
              lineHeight: 1.12,
              color: "#ffffff",
              marginBottom: "1.5rem",
              fontFamily: "Plus Jakarta Sans, sans-serif",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(28px)",
              transition: "all 0.7s ease 0.2s",
            }}
          >
            {t.hero.titleLine1}
            <br />
            <span
              style={{
                background:
                  "linear-gradient(90deg, #f5a623 0%, #fbbf24 50%, #f5a623 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t.hero.titleGradient}
            </span>{" "}
            {t.hero.titleLine2}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              color: "rgba(255,255,255,0.82)",
              lineHeight: 1.75,
              marginBottom: "2.5rem",
              maxWidth: "580px",
              fontWeight: 400,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: "all 0.7s ease 0.35s",
            }}
            dangerouslySetInnerHTML={{ __html: t.hero.subtitle }}
          />

          {/* CTA Buttons */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.7s ease 0.5s",
            }}
          >
            <a
              href="#daftar"
              onClick={(e) => {
                e.preventDefault();
                handleScroll("daftar");
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.9rem 2rem",
                background: "linear-gradient(135deg, #f5a623 0%, #fbbf24 100%)",
                color: "#0f2d6b",
                fontWeight: 700,
                fontSize: "1rem",
                borderRadius: "999px",
                textDecoration: "none",
                boxShadow: "0 8px 32px rgba(245,166,35,0.45)",
                transition: "all 0.25s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(-3px)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 14px 40px rgba(245,166,35,0.55)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(0)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 8px 32px rgba(245,166,35,0.45)";
              }}
            >
              {t.hero.cta1}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="#program"
              onClick={(e) => {
                e.preventDefault();
                handleScroll("program");
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.9rem 2rem",
                background: "rgba(255,255,255,0.12)",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "1rem",
                borderRadius: "999px",
                textDecoration: "none",
                border: "1.5px solid rgba(255,255,255,0.35)",
                backdropFilter: "blur(10px)",
                transition: "all 0.25s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "rgba(255,255,255,0.2)";
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "rgba(255,255,255,0.12)";
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(0)";
              }}
            >
              {t.hero.cta2}
            </a>
          </div>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1px",
            background: "rgba(255,255,255,0.12)",
            borderRadius: "16px",
            overflow: "hidden",
            marginTop: "4rem",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(32px)",
            transition: "all 0.7s ease 0.75s",
          }}
          className="hero-stats-grid"
        >
          {t.hero.stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                padding: "1.5rem",
                background: "rgba(255,255,255,0.06)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  fontWeight: 800,
                  color: "#fbbf24",
                  marginBottom: "0.25rem",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.72)",
                  fontWeight: 400,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          color: "rgba(255,255,255,0.5)",
          fontSize: "0.7rem",
          letterSpacing: "0.1em",
          opacity: visible ? 1 : 0,
          transition: "opacity 1s ease 1.2s",
        }}
      >
        <span>SCROLL</span>
        <div
          style={{
            width: "1.5px",
            height: "32px",
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)",
            animation: "float 2s ease-in-out infinite",
          }}
        />
      </div>

      <style>{`
        @media (max-width: 640px) {
          .hero-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .hero-stats-grid > *:last-child:nth-child(odd) { grid-column: span 2; }
          .hero-stats-grid > * { padding: 1rem !important; }
        }
      `}</style>
    </section>
  );
}
