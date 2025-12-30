import type { Metadata } from "next";
import { Crimson_Text, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const serif = Crimson_Text({
  variable: "--font-serif",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BoardSaga - Turning Moves into Myths",
  description: "Transform chess PGN files into captivating stories powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sans.variable} ${serif.variable} antialiased min-h-screen flex flex-col`}
        style={{
          background: 'linear-gradient(to bottom, #F5F0E6 0%, #EEE8D3 100%)',
        }}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
