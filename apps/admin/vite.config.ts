import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(async ({ command }) => {
	const plugins = [
		tailwindcss(),
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
		}),
		viteReact({
			// https://react.dev/learn/react-compiler
			babel: {
				plugins: [
					[
						"babel-plugin-react-compiler",
						{
							target: "19",
						},
					],
				],
			},
		}),
	];

	if (command === "serve") {
		const { devtools } = await import("@tanstack/devtools-vite");
		plugins.splice(
			1,
			0,
			devtools({
				eventBusConfig: {
					enabled: false,
				},
			}),
		);
	}

	return {
		server: {
			host: "0.0.0.0",
		},
		preview: {
			host: "0.0.0.0",
		},
		plugins,
	};
});
