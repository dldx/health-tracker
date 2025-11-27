<script lang="ts">
	import { X, Clock, Trash2 } from 'lucide-svelte';
	import Icon from '@iconify/svelte';
	import { i18n } from '$lib/i18n';
	import { getCurrentTime } from '$lib/utils/date';
	import { healthStore } from '$lib/stores/health.svelte';
	import TriggerSelector from './TriggerSelector.svelte';
	import SeveritySlider from './SeveritySlider.svelte';
	import type { AilmentType, Severity, HealthEntry } from '$lib/types';

	interface Props {
		ailment: AilmentType;
		date: string;
		existingEntry?: HealthEntry; // For editing existing entries
		onClose: () => void;
		onSaved: () => void;
		onDelete?: (id: string) => void; // For deleting from edit mode
	}

	let { ailment, date, existingEntry, onClose, onSaved, onDelete }: Props = $props();

	// Check if we're editing
	const isEditing = $derived(!!existingEntry);

	// Form state - initialize from existing entry if editing
	let severity = $state<Severity>(existingEntry?.severity ?? 2);
	let selectedTriggerIds = $state<string[]>(existingEntry?.triggerIds ? [...existingEntry.triggerIds] : []);
	let time = $state(existingEntry?.time ?? getCurrentTime());
	let notes = $state(existingEntry?.notes ?? '');
	let isSaving = $state(false);
	let showDeleteConfirm = $state(false);

	// Calculate trigger frequency for this specific ailment
	const sortedTriggers = $derived(() => {
		// Count how many times each trigger appears with this ailment
		const triggerCounts = new Map<string, number>();

		for (const entry of healthStore.entries) {
			if (entry.ailmentTypeId === ailment.id) {
				for (const triggerId of entry.triggerIds) {
					triggerCounts.set(triggerId, (triggerCounts.get(triggerId) || 0) + 1);
				}
			}
		}

		// Sort active triggers by frequency (descending)
		return [...healthStore.activeTriggerTypes].sort((a, b) => {
			const countA = triggerCounts.get(a.id) || 0;
			const countB = triggerCounts.get(b.id) || 0;
			return countB - countA;
		});
	});

	function toggleTrigger(id: string) {
		if (selectedTriggerIds.includes(id)) {
			selectedTriggerIds = selectedTriggerIds.filter(t => t !== id);
		} else {
			selectedTriggerIds = [...selectedTriggerIds, id];
		}
	}

	async function handleSave() {
		if (isSaving) return;
		isSaving = true;

		try {
			if (isEditing && existingEntry) {
				// Update existing entry
				await healthStore.updateEntry(existingEntry.id, {
					time,
					severity,
					triggerIds: selectedTriggerIds,
					notes
				});
			} else {
				// Add new entry
				await healthStore.addEntry({
					date,
					time,
					ailmentTypeId: ailment.id,
					severity,
					triggerIds: selectedTriggerIds,
					notes
				});
			}
			onSaved();
		} catch (error) {
			console.error('Failed to save entry:', error);
			alert(i18n.t.errors.saveFailed + ': ' + (error instanceof Error ? error.message : String(error)));
		} finally {
			isSaving = false;
		}
	}

	function handleDelete() {
		if (existingEntry && onDelete) {
			onDelete(existingEntry.id);
		}
	}
</script>

<!-- Backdrop -->
<div
	class="z-50 fixed inset-0 bg-black/50 animate-fade-in"
	onclick={onClose}
	onkeydown={(e) => e.key === 'Escape' && onClose()}
	role="button"
	tabindex="-1"
></div>

