import { type NextConfig } from "next";

function createSvgWebpackRules(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	config: any,
) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const fileLoaderRule = config.module.rules.find((rule: any) =>
		rule.test?.test?.(".svg"),
	);

	if (fileLoaderRule == undefined) {
		throw new Error("File loader rule for SVG not found in webpack config");
	}

	config.module.rules.push(
		{
			...fileLoaderRule,
			test: /\.svg$/i,
			resourceQuery: /url/,
		},
		{
			test: /\.svg$/i,
			issuer: fileLoaderRule.issuer,
			resourceQuery: {
				not: [...fileLoaderRule.resourceQuery.not, /url/],
			},
			use: ["@svgr/webpack"],
		},
	);

	fileLoaderRule.exclude = /\.svg$/i;
}

function createBaseNextConfig(): NextConfig {
	return {
		experimental: {
			scrollRestoration: true,
			optimizePackageImports: ["@ark-ui/react"],
		},
		webpack(config) {
			createSvgWebpackRules(config);

			return config;
		},

		turbopack: {
			rules: {
				"*.svg": {
					loaders: ["@svgr/webpack"],
					as: "*.js",
				},
			},
		},
		images: {
			remotePatterns: [
				{
					protocol: "https",
					hostname: "kappastars.ru",
					pathname: "/**",
				},
				{
					protocol: "https",
					hostname: "cdn4.telesco.pe",
					pathname: "/**",
				},
			],
		},
	};
}
function applyStandaloneBuild(config: NextConfig): NextConfig {
	if (process.env.NEXT_STANDALONE_BUILD === "true") {
		return { ...config, output: "standalone" };
	}

	return config;
}

let config = createBaseNextConfig();
config = applyStandaloneBuild(config);

export default config;
