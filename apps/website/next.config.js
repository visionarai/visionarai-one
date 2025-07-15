//@ts-check

const createNextIntlPlugin = require('next-intl/plugin');
const { composePlugins, withNx } = require('@nx/next');

const withNextIntl = createNextIntlPlugin();

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 */
const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withNextIntl,
];

module.exports = composePlugins(...plugins)(nextConfig);