<!-- Sheet -->
<div class="bottom-0 z-50 fixed inset-x-0 animate-slide-in-bottom">
	<div class="flex flex-col bg-white rounded-t-3xl max-h-[90vh]">
		<!-- Header -->
		<div class="top-0 sticky flex justify-between items-center bg-white px-4 py-4 border-charcoal-100 border-b">
			<div class="flex items-center gap-3">
				<span class="text-3xl">
					{#if ailment.icon.includes(':')}
						<Icon icon={ailment.icon} />
					{:else}
						{ailment.icon}
					{/if}
				</span>
				<div>
					<h2 class="font-semibold text-charcoal-600">
						{isEditing ? i18n.t.common.edit : i18n.t.log.title}
					</h2>
					<p class="text-charcoal-400 text-sm">
						{i18n.localizedName(ailment)}
					</p>
				</div>
			</div>
			<div class="flex items-center gap-1">
				{#if isEditing && onDelete}
					<button
						type="button"
						onclick={() => showDeleteConfirm = true}
						class="hover:bg-coral-50 p-2 rounded-lg text-charcoal-400 hover:text-coral-500 transition-colors"
						aria-label="Delete"
					>
						<Trash2 class="w-5 h-5" />
					</button>
				{/if}
				<button
					type="button"
					onclick={onClose}
					class="hover:bg-cream-200 p-2 rounded-lg transition-colors"
					aria-label="Close"
				>
					<X class="w-5 h-5 text-charcoal-500" />
				</button>
			</div>
		</div>

		<!-- Content -->
		<div class="flex-1 space-y-6 p-4 overflow-y-auto">
			<!-- Time -->
			<div class="space-y-2">
				<label for="time" class="flex items-center gap-2 font-medium text-charcoal-500 text-sm">
					<Clock class="w-4 h-4" />
					{i18n.t.log.time}
				</label>
				<input
					type="time"
					id="time"
					bind:value={time}
					class="input"
				/>
			</div>

			<!-- Severity -->
			<SeveritySlider value={severity} onChange={(v) => severity = v} />

			<!-- Triggers -->
			<TriggerSelector
				triggers={sortedTriggers()}
				selectedIds={selectedTriggerIds}
				onToggle={toggleTrigger}
			/>

			<!-- Notes -->
			<div class="space-y-2">
				<label for="notes" class="font-medium text-charcoal-500 text-sm">
					{i18n.t.log.notes}
				</label>
<textarea
				id="notes"
				bind:value={notes}
				placeholder={i18n.t.log.notesPlaceholder}
				rows="3"
				class="textarea"
			></textarea>
			</div>
		</div>

		<!-- Footer -->
		<div class="bg-white p-4 pb-20 border-charcoal-100 border-t shrink-0">
			<button
				type="button"
				onclick={handleSave}
				disabled={isSaving}
				class="disabled:opacity-50 w-full btn-primary"
			>
				{isSaving ? i18n.t.common.loading : (isEditing ? i18n.t.common.save : i18n.t.log.saveEntry)}
			</button>
		</div>
	</div>
</div>

<!-- Delete Confirmation -->
{#if showDeleteConfirm}
	<div
		class="z-60 fixed inset-0 flex justify-center items-center bg-black/50 p-4"
		onclick={() => showDeleteConfirm = false}
		onkeydown={(e) => e.key === 'Escape' && (showDeleteConfirm = false)}
		role="button"
		tabindex="-1"
	>
		<div
			class="bg-white shadow-xl p-6 rounded-2xl w-full max-w-sm animate-slide-up"
			onclick={(e) => e.stopPropagation()}
			onkeydown={() => {}}
			role="dialog"
			tabindex="-1"
		>
			<h3 class="mb-2 font-semibold text-charcoal-600 text-lg">{i18n.t.settings.deleteConfirm}</h3>
			<p class="mb-6 text-charcoal-500 text-sm">{i18n.t.settings.deleteWarning}</p>
			<div class="flex gap-3">
				<button
					type="button"
					onclick={() => showDeleteConfirm = false}
					class="flex-1 btn-ghost"
				>
					{i18n.t.common.cancel}
				</button>
				<button
					type="button"
					onclick={handleDelete}
					class="flex-1 bg-coral-500 hover:bg-coral-600 text-white btn-primary"
				>
					{i18n.t.common.delete}
				</button>
			</div>
		</div>
	</div>
{/if}

