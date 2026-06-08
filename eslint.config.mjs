import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import gitignore from "eslint-config-flat-gitignore";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import { defineConfig } from "eslint/config";
import globals from "globals";

const compat = new FlatCompat({
	baseDirectory: import.meta.dirname,
	recommendedConfig: eslint.configs.recommended,
});

export default defineConfig([
	gitignore(),
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	...compat.config({
		root: true,
		extends: ["next/core-web-vitals", "next/typescript"],
	}),
	eslintPluginUnicorn.configs.all,
	{
		rules: {
			"no-plusplus": "error",
			"unicorn/import-style": [
				"error",
				{
					styles: {
						"node:path": {
							named: true,
						},
					},
				},
			],
			"unicorn/no-keyword-prefix": "off",
			"unicorn/no-negated-condition": "off",
			"unicorn/no-useless-undefined": "off",
			"unicorn/prefer-query-selector": "off",
			"unicorn/prevent-abbreviations": "off",
			'unicorn/no-abusive-eslint-disable': 'off',
			'unicorn/switch-case-braces': 'off',
			"@typescript-eslint/consistent-type-imports": [
				"error",
				{
					fixStyle: "inline-type-imports",
					disallowTypeAnnotations: false,
				},
			],
		},
	},
]);
