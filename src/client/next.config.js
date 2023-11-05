module.exports = {
  distDir: '../../dist/client',
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
  trailingSlash: true,
  httpAgentOptions: {
    keepAlive: false,
  },
  redirects: async () => {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  }
};
