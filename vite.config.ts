import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	server: {
		hmr: {
			// Fix WebSocket connection issues
			protocol: 'ws',
			host: 'localhost',
			port: 5173
		}
	}
});
