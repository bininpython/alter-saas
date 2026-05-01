import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Otimizações para produção
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  // Variáveis de ambiente que devem ser expostas no client (se necessário)
  env: {
    NEXT_PUBLIC_APP_NAME: "Alter",
    NEXT_PUBLIC_APP_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  },
};

export default nextConfig;
