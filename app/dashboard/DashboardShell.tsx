"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { api } from "../lib/api";
import { useTheme } from "../i18n/ThemeContext";

const sidebarLinks = [
  { icon: "🏠", label: "Overview", href: "/dashboard" },
  { icon: "📝", label: "Artikel", href: "/dashboard/article" },
  { icon: "📰", label: "Berita & Pengumuman", href: "/dashboard/news" },
  { icon: "🎓", label: "Program Studi", href: "/dashboard/program" },
  { icon: "📬", label: "Leads / Inquiry", href: "/dashboard/leads" },
  { icon: "⚙️", label: "Pengaturan", href: "/dashboard/settings" },
];

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem("stia_token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    api.auth
      .me()
      .then((user) => setUser(user))
      .catch(() => {
        localStorage.removeItem("stia_token");
        localStorage.removeItem("stia_auth");
        window.location.href = "/login";
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("stia_token");
    localStorage.removeItem("stia_auth");
    window.location.href = "/login";
  };

  if (!user)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-muted)",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            border: "3px solid #e2e8f0",
            borderTopColor: "#0f2d6b",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg-muted)",
      }}
    >
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 40,
          }}
          className="sidebar-overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: "240px",
          flexShrink: 0,
          background: "linear-gradient(180deg, #071a40 0%, #0f2d6b 100%)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          transition: "transform 0.3s ease",
        }}
        className={`dashboard-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
      >
        {/* Sidebar header */}
        <div
          style={{
            padding: "1.5rem 1.25rem",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "9px",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{ color: "white", fontWeight: 800, fontSize: "1rem" }}
              >
                S
              </span>
            </div>
            <div>
              <div
                style={{
                  color: "white",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  lineHeight: 1.2,
                }}
              >
                STIA YPA-AH MAKASSAR
              </div>
              <div
                style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.65rem" }}
              >
                Admin Panel
              </div>
            </div>
          </Link>
        </div>

        {/* Nav links */}
        <nav
          style={{
            flex: 1,
            padding: "1rem 0.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          {sidebarLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.65rem 0.9rem",
                  borderRadius: "10px",
                  textDecoration: "none",
                  background: active ? "rgba(255,255,255,0.12)" : "transparent",
                  color: active ? "white" : "rgba(255,255,255,0.6)",
                  fontWeight: active ? 600 : 400,
                  fontSize: "0.875rem",
                  transition: "all 0.2s",
                  borderLeft: active
                    ? "3px solid #f5a623"
                    : "3px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "rgba(255,255,255,0.85)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "rgba(255,255,255,0.6)";
                  }
                }}
              >
                <span
                  style={{
                    fontSize: "1rem",
                    width: "20px",
                    textAlign: "center",
                  }}
                >
                  {link.icon}
                </span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div
          style={{
            padding: "1rem 0.75rem",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
              padding: "0.75rem 0.9rem",
              marginBottom: "0.5rem",
              background: "rgba(255,255,255,0.06)",
              borderRadius: "10px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #f5a623, #fbbf24)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  color: "var(--text-primary)",
                  fontWeight: 800,
                  fontSize: "0.8rem",
                }}
              >
                {user.name.charAt(0)}
              </span>
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  color: "white",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user.name}
              </div>
              <div
                style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.65rem" }}
              >
                {user.role}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "0.6rem",
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "8px",
              color: "#fca5a5",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(239,68,68,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(239,68,68,0.12)";
            }}
          >
            Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <div
        style={{
          flex: 1,
          marginLeft: "240px",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
        className="dashboard-main"
      >
        {/* Topbar */}
        <header
          style={{
            background: "var(--bg-card)",
            borderBottom: "1px solid var(--border)",
            padding: "0 1.5rem",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              padding: "0.25rem",
            }}
            className="sidebar-toggle"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={theme === "dark" ? "Mode Terang" : "Mode Gelap"}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "34px",
                height: "34px",
                background: "var(--bg-muted)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                cursor: "pointer",
                color: "var(--text-muted)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "var(--text-primary)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "var(--text-muted)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "var(--border)";
              }}
            >
              {theme === "dark" ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.166 17.834a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 6.166a.75.75 0 001.06 1.06l-1.59 1.591a.75.75 0 001.061 1.06L5.106 7.227a.75.75 0 00-1.061-1.061L6.166 6.166z" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>

            <a
              href="/"
              target="_blank"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.8rem",
                color: "var(--text-primary)",
                fontWeight: 600,
                textDecoration: "none",
                padding: "0.4rem 0.85rem",
                border: "1.5px solid var(--border)",
                borderRadius: "999px",
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Lihat Website
            </a>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "2rem 1.5rem" }}>{children}</main>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .dashboard-sidebar { transform: translateX(-100%); }
          .dashboard-sidebar.sidebar-open { transform: translateX(0); }
          .dashboard-main { margin-left: 0 !important; }
          .sidebar-toggle { display: flex !important; }
        }
        @media (min-width: 769px) {
          .sidebar-toggle { display: none; }
          .sidebar-overlay { display: none; }
        }
      `}</style>
    </div>
  );
}
