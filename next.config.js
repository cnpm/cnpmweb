module.exports = {
  env: {},
  // https://github.com/vercel/next.js/issues/36251#issuecomment-1212900096
  httpAgentOptions: {
    keepAlive: false,
  },
  output: 'export',
  typescript: {
    // The build script runs tsrs after Next.js generates its type declarations.
    ignoreBuildErrors: true,
  },
};
