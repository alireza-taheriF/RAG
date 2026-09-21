import type { Metadata } from "next";
import { Geist_Mono, Vazirmatn } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
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
  title: "نقشه پروژه AI برای رزومه و مسیر آمریکا",
  description:
    "۱۵ پروژه مشخص برای دانشجوی ارشد هوش مصنوعی در ایران، با امتیاز اهمیت و تأثیر روی رزومه برای مقصد نهایی آمریکا.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} ${geistMono.variable} h-full dark`}
    >
      <body className="min-h-full bg-zinc-950 font-sans text-zinc-100 antialiased">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
