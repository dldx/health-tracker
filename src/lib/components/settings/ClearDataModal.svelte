<script lang="ts">
	import { i18n } from '$lib/i18n';

	interface Props {
		onClose: () => void;
		onConfirm: () => void;
	}

	let { onClose, onConfirm }: Props = $props();
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
		<h3 class="text-lg font-semibold text-charcoal-600 mb-2">
			{i18n.t.settings.clearData}
		</h3>
		<p class="text-sm text-charcoal-500 mb-6">
			{i18n.t.settings.clearDataConfirm}
		</p>
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

