import type { NextConfig } from "next";
import { withMicrofrontends } from "@vercel/microfrontends/next/config";

const nextConfig: NextConfig = {
  basePath: "/pixels",
  serverExternalPackages: ["@resvg/resvg-js"],
};

export default withMicrofrontends(nextConfig);
