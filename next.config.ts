import type { NextConfig } from "next";

const repo = "tofuautoworks";
const isGithubSubpathBuild = process.env.DEPLOY_TARGET === "gh-pages";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "build",
  images: { unoptimized: true },
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubSubpathBuild ? `/${repo}` : "",
  },
  ...(isGithubSubpathBuild
    ? {
        basePath: `/${repo}`,
        assetPrefix: `/${repo}`,
      }
    : {}),
};

export default nextConfig;
