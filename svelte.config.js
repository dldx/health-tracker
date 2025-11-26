import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// Configure for static GitHub Pages deployment
		adapter: adapter({
			// Default output directory
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: true
		}),
		// Configure paths for GitHub Pages
		// If deploying to username.github.io, leave paths commented
		// If deploying to username.github.io/repo-name, uncomment and set base path:
		// paths: {
		// 	base: process.env.NODE_ENV === 'production' ? '/health-tracker' : '',
		// }
	}
};

export default config;
