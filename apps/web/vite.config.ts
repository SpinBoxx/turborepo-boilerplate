import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import legacy from "@vitejs/plugin-legacy";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { intlayer, intlayerCompiler } from "vite-intlayer";

export default defineConfig(({ command }) => {
	const plugins = [
		tailwindcss(),
		intlayer(),
		intlayerCompiler(),
		legacy({
			targets: ["iOS >= 13", "Safari >= 13"],
			additionalModernPolyfills: [
				"resize-observer-polyfill",
				"wicg-inert",
			],
		}),
		tanstackRouter({
			target: "react",
		}),
		viteReact(),
	];

	return {
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
		base: "/",
		build: {
			rollupOptions: {
				output: {},
			},
		},
		server: {
			host: "0.0.0.0",
			allowedHosts: true,
		},
		preview: {
			allowedHosts: true,
			host: "0.0.0.0",
		},
		plugins,
	};
});

