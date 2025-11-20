import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  // Añadimos la configuración de 'rewrites' para actuar como proxy
  // en el entorno de desarrollo.
  async rewrites() {
    return [
      {
        // Esta regla captura cualquier petición que empiece con /api
        source: '/api/:path*',
        // Y la reenvía a tu servidor backend en el puerto 5000
        // Asegúrate de que este puerto coincide con el de tu server.ts
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },
  // --- FIN DE LA ADICIÓN ---
};

export default nextConfig;
