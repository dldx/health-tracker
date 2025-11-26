<script lang="ts">
	import { onMount } from 'svelte';
	import { Download, X } from 'lucide-svelte';
	import { i18n } from '$lib/i18n';

	let showPrompt = $state(false);
	let deferredPrompt: any = null;
	let isInstalled = $state(false);

	onMount(() => {
		// Check if already installed
		const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
		const isIOSStandalone = (window.navigator as any).standalone === true;
		isInstalled = isStandalone || isIOSStandalone;

		// Check if user has dismissed the prompt before
		const dismissed = localStorage.getItem('installPromptDismissed');
		if (dismissed || isInstalled) {
			return;
		}

		// Listen for the beforeinstallprompt event
		const handleBeforeInstall = (e: Event) => {
			e.preventDefault();
			deferredPrompt = e;
			// Show the prompt after a short delay
			setTimeout(() => {
				showPrompt = true;
			}, 3000);
		};

		window.addEventListener('beforeinstallprompt', handleBeforeInstall);

		// Listen for successful installation
		window.addEventListener('appinstalled', () => {
			console.log('PWA was installed');
			showPrompt = false;
			deferredPrompt = null;
		});

		return () => {
			window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
		};
	});

	async function handleInstall() {
		if (!deferredPrompt) {
			return;
		}

		deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;

		console.log(`User response to install prompt: ${outcome}`);

		deferredPrompt = null;
		showPrompt = false;
	}

	function handleDismiss() {
		showPrompt = false;
		localStorage.setItem('installPromptDismissed', 'true');
	}
</script>

{#if showPrompt && !isInstalled}
	<div class="right-4 bottom-24 left-4 z-40 fixed animate-slide-in-bottom">
		<div class="bg-white shadow-lg mx-auto p-4 border border-charcoal-200 rounded-2xl max-w-md">
			<div class="flex items-start gap-3">
				<div class="flex-shrink-0 bg-sage-100 p-2 rounded-lg">
					<Download class="w-5 h-5 text-sage-600" />
				</div>
				<div class="flex-1 min-w-0">
					<h3 class="mb-1 font-semibold text-charcoal-600">
						{i18n.t.pwa?.installTitle || 'Install App'}
					</h3>
					<p class="mb-3 text-charcoal-500 text-sm">
						{i18n.t.pwa?.installMessage || 'Install this app on your device for quick access and offline use.'}
					</p>
					<div class="flex gap-2">
						<button
							type="button"
							onclick={handleInstall}
							class="px-4 py-2 text-sm btn-primary"
						>
							{i18n.t.pwa?.install || 'Install'}
						</button>
						<button
							type="button"
							onclick={handleDismiss}
							class="px-4 py-2 text-sm btn-secondary"
						>
							{i18n.t.common?.later || 'Later'}
						</button>
					</div>
				</div>
				<button
					type="button"
					onclick={handleDismiss}
					class="flex-shrink-0 hover:bg-charcoal-100 p-1 rounded transition-colors"
					aria-label="Close"
				>
					<X class="w-4 h-4 text-charcoal-400" />
				</button>
			</div>
		</div>
	</div>
{/if}

