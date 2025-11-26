<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { healthStore } from '$lib/stores/health.svelte';
	import { i18n } from '$lib/i18n';
	import Navigation from '$lib/components/Navigation.svelte';
	import InstallPrompt from '$lib/components/InstallPrompt.svelte';
	import Onboarding from '$lib/components/Onboarding.svelte';
	import { Toaster } from 'svelte-sonner';
	import { registerServiceWorker, requestPersistentStorage } from '$lib/utils/pwa';

	let { children } = $props();

	// Dynamic app title based on custom name
	const appTitle = $derived.by(() => {
		if (healthStore.customName) {
			return i18n.locale === 'en'
				? `${healthStore.customName}'s Health Tracker`
				: `${healthStore.customName} 嘅健康追蹤`;
		}
		return 'Health Tracker 健康追蹤';
	});

	onMount(async () => {
		try {
			// Initialize health store
			await healthStore.initialize();

			// Check URL for custom name easter egg (e.g., ?name=Eliza)
			await healthStore.checkUrlForCustomName();

			// Register service worker for PWA support
			await registerServiceWorker();

			// Request persistent storage for better data retention
			await requestPersistentStorage();
		} catch (error) {
			console.error('Failed to initialize app:', error);
		}
	});
</script>

<svelte:head>
	<title>{appTitle}</title>
	<meta name="description" content="Track your health, identify triggers. 追蹤你嘅健康，識別誘因。" />
	<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
	<meta name="theme-color" content="#7ba888" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+HK:wght@400;500;600;700&display=swap" rel="stylesheet" />
</svelte:head>

<Toaster
	position="top-center"
	richColors
	toastOptions={{
		style: 'font-family: "Noto Sans HK", sans-serif;'
	}}
/>

{#if healthStore.isInitialized && !healthStore.hasCompletedOnboarding}
	<Onboarding />
{:else if healthStore.isInitialized}
	<div class="safe-top pb-20 min-h-screen">
		{@render children()}
	</div>

	<Navigation />
	<InstallPrompt />
{/if}
