<script lang="ts">
	import { DragDropProvider, DragOverlay, KeyboardSensor, PointerSensor } from '@dnd-kit-svelte/svelte';
	import { useSortable } from '@dnd-kit-svelte/svelte/sortable';
	import { move } from '@dnd-kit/helpers';
	import { Settings2, GripVertical, Check, Eye, EyeOff } from 'lucide-svelte';
	import { i18n } from '$lib/i18n';
	import { healthStore } from '$lib/stores/health.svelte';
	import DayPicker from '$lib/components/DayPicker.svelte';
	import MoodSelector from '$lib/components/MoodSelector.svelte';
	import AilmentSelector from '$lib/components/AilmentSelector.svelte';
	import LogAilmentSheet from '$lib/components/LogAilmentSheet.svelte';
	import PeriodLogger from '$lib/components/PeriodLogger.svelte';
	import { PeriodTrackerButton, TodayEntriesSection } from '$lib/components/today';
	import type { AilmentType, MoodLevel, TileConfig, TileId } from '$lib/types';

	// Sheet state
	let selectedAilment = $state<AilmentType | null>(null);
	let showSheet = $state(false);
	let showPeriodSheet = $state(false);
	let isEditMode = $state(false);

	// Local tile order for drag operations - show ALL tiles in edit mode, only visible in normal mode
	let localTiles = $state<TileConfig[]>([]);

	// Use separate effects for clarity
	$effect(() => {
		// Read both arrays to track them as dependencies
		const sorted = healthStore.sortedTiles;
		const visible = healthStore.visibleTiles;

		// Update based on edit mode
		if (isEditMode) {
			localTiles = [...sorted];
		} else {
			localTiles = [...visible];
		}
	});

	async function toggleTileVisibility(tileId: TileId) {
		await healthStore.toggleTileVisibility(tileId);
	}

	function handleAilmentSelect(ailment: AilmentType) {
		if (isEditMode) return;
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
		if (isEditMode) return;
		await healthStore.setMood(healthStore.selectedDate, mood);
	}

	async function handleDeleteEntry(id: string) {
		if (isEditMode) return;
		await healthStore.deleteEntry(id);
	}

	function handlePeriodClick() {
		if (isEditMode) return;
		showPeriodSheet = true;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function handleDragOver(event: any) {
		localTiles = move(localTiles, event) as TileConfig[];
	}

	async function handleDragEnd(event: { canceled?: boolean }) {
		if (event.canceled) return;

		// In edit mode, localTiles already contains all tiles
		const newOrder = localTiles.map(t => t.id);
		await healthStore.reorderTiles(newOrder);
	}

	function toggleEditMode() {
		isEditMode = !isEditMode;
	}

	// Derived state
	const entries = $derived(healthStore.selectedDateEntriesWithDetails);
	const currentMood = $derived(healthStore.selectedDateCheckIn?.mood);
	const currentPeriod = $derived(healthStore.selectedDatePeriod);

	// Dynamic title based on custom name
	const pageTitle = $derived.by(() => {
		if (healthStore.customName) {
			return i18n.locale === 'en'
				? `${healthStore.customName}'s Health Tracker`
				: `${healthStore.customName} 嘅健康追蹤`;
		}
		return i18n.t.dayView.title;
	});

	const pageSubtitle = $derived.by(() => {
		if (healthStore.customName) {
			return i18n.locale === 'en'
				? 'Track your health'
				: '追蹤你嘅健康';
		}
		return i18n.t.dayView.subtitle;
	});

	function getTileName(id: TileId): string {
		return i18n.t.tiles.names[id];
	}

	interface SortableTileProps {
		tile: TileConfig;
		index: number;
	}
</script>

{#snippet SortableTileWrapper({ tile, index }: SortableTileProps)}
	{@const sortable = useSortable({
		id: tile.id,
		index: () => index,
		group: 'home-tiles',
		data: () => ({ tile, index }),
		disabled: () => !isEditMode
	})}
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
			<div class="top-1/2 left-1 z-10 absolute flex flex-col gap-1 -translate-y-1/2">
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
					aria-label={tile.visible ? 'Hide tile' : 'Show tile'}
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
			class:opacity-40={isEditMode && !tile.visible}
			class:grayscale={isEditMode && !tile.visible}
		>
			{#if tile.id === 'dayPicker'}
				<DayPicker
					selectedDate={healthStore.selectedDate}
					onDateChange={(date) => !isEditMode && healthStore.setSelectedDate(date)}
				/>
			{:else if tile.id === 'mood'}
				<MoodSelector
					selected={currentMood}
					onSelect={handleMoodSelect}
				/>
			{:else if tile.id === 'period'}
				<PeriodTrackerButton
					currentPeriod={currentPeriod}
					onClick={handlePeriodClick}
				/>
			{:else if tile.id === 'ailments'}
				<AilmentSelector
					ailmentTypes={healthStore.activeAilmentTypes}
					onSelect={handleAilmentSelect}
				/>
			{:else if tile.id === 'entries'}
				{#if isEditMode}
					<!-- Collapsed view in edit mode -->
					<div class="p-4 text-center card">
						<div class="font-medium text-charcoal-500">{i18n.t.tiles.names.entries}</div>
						<div class="text-charcoal-400 text-sm">{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</div>
					</div>
				{:else}
					<TodayEntriesSection
						{entries}
						onDelete={handleDeleteEntry}
					/>
				{/if}
			{/if}
		</div>
	</div>
{/snippet}

<main class="space-y-4 mx-auto px-4 py-6 max-w-md overflow-visible">
	<!-- Header -->
	<header class="relative mb-6 text-center">
		<h1 class="font-bold text-jade-600 text-2xl neon-glow">
			{pageTitle}
		</h1>
		<p class="text-charcoal-400 text-sm">
			{pageSubtitle}
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
			title={isEditMode ? i18n.t.tiles.doneEditing : i18n.t.tiles.editMode}
		>
			{#if isEditMode}
				<Check class="w-5 h-5" />
			{:else}
				<Settings2 class="w-5 h-5" />
			{/if}
		</button>
	</header>

	{#if isEditMode}
		<div class="bg-jade-50 px-4 py-2 border border-jade-100 rounded-lg text-charcoal-400 text-sm text-center">
			{i18n.t.tiles.dragHint}
		</div>
	{/if}

	{#if healthStore.isLoading}
		<!-- Loading State -->
		<div class="flex justify-center items-center py-12">
			<div class="text-charcoal-400">{i18n.t.common.loading}</div>
		</div>
	{:else}
		<DragDropProvider
			sensors={[KeyboardSensor, PointerSensor]}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
		>
			<div class="space-y-4 overflow-visible">
				{#each localTiles as tile, index (tile.id)}
					{@render SortableTileWrapper({ tile, index })}
				{/each}
			</div>

		<DragOverlay>
			{#snippet children(source)}
				{@const tile = localTiles.find(t => t.id === source.id)}
				{#if tile}
					<div class="opacity-95 max-w-md rotate-1 scale-[1.02] pointer-events-none">
						{#if tile.id === 'dayPicker'}
							<DayPicker
								selectedDate={healthStore.selectedDate}
								onDateChange={() => {}}
							/>
						{:else if tile.id === 'mood'}
							<MoodSelector
								selected={currentMood}
								onSelect={() => {}}
							/>
						{:else if tile.id === 'period'}
							<PeriodTrackerButton
								currentPeriod={currentPeriod}
								onClick={() => {}}
							/>
						{:else if tile.id === 'ailments'}
							<AilmentSelector
								ailmentTypes={healthStore.activeAilmentTypes}
								onSelect={() => {}}
							/>
						{:else if tile.id === 'entries'}
							<TodayEntriesSection
								{entries}
								onDelete={async () => {}}
							/>
						{/if}
					</div>
				{/if}
			{/snippet}
		</DragOverlay>
		</DragDropProvider>
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

