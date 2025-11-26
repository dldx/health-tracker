<script lang="ts">
	import Icon from '@iconify/svelte';
	import { i18n } from '$lib/i18n';
	import { cn } from '$lib/utils/cn';
	import type { AilmentType } from '$lib/types';

	interface AilmentCorrelation {
		ailment: AilmentType;
		periodCount: number;
		nonPeriodCount: number;
		periodRate: number;
		nonPeriodRate: number;
		increase: number;
		periodAvgSeverity: number;
		nonPeriodAvgSeverity: number;
	}

	interface CorrelationData {
		periodDays: number;
		nonPeriodDays: number;
		periodEntryCount: number;
		nonPeriodEntryCount: number;
		overallPeriodRate: number;
		overallNonPeriodRate: number;
		overallIncrease: number;
		periodAvgSeverity: number;
		nonPeriodAvgSeverity: number;
		ailmentCorrelations: AilmentCorrelation[];
	}

	interface Props {
		correlation: CorrelationData;
		selectedAilmentName?: string;
		showPerAilmentBreakdown: boolean;
	}

	let { correlation, selectedAilmentName, showPerAilmentBreakdown }: Props = $props();
</script>

<section class="p-4 card">
	<h2 class="flex items-center gap-2 mb-4 font-semibold text-charcoal-600 text-sm">
		<span>🔗</span>
		{i18n.t.stats.periodCorrelation}
		{#if selectedAilmentName}
			<span class="font-normal text-charcoal-400 text-xs">
				— {selectedAilmentName}
			</span>
		{/if}
	</h2>

	<!-- Overall comparison -->
	<div class="gap-3 grid grid-cols-2 mb-4">
		<div class="bg-pink-50 p-3 border border-pink-200 rounded-lg text-center">
			<p class="font-bold text-pink-600 text-xl">{correlation.periodEntryCount}</p>
			<p class="text-charcoal-500 text-xs">{i18n.t.stats.duringPeriod}</p>
			<p class="text-[10px] text-charcoal-400">{correlation.periodDays} days</p>
		</div>
		<div class="bg-cream-100 p-3 border border-cream-300 rounded-lg text-center">
			<p class="font-bold text-charcoal-600 text-xl">{correlation.nonPeriodEntryCount}</p>
			<p class="text-charcoal-500 text-xs">{i18n.t.stats.outsidePeriod}</p>
			<p class="text-[10px] text-charcoal-400">{correlation.nonPeriodDays} days</p>
		</div>
	</div>

	<!-- Overall rate comparison -->
	{#if correlation.periodEntryCount > 0 || correlation.nonPeriodEntryCount > 0}
		<div class="bg-linear-to-r from-pink-50 to-cream-100 mb-4 p-3 rounded-lg text-center">
			<p class="text-charcoal-600 text-sm">
				{#if correlation.nonPeriodEntryCount === 0}
					<span class="font-bold text-pink-600">{i18n.t.stats.onlyDuringPeriod}</span>
				{:else if correlation.periodEntryCount === 0}
					<span class="font-bold text-jade-600">{i18n.t.stats.onlyOutsidePeriod}</span>
				{:else if correlation.overallIncrease > 0}
					<span class="font-bold text-pink-600">+{correlation.overallIncrease}%</span>
					{i18n.t.stats.moreCommon}
					<span class="text-charcoal-400"> during period</span>
				{:else if correlation.overallIncrease < 0}
					<span class="font-bold text-jade-600">{correlation.overallIncrease}%</span>
					{i18n.t.stats.lessCommon}
					<span class="text-charcoal-400"> during period</span>
				{:else}
					<span class="text-charcoal-500">{i18n.t.stats.noCorrelation}</span>
				{/if}
			</p>
		</div>
	{/if}

	<!-- Severity comparison -->
	{#if correlation.periodAvgSeverity > 0 || correlation.nonPeriodAvgSeverity > 0}
		<div class="flex justify-between items-center gap-2 bg-cream-50 mb-4 p-2 rounded-lg">
			<div class="flex-1 text-center">
				<p class="font-bold text-pink-500 text-lg">{correlation.periodAvgSeverity.toFixed(1)}</p>
				<p class="text-[10px] text-charcoal-400">{i18n.t.stats.avgSeverityDuring}</p>
			</div>
			<div class="text-charcoal-300">vs</div>
			<div class="flex-1 text-center">
				<p class="font-bold text-charcoal-500 text-lg">{correlation.nonPeriodAvgSeverity.toFixed(1)}</p>
				<p class="text-[10px] text-charcoal-400">{i18n.t.stats.avgSeverityOutside}</p>
			</div>
		</div>
	{/if}

	<!-- Per-ailment breakdown -->
	{#if showPerAilmentBreakdown && correlation.ailmentCorrelations.length > 0}
		<div class="pt-4 border-charcoal-100 border-t">
			<p class="mb-3 font-semibold text-charcoal-500 text-xs">Per Ailment</p>
			<div class="space-y-3">
				{#each correlation.ailmentCorrelations as item}
					{@const totalRate = item.periodRate + item.nonPeriodRate}
					{@const periodPct = totalRate > 0 ? (item.periodRate / totalRate) * 100 : 50}
					{@const nonPeriodPct = totalRate > 0 ? (item.nonPeriodRate / totalRate) * 100 : 50}
					<div class="flex items-center gap-3">
						<span class="text-lg">
							{#if item.ailment.icon.includes(':')}
								<Icon icon={item.ailment.icon} />
							{:else}
								{item.ailment.icon}
							{/if}
						</span>
						<div class="flex-1 min-w-0">
							<div class="flex justify-between items-center mb-1">
								<span class="text-charcoal-600 text-sm truncate">
									{i18n.localizedName(item.ailment)}
								</span>
								<span class={cn(
									'px-2 py-0.5 rounded-full font-medium text-xs',
									item.increase > 20 ? 'bg-pink-100 text-pink-600' :
									item.increase < -20 ? 'bg-jade-100 text-jade-600' :
									'bg-cream-200 text-charcoal-500'
								)}>
									{item.increase > 0 ? '+' : ''}{item.increase}%
								</span>
							</div>
							<!-- Stacked bar chart -->
							<div class="flex rounded-full h-2.5 overflow-hidden">
								<div
									class="bg-pink-400 h-full transition-all"
									style="width: {periodPct}%"
									title="{i18n.t.stats.duringPeriod}: {item.periodCount}"
								></div>
								<div
									class="bg-charcoal-300 h-full transition-all"
									style="width: {nonPeriodPct}%"
									title="{i18n.t.stats.outsidePeriod}: {item.nonPeriodCount}"
								></div>
							</div>
							<div class="flex justify-between mt-1 text-[10px] text-charcoal-400">
								<span class="text-pink-500">{item.periodCount} during ({periodPct.toFixed(0)}%)</span>
								<span>{item.nonPeriodCount} outside ({nonPeriodPct.toFixed(0)}%)</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</section>

