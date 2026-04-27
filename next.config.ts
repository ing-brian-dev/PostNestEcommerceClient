import type { NextConfig } from "next";

const NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images : {
    remotePatterns : [
      {
        protocol : 'http',
        hostname: process.env.DOMAIN!,
        port: '3000'
      }
    ]
  }
};

export default NextConfig;
