import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",               // enables `next export`
  distDir: "build",               // folder GH Pages will serve
  images: { unoptimized: true },  // no remote loader on Pages
  basePath: "/tofuautoworks",     //  <<< repo name
  trailingSlash: true,            // optional but avoids 404s
};

export default nextConfig;
