import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Settings, Sparkles } from "lucide-react";
import { cn } from "./ui";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground pb-20">
      {/* Frosted Glass Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-16 max-w-[1800px] items-center justify-between px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <img
              src="/images/logo.png"
              alt="Kate Crawford Jewelry"
              className="h-9 w-auto transition-transform group-hover:scale-105 active:scale-95"
            />
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                isActive("/")
                  ? "bg-secondary text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Sparkles className="w-4 h-4" />
              Studio
            </Link>
            <Link
              to="/copywriting"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                isActive("/copywriting")
                  ? "bg-secondary text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Copy
            </Link>
            <Link
              to="/settings"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                isActive("/settings")
                  ? "bg-secondary text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1800px] px-6 py-8 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
