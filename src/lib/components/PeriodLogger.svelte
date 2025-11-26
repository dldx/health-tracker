<script lang="ts">
	import { X, Check, Droplets, Plus } from 'lucide-svelte';
	import { i18n } from '$lib/i18n';
	import { healthStore } from '$lib/stores/health.svelte';
	import { cn } from '$lib/utils/cn';
	import type { FlowLevel, PeriodSymptom, PeriodEntry, BuiltInPeriodSymptom } from '$lib/types';

	interface Props {
		date: string;
		existingEntry?: PeriodEntry;
		onClose: () => void;
		onSaved: () => void;
	}

	let { date, existingEntry, onClose, onSaved }: Props = $props();

	// Form state
	let flow = $state<FlowLevel>(existingEntry?.flow || 'medium');
	let selectedSymptoms = $state<PeriodSymptom[]>(existingEntry?.symptoms ? [...existingEntry.symptoms] : []);
	let notes = $state(existingEntry?.notes || '');
	let isSaving = $state(false);

	// Add symptom modal state
	let showAddSymptomModal = $state(false);
	let newSymptomName = $state('');
	let newSymptomNameZh = $state('');
	let selectedSymptomIcon = $state('😷');
	let isAddingSymptom = $state(false);

	const flowLevels: { value: FlowLevel; emoji: string; color: string }[] = [
		{ value: 'spotting', emoji: '💧', color: 'bg-pink-100 border-pink-300 text-pink-700' },
		{ value: 'light', emoji: '🩸', color: 'bg-pink-200 border-pink-400 text-pink-800' },
		{ value: 'medium', emoji: '🩸🩸', color: 'bg-red-200 border-red-400 text-red-800' },
		{ value: 'heavy', emoji: '🩸🩸🩸', color: 'bg-red-300 border-red-500 text-red-900' }
	];

	// Built-in symptoms
	const builtInSymptoms: { id: BuiltInPeriodSymptom; icon: string }[] = [
		{ id: 'cramps', icon: '😣' },
		{ id: 'bloating', icon: '🫃' },
		{ id: 'headache', icon: '🤕' },
		{ id: 'backPain', icon: '🔙' },
		{ id: 'fatigue', icon: '😴' },
		{ id: 'moodSwings', icon: '🎭' },
		{ id: 'acne', icon: '😖' },
		{ id: 'cravings', icon: '🍫' },
		{ id: 'insomnia', icon: '🌙' },
		{ id: 'nausea', icon: '🤢' }
	];

	// Icon options for custom symptoms
	const symptomIconOptions = [
		'😷', '🤒', '🥴', '😵', '🤧', '😰', '😩', '😫',
		'💔', '🔥', '❄️', '💫', '⚡', '🌡️', '💊', '🩹'
	];

	// Sorted symptoms (built-in + custom, sorted by usage)
	const sortedSymptoms = $derived(() => {
		const usageCounts = healthStore.symptomUsageCounts;

		// Map built-in symptoms
		const builtIn = builtInSymptoms.map(s => ({
			id: s.id as PeriodSymptom,
			icon: s.icon,
			label: i18n.t.period.symptomLabels[s.id],
			isBuiltIn: true
		}));

		// Map custom symptoms
		const custom = healthStore.activeCustomSymptoms.map(s => ({
			id: s.id as PeriodSymptom,
			icon: s.icon,
			label: i18n.locale === 'zh-HK' && s.nameZh ? s.nameZh : s.name,
			isBuiltIn: false
		}));

		// Combine and sort by usage
		return [...builtIn, ...custom].sort((a, b) =>
			(usageCounts[b.id] || 0) - (usageCounts[a.id] || 0)
		);
	});

	function toggleSymptom(symptom: PeriodSymptom) {
		if (selectedSymptoms.includes(symptom)) {
			selectedSymptoms = selectedSymptoms.filter(s => s !== symptom);
		} else {
			selectedSymptoms = [...selectedSymptoms, symptom];
		}
	}

	async function handleSave() {
		if (isSaving) return;
		isSaving = true;

		try {
			await healthStore.setPeriodEntry(date, flow, selectedSymptoms, notes);
			onSaved();
		} catch (error) {
			console.error('Failed to save period entry:', error);
			alert(i18n.t.errors.saveFailed);
		} finally {
			isSaving = false;
		}
	}

	async function handleDelete() {
		if (!existingEntry) return;

		try {
			await healthStore.deletePeriodEntry(date);
			onSaved();
		} catch (error) {
			console.error('Failed to delete period entry:', error);
		}
	}

	async function handleAddSymptom() {
		if (!newSymptomName.trim() || isAddingSymptom) return;

		isAddingSymptom = true;
		try {
			await healthStore.addCustomSymptom({
				name: newSymptomName.trim(),
				nameZh: newSymptomNameZh.trim() || newSymptomName.trim(),
				icon: selectedSymptomIcon,
				isActive: true
			});
			// Reset form
			newSymptomName = '';
			newSymptomNameZh = '';
			selectedSymptomIcon = '😷';
			showAddSymptomModal = false;
		} finally {
			isAddingSymptom = false;
		}
	}

	function closeAddSymptomModal() {
		showAddSymptomModal = false;
		newSymptomName = '';
		newSymptomNameZh = '';
		selectedSymptomIcon = '😷';
	}
