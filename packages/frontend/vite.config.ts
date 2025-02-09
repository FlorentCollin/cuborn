import path from "node:path";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [TanStackRouterVite({}), react(), viteCompression()],
	css: {
		postcss: {
			plugins: [tailwindcss()],
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
