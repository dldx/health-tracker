<script lang="ts">
	import { Clock } from 'lucide-svelte';
	import Icon from '@iconify/svelte';
	import { i18n } from '$lib/i18n';
	import { cn } from '$lib/utils/cn';

	interface TimeStat {
		period: string;
		count: number;
		percentage: number;
	}

	interface Props {
		stats: TimeStat[];
	}

	let { stats }: Props = $props();

	const timeIcons: Record<string, string> = {
		morning: 'ph:sun-horizon-duotone',
		afternoon: 'ph:sun-duotone',
		evening: 'ph:cloud-sun-duotone',
		night: 'ph:moon-stars-duotone'
	};

	const timeLabels = $derived({
		morning: i18n.t.stats.morning,
		afternoon: i18n.t.stats.afternoon,
		evening: i18n.t.stats.evening,
		night: i18n.t.stats.night
	});
</script>

<section class="p-4 card">
	<div class="flex items-center gap-2 mb-4">
		<Clock class="w-4 h-4 text-jade-500" />
		<h2 class="font-semibold text-charcoal-600 text-sm">
			{i18n.t.stats.timeOfDay}
		</h2>
	</div>

	<div class="gap-2 grid grid-cols-4">
		{#each stats as stat}
			{@const label = timeLabels[stat.period as keyof typeof timeLabels]}
			<div class="text-center">
				<div
					class={cn(
						'flex justify-center items-center mx-auto mb-2 rounded-xl w-14 h-14 transition-all',
						stat.percentage >= 40
							? 'bg-coral-100 text-coral-600'
							: stat.percentage >= 20
								? 'bg-gold-100 text-gold-600'
								: 'bg-cream-200 text-charcoal-400'
					)}
				>
					<Icon icon={timeIcons[stat.period]} class="w-6 h-6" />
				</div>
				<p class="font-medium text-charcoal-600 text-xs">{label}</p>
				<p class="font-bold text-charcoal-500 text-lg">{stat.count}</p>
				<p class="text-[10px] text-charcoal-400">{stat.percentage}%</p>
			</div>
		{/each}
	</div>
</section>

