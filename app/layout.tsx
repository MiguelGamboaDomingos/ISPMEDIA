import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "../providers/ConvexClerkProvider";
import AudioProvider from "@/providers/MediaProvider";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ISPMEDIA",
  description: "Compartilhamento de mídia para a comunidade acadêmica do ISPTEC",
  icons: {
    icon: '/icons/logo.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
      <html lang="pt-BR"> // Alterado de "en" para "pt-BR"
        <AudioProvider>
          <body className={`${manrope.className}`}>
              {children}
          </body>
        </AudioProvider>
      </html>
    </ConvexClerkProvider>
  );
}