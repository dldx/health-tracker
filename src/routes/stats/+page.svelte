<script lang="ts">
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import Icon from '@iconify/svelte';
	import { i18n } from '$lib/i18n';
	import { healthStore } from '$lib/stores/health.svelte';
	import { getMonthRange, getDatesInMonth } from '$lib/utils/date';
	import { cn } from '$lib/utils/cn';

	// Current view month
	let currentYear = $state(new Date().getFullYear());
	let currentMonth = $state(new Date().getMonth());

	function previousMonth() {
		if (currentMonth === 0) {
			currentMonth = 11;
			currentYear--;
		} else {
			currentMonth--;
		}
	}

	function nextMonth() {
		const now = new Date();
		const isCurrentMonth = currentYear === now.getFullYear() && currentMonth === now.getMonth();
		if (isCurrentMonth) return;

		if (currentMonth === 11) {
			currentMonth = 0;
			currentYear++;
		} else {
			currentMonth++;
		}
	}

	// Computed stats
	const monthRange = $derived(getMonthRange(currentYear, currentMonth));
	const monthDates = $derived(getDatesInMonth(currentYear, currentMonth));
	const monthEntries = $derived(healthStore.getEntriesInRange(monthRange.start, monthRange.end));

	// Ailment frequency
	const ailmentCounts = $derived(() => {
		const counts: Record<string, number> = {};
		for (const entry of monthEntries) {
			counts[entry.ailmentTypeId] = (counts[entry.ailmentTypeId] || 0) + 1;
		}
		return Object.entries(counts)
			.map(([id, count]) => ({
				ailment: healthStore.ailmentTypes.find(a => a.id === id),
				count
			}))
			.filter(item => item.ailment)
			.sort((a, b) => b.count - a.count);
	});

	// Trigger frequency
	const triggerCounts = $derived(() => {
		const counts: Record<string, number> = {};
		for (const entry of monthEntries) {
			for (const triggerId of entry.triggerIds) {
				counts[triggerId] = (counts[triggerId] || 0) + 1;
			}
		}
		return Object.entries(counts)
			.map(([id, count]) => ({
				trigger: healthStore.triggerTypes.find(t => t.id === id),
				count
			}))
			.filter(item => item.trigger)
			.sort((a, b) => b.count - a.count)
			.slice(0, 5);
	});

	// Calendar heatmap data
	const entriesByDate = $derived(healthStore.getEntriesCountByDate());
	const maxSeverityByDate = $derived(healthStore.getMaxSeverityByDate());
	const periodDates = $derived(healthStore.periodDates);

	// Cycle statistics
	const cycleStats = $derived(healthStore.cycleStats);

	// Month name
	const monthName = $derived(i18n.t.calendar.months[currentMonth]);

	// Can navigate forward
	const canGoForward = $derived(() => {
		const now = new Date();
		return !(currentYear === now.getFullYear() && currentMonth === now.getMonth());
	});

	// Max count for bar chart scaling
	const maxAilmentCount = $derived(Math.max(...(ailmentCounts().map(a => a.count)), 1));
	const maxTriggerCount = $derived(Math.max(...(triggerCounts().map(t => t.count)), 1));

	// Calendar helpers
	function getFirstDayOfMonth(): number {
		return new Date(currentYear, currentMonth, 1).getDay();
	}

	function getDayColor(date: string): string {
		// Check if period day first
		if (periodDates.has(date)) return 'bg-pink-300';

		const severity = maxSeverityByDate[date];
		if (!severity) return 'bg-cream-200';
		if (severity <= 2) return 'bg-jade-300';
		if (severity <= 3) return 'bg-gold-300';
		return 'bg-coral-400';
	}
</script>

