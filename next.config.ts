const repo = "tofuautoworks";
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  distDir: "build",
  images: { unoptimized: true },

  basePath: `/${repo}`,
  assetPrefix: `/${repo}`,
  trailingSlash: true,
};

export default nextConfig;
