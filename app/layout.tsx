import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import StarField from "./components/ui/StarField";

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
      <body className="antialiased min-h-screen flex flex-col relative">
        {/* Cosmic Background */}
        <div className="cosmic-bg" />
        
        {/* Star Field - Client Component */}
        <StarField />
        
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
