import type { Metadata } from "next";
import { Providers } from "../components/Providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "Kate Crawford Jewelry",
  description: "Content generation for Kate Crawford Jewelry",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
