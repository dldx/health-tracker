<script lang="ts">
	import { X } from 'lucide-svelte';
	import { i18n } from '$lib/i18n';
	import type { TriggerCategory } from '$lib/types';

	interface Props {
		type: 'ailment' | 'trigger' | 'symptom';
		name: string;
		nameZh: string;
		icon: string;
		category?: TriggerCategory;
		onClose: () => void;
		onSave: (name: string, nameZh: string, icon: string, category?: TriggerCategory) => void;
	}

	let { type, name, nameZh, icon, category, onClose, onSave }: Props = $props();

	let editName = $state(name);
	let editNameZh = $state(nameZh);
	let editIcon = $state(icon);
	let editCategory = $state<TriggerCategory>(category || 'other');

	function handleSave() {
		if (type === 'trigger') {
			onSave(editName, editNameZh, editIcon, editCategory);
		} else {
			onSave(editName, editNameZh, editIcon);
		}
	}
</script>

<div
	class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in"
	onclick={onClose}
	onkeydown={(e) => e.key === 'Escape' && onClose()}
	role="button"
	tabindex="-1"
>
	<div
		class="bg-white rounded-2xl p-6 max-w-sm w-full animate-slide-up"
		onclick={(e) => e.stopPropagation()}
		onkeydown={() => {}}
		role="dialog"
		tabindex="-1"
	>
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-semibold text-charcoal-600">
				{i18n.t.settings.editItem}
			</h3>
			<button
				type="button"
				onclick={onClose}
				class="p-1 rounded-full hover:bg-charcoal-100 transition-colors"
			>
				<X class="w-5 h-5 text-charcoal-400" />
			</button>
		</div>

		<div class="space-y-4">
			<!-- Icon -->
			<div>
				<label class="block text-sm font-medium text-charcoal-600 mb-1">Icon</label>
				<input
					type="text"
					bind:value={editIcon}
					class="input text-center text-2xl"
					placeholder="🏥"
				/>
			</div>

			<!-- Name (English) -->
			<div>
				<label class="block text-sm font-medium text-charcoal-600 mb-1">
					{i18n.t.ailments.nameEn}
				</label>
				<input
					type="text"
					bind:value={editName}
					class="input"
					placeholder="Name"
				/>
			</div>

			<!-- Name (Chinese) -->
			<div>
				<label class="block text-sm font-medium text-charcoal-600 mb-1">
					{i18n.t.ailments.nameZh}
				</label>
				<input
					type="text"
					bind:value={editNameZh}
					class="input"
					placeholder="名稱"
				/>
			</div>

			<!-- Category (for triggers only) -->
			{#if type === 'trigger'}
				<div>
					<label class="block text-sm font-medium text-charcoal-600 mb-1">
						{i18n.t.triggers.category}
					</label>
					<select bind:value={editCategory} class="input">
						<option value="food">{i18n.t.triggers.categories.food}</option>
						<option value="lifestyle">{i18n.t.triggers.categories.lifestyle}</option>
						<option value="environment">{i18n.t.triggers.categories.environment}</option>
						<option value="substance">{i18n.t.triggers.categories.substance}</option>
						<option value="other">{i18n.t.triggers.categories.other}</option>
					</select>
				</div>
			{/if}
		</div>

		<div class="flex gap-3 mt-6">
			<button
				type="button"
				onclick={onClose}
				class="btn-secondary flex-1"
			>
				{i18n.t.common.cancel}
			</button>
			<button
				type="button"
				onclick={handleSave}
				disabled={!editName.trim() || !editIcon.trim()}
				class="btn-primary flex-1 disabled:opacity-50"
			>
				{i18n.t.common.save}
			</button>
		</div>
	</div>
</div>

