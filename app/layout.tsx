import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ui/mode-toggle";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI News Article Summarizer",
  description: "AI News Article Summarizer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={true}
        >
          <div className="min-h-screen">
            <header className="border-b">
              <div className="container max-w-5xl mx-auto flex items-center justify-between py-4 px-8">
                <h1 className="text-xl font-bold">AI News Summarizer</h1>
                <ModeToggle />
              </div>
            </header>
            <main className="container max-w-5xl mx-auto py-4">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
