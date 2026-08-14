import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /schedule reads content/schedule.md from disk, which the tracer cannot infer
  // from the dynamic path, so include it in that route's deployment bundle.
  outputFileTracingIncludes: {
    "/schedule": ["./content/schedule.md"],
  },
};

export default nextConfig;
