"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, isConfigured } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && isConfigured) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, isConfigured, router, pathname]);

  // If Supabase not configured, allow access (dev mode)
  if (!isConfigured) {
    return <>{children}</>;
  }

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render children (redirecting)
  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
