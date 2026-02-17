import type { NextConfig } from "next";

const repo = "tofuautoworks";
const isGithubSubpathBuild = process.env.DEPLOY_TARGET === "gh-pages";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "build",
  images: { unoptimized: true },
  trailingSlash: true,
  ...(isGithubSubpathBuild
    ? {
        basePath: `/${repo}`,
        assetPrefix: `/${repo}`,
      }
    : {}),
};

export default nextConfig;
