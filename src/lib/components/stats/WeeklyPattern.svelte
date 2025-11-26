<script lang="ts">
	import { Calendar } from 'lucide-svelte';
	import { i18n } from '$lib/i18n';

	interface DayStat {
		day: string;
		count: number;
		percentage: number;
	}

	interface Props {
		stats: DayStat[];
	}

	let { stats }: Props = $props();
</script>

<section class="p-4 card">
	<div class="flex items-center gap-2 mb-4">
		<Calendar class="w-4 h-4 text-jade-500" />
		<h2 class="font-semibold text-charcoal-600 text-sm">
			{i18n.t.stats.weekPattern}
		</h2>
	</div>

	<div class="flex justify-between items-end gap-1 h-20">
		{#each stats as stat}
			<div class="flex flex-col flex-1 items-center gap-1">
				<div
					class="bg-jade-400 rounded-t-md w-full transition-all duration-500"
					style="height: {Math.max(stat.percentage * 0.6, 4)}px;"
				></div>
				<span class="font-medium text-charcoal-500 text-xs">{stat.day}</span>
				<span class="text-[10px] text-charcoal-400">{stat.count}</span>
			</div>
		{/each}
	</div>
</section>

