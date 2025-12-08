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
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-zinc-900 selection:text-white pb-20">
      {/* Frosted Glass Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-16 max-w-[1800px] items-center justify-between px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white font-serif font-bold shadow-lg shadow-zinc-900/10 transition-transform group-hover:scale-105 active:scale-95">
              J
            </div>
            <h1 className="text-lg font-serif font-medium tracking-wide text-zinc-900 group-hover:text-black transition-colors">
              Jewelry GenAI Studio
            </h1>
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                isActive("/")
                  ? "bg-zinc-100 text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
              )}
            >
              <Sparkles className="w-4 h-4" />
              Studio
            </Link>
            <Link
              to="/settings"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                isActive("/settings")
                  ? "bg-zinc-100 text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
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
