import type { Metadata } from "next";
import { Geist_Mono, Vazirmatn } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sanjesh — grounded RAG and offline eval harness",
  description:
    "BM25, TF-IDF, and RRF hybrid retrieval with citation-required extractive answers, selective abstention, and a 48-question eval harness.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} ${geistMono.variable} h-full dark`}
    >
      <body className="min-h-full bg-zinc-950 font-sans text-zinc-100 antialiased">
        <TooltipProvider>
          <SiteHeader />
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
