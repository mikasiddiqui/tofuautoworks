import type { NextConfig } from "next";

// GitHub's configure-pages action supplies an empty path for a custom domain,
// or the repository path for a github.io project site. Local builds use root.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "build",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
