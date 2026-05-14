import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "CV Builder",
  description: "Personal CV builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${notoSans.variable} font-sans`}>
      <body className="h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
