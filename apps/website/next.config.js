//@ts-check

const createNextIntlPlugin = require("next-intl/plugin");
const { composePlugins, withNx } = require("@nx/next");

const withNextIntl = createNextIntlPlugin();

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 */
const nextConfig = {
	nx: {},
	// output: "standalone",
	serverExternalPackages: ["pino", "pino-pretty"],
};

const plugins = [
	// Add more Next.js plugins to this list if needed.
	withNx,
	withNextIntl,
];

module.exports = composePlugins(...plugins)(nextConfig);
