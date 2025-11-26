<script lang="ts">
	import { User, X } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { i18n } from '$lib/i18n';
	import { healthStore } from '$lib/stores/health.svelte';

	let nameInput = $state(healthStore.customName || '');
	let isSaving = $state(false);

	// Sync input with store when it changes externally
	$effect(() => {
		nameInput = healthStore.customName || '';
	});

	async function handleSave() {
		if (isSaving) return;

		isSaving = true;
		try {
			const trimmedName = nameInput.trim();
			if (trimmedName) {
				await healthStore.setCustomName(trimmedName);
				toast.success(i18n.t.settings.customNameSaved);
			}
		} catch (error) {
			console.error('Failed to save name:', error);
			toast.error(i18n.t.errors.saveFailed);
		} finally {
			isSaving = false;
		}
	}

	async function handleClear() {
		if (isSaving) return;

		isSaving = true;
		try {
			await healthStore.clearCustomName();
			nameInput = '';
			toast.success(i18n.t.settings.customNameCleared);
		} catch (error) {
			console.error('Failed to clear name:', error);
			toast.error(i18n.t.errors.deleteFailed);
		} finally {
			isSaving = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleSave();
		}
	}
</script>

<section class="bg-cream-50 rounded-2xl shadow-soft p-4">
	<div class="flex items-center gap-3 mb-3">
		<div class="p-2 bg-jade-100 rounded-lg">
			<User class="w-5 h-5 text-jade-600" />
		</div>
		<div>
			<h2 class="font-semibold text-charcoal-600">
				{i18n.t.settings.personalization}
			</h2>
			<p class="text-xs text-charcoal-400">
				{i18n.t.settings.customNameHint}
			</p>
		</div>
	</div>

	<div class="space-y-3">
		<div class="relative">
			<label for="custom-name" class="block text-sm text-charcoal-500 mb-1">
				{i18n.t.settings.customName}
			</label>
			<div class="flex gap-2">
				<input
					id="custom-name"
					type="text"
					bind:value={nameInput}
					onkeydown={handleKeydown}
					placeholder={i18n.t.settings.customNamePlaceholder}
					class="flex-1 px-3 py-2 bg-white border border-charcoal-200 rounded-lg
						text-charcoal-600 placeholder:text-charcoal-300
						focus:outline-none focus:ring-2 focus:ring-jade-400 focus:border-transparent
						transition-all duration-200"
				/>
				{#if healthStore.customName}
					<button
						onclick={handleClear}
						disabled={isSaving}
						class="px-3 py-2 bg-charcoal-100 text-charcoal-500 rounded-lg
							hover:bg-charcoal-200 transition-colors duration-200
							disabled:opacity-50 disabled:cursor-not-allowed"
						title="Clear name"
					>
						<X class="w-5 h-5" />
					</button>
				{/if}
				<button
					onclick={handleSave}
					disabled={isSaving || !nameInput.trim()}
					class="px-4 py-2 bg-jade-500 text-white rounded-lg font-medium
						hover:bg-jade-600 transition-colors duration-200
						disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{i18n.t.common.save}
				</button>
			</div>
		</div>

		{#if healthStore.customName}
			<p class="text-xs text-jade-600 flex items-center gap-1">
				<span class="inline-block w-2 h-2 bg-jade-500 rounded-full"></span>
				{i18n.locale === 'en'
					? `App title: "${healthStore.customName}'s Health Tracker"`
					: `應用程式標題：「${healthStore.customName} 嘅健康追蹤」`}
			</p>
		{/if}

		<p class="text-xs text-charcoal-400 italic">
			{i18n.locale === 'en'
				? '💡 Tip: You can also set your name via URL: ?name=YourName'
				: '💡 提示：你亦可以用網址設定名稱：?name=你嘅名'}
		</p>
	</div>
</section>

