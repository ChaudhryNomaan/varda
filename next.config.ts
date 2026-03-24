/** @type {import('next').NextConfig} */
const nextConfig = {
  // If you don't need the proxy anymore, you can just remove the rewrites 
  // or wrap them in a check so they don't break the build.
  async rewrites() {
    const target = process.env.SUPABASE_TARGET_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    
    // Only add the rewrite if a valid target exists
    if (!target) return [];

    return [
      {
        source: '/supabase-api/:path*',
        destination: `${target}/:path*`,
      },
    ];
  },
  // ... other config settings
};

export default nextConfig;