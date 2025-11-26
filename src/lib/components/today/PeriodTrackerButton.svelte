<script lang="ts">
	import { i18n } from '$lib/i18n';
	import type { PeriodEntry } from '$lib/types';

	interface Props {
		currentPeriod: PeriodEntry | undefined;
		onClick: () => void;
	}

	let { currentPeriod, onClick }: Props = $props();
</script>

<button
	type="button"
	onclick={onClick}
	class="flex justify-between items-center p-4 hover:border-pink-300 w-full transition-all card"
	class:border-pink-400={currentPeriod}
	class:bg-pink-50={currentPeriod}
>
	<div class="flex items-center gap-3">
		<span class="text-2xl">🩸</span>
		<div class="text-left">
			<span class="font-medium text-charcoal-600">{i18n.t.period.logPeriod}</span>
			{#if currentPeriod}
				<p class="text-pink-600 text-xs">
					{i18n.t.period.flow[currentPeriod.flow]}
					{#if currentPeriod.symptoms.length > 0}
						• {currentPeriod.symptoms.length} {i18n.t.period.symptoms.toLowerCase()}
					{/if}
				</p>
			{:else}
				<p class="text-charcoal-400 text-xs">{i18n.t.period.subtitle}</p>
			{/if}
		</div>
	</div>
	<span class="text-charcoal-400">›</span>
</button>

