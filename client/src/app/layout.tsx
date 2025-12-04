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
  // 1. Título de la pestaña
  title: "Collector's Vault", 
  
  // Descripción para SEO (Buscadores)
  description: "Gestiona tu colección de cartas de Pokémon y más.",
  
  // 2. Iconos (Configuración completa para asegurar que cambie)
  icons: {
    icon: '/icono.png',        // Icono estándar
    shortcut: '/icono.png',    // Acceso directo
    apple: '/icono.png',       // Icono para iPhone/iPad
  },

  // 3. Imagen del buscador y redes sociales (Open Graph)
  openGraph: {
    title: "Collector's Vault",
    description: "Gestiona tu colección de cartas de Pokémon y más.",
    images: [
      {
        url: '/icono.png', // La imagen que se mostrará al compartir
        width: 800,
        height: 800,
        alt: "Logo de Collector's Vault",
      },
    ],
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // He cambiado el idioma a 'es' para mejorar el SEO en español
    <html lang="es"> 
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}