/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for deployment flexibility
  // output: 'export',
  
  // Image optimization
  images: {
    domains: [],
  },

  // The legal pages live in the app; the landing's old URLs forward there.
  async redirects() {
    return [
      { source: '/terms', destination: 'https://app.vibestarter.xyz/terms', permanent: true },
      { source: '/risk-disclosure', destination: 'https://app.vibestarter.xyz/risk-disclosure', permanent: true },
    ];
  },
};

module.exports = nextConfig;
