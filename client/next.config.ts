import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Opciones de configuración aquí */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pokemontcg.io', // Permitimos este dominio
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;