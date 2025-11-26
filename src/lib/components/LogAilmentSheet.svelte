<script lang="ts">
	import { X, Clock } from 'lucide-svelte';
	import Icon from '@iconify/svelte';
	import { i18n } from '$lib/i18n';
	import { getCurrentTime } from '$lib/utils/date';
	import { healthStore } from '$lib/stores/health.svelte';
	import TriggerSelector from './TriggerSelector.svelte';
	import SeveritySlider from './SeveritySlider.svelte';
	import type { AilmentType, Severity } from '$lib/types';

	interface Props {
		ailment: AilmentType;
		date: string;
		onClose: () => void;
		onSaved: () => void;
	}

	let { ailment, date, onClose, onSaved }: Props = $props();

	// Form state
	let severity = $state<Severity>(2);
	let selectedTriggerIds = $state<string[]>([]);
	let time = $state(getCurrentTime());
	let notes = $state('');
	let isSaving = $state(false);

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
			await healthStore.addEntry({
				date,
				time,
				ailmentTypeId: ailment.id,
				severity,
				triggerIds: selectedTriggerIds,
				notes
			});
			onSaved();
		} catch (error) {
			console.error('Failed to save entry:', error);
			alert(i18n.t.errors.saveFailed + ': ' + (error instanceof Error ? error.message : String(error)));
		} finally {
			isSaving = false;
		}
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
	<div class="bg-white rounded-t-3xl max-h-[90vh] flex flex-col safe-bottom">
		<!-- Header -->
		<div class="sticky top-0 bg-white border-b border-charcoal-100 px-4 py-4 flex items-center justify-between">
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
						{i18n.t.log.title}
					</h2>
					<p class="text-sm text-charcoal-400">
						{i18n.localizedName(ailment)}
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
			<!-- Time -->
			<div class="space-y-2">
				<label for="time" class="text-sm font-medium text-charcoal-500 flex items-center gap-2">
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
				triggers={healthStore.activeTriggerTypes}
				selectedIds={selectedTriggerIds}
				onToggle={toggleTrigger}
			/>

			<!-- Notes -->
			<div class="space-y-2">
				<label for="notes" class="text-sm font-medium text-charcoal-500">
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
		<div class="bg-white border-t border-charcoal-100 p-4 pb-20 flex-shrink-0">
			<button
				type="button"
				onclick={handleSave}
				disabled={isSaving}
				class="btn-primary w-full disabled:opacity-50"
			>
				{isSaving ? i18n.t.common.loading : i18n.t.log.saveEntry}
			</button>
		</div>
	</div>
</div>

