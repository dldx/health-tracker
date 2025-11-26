<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Plus, X } from 'lucide-svelte';
	import { i18n } from '$lib/i18n';
	import { healthStore } from '$lib/stores/health.svelte';
	import type { AilmentType } from '$lib/types';

	interface Props {
		ailmentTypes: AilmentType[];
		onSelect: (ailment: AilmentType) => void;
	}

	let { ailmentTypes, onSelect }: Props = $props();

	// Modal state
	let showAddModal = $state(false);
	let newName = $state('');
	let newNameZh = $state('');
	let selectedEmoji = $state('🤒');
	let customEmoji = $state('');
	let isSaving = $state(false);

	// Emoji options for ailments
	const emojiOptions = [
		'🤒', '🤕', '🤢', '🤧', '😴', '😵', '🥵', '🥶',
		'🥴', '😵‍💫', '😰', '😖', '😫', '😮‍💨', '💔', '🫀',
		'🤮', '😷', '🤯', '😩', '😣', '😞', '🦴', '🦷',
		'👁️', '👂', '👃', '🫁', '🧠', '💪', '🦵', '🦶'
	];

	// Get the final emoji (custom if entered, otherwise selected)
	function getFinalEmoji(): string {
		return customEmoji.trim() || selectedEmoji;
	}

	async function handleAddAilment() {
		if (!newName.trim() || isSaving) return;

		isSaving = true;
		try {
			await healthStore.addAilmentType({
				name: newName.trim(),
				nameZh: newNameZh.trim() || newName.trim(),
				icon: getFinalEmoji(),
				isActive: true
			});
			// Reset form
			newName = '';
			newNameZh = '';
			selectedEmoji = '🤒';
			customEmoji = '';
			showAddModal = false;
		} finally {
			isSaving = false;
		}
	}

	function closeModal() {
		showAddModal = false;
		newName = '';
		newNameZh = '';
		selectedEmoji = '🤒';
		customEmoji = '';
	}
</script>

<div class="p-4 card">
	<h2 class="mb-3 font-medium text-charcoal-500 text-sm">
		{i18n.t.dayView.logAilment}
	</h2>
	<div class="gap-3 grid grid-cols-2">
		{#each ailmentTypes as ailment}
			<button
				type="button"
				onclick={() => onSelect(ailment)}
				class="flex items-center gap-3 bg-cream-50 hover:bg-jade-50 p-3 border border-charcoal-200 hover:border-jade-300 rounded-xl text-left transition-all duration-200"
			>
				<span class="text-2xl">
					{#if ailment.icon.includes(':')}
						<Icon icon={ailment.icon} />
					{:else}
						{ailment.icon}
					{/if}
				</span>
				<span class="font-medium text-charcoal-600 text-sm leading-tight">
					{i18n.localizedName(ailment)}
				</span>
			</button>
		{/each}
		<!-- Add New Button -->
		<button
			type="button"
			onclick={() => showAddModal = true}
			class="flex items-center gap-3 bg-cream-50 hover:bg-jade-50 p-3 border border-charcoal-300 hover:border-jade-400 border-dashed rounded-xl text-left transition-all duration-200"
		>
			<span class="text-charcoal-400 text-2xl">
				<Plus class="w-6 h-6" />
			</span>
			<span class="font-medium text-charcoal-400 text-sm leading-tight">
				{i18n.t.ailments.addNew}
			</span>
		</button>
	</div>
</div>

<!-- Add Ailment Modal -->
{#if showAddModal}
	<div
		class="z-50 fixed inset-0 flex justify-center items-center bg-black/50 p-4 animate-fade-in"
		onclick={closeModal}
		onkeydown={(e) => e.key === 'Escape' && closeModal()}
		role="button"
		tabindex="-1"
	>
		<div
			class="space-y-4 bg-white p-5 rounded-2xl w-full max-w-sm animate-slide-up"
			onclick={(e) => e.stopPropagation()}
			onkeydown={() => {}}
			role="dialog"
			tabindex="-1"
		>
			<div class="flex justify-between items-center">
				<h3 class="font-semibold text-charcoal-600 text-lg">
					{i18n.t.ailments.addNewTitle}
				</h3>
				<button
					type="button"
					onclick={closeModal}
					class="hover:bg-cream-100 p-1 rounded-lg transition-colors"
				>
					<X class="w-5 h-5 text-charcoal-400" />
				</button>
			</div>

			<!-- Name (English) -->
			<div class="space-y-1">
				<label for="ailment-name" class="font-medium text-charcoal-500 text-sm">
					{i18n.t.ailments.nameEn}
				</label>
				<input
					id="ailment-name"
					type="text"
					bind:value={newName}
					class="px-3 py-2 border border-charcoal-200 focus:border-jade-400 rounded-lg outline-none focus:ring-1 focus:ring-jade-400 w-full transition-colors"
					placeholder="e.g. Back Pain"
				/>
			</div>

			<!-- Name (Chinese) -->
			<div class="space-y-1">
				<label for="ailment-name-zh" class="font-medium text-charcoal-500 text-sm">
					{i18n.t.ailments.nameZh}
				</label>
				<input
					id="ailment-name-zh"
					type="text"
					bind:value={newNameZh}
					class="px-3 py-2 border border-charcoal-200 focus:border-jade-400 rounded-lg outline-none focus:ring-1 focus:ring-jade-400 w-full transition-colors"
					placeholder="例：背痛"
				/>
			</div>

			<!-- Emoji Selection -->
			<div class="space-y-2">
				<span class="block font-medium text-charcoal-500 text-sm">
					{i18n.t.ailments.iconHint}
				</span>
				<div class="gap-2 grid grid-cols-8 max-h-28 overflow-y-auto">
					{#each emojiOptions as emoji}
						<button
							type="button"
							onclick={() => { selectedEmoji = emoji; customEmoji = ''; }}
							class="p-2 rounded-lg border-2 transition-all text-xl {selectedEmoji === emoji && !customEmoji ? 'border-jade-400 bg-jade-50' : 'border-transparent hover:bg-cream-100'}"
						>
							{emoji}
						</button>
					{/each}
				</div>
				<!-- Custom Emoji Input -->
				<div class="flex items-center gap-2 pt-1">
					<span class="text-charcoal-400 text-xs">{i18n.t.ailments.customEmoji}</span>
					<input
						type="text"
						bind:value={customEmoji}
						maxlength="2"
						class="px-2 py-1 border border-charcoal-200 focus:border-jade-400 rounded-lg outline-none focus:ring-1 focus:ring-jade-400 w-12 text-xl text-center transition-colors"
						placeholder="🎯"
					/>
					{#if customEmoji}
						<span class="text-jade-600 text-xs">✓</span>
					{/if}
				</div>
			</div>

			<!-- Actions -->
			<div class="flex gap-3 pt-2">
				<button
					type="button"
					onclick={closeModal}
					class="flex-1 btn-secondary"
				>
					{i18n.t.common.cancel}
				</button>
				<button
					type="button"
					onclick={handleAddAilment}
					disabled={!newName.trim() || isSaving}
					class="flex-1 disabled:opacity-50 btn-primary"
				>
					{isSaving ? i18n.t.common.loading : i18n.t.common.add}
				</button>
			</div>
		</div>
	</div>
{/if}

