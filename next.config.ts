import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {protocol: 'https', hostname: 'cdn.sanity.io'},
      {protocol: 'https', hostname: 'i.ytimg.com'},
      {protocol: 'https', hostname: 'i1.ytimg.com'},
      {protocol: 'https', hostname: 'i2.ytimg.com'},
      {protocol: 'https', hostname: 'i3.ytimg.com'},
      {protocol: 'https', hostname: 'i4.ytimg.com'},
      {protocol: 'https', hostname: 'images.unsplash.com'},
    ],
  },
  env: {SC_DISABLE_SPEEDY: 'false'},
}

export default nextConfig
