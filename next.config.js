// eslint-disable-next-line @typescript-eslint/no-var-requires
const withSvgr = require('next-plugin-svgr')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['ahooks'],
  images: {
    domains: ['oss.bouncebit.io', 's3.ap-southeast-1.amazonaws.com', 'assets.coingecko.com']
  },
  compiler: {
    styledComponents: true
  },
  images: {
    unoptimized: true
  },
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    config.resolve.fallback = { fs: false }
    return config
  }
}

module.exports = withSvgr(nextConfig)
