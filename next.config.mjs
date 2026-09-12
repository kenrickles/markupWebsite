/** @type {import('next').NextConfig} */
// Root-domain deployment (kenrickles.com via Netlify): no basePath.
// For GH Pages project-path builds, set NEXT_PUBLIC_BASE_PATH=/kenrick-portfolio explicitly.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig = {
  reactStrictMode: false,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
};
export default nextConfig;
