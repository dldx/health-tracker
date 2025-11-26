<script lang="ts">
	import { i18n } from '$lib/i18n';

	interface CycleStats {
		averageCycleLength: number;
		averagePeriodLength: number;
		lastPeriodStart: string | null;
		predictedNextStart: string | null;
		totalCyclesTracked: number;
	}

	interface Props {
		stats: CycleStats;
	}

	let { stats }: Props = $props();
</script>

<section class="p-4 card">
	<h2 class="flex items-center gap-2 mb-4 font-semibold text-charcoal-600 text-sm">
		<span>🩸</span>
		{i18n.t.period.stats.title}
	</h2>
	<div class="gap-4 grid grid-cols-2">
		<div class="bg-pink-50 p-3 rounded-lg text-center">
			<p class="font-bold text-pink-600 text-2xl">{stats.averageCycleLength}</p>
			<p class="text-charcoal-500 text-xs">{i18n.t.period.stats.averageCycle}</p>
			<p class="text-charcoal-400 text-xs">{i18n.t.period.stats.days}</p>
		</div>
		<div class="bg-pink-50 p-3 rounded-lg text-center">
			<p class="font-bold text-pink-600 text-2xl">{stats.averagePeriodLength}</p>
			<p class="text-charcoal-500 text-xs">{i18n.t.period.stats.averagePeriod}</p>
			<p class="text-charcoal-400 text-xs">{i18n.t.period.stats.days}</p>
		</div>
	</div>
	{#if stats.lastPeriodStart}
		<div class="space-y-2 mt-4 pt-4 border-charcoal-100 border-t">
			<div class="flex justify-between text-sm">
				<span class="text-charcoal-500">{i18n.t.period.stats.lastPeriod}</span>
				<span class="font-medium text-charcoal-600">{stats.lastPeriodStart}</span>
			</div>
			{#if stats.predictedNextStart}
				<div class="flex justify-between text-sm">
					<span class="text-charcoal-500">{i18n.t.period.stats.nextPredicted}</span>
					<span class="font-medium text-pink-600">{stats.predictedNextStart}</span>
				</div>
			{/if}
		</div>
	{/if}
	<p class="mt-3 text-charcoal-400 text-xs text-center">
		{stats.totalCyclesTracked}
		{i18n.t.period.stats.cyclesTracked}
	</p>
</section>

