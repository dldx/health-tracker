<script lang="ts">
	import {
		DragDropProvider,
		DragOverlay,
		KeyboardSensor,
		PointerSensor,
	} from "@dnd-kit-svelte/svelte";
	import { useSortable } from "@dnd-kit-svelte/svelte/sortable";
	import { move } from "@dnd-kit/helpers";
	import {
		ChevronLeft,
		ChevronRight,
		Filter,
		Settings2,
		Check,
		GripVertical,
		Eye,
		EyeOff,
	} from "lucide-svelte";
	import Icon from "@iconify/svelte";
	import { i18n } from "$lib/i18n";
	import { healthStore } from "$lib/stores/health.svelte";
	import { getMonthRange, getDatesInMonth } from "$lib/utils/date";
	import { cn } from "$lib/utils/cn";
	import {
		SummaryCards,
		SeverityTrendChart,
		TimeOfDayPattern,
		WeeklyPattern,
		TriggerCorrelation,
		AilmentFrequency,
		TopTriggers,
		CalendarHeatmap,
		CycleStatistics,
		PeriodCorrelation,
	} from "$lib/components/stats";
	import type { StatsTileConfig, StatsTileId, MoodLevel } from "$lib/types";

	// Current view month
	let currentYear = $state(new Date().getFullYear());
	let currentMonth = $state(new Date().getMonth());

	// Ailment filter
	let selectedAilmentId = $state<string | null>(null);

	// Scroll state for sticky header shadow
	let scrollY = $state(0);
	const isScrolled = $derived(scrollY > 20);

	// Edit mode for tile reordering
	let isEditMode = $state(false);

	// Local tile order for drag operations
	let localTiles = $state<StatsTileConfig[]>([]);

	// Sync local tiles with store
	$effect(() => {
		const sorted = healthStore.sortedStatsTiles;
		const visible = healthStore.visibleStatsTiles;

		if (isEditMode) {
			localTiles = [...sorted];
		} else {
			localTiles = [...visible];
		}
	});

	function toggleEditMode() {
		isEditMode = !isEditMode;
	}

	async function toggleTileVisibility(tileId: StatsTileId) {
		await healthStore.toggleStatsTileVisibility(tileId);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function handleDragOver(event: any) {
		localTiles = move(localTiles, event) as StatsTileConfig[];
	}

	async function handleDragEnd(event: { canceled?: boolean }) {
		if (event.canceled) return;
		const newOrder = localTiles.map((t) => t.id);
		await healthStore.reorderStatsTiles(newOrder);
	}

	function getTileName(id: StatsTileId): string {
		return i18n.t.tiles.statsNames[id];
	}

	function getTileShouldShow(id: StatsTileId): boolean {
		switch (id) {
			case "summary":
				return monthEntries.length > 0;
			case "severityTrend":
				return monthEntries.length > 1;
			case "timeOfDay":
			case "weeklyPattern":
				return monthEntries.length > 0;
			case "triggerCorrelation":
				return triggerCorrelations().length > 0;
			case "ailmentFrequency":
				return selectedAilmentId === null;
			case "topTriggers":
				return (
					selectedAilmentId === null ||
					triggerCorrelations().length === 0
				);
			case "calendarHeatmap":
				return true;
			case "cycleStats":
				return !selectedAilmentId && cycleStats.totalCyclesTracked > 0;
			case "periodCorrelation":
				return (
					periodAilmentCorrelation() !== null ||
					(healthStore.periodEntries.length === 0 &&
						monthEntries.length > 0)
				);
			default:
				return true;
		}
	}

	interface SortableTileProps {
		tile: StatsTileConfig;
		index: number;
	}

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
		const isCurrentMonth =
			currentYear === now.getFullYear() &&
			currentMonth === now.getMonth();
		if (isCurrentMonth) return;

		if (currentMonth === 11) {
			currentMonth = 0;
			currentYear++;
		} else {
			currentMonth++;
		}
	}

	function canGoForward(): boolean {
		const now = new Date();
		return !(
			currentYear === now.getFullYear() && currentMonth === now.getMonth()
		);
	}

	function getFirstDayOfMonth(): number {
		// 0 = Monday, 6 = Sunday
		const day = new Date(currentYear, currentMonth, 1).getDay();
		return (day + 6) % 7;
	}

	// Computed stats
	const monthRange = $derived(getMonthRange(currentYear, currentMonth));
	const monthDates = $derived(getDatesInMonth(currentYear, currentMonth));
	const allMonthEntries = $derived(
		healthStore.getEntriesInRange(monthRange.start, monthRange.end),
	);

	// Filtered entries based on selected ailment
	const monthEntries = $derived(
		selectedAilmentId
			? allMonthEntries.filter(
					(e) => e.ailmentTypeId === selectedAilmentId,
				)
			: allMonthEntries,
	);

	const monthName = $derived(i18n.t.calendar.months[currentMonth]);
	const periodDates = $derived(healthStore.periodDates);

	// Ailment frequency
	const ailmentCounts = $derived(() => {
		const counts: Record<string, number> = {};
		for (const entry of allMonthEntries) {
			counts[entry.ailmentTypeId] =
				(counts[entry.ailmentTypeId] || 0) + 1;
		}
		return Object.entries(counts)
			.map(([id, count]) => ({
				ailment: healthStore.ailmentTypes.find((a) => a.id === id),
				count,
			}))
			.filter((item) => item.ailment)
			.sort((a, b) => b.count - a.count);
	});

	// Trigger frequency for filtered entries
	const triggerCounts = $derived(() => {
		const counts: Record<string, number> = {};
		for (const entry of monthEntries) {
			for (const triggerId of entry.triggerIds) {
				counts[triggerId] = (counts[triggerId] || 0) + 1;
			}
		}
		return Object.entries(counts)
			.map(([id, count]) => ({
				trigger: healthStore.triggerTypes.find((t) => t.id === id),
				count,
				percentage:
					monthEntries.length > 0
						? Math.round((count / monthEntries.length) * 100)
						: 0,
			}))
			.filter((item) => item.trigger)
			.sort((a, b) => b.count - a.count)
			.slice(0, 6);
	});

	// Severity trend data (daily averages)
	const severityTrend = $derived(() => {
		const dailySeverities: Record<string, { sum: number; count: number }> =
			{};
		for (const entry of monthEntries) {
			if (!dailySeverities[entry.date]) {
				dailySeverities[entry.date] = { sum: 0, count: 0 };
			}
			dailySeverities[entry.date].sum += entry.severity;
			dailySeverities[entry.date].count++;
		}
		return monthDates.map((date) => ({
			date,
			avgSeverity: dailySeverities[date]
				? dailySeverities[date].sum / dailySeverities[date].count
				: null,
		}));
	});

	// Time of day distribution
	const timeOfDayStats = $derived(() => {
		const periods = { morning: 0, afternoon: 0, evening: 0, night: 0 };
		for (const entry of monthEntries) {
			const hour = parseInt(entry.time.split(":")[0]);
			if (hour >= 5 && hour < 12) periods.morning++;
			else if (hour >= 12 && hour < 17) periods.afternoon++;
			else if (hour >= 17 && hour < 21) periods.evening++;
			else periods.night++;
		}
		const total = monthEntries.length || 1;
		return Object.entries(periods).map(([period, count]) => ({
			period,
			count,
			percentage: Math.round((count / total) * 100),
		}));
	});

	// Weekly pattern
	const weekdayStats = $derived(() => {
		const days = [0, 0, 0, 0, 0, 0, 0];
		for (const entry of monthEntries) {
			const dayOfWeek = new Date(entry.date + "T00:00:00").getDay();
			days[dayOfWeek]++;
		}
		const max = Math.max(...days, 1);
		return days.map((count, idx) => ({
			day: ["S", "M", "T", "W", "T", "F", "S"][idx],
			count,
			percentage: Math.round((count / max) * 100),
		}));
	});

	// Trigger correlation - which triggers appear most with current filter
	const triggerCorrelations = $derived(() => {
		if (monthEntries.length === 0) return [];

		const triggerStats: Record<
			string,
			{ appearances: number; totalSeverity: number; avgSeverity: number }
		> = {};

		for (const entry of monthEntries) {
			for (const triggerId of entry.triggerIds) {
				if (!triggerStats[triggerId]) {
					triggerStats[triggerId] = {
						appearances: 0,
						totalSeverity: 0,
						avgSeverity: 0,
					};
				}
				triggerStats[triggerId].appearances++;
				triggerStats[triggerId].totalSeverity += entry.severity;
			}
		}

		type CorrelationLevel = "high" | "medium" | "low";
		const getCorrelationLevel = (corr: number): CorrelationLevel =>
			corr >= 50 ? "high" : corr >= 25 ? "medium" : "low";

		const results: Array<{
			trigger: (typeof healthStore.triggerTypes)[0] | null;
			isPeriod?: boolean;
			appearances: number;
			correlation: number;
			avgSeverity: string;
			correlationLevel: CorrelationLevel;
		}> = Object.entries(triggerStats)
			.map(([id, stats]) => {
				const trigger = healthStore.triggerTypes.find(
					(t) => t.id === id,
				);
				const correlation =
					(stats.appearances / monthEntries.length) * 100;
				const avgSeverity = stats.totalSeverity / stats.appearances;
				return {
					trigger: trigger || null,
					appearances: stats.appearances,
					correlation: Math.round(correlation),
					avgSeverity: avgSeverity.toFixed(1),
					correlationLevel: getCorrelationLevel(correlation),
				};
			})
			.filter((item) => item.trigger);

		// Add period as a pseudo-trigger if user has period data
		const periodDateSet = healthStore.periodDates;
		if (periodDateSet.size > 0) {
			const periodEntries = monthEntries.filter((e) =>
				periodDateSet.has(e.date),
			);
			if (periodEntries.length > 0) {
				const correlation =
					(periodEntries.length / monthEntries.length) * 100;
				const avgSeverity =
					periodEntries.reduce((sum, e) => sum + e.severity, 0) /
					periodEntries.length;
				results.push({
					trigger: null,
					isPeriod: true,
					appearances: periodEntries.length,
					correlation: Math.round(correlation),
					avgSeverity: avgSeverity.toFixed(1),
					correlationLevel: getCorrelationLevel(correlation),
				});
			}
		}

		return results
			.sort((a, b) => b.correlation - a.correlation)
			.slice(0, 6);
	});

	// Summary stats
	const summaryStats = $derived(() => {
		if (monthEntries.length === 0) {
			return {
				totalEntries: 0,
				avgSeverity: "0",
				avgPerWeek: "0",
				peakTime: "-",
			};
		}

		const total = monthEntries.length;
		const avgSev =
			monthEntries.reduce((sum, e) => sum + e.severity, 0) / total;
		const weeksInMonth = monthDates.length / 7;
		const avgPerWeek = total / weeksInMonth;

		// Find peak time
		const hourCounts: Record<number, number> = {};
		for (const entry of monthEntries) {
			const hour = parseInt(entry.time.split(":")[0]);
			hourCounts[hour] = (hourCounts[hour] || 0) + 1;
		}
		const peakHour = Object.entries(hourCounts).sort(
			(a, b) => b[1] - a[1],
		)[0];
		const peakTime = peakHour ? `${peakHour[0].padStart(2, "0")}:00` : "-";

		return {
			totalEntries: total,
			avgSeverity: avgSev.toFixed(1),
			avgPerWeek: avgPerWeek.toFixed(1),
			peakTime,
		};
	});

	// Entries by date for calendar
	const entriesByDate = $derived(() => {
		const result: Record<string, number> = {};
		for (const entry of monthEntries) {
			result[entry.date] = (result[entry.date] || 0) + 1;
		}
		return result;
	});

	// Max severity by date
	const maxSeverityByDate = $derived(() => {
		const result: Record<string, number> = {};
		for (const entry of monthEntries) {
			result[entry.date] = Math.max(
				result[entry.date] || 0,
				entry.severity,
			);
		}
		return result;
	});

	// Mood by date
	const moodByDate = $derived(() => {
		const result: Record<string, MoodLevel> = {};
		for (const checkIn of healthStore.dailyCheckIns) {
			result[checkIn.date] = checkIn.mood;
		}
		return result;
	});

	// Cycle statistics
	const cycleStats = $derived(healthStore.cycleStats);

	// Period-Ailment Correlation Analysis
	const periodAilmentCorrelation = $derived(() => {
		const periodDateSet = healthStore.periodDates;
		const entriesToAnalyze = monthEntries;

		if (periodDateSet.size === 0 || entriesToAnalyze.length === 0)
			return null;

		const monthPeriodDates = monthDates.filter((d) => periodDateSet.has(d));
		const monthNonPeriodDates = monthDates.filter(
			(d) => !periodDateSet.has(d),
		);

		if (monthPeriodDates.length === 0) return null;

		const periodEntries = entriesToAnalyze.filter((e) =>
			periodDateSet.has(e.date),
		);
		const nonPeriodEntries = entriesToAnalyze.filter(
			(e) => !periodDateSet.has(e.date),
		);

		if (periodEntries.length === 0 && nonPeriodEntries.length === 0)
			return null;

		const periodRate =
			monthPeriodDates.length > 0
				? periodEntries.length / monthPeriodDates.length
				: 0;
		const nonPeriodRate =
			monthNonPeriodDates.length > 0
				? nonPeriodEntries.length / monthNonPeriodDates.length
				: 0;

		const periodAvgSeverity =
			periodEntries.length > 0
				? periodEntries.reduce((sum, e) => sum + e.severity, 0) /
					periodEntries.length
				: 0;
		const nonPeriodAvgSeverity =
			nonPeriodEntries.length > 0
				? nonPeriodEntries.reduce((sum, e) => sum + e.severity, 0) /
					nonPeriodEntries.length
				: 0;

		const ailmentCorrelations: Array<{
			ailment: (typeof healthStore.ailmentTypes)[0];
			periodCount: number;
			nonPeriodCount: number;
			periodRate: number;
			nonPeriodRate: number;
			increase: number;
			periodAvgSeverity: number;
			nonPeriodAvgSeverity: number;
		}> = [];

		if (!selectedAilmentId) {
			for (const ailmentType of healthStore.ailmentTypes) {
				const ailmentPeriodEntries = periodEntries.filter(
					(e) => e.ailmentTypeId === ailmentType.id,
				);
				const ailmentNonPeriodEntries = nonPeriodEntries.filter(
					(e) => e.ailmentTypeId === ailmentType.id,
				);

				if (
					ailmentPeriodEntries.length === 0 &&
					ailmentNonPeriodEntries.length === 0
				)
					continue;

				const aPeriodRate =
					monthPeriodDates.length > 0
						? ailmentPeriodEntries.length / monthPeriodDates.length
						: 0;
				const aNonPeriodRate =
					monthNonPeriodDates.length > 0
						? ailmentNonPeriodEntries.length /
							monthNonPeriodDates.length
						: 0;

				const increase =
					aNonPeriodRate > 0
						? ((aPeriodRate - aNonPeriodRate) / aNonPeriodRate) *
							100
						: aPeriodRate > 0
							? 100
							: 0;

				const aPeriodAvgSeverity =
					ailmentPeriodEntries.length > 0
						? ailmentPeriodEntries.reduce(
								(sum, e) => sum + e.severity,
								0,
							) / ailmentPeriodEntries.length
						: 0;
				const aNonPeriodAvgSeverity =
					ailmentNonPeriodEntries.length > 0
						? ailmentNonPeriodEntries.reduce(
								(sum, e) => sum + e.severity,
								0,
							) / ailmentNonPeriodEntries.length
						: 0;

				ailmentCorrelations.push({
					ailment: ailmentType,
					periodCount: ailmentPeriodEntries.length,
					nonPeriodCount: ailmentNonPeriodEntries.length,
					periodRate: aPeriodRate,
					nonPeriodRate: aNonPeriodRate,
					increase: Math.round(increase),
					periodAvgSeverity: aPeriodAvgSeverity,
					nonPeriodAvgSeverity: aNonPeriodAvgSeverity,
				});
			}

			ailmentCorrelations.sort(
				(a, b) => Math.abs(b.increase) - Math.abs(a.increase),
			);
		}

		return {
			periodDays: monthPeriodDates.length,
			nonPeriodDays: monthNonPeriodDates.length,
			periodEntryCount: periodEntries.length,
			nonPeriodEntryCount: nonPeriodEntries.length,
			overallPeriodRate: periodRate,
			overallNonPeriodRate: nonPeriodRate,
			overallIncrease:
				nonPeriodRate > 0
					? Math.round(
							((periodRate - nonPeriodRate) / nonPeriodRate) *
								100,
						)
					: periodRate > 0
						? 100
						: 0,
			periodAvgSeverity,
			nonPeriodAvgSeverity,
			ailmentCorrelations: ailmentCorrelations
				.filter((a) => a.periodCount > 0 || a.nonPeriodCount > 0)
				.slice(0, 5),
		};
	});

	// Computed values for display
	const maxAilmentCount = $derived(
		ailmentCounts().length > 0 ? ailmentCounts()[0].count : 1,
	);
	const maxTriggerCount = $derived(
		triggerCounts().length > 0 ? triggerCounts()[0].count : 1,
	);

	// Selected ailment name for period correlation
	const selectedAilmentName = $derived(
		selectedAilmentId
			? i18n.localizedName(
					healthStore.ailmentTypes.find(
						(a) => a.id === selectedAilmentId,
					)!,
				)
			: undefined,
	);
