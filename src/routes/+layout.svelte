<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { healthStore } from '$lib/stores/health.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import { Toaster } from 'svelte-sonner';

	let { children } = $props();

	onMount(async () => {
		try {
			await healthStore.initialize();
		} catch (error) {
			console.error('Failed to initialize health store:', error);
		}
	});
</script>

<svelte:head>
	<title>Health Tracker 健康追蹤</title>
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

<div class="min-h-screen pb-20 safe-top">
	{@render children()}
</div>

<Navigation />
