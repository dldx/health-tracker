<script lang="ts">
	import Icon from '@iconify/svelte';
	import { i18n } from '$lib/i18n';
	import type { TriggerType } from '$lib/types';

	interface TriggerCount {
		trigger: TriggerType | undefined;
		count: number;
		percentage: number;
	}

	interface Props {
		items: TriggerCount[];
		maxCount: number;
	}

	let { items, maxCount }: Props = $props();
</script>

<section class="p-4 card">
	<h2 class="mb-4 font-semibold text-charcoal-600 text-sm">
		{i18n.t.stats.topTriggers}
	</h2>
	{#if items.length === 0}
		<p class="py-4 text-charcoal-400 text-sm text-center">{i18n.t.stats.noData}</p>
	{:else}
		<div class="space-y-3">
			{#each items as item}
				{#if item.trigger}
					<div class="flex items-center gap-3">
						<span class="text-xl">
							<Icon icon={item.trigger.icon} />
						</span>
						<div class="flex-1">
							<div class="flex justify-between mb-1 text-sm">
								<span class="text-charcoal-600">{i18n.localizedName(item.trigger)}</span>
								<span class="text-charcoal-400">{item.count} {i18n.t.stats.times}</span>
							</div>
							<div class="bg-cream-200 rounded-full h-2 overflow-hidden">
								<div
									class="bg-coral-400 rounded-full h-full transition-all duration-500"
									style="width: {(item.count / maxCount) * 100}%"
								></div>
							</div>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</section>