</script>

<!-- Backdrop -->
<div
	class="fixed inset-0 bg-black/50 z-50 animate-fade-in"
	onclick={onClose}
	onkeydown={(e) => e.key === 'Escape' && onClose()}
	role="button"
	tabindex="-1"
></div>

<!-- Sheet -->
<div class="fixed inset-x-0 bottom-0 z-50 animate-slide-in-bottom">
	<div class="bg-white rounded-t-3xl max-h-[85vh] flex flex-col safe-bottom">
		<!-- Header -->
		<div class="sticky top-0 bg-white border-b border-charcoal-100 px-4 py-4 flex items-center justify-between">
			<div class="flex items-center gap-3">
				<span class="text-3xl">🩸</span>
				<div>
					<h2 class="font-semibold text-charcoal-600">
						{i18n.t.period.title}
					</h2>
					<p class="text-sm text-charcoal-400">
						{i18n.t.period.subtitle}
					</p>
				</div>
			</div>
			<button
				type="button"
				onclick={onClose}
				class="p-2 rounded-lg hover:bg-cream-200 transition-colors"
				aria-label="Close"
			>
				<X class="w-5 h-5 text-charcoal-500" />
			</button>
		</div>

		<!-- Content -->
		<div class="p-4 space-y-6 overflow-y-auto flex-1">
			<!-- Flow Level -->
			<div class="space-y-3">
				<h3 class="text-sm font-medium text-charcoal-500">
					{i18n.t.period.flowLevel}
				</h3>
				<div class="grid grid-cols-4 gap-2">
					{#each flowLevels as level}
						<button
							type="button"
							onclick={() => flow = level.value}
							class={cn(
								'flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all',
								flow === level.value ? level.color : 'border-charcoal-200 bg-cream-50'
							)}
						>
							<span class="text-lg">{level.emoji}</span>
							<span class="text-xs">{i18n.t.period.flow[level.value]}</span>
						</button>
					{/each}
				</div>
			</div>

			<!-- Symptoms -->
			<div class="space-y-3">
				<h3 class="text-sm font-medium text-charcoal-500">
					{i18n.t.period.symptoms}
				</h3>
				<div class="grid grid-cols-5 gap-2">
					{#each sortedSymptoms() as symptom}
						<button
							type="button"
							onclick={() => toggleSymptom(symptom.id)}
							class={cn(
								'flex flex-col items-center gap-1 p-2 rounded-xl border transition-all relative',
								selectedSymptoms.includes(symptom.id)
									? 'border-2 border-pink-400 bg-pink-100'
									: 'border-charcoal-200 bg-cream-50'
							)}
						>
							{#if selectedSymptoms.includes(symptom.id)}
								<div class="absolute -top-1 -right-1 bg-pink-500 rounded-full p-0.5">
									<Check class="w-2 h-2 text-white" />
								</div>
							{/if}
							<span class="text-xl">{symptom.icon}</span>
							<span class="text-[10px] text-charcoal-600 leading-tight text-center">
								{symptom.label}
							</span>
						</button>
					{/each}
					<!-- Add New Symptom Button -->
					<button
						type="button"
						onclick={() => showAddSymptomModal = true}
						class="flex flex-col items-center gap-1 p-2 rounded-xl border border-dashed border-charcoal-300 hover:border-pink-400 bg-cream-50 hover:bg-pink-50 transition-all"
					>
						<Plus class="w-5 h-5 text-charcoal-400" />
						<span class="text-[10px] text-charcoal-400 leading-tight text-center">
							{i18n.t.common.add}
						</span>
					</button>
				</div>
			</div>

			<!-- Notes -->
			<div class="space-y-2">
				<label for="period-notes" class="text-sm font-medium text-charcoal-500">
					{i18n.t.log.notes}
				</label>
				<textarea
					id="period-notes"
					bind:value={notes}
					placeholder={i18n.t.period.notesPlaceholder}
					rows="2"
					class="textarea"
				></textarea>
			</div>
		</div>

		<!-- Footer -->
		<div class="bg-white border-t border-charcoal-100 p-4 pb-20 flex-shrink-0 space-y-2">
			<button
				type="button"
				onclick={handleSave}
				disabled={isSaving}
				class="btn-primary w-full disabled:opacity-50"
				style="background-color: #db7093;"
			>
				{isSaving ? i18n.t.common.loading : i18n.t.period.save}
			</button>
			{#if existingEntry}
				<button
					type="button"
					onclick={handleDelete}
					class="btn-secondary w-full !text-red-500 !border-red-300"
				>
					{i18n.t.period.remove}
				</button>
			{/if}
		</div>
	</div>
</div>

<!-- Add Symptom Modal -->
{#if showAddSymptomModal}
	<div
		class="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 animate-fade-in"
		onclick={closeAddSymptomModal}
		onkeydown={(e) => e.key === 'Escape' && closeAddSymptomModal()}
		role="button"
		tabindex="-1"
	>
		<div
			class="bg-white rounded-2xl p-5 max-w-sm w-full animate-slide-up space-y-4"
			onclick={(e) => e.stopPropagation()}
			onkeydown={() => {}}
			role="dialog"
			tabindex="-1"
		>
			<div class="flex items-center justify-between">
				<h3 class="text-lg font-semibold text-charcoal-600">
					{i18n.t.period.addSymptomTitle}
				</h3>
				<button
					type="button"
					onclick={closeAddSymptomModal}
					class="p-1 rounded-lg hover:bg-cream-100 transition-colors"
				>
					<X class="w-5 h-5 text-charcoal-400" />
				</button>
			</div>

			<!-- Name (English) -->
			<div class="space-y-1">
				<label for="symptom-name" class="text-sm font-medium text-charcoal-500">
					{i18n.t.ailments.nameEn}
				</label>
				<input
					id="symptom-name"
					type="text"
					bind:value={newSymptomName}
					class="w-full px-3 py-2 border border-charcoal-200 rounded-lg focus:border-pink-400 focus:ring-1 focus:ring-pink-400 outline-none transition-colors"
					placeholder="e.g. Dizziness"
				/>
			</div>

			<!-- Name (Chinese) -->
			<div class="space-y-1">
				<label for="symptom-name-zh" class="text-sm font-medium text-charcoal-500">
					{i18n.t.ailments.nameZh}
				</label>
				<input
					id="symptom-name-zh"
					type="text"
					bind:value={newSymptomNameZh}
					class="w-full px-3 py-2 border border-charcoal-200 rounded-lg focus:border-pink-400 focus:ring-1 focus:ring-pink-400 outline-none transition-colors"
					placeholder="例：頭暈"
				/>
			</div>

			<!-- Icon Selection -->
			<div class="space-y-2">
				<span class="text-sm font-medium text-charcoal-500 block">
					{i18n.t.ailments.iconHint}
				</span>
				<div class="grid grid-cols-8 gap-2">
					{#each symptomIconOptions as icon}
						<button
							type="button"
							onclick={() => selectedSymptomIcon = icon}
							class="p-2 rounded-lg border-2 transition-all text-xl {selectedSymptomIcon === icon ? 'border-pink-400 bg-pink-50' : 'border-transparent hover:bg-cream-100'}"
						>
							{icon}
						</button>
					{/each}
				</div>
			</div>

			<!-- Actions -->
			<div class="flex gap-3 pt-2">
				<button
					type="button"
					onclick={closeAddSymptomModal}
					class="btn-secondary flex-1"
				>
					{i18n.t.common.cancel}
				</button>
				<button
					type="button"
					onclick={handleAddSymptom}
					disabled={!newSymptomName.trim() || isAddingSymptom}
					class="btn-primary flex-1 disabled:opacity-50"
					style="background-color: #db7093;"
				>
					{isAddingSymptom ? i18n.t.common.loading : i18n.t.common.add}
				</button>
			</div>
		</div>
	</div>
{/if}

