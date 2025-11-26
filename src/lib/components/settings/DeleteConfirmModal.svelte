<script lang="ts">
	import { Trash2 } from 'lucide-svelte';
	import Icon from '@iconify/svelte';
	import { i18n } from '$lib/i18n';
	import type { AilmentType, TriggerType, CustomPeriodSymptom } from '$lib/types';

	interface Props {
		item: AilmentType | TriggerType | CustomPeriodSymptom;
		onClose: () => void;
		onConfirm: () => void;
	}

	let { item, onClose, onConfirm }: Props = $props();
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
		<div class="text-center mb-4">
			<div class="w-12 h-12 rounded-full bg-coral-100 flex items-center justify-center mx-auto mb-3">
				<Trash2 class="w-6 h-6 text-coral-500" />
			</div>
			<h3 class="text-lg font-semibold text-charcoal-600">
				{i18n.t.settings.deleteConfirm}
			</h3>
			<p class="text-sm text-charcoal-500 mt-1">
				{i18n.t.settings.deleteWarning}
			</p>
		</div>

		<div class="p-3 bg-cream-100 rounded-lg mb-4">
			<div class="flex items-center gap-3">
				<span class="text-xl">
					{#if item.icon.includes(':')}
						<Icon icon={item.icon} />
					{:else}
						{item.icon}
					{/if}
				</span>
				<span class="text-charcoal-600 font-medium">
					{i18n.localizedName(item)}
				</span>
			</div>
		</div>

		<div class="flex gap-3">
			<button
				type="button"
				onclick={onClose}
				class="btn-secondary flex-1"
			>
				{i18n.t.common.cancel}
			</button>
			<button
				type="button"
				onclick={onConfirm}
				class="btn-primary flex-1 !bg-coral-500 hover:!bg-coral-600"
			>
				{i18n.t.common.delete}
			</button>
		</div>
	</div>
</div>

