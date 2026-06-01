import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["sqlite3", "sqlite", "puppeteer"],
};

export default nextConfig;
