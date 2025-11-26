<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { cn } from '$lib/utils/cn';

	interface Props {
		monthDates: string[];
		entriesByDate: Record<string, number>;
		maxSeverityByDate: Record<string, number>;
		periodDates: Set<string>;
		firstDayOffset: number;
	}

	let { monthDates, entriesByDate, maxSeverityByDate, periodDates, firstDayOffset }: Props = $props();

	function getDayColor(date: string): string {
		const severity = maxSeverityByDate[date];
		if (!severity) return 'bg-cream-200';
		if (severity <= 2) return 'bg-jade-300';
		if (severity <= 3) return 'bg-gold-300';
		return 'bg-coral-400';
	}
</script>

<section class="p-4 card">
	<h2 class="mb-4 font-semibold text-charcoal-600 text-sm">
		{i18n.t.stats.calendarHeatmap}
	</h2>

	<!-- Weekday headers -->
	<div class="gap-1 grid grid-cols-7 mb-2">
		{#each ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as day}
			<div class="font-medium text-charcoal-400 text-xs text-center">
				{day}
			</div>
		{/each}
	</div>

	<!-- Calendar grid -->
	<div class="gap-1 grid grid-cols-7">
		<!-- Empty cells for offset -->
		{#each Array(firstDayOffset) as _}
			<div class="aspect-square"></div>
		{/each}

		<!-- Date cells -->
		{#each monthDates as date}
			{@const dayNum = new Date(date + 'T00:00:00').getDate()}
			{@const entryCount = entriesByDate[date] || 0}
			{@const hasEntries = entryCount > 0}
			{@const isPeriodDay = periodDates.has(date)}
			<div
				class={cn(
					'flex flex-col rounded-md aspect-square overflow-hidden text-xs',
					hasEntries ? 'font-semibold' : 'text-charcoal-400'
				)}
				title={hasEntries ? `${entryCount} entries${isPeriodDay ? ' (period)' : ''}` : isPeriodDay ? 'Period day' : undefined}
			>
				<div class={cn(
					'flex flex-1 justify-center items-center',
					getDayColor(date)
				)}>
					{dayNum}
				</div>
				{#if isPeriodDay}
					<div class="bg-pink-400 w-full h-1.5 shrink-0"></div>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Legend -->
	<div class="flex flex-wrap justify-center items-center gap-3 mt-4 text-charcoal-400 text-xs">
		<div class="flex items-center gap-1">
			<div class="bg-cream-200 rounded w-3 h-3"></div>
			<span>None</span>
		</div>
		<div class="flex items-center gap-1">
			<div class="bg-jade-300 rounded w-3 h-3"></div>
			<span>Mild</span>
		</div>
		<div class="flex items-center gap-1">
			<div class="bg-gold-300 rounded w-3 h-3"></div>
			<span>Moderate</span>
		</div>
		<div class="flex items-center gap-1">
			<div class="bg-coral-400 rounded w-3 h-3"></div>
			<span>Severe</span>
		</div>
		{#if periodDates.size > 0}
			<div class="flex items-center gap-1">
				<div class="flex flex-col rounded w-3 h-3 overflow-hidden">
					<div class="flex-1 bg-cream-200"></div>
					<div class="bg-pink-400 h-1"></div>
				</div>
				<span>{i18n.t.period.title}</span>
			</div>
		{/if}
	</div>
</section>