<main class="max-w-md mx-auto px-4 py-6 space-y-6">
	<!-- Header -->
	<header class="text-center">
		<h1 class="text-2xl font-bold text-jade-600 neon-glow">
			{i18n.t.stats.title}
		</h1>
		<p class="text-sm text-charcoal-400">
			{i18n.t.stats.subtitle}
		</p>
	</header>

	<!-- Month Navigator -->
	<div class="card p-4">
		<div class="flex items-center justify-between">
			<button
				type="button"
				onclick={previousMonth}
				class="p-2 rounded-lg hover:bg-cream-200 transition-colors"
			>
				<ChevronLeft class="w-5 h-5 text-charcoal-500" />
			</button>
			<span class="text-lg font-semibold text-charcoal-600">
				{monthName} {currentYear}
			</span>
			<button
				type="button"
				onclick={nextMonth}
				disabled={!canGoForward()}
				class="p-2 rounded-lg hover:bg-cream-200 transition-colors disabled:opacity-30"
			>
				<ChevronRight class="w-5 h-5 text-charcoal-500" />
			</button>
		</div>
	</div>

	{#if healthStore.isLoading}
		<div class="flex items-center justify-center py-12">
			<div class="text-charcoal-400">{i18n.t.common.loading}</div>
		</div>
	{:else}
		<!-- Ailment Frequency -->
		<section class="card p-4">
			<h2 class="text-sm font-semibold text-charcoal-600 mb-4">
				{i18n.t.stats.ailmentFrequency}
			</h2>
			{#if ailmentCounts().length === 0}
				<p class="text-sm text-charcoal-400 text-center py-4">{i18n.t.stats.noData}</p>
			{:else}
				<div class="space-y-3">
					{#each ailmentCounts() as item}
						{#if item.ailment}
							<div class="flex items-center gap-3">
								<span class="text-xl">
									{#if item.ailment.icon.includes(':')}
										<Icon icon={item.ailment.icon} />
									{:else}
										{item.ailment.icon}
									{/if}
								</span>
								<div class="flex-1">
									<div class="flex justify-between text-sm mb-1">
										<span class="text-charcoal-600">{i18n.localizedName(item.ailment)}</span>
										<span class="text-charcoal-400">{item.count} {i18n.t.stats.times}</span>
									</div>
								<div class="h-2 bg-cream-200 rounded-full overflow-hidden">
									<div
										class="h-full bg-jade-400 rounded-full transition-all duration-500"
										style="width: {(item.count / maxAilmentCount) * 100}%"
									></div>
								</div>
								</div>
							</div>
						{/if}
					{/each}
				</div>
			{/if}
		</section>

		<!-- Top Triggers -->
		<section class="card p-4">
			<h2 class="text-sm font-semibold text-charcoal-600 mb-4">
				{i18n.t.stats.topTriggers}
			</h2>
			{#if triggerCounts().length === 0}
				<p class="text-sm text-charcoal-400 text-center py-4">{i18n.t.stats.noData}</p>
			{:else}
				<div class="space-y-3">
					{#each triggerCounts() as item}
						{#if item.trigger}
							<div class="flex items-center gap-3">
								<span class="text-xl">
									<Icon icon={item.trigger.icon} />
								</span>
								<div class="flex-1">
									<div class="flex justify-between text-sm mb-1">
										<span class="text-charcoal-600">{i18n.localizedName(item.trigger)}</span>
										<span class="text-charcoal-400">{item.count} {i18n.t.stats.times}</span>
									</div>
								<div class="h-2 bg-cream-200 rounded-full overflow-hidden">
									<div
										class="h-full bg-coral-400 rounded-full transition-all duration-500"
										style="width: {(item.count / maxTriggerCount) * 100}%"
									></div>
								</div>
								</div>
							</div>
						{/if}
					{/each}
				</div>
			{/if}
		</section>

		<!-- Calendar Heatmap -->
		<section class="card p-4">
			<h2 class="text-sm font-semibold text-charcoal-600 mb-4">
				{i18n.t.stats.calendarHeatmap}
			</h2>

			<!-- Weekday headers -->
			<div class="grid grid-cols-7 gap-1 mb-2">
				{#each ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as day}
					<div class="text-xs text-center text-charcoal-400 font-medium">
						{day}
					</div>
				{/each}
			</div>

			<!-- Calendar grid -->
			<div class="grid grid-cols-7 gap-1">
			<!-- Empty cells for offset -->
			{#each Array(getFirstDayOfMonth()) as _}
				<div class="aspect-square"></div>
			{/each}

				<!-- Date cells -->
				{#each monthDates as date}
					{@const dayNum = new Date(date + 'T00:00:00').getDate()}
					{@const hasEntries = entriesByDate[date] > 0}
					<div
						class={cn(
							'aspect-square rounded-md flex items-center justify-center text-xs',
							getDayColor(date),
							hasEntries ? 'font-semibold' : 'text-charcoal-400'
						)}
						title={hasEntries ? `${entriesByDate[date]} entries` : undefined}
					>
						{dayNum}
					</div>
				{/each}
			</div>

		<!-- Legend -->
		<div class="flex flex-wrap items-center justify-center gap-3 mt-4 text-xs text-charcoal-400">
			<div class="flex items-center gap-1">
				<div class="w-3 h-3 rounded bg-cream-200"></div>
				<span>None</span>
			</div>
			<div class="flex items-center gap-1">
				<div class="w-3 h-3 rounded bg-jade-300"></div>
				<span>Mild</span>
			</div>
			<div class="flex items-center gap-1">
				<div class="w-3 h-3 rounded bg-gold-300"></div>
				<span>Moderate</span>
			</div>
			<div class="flex items-center gap-1">
				<div class="w-3 h-3 rounded bg-coral-400"></div>
				<span>Severe</span>
			</div>
			<div class="flex items-center gap-1">
				<div class="w-3 h-3 rounded bg-pink-300"></div>
				<span>Period</span>
			</div>
		</div>
		</section>

		<!-- Cycle Statistics -->
		{#if cycleStats.totalCyclesTracked > 0}
			<section class="card p-4">
				<h2 class="text-sm font-semibold text-charcoal-600 mb-4 flex items-center gap-2">
					<span>🩸</span>
					{i18n.t.period.stats.title}
				</h2>
				<div class="grid grid-cols-2 gap-4">
					<div class="text-center p-3 bg-pink-50 rounded-lg">
						<p class="text-2xl font-bold text-pink-600">{cycleStats.averageCycleLength}</p>
						<p class="text-xs text-charcoal-500">{i18n.t.period.stats.averageCycle}</p>
						<p class="text-xs text-charcoal-400">{i18n.t.period.stats.days}</p>
					</div>
					<div class="text-center p-3 bg-pink-50 rounded-lg">
						<p class="text-2xl font-bold text-pink-600">{cycleStats.averagePeriodLength}</p>
						<p class="text-xs text-charcoal-500">{i18n.t.period.stats.averagePeriod}</p>
						<p class="text-xs text-charcoal-400">{i18n.t.period.stats.days}</p>
					</div>
				</div>
				{#if cycleStats.lastPeriodStart}
					<div class="mt-4 pt-4 border-t border-charcoal-100 space-y-2">
						<div class="flex justify-between text-sm">
							<span class="text-charcoal-500">{i18n.t.period.stats.lastPeriod}</span>
							<span class="text-charcoal-600 font-medium">{cycleStats.lastPeriodStart}</span>
						</div>
						{#if cycleStats.predictedNextStart}
							<div class="flex justify-between text-sm">
								<span class="text-charcoal-500">{i18n.t.period.stats.nextPredicted}</span>
								<span class="text-pink-600 font-medium">{cycleStats.predictedNextStart}</span>
							</div>
						{/if}
					</div>
				{/if}
				<p class="text-xs text-charcoal-400 mt-3 text-center">
					{cycleStats.totalCyclesTracked} {i18n.t.period.stats.cyclesTracked}
				</p>
			</section>
		{/if}
	{/if}
</main>

