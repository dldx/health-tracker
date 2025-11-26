<script lang="ts">
	import { Zap } from 'lucide-svelte';
	import Icon from '@iconify/svelte';
	import { i18n } from '$lib/i18n';
	import { cn } from '$lib/utils/cn';
	import type { TriggerType } from '$lib/types';

	interface CorrelationItem {
		trigger: TriggerType | null;
		isPeriod?: boolean;
		appearances: number;
		correlation: number;
		avgSeverity: string;
		correlationLevel: 'high' | 'medium' | 'low';
	}

	interface Props {
		items: CorrelationItem[];
	}

	let { items }: Props = $props();
</script>

<section class="p-4 card">
	<div class="flex items-center gap-2 mb-4">
		<Zap class="w-4 h-4 text-jade-500" />
		<h2 class="font-semibold text-charcoal-600 text-sm">
			{i18n.t.stats.triggerCorrelation}
		</h2>
	</div>

	<div class="space-y-3">
		{#each items as item}
			{#if item.trigger || item.isPeriod}
				<div class="flex items-center gap-3">
					<div
						class={cn(
							'flex justify-center items-center rounded-lg w-10 h-10 text-lg',
							item.isPeriod
								? 'bg-pink-100'
								: item.correlationLevel === 'high'
									? 'bg-coral-100'
									: item.correlationLevel === 'medium'
										? 'bg-gold-100'
										: 'bg-cream-200'
						)}
					>
						{#if item.isPeriod}
							<span>🩸</span>
						{:else if item.trigger}
							<Icon icon={item.trigger.icon} />
						{/if}
					</div>
					<div class="flex-1 min-w-0">
						<div class="flex justify-between items-center mb-1">
							<span class="font-medium text-charcoal-600 text-sm truncate">
								{#if item.isPeriod}
									{i18n.t.period.title}
								{:else if item.trigger}
									{i18n.localizedName(item.trigger)}
								{/if}
							</span>
							<span
								class={cn(
									'px-2 py-0.5 rounded-full text-xs',
									item.isPeriod
										? 'bg-pink-100 text-pink-600'
										: item.correlationLevel === 'high'
											? 'bg-coral-100 text-coral-600'
											: item.correlationLevel === 'medium'
												? 'bg-gold-100 text-gold-600'
												: 'bg-cream-200 text-charcoal-500'
								)}
							>
								{item.correlation}%
							</span>
						</div>
						<div class="bg-cream-200 rounded-full h-1.5 overflow-hidden">
							<div
								class={cn(
									'rounded-full h-full transition-all duration-500',
									item.isPeriod
										? 'bg-pink-400'
										: item.correlationLevel === 'high'
											? 'bg-coral-400'
											: item.correlationLevel === 'medium'
												? 'bg-gold-400'
												: 'bg-jade-300'
								)}
								style="width: {item.correlation}%"
							></div>
						</div>
						<div class="flex justify-between mt-1 text-[10px] text-charcoal-400">
							<span>{item.appearances}× {i18n.t.stats.entries}</span>
							<span>Avg: {item.avgSeverity}/5</span>
						</div>
					</div>
				</div>
			{/if}
		{/each}
	</div>
</section>

