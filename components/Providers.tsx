"use client";

import React from "react";
import { AuthProvider } from "../contexts/AuthContext";
import { BrandProvider } from "../contexts/BrandContext";
import { PromptProvider } from "../contexts/PromptContext";
import { ToastProvider } from "../contexts/ToastContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrandProvider>
          <PromptProvider>{children}</PromptProvider>
        </BrandProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
