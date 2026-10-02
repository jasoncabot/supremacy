import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

import { cloudflare } from '@cloudflare/vite-plugin';

// https://vite.dev/config/
export default defineConfig({
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("node_modules/react") || id.includes("node_modules/react-dom") || id.includes("node_modules/react-router")) {
						return "react";
					}

					if (id.includes("node_modules/@heroicons") || id.includes("node_modules/@headlessui")) {
						return "ui";
					}

					return undefined;
				},
			},
		},
	},
	plugins: [react(), tailwindcss(), cloudflare()],
});
