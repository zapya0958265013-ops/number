/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. ข้ามการตรวจ Error ของ TypeScript ตอน Build
  typescript: {
    ignoreBuildErrors: true,
  },
  // 2. ข้ามการตรวจ Error ของ ESlint ตอน Build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;