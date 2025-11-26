<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Check, Plus, X } from 'lucide-svelte';
	import { i18n } from '$lib/i18n';
	import { healthStore } from '$lib/stores/health.svelte';
	import { cn } from '$lib/utils/cn';
	import type { TriggerType } from '$lib/types';

	interface Props {
		triggers: TriggerType[];
		selectedIds: string[];
		onToggle: (id: string) => void;
	}

	let { triggers, selectedIds, onToggle }: Props = $props();

	// Modal state
	let showAddModal = $state(false);
	let newName = $state('');
	let newNameZh = $state('');
	let selectedEmoji = $state('❓');
	let customEmoji = $state('');
	let isSaving = $state(false);

	// Emoji options for triggers
	const emojiOptions = [
		'☕', '🍔', '🍕', '🍪', '🍬', '🥛', '🍷', '🍺',
		'🚬', '💊', '💉', '😴', '😰', '⛅', '🌧️', '❄️',
		'🌡️', '👃', '👂', '👀', '💪', '🏃', '💻', '📱',
		'🧂', '🍫', '🌶️', '🥜', '🌾', '🥚', '🧀', '🍣'
	];

	function isSelected(id: string): boolean {
		return selectedIds.includes(id);
	}

	// Get the final emoji (custom if entered, otherwise selected)
	function getFinalEmoji(): string {
		return customEmoji.trim() || selectedEmoji;
	}

	async function handleAddTrigger() {
		if (!newName.trim() || isSaving) return;

		isSaving = true;
		try {
			await healthStore.addTriggerType({
				name: newName.trim(),
				nameZh: newNameZh.trim() || newName.trim(),
				icon: getFinalEmoji(),
				category: 'other',
				isActive: true
			});
			closeModal();
		} finally {
			isSaving = false;
		}
	}

	function closeModal() {
		showAddModal = false;
		newName = '';
		newNameZh = '';
		selectedEmoji = '❓';
		customEmoji = '';
	}
</script>

<div class="space-y-3">
	<h3 class="text-sm font-medium text-charcoal-500">
		{i18n.t.triggers.title}
	</h3>
	<p class="text-xs text-charcoal-400">
		{i18n.t.triggers.selectTriggers}
	</p>
	<div class="grid grid-cols-3 gap-2">
		{#each triggers as trigger}
			<button
				type="button"
				onclick={() => onToggle(trigger.id)}
				class={cn(
					'trigger-chip relative',
					isSelected(trigger.id) && 'trigger-chip-selected'
				)}
			>
				{#if isSelected(trigger.id)}
					<div class="absolute top-1 right-1">
						<Check class="w-3 h-3 text-jade-600" />
					</div>
				{/if}
				<span class="text-xl">
					{#if trigger.icon.includes(':')}
						<Icon icon={trigger.icon} />
					{:else}
						{trigger.icon}
					{/if}
				</span>
				<span class="text-xs text-charcoal-600 text-center leading-tight">
					{i18n.localizedName(trigger)}
				</span>
			</button>
		{/each}
		<!-- Add New Trigger Button -->
		<button
			type="button"
			onclick={() => showAddModal = true}
			class="flex flex-col items-center gap-1 p-2 rounded-xl border border-dashed border-charcoal-300 hover:border-gold-400 bg-cream-50 hover:bg-gold-50 transition-all"
		>
			<Plus class="w-5 h-5 text-charcoal-400" />
			<span class="text-xs text-charcoal-400 text-center leading-tight">
				{i18n.t.common.add}
			</span>
		</button>
	</div>
</div>

<!-- Add Trigger Modal -->
{#if showAddModal}
	<div
		class="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 animate-fade-in"
		onclick={closeModal}
		onkeydown={(e) => e.key === 'Escape' && closeModal()}
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
					{i18n.t.triggers.addNewTitle}
				</h3>
				<button
					type="button"
					onclick={closeModal}
					class="p-1 rounded-lg hover:bg-cream-100 transition-colors"
				>
					<X class="w-5 h-5 text-charcoal-400" />
				</button>
			</div>

			<!-- Name (English) -->
			<div class="space-y-1">
				<label for="trigger-name" class="text-sm font-medium text-charcoal-500">
					{i18n.t.ailments.nameEn}
				</label>
				<input
					id="trigger-name"
					type="text"
					bind:value={newName}
					class="w-full px-3 py-2 border border-charcoal-200 rounded-lg focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none transition-colors"
					placeholder="e.g. Sugar"
				/>
			</div>

			<!-- Name (Chinese) -->
			<div class="space-y-1">
				<label for="trigger-name-zh" class="text-sm font-medium text-charcoal-500">
					{i18n.t.ailments.nameZh}
				</label>
				<input
					id="trigger-name-zh"
					type="text"
					bind:value={newNameZh}
					class="w-full px-3 py-2 border border-charcoal-200 rounded-lg focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none transition-colors"
					placeholder="例：糖"
				/>
			</div>

			<!-- Emoji Selection -->
			<div class="space-y-2">
				<span class="text-sm font-medium text-charcoal-500 block">
					{i18n.t.ailments.iconHint}
				</span>
				<div class="grid grid-cols-8 gap-2 max-h-28 overflow-y-auto">
					{#each emojiOptions as emoji}
						<button
							type="button"
							onclick={() => { selectedEmoji = emoji; customEmoji = ''; }}
							class="p-2 rounded-lg border-2 transition-all text-xl {selectedEmoji === emoji && !customEmoji ? 'border-gold-400 bg-gold-50' : 'border-transparent hover:bg-cream-100'}"
						>
							{emoji}
						</button>
					{/each}
				</div>
				<!-- Custom Emoji Input -->
				<div class="flex items-center gap-2 pt-1">
					<span class="text-xs text-charcoal-400">{i18n.t.triggers.customEmoji}</span>
					<input
						type="text"
						bind:value={customEmoji}
						maxlength="2"
						class="w-12 px-2 py-1 text-center text-xl border border-charcoal-200 rounded-lg focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none transition-colors"
						placeholder="🎯"
					/>
					{#if customEmoji}
						<span class="text-xs text-gold-600">✓</span>
					{/if}
				</div>
			</div>

			<!-- Actions -->
			<div class="flex gap-3 pt-2">
				<button
					type="button"
					onclick={closeModal}
					class="btn-secondary flex-1"
				>
					{i18n.t.common.cancel}
				</button>
				<button
					type="button"
					onclick={handleAddTrigger}
					disabled={!newName.trim() || isSaving}
					class="btn-primary flex-1 disabled:opacity-50"
					style="background-color: #D4AF37;"
				>
					{isSaving ? i18n.t.common.loading : i18n.t.common.add}
				</button>
			</div>
		</div>
	</div>
{/if}

