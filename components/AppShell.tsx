"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, LogOut, User, LayoutGrid, Plus } from "lucide-react";
import { cn, Button } from "./ui";
import { useAuth } from "../contexts/AuthContext";

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const { user, signOut, isConfigured } = useAuth();

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground pb-20">
      {/* Frosted Glass Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-16 max-w-[1800px] items-center justify-between px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 group cursor-pointer"
          >
            <img
              src="/images/logo.png"
              alt="Kate Crawford Jewelry"
              className="h-9 w-auto transition-transform group-hover:scale-105 active:scale-95"
            />
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                isActive("/dashboard")
                  ? "bg-secondary text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
              Items
            </Link>
            <Link
              href="/items/new"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                isActive("/items/new")
                  ? "bg-secondary text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Plus className="w-4 h-4" />
              New Item
            </Link>
            <Link
              href="/settings"
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

            {/* User Menu - integrated in nav */}
            {isConfigured && user && (
              <>
                <div className="w-px h-6 bg-border mx-2" />
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline max-w-[120px] truncate">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1800px] px-6 py-8 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default AppShell;
