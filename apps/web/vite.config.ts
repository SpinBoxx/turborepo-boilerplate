import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { intlayer, intlayerCompiler } from "vite-intlayer";

export default defineConfig(({ command }) => {
	const plugins = [
		tailwindcss(),
		intlayer(),
		intlayerCompiler(),
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
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
		server: {
			host: "0.0.0.0",
			allowedHosts: true,
		},
		build: {
			modulePreload: {
				polyfill: true,
			},
			rollupOptions: {
				output: {
					manualChunks: undefined, // Let Vite handle code splitting based on dynamic imports and other heuristics
				},
			},
			target: "es2015",
			cssTarget: "safari13",
			sourcemap: false,
			minify: "esbuild",
		},
		preview: {
			allowedHosts: true,
			host: "0.0.0.0",
		},
		plugins,
	};
});
