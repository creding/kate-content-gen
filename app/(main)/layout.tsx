"use client";

import React, { useEffect } from "react";
import AppShell from "@/components/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isConfigured } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isConfigured && !user) {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [user, loading, isConfigured, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // If not configured (dev mode without auth), allow access, otherwise require user.
  if (isConfigured && !user) return null;

  return <AppShell>{children}</AppShell>;
}
