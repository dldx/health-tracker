<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { healthStore } from '$lib/stores/health.svelte';
	import DayPicker from '$lib/components/DayPicker.svelte';
	import MoodSelector from '$lib/components/MoodSelector.svelte';
	import AilmentSelector from '$lib/components/AilmentSelector.svelte';
	import HealthEntryCard from '$lib/components/HealthEntryCard.svelte';
	import LogAilmentSheet from '$lib/components/LogAilmentSheet.svelte';
	import PeriodLogger from '$lib/components/PeriodLogger.svelte';
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

<main class="max-w-md mx-auto px-4 py-6 space-y-4">
	<!-- Header -->
	<header class="text-center mb-6">
		<h1 class="text-2xl font-bold text-jade-600 neon-glow">
			{i18n.t.dayView.title}
		</h1>
		<p class="text-sm text-charcoal-400">
			{i18n.t.dayView.subtitle}
		</p>
	</header>

	{#if healthStore.isLoading}
		<!-- Loading State -->
		<div class="flex items-center justify-center py-12">
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
		<button
			type="button"
			onclick={() => showPeriodSheet = true}
			class="card p-4 w-full flex items-center justify-between hover:border-pink-300 transition-all"
			class:border-pink-400={currentPeriod}
			class:bg-pink-50={currentPeriod}
		>
			<div class="flex items-center gap-3">
				<span class="text-2xl">🩸</span>
				<div class="text-left">
					<span class="font-medium text-charcoal-600">{i18n.t.period.logPeriod}</span>
					{#if currentPeriod}
						<p class="text-xs text-pink-600">
							{i18n.t.period.flow[currentPeriod.flow]}
							{#if currentPeriod.symptoms.length > 0}
								• {currentPeriod.symptoms.length} {i18n.t.period.symptoms.toLowerCase()}
							{/if}
						</p>
					{:else}
						<p class="text-xs text-charcoal-400">{i18n.t.period.subtitle}</p>
					{/if}
				</div>
			</div>
			<span class="text-charcoal-400">›</span>
		</button>

		<!-- Ailment Selector -->
		<AilmentSelector
			ailmentTypes={healthStore.activeAilmentTypes}
			onSelect={handleAilmentSelect}
		/>

		<!-- Today's Entries -->
		<section>
			<div class="divider-gold my-4">
				{i18n.t.dayView.todayEntries}
			</div>

			{#if entries.length === 0}
				<div class="card p-8 text-center">
					<p class="text-charcoal-400">{i18n.t.dayView.noEntries}</p>
					<p class="text-sm text-charcoal-300 mt-1">{i18n.t.dayView.noEntriesHint}</p>
				</div>
			{:else}
				<div class="space-y-3">
					{#each entries as entry, index}
						<div class="stagger-{Math.min(index + 1, 5)}">
							<HealthEntryCard
								{entry}
								onDelete={handleDeleteEntry}
							/>
						</div>
					{/each}
				</div>
			{/if}
		</section>
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
