import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/react"
import { TranslationsProvider } from "@/components/translations-context"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InterView AI",
  description: "InterView AI is a tool that helps you prepare for interviews.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-dvh bg-background font-sans antialiased",
          geistSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TranslationsProvider>
            <div className="relative flex min-h-dvh flex-col bg-background items-center">
              <main className="flex flex-1 justify-center items-start">
                {children}
              </main>
            </div>
            <Toaster />
          </TranslationsProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
