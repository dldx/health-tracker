<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { healthStore } from '$lib/stores/health.svelte';
	import DayPicker from '$lib/components/DayPicker.svelte';
	import MoodSelector from '$lib/components/MoodSelector.svelte';
	import AilmentSelector from '$lib/components/AilmentSelector.svelte';
	import LogAilmentSheet from '$lib/components/LogAilmentSheet.svelte';
	import PeriodLogger from '$lib/components/PeriodLogger.svelte';
	import { PeriodTrackerButton, TodayEntriesSection } from '$lib/components/today';
	import type { AilmentType, MoodLevel } from '$lib/types';

	// Sheet state
	let selectedAilment = $state<AilmentType | null>(null);
	let showSheet = $state(false);
	let showPeriodSheet = $state(false);

	function handleAilmentSelect(ailment: AilmentType) {
		selectedAilment = ailment;
		showSheet = true;
	}

	function handleSheetClose() {
		showSheet = false;
		selectedAilment = null;
	}

	function handleEntrySaved() {
		showSheet = false;
		selectedAilment = null;
	}

	function handlePeriodSheetClose() {
		showPeriodSheet = false;
	}

	function handlePeriodSaved() {
		showPeriodSheet = false;
	}

	async function handleMoodSelect(mood: MoodLevel) {
		await healthStore.setMood(healthStore.selectedDate, mood);
	}

	async function handleDeleteEntry(id: string) {
		await healthStore.deleteEntry(id);
	}

	// Derived state
	const entries = $derived(healthStore.selectedDateEntriesWithDetails);
	const currentMood = $derived(healthStore.selectedDateCheckIn?.mood);
	const currentPeriod = $derived(healthStore.selectedDatePeriod);
</script>

<main class="space-y-4 mx-auto px-4 py-6 max-w-md">
	<!-- Header -->
	<header class="mb-6 text-center">
		<h1 class="font-bold text-jade-600 text-2xl neon-glow">
			{i18n.t.dayView.title}
		</h1>
		<p class="text-charcoal-400 text-sm">
			{i18n.t.dayView.subtitle}
		</p>
	</header>

	{#if healthStore.isLoading}
		<!-- Loading State -->
		<div class="flex justify-center items-center py-12">
			<div class="text-charcoal-400">{i18n.t.common.loading}</div>
		</div>
	{:else}
		<!-- Day Picker -->
		<DayPicker
			selectedDate={healthStore.selectedDate}
			onDateChange={(date) => healthStore.setSelectedDate(date)}
		/>

		<!-- Mood Selector -->
		<MoodSelector
			selected={currentMood}
			onSelect={handleMoodSelect}
		/>

		<!-- Period Tracker Button -->
		<PeriodTrackerButton
			currentPeriod={currentPeriod}
			onClick={() => showPeriodSheet = true}
		/>

		<!-- Ailment Selector -->
		<AilmentSelector
			ailmentTypes={healthStore.activeAilmentTypes}
			onSelect={handleAilmentSelect}
		/>

		<!-- Today's Entries -->
		<TodayEntriesSection
			{entries}
			onDelete={handleDeleteEntry}
		/>
	{/if}
</main>

<!-- Log Ailment Sheet -->
{#if showSheet && selectedAilment}
	<LogAilmentSheet
		ailment={selectedAilment}
		date={healthStore.selectedDate}
		onClose={handleSheetClose}
		onSaved={handleEntrySaved}
	/>
{/if}

<!-- Period Logger Sheet -->
{#if showPeriodSheet}
	<PeriodLogger
		date={healthStore.selectedDate}
		existingEntry={currentPeriod}
		onClose={handlePeriodSheetClose}
		onSaved={handlePeriodSaved}
	/>
{/if}