</script>

<svelte:window bind:scrollY />

<main class="space-y-5 mx-auto px-4 py-6 pb-24 max-w-md">
	<!-- Header -->
	<header class="relative text-center">
		<h1 class="font-bold text-jade-600 text-2xl neon-glow">
			{i18n.t.stats.title}
		</h1>
		<p class="text-charcoal-400 text-sm">
			{i18n.t.stats.subtitle}
		</p>

		<!-- Edit Mode Toggle -->
		<button
			type="button"
			onclick={toggleEditMode}
			class="top-1/2 right-0 absolute p-2 rounded-lg transition-all -translate-y-1/2"
			class:bg-jade-100={isEditMode}
			class:text-jade-600={isEditMode}
			class:hover:bg-jade-200={isEditMode}
			class:text-charcoal-400={!isEditMode}
			class:hover:bg-charcoal-100={!isEditMode}
			class:hover:text-charcoal-600={!isEditMode}
			title={isEditMode
				? i18n.t.tiles.doneEditing
				: i18n.t.tiles.editMode}
		>
			{#if isEditMode}
				<Check class="w-5 h-5" />
			{:else}
				<Settings2 class="w-5 h-5" />
			{/if}
		</button>
	</header>

	{#if isEditMode}
		<div
			class="bg-jade-50 px-4 py-2 border border-jade-100 rounded-lg text-charcoal-400 text-sm text-center"
		>
			{i18n.t.tiles.dragHint}
		</div>
	{/if}

	<!-- Sticky Controls: Month Navigator + Ailment Filter -->
	<div
		class={cn(
			"bg-white/80 p-4 border border-jade-200 rounded-xl transition-all duration-200",
			isEditMode ? "relative z-0" : "top-2 z-20 sticky",
			isScrolled && !isEditMode ? "shadow-lg" : "shadow-none",
		)}
		style="backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);"
	>
		<!-- Month Navigator -->
		<div class="flex justify-between items-center" class:mb-3={!isEditMode}>
			<button
				type="button"
				onclick={previousMonth}
				class="hover:bg-jade-50 p-2 rounded-full transition-colors"
			>
				<ChevronLeft class="w-5 h-5 text-charcoal-500" />
			</button>
			<span class="font-semibold text-charcoal-600 text-lg">
				{monthName}
				{currentYear}
			</span>
			<button
				type="button"
				onclick={nextMonth}
				disabled={!canGoForward()}
				class="hover:bg-jade-50 disabled:opacity-30 p-2 rounded-full transition-colors"
			>
				<ChevronRight class="w-5 h-5 text-charcoal-500" />
			</button>
		</div>

		<!-- Ailment Filter (hidden in edit mode) -->
		{#if !healthStore.isLoading && ailmentCounts().length > 0 && !isEditMode}
			<div class="pt-3 border-jade-200 border-t">
				<div class="flex items-center gap-2 mb-2">
					<Filter class="w-4 h-4 text-jade-500" />
					<span class="font-semibold text-charcoal-500 text-xs"
						>{i18n.t.stats.filterBy}</span
					>
				</div>
				<div class="flex flex-wrap gap-2">
					<button
						type="button"
						onclick={() => (selectedAilmentId = null)}
						class={cn(
							"px-3 py-1.5 border rounded-full font-medium text-sm transition-all",
							selectedAilmentId === null
								? "bg-jade-400 text-white shadow-md border-jade-400"
								: "bg-cream-50 text-charcoal-500 hover:bg-jade-50 border-jade-200",
						)}
					>
						{i18n.t.stats.allAilments}
					</button>
					{#each ailmentCounts() as item}
						{#if item.ailment}
							<button
								type="button"
								onclick={() =>
									(selectedAilmentId = item.ailment!.id)}
								class={cn(
									"flex items-center gap-1.5 px-3 py-1.5 border rounded-full font-medium text-sm transition-all",
									selectedAilmentId === item.ailment.id
										? "bg-jade-400 text-white shadow-md border-jade-400"
										: "bg-cream-50 text-charcoal-500 hover:bg-jade-50 border-jade-200",
								)}
							>
								<span class="text-base">
									{#if item.ailment.icon.includes(":")}
										<Icon
											icon={item.ailment.icon}
											class="w-4 h-4"
										/>
									{:else}
										{item.ailment.icon}
									{/if}
								</span>
								<span>{i18n.localizedName(item.ailment)}</span>
								<span
									class={cn(
										"px-1.5 py-0.5 rounded-full text-xs",
										selectedAilmentId === item.ailment.id
											? "bg-white/20"
											: "bg-jade-100",
									)}
								>
									{item.count}
								</span>
							</button>
						{/if}
					{/each}
				</div>
			</div>
		{/if}
	</div>

	{#if healthStore.isLoading}
		<div class="flex justify-center items-center py-12">
			<div class="text-charcoal-400">{i18n.t.common.loading}</div>
		</div>
	{:else}
		<DragDropProvider
			sensors={[KeyboardSensor, PointerSensor]}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
		>
			<div class="space-y-5">
				{#each localTiles as tile, index (tile.id)}
					{@render SortableTileWrapper({ tile, index })}
				{/each}
			</div>

			<DragOverlay>
				{#snippet children(source)}
					{@const tile = localTiles.find((t) => t.id === source.id)}
					{#if tile}
						<div
							class="opacity-95 max-w-md rotate-1 scale-[1.02] pointer-events-none"
						>
							{@render TileContent(tile.id)}
						</div>
					{/if}
				{/snippet}
			</DragOverlay>
		</DragDropProvider>

		<!-- Empty state -->
		{#if allMonthEntries.length === 0}
			<div class="p-8 text-center card">
				<div class="mb-3 text-4xl">📊</div>
				<p class="font-medium text-charcoal-500">
					{i18n.t.stats.noData}
				</p>
				<p class="mt-1 text-charcoal-400 text-sm">
					Start logging to see your insights
				</p>
			</div>
		{/if}
	{/if}
</main>

{#snippet SortableTileWrapper({ tile, index }: SortableTileProps)}
	{@const sortable = useSortable({
		id: tile.id,
		index: () => index,
		group: "stats-tiles",
		data: () => ({ tile, index }),
		disabled: () => !isEditMode,
	})}
	{@const shouldShow = getTileShouldShow(tile.id)}
	{#if shouldShow || isEditMode}
		<div
			{@attach sortable.ref}
			class="relative transition-all duration-200"
			class:opacity-50={sortable.isDragging.current}
			class:scale-[1.02]={sortable.isDropTarget.current}
			class:ring-2={sortable.isDropTarget.current}
			class:ring-jade-400={sortable.isDropTarget.current}
		>
			{#if isEditMode}
				<!-- Controls on the left -->
				<div
					class="top-1/2 left-1 z-10 absolute flex flex-col gap-1 -translate-y-1/2"
				>
					<button
						{@attach sortable.handleRef}
						type="button"
						class="bg-jade-100 hover:bg-jade-200 shadow-sm p-1.5 border border-jade-200 rounded-lg touch-none cursor-grab active:cursor-grabbing"
						aria-label="Drag to reorder"
					>
						<GripVertical class="w-4 h-4 text-jade-600" />
					</button>
					<button
						type="button"
						onclick={() => toggleTileVisibility(tile.id)}
						class="shadow-sm p-1.5 border rounded-lg transition-colors"
						class:bg-jade-100={tile.visible}
						class:border-jade-200={tile.visible}
						class:hover:bg-jade-200={tile.visible}
						class:bg-charcoal-100={!tile.visible}
						class:border-charcoal-200={!tile.visible}
						class:hover:bg-charcoal-200={!tile.visible}
						aria-label={tile.visible ? "Hide tile" : "Show tile"}
					>
						{#if tile.visible}
							<Eye class="w-4 h-4 text-jade-600" />
						{:else}
							<EyeOff class="w-4 h-4 text-charcoal-400" />
						{/if}
					</button>
				</div>
			{/if}

			<div
				class="transition-all duration-200"
				class:pl-12={isEditMode}
				class:opacity-40={isEditMode && (!tile.visible || !shouldShow)}
				class:grayscale={isEditMode && (!tile.visible || !shouldShow)}
			>
				{@render TileContent(tile.id)}
			</div>
		</div>
	{/if}
{/snippet}

{#snippet TileContent(tileId: StatsTileId)}
	{#if tileId === "summary"}
		{#if monthEntries.length > 0}
			<SummaryCards {...summaryStats()} />
		{:else if isEditMode}
			<div class="p-4 card text-center text-charcoal-400 text-sm">
				{getTileName("summary")} - {i18n.t.stats.noData}
			</div>
		{/if}
	{:else if tileId === "severityTrend"}
		{#if monthEntries.length > 1}
			<SeverityTrendChart trend={severityTrend()} {monthDates} />
		{:else if isEditMode}
			<div class="p-4 card text-center text-charcoal-400 text-sm">
				{getTileName("severityTrend")} - {i18n.t.stats.noData}
			</div>
		{/if}
	{:else if tileId === "timeOfDay"}
		{#if monthEntries.length > 0}
			<TimeOfDayPattern stats={timeOfDayStats()} />
		{:else if isEditMode}
			<div class="p-4 card text-center text-charcoal-400 text-sm">
				{getTileName("timeOfDay")} - {i18n.t.stats.noData}
			</div>
		{/if}
	{:else if tileId === "weeklyPattern"}
		{#if monthEntries.length > 0}
			<WeeklyPattern stats={weekdayStats()} />
		{:else if isEditMode}
			<div class="p-4 card text-center text-charcoal-400 text-sm">
				{getTileName("weeklyPattern")} - {i18n.t.stats.noData}
			</div>
		{/if}
	{:else if tileId === "triggerCorrelation"}
		{#if triggerCorrelations().length > 0}
			<TriggerCorrelation items={triggerCorrelations()} />
		{:else if isEditMode}
			<div class="p-4 card text-center text-charcoal-400 text-sm">
				{getTileName("triggerCorrelation")} - {i18n.t.stats.noData}
			</div>
		{/if}
	{:else if tileId === "ailmentFrequency"}
		{#if selectedAilmentId === null}
			<AilmentFrequency
				items={ailmentCounts()}
				maxCount={maxAilmentCount}
			/>
		{:else if isEditMode}
			<div class="p-4 card text-center text-charcoal-400 text-sm">
				{getTileName("ailmentFrequency")} - Filtered
			</div>
		{/if}
	{:else if tileId === "topTriggers"}
		{#if selectedAilmentId === null || triggerCorrelations().length === 0}
			<TopTriggers items={triggerCounts()} maxCount={maxTriggerCount} />
		{:else if isEditMode}
			<div class="p-4 card text-center text-charcoal-400 text-sm">
				{getTileName("topTriggers")} - Filtered
			</div>
		{/if}
	{:else if tileId === "calendarHeatmap"}
		<CalendarHeatmap
			{monthDates}
			entriesByDate={entriesByDate()}
			maxSeverityByDate={maxSeverityByDate()}
			moodByDate={moodByDate()}
			{periodDates}
			firstDayOffset={getFirstDayOfMonth()}
		/>
	{:else if tileId === "cycleStats"}
		{#if !selectedAilmentId && cycleStats.totalCyclesTracked > 0}
			<CycleStatistics stats={cycleStats} />
		{:else if isEditMode}
			<div class="p-4 card text-center text-charcoal-400 text-sm">
				{getTileName("cycleStats")} - {cycleStats.totalCyclesTracked ===
				0
					? i18n.t.stats.noData
					: "Filtered"}
			</div>
		{/if}
	{:else if tileId === "periodCorrelation"}
		{#if periodAilmentCorrelation()}
			<PeriodCorrelation
				correlation={periodAilmentCorrelation()!}
				{selectedAilmentName}
				showPerAilmentBreakdown={!selectedAilmentId}
			/>
		{:else if healthStore.periodEntries.length === 0 && monthEntries.length > 0}
			<section class="p-4 card">
				<div class="py-2 text-center">
					<span class="block mb-2 text-2xl">🩸</span>
					<p class="text-charcoal-500 text-sm">
						{i18n.t.stats.noPeriodData}
					</p>
				</div>
			</section>
		{:else if isEditMode}
			<div class="p-4 card text-center text-charcoal-400 text-sm">
				{getTileName("periodCorrelation")} - {i18n.t.stats.noData}
			</div>
		{/if}
	{/if}
{/snippet}
