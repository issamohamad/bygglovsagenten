/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/bygglovsagenten", // Korrekt sökväg för GitHub Pages
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
