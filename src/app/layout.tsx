import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prestigio Roleplay — Portal Gaming Hub",
  description: "Portal moderno tipo gaming hub para servidor FiveM/GTA RP. Whitelist, galería, facciones y más.",
  keywords: ["Prestigio", "Roleplay", "FiveM", "GTA RP", "Gaming", "Servidor"],
  icons: {
    icon: "/prestigio-logo.png",
  },
  openGraph: {
    title: "Prestigio Roleplay",
    description: "Vive la experiencia de roleplay definitiva",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#030712] text-foreground`}
      >
        {children}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0f172a',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              color: '#f1f5f9',
            },
          }}
        />
      </body>
    </html>
  );
}
