/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ['jsonwebtoken'],
  },
  // Configurando o middleware para não usar Edge Runtime
  middleware: {
    skipMiddlewareUrlNormalize: true,
  },
}

module.exports = nextConfig 