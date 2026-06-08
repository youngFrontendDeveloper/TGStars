import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/features/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/*.{js,ts,jsx,tsx,mdx}",
	],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				primary: "var(--color-primary)",
				surface: "var(--color-surface)",
				"surface-inverted": "var(--color-surface-inverted)",
			},
		},
	},
	plugins: [],
	corePlugins: {
		listStyleType: true,
	},
};

export default config;
