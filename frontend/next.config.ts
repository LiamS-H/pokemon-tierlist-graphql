import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    compiler: {
        relay: {
            src: "./src",
            language: "typescript",
        },
    },
    /* config options here */
};

export default nextConfig;
