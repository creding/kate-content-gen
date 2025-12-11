import type { Metadata } from "next";
import { Providers } from "../components/Providers";
import Layout from "../components/Layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jewelry GenAI Studio",
  description: "AI-powered content generation for jewelry brands",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
