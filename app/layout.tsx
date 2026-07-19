import type { Metadata } from "next";
import { Inter, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Agency OS",
  description: "Private client management system for web design and local SEO agencies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("dark h-full", inter.variable, sourceSans.variable, "font-sans")}
    >
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
