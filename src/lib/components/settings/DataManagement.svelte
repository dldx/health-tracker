<script lang="ts">
	import { ChevronRight, Download, Upload, Trash2, Shield } from 'lucide-svelte';
	import { i18n } from '$lib/i18n';

	interface Props {
		isExporting: boolean;
		isImporting: boolean;
		onExport: () => Promise<void>;
		onImport: () => void;
		onClearData: () => void;
	}

	let { isExporting, isImporting, onExport, onImport, onClearData }: Props = $props();
</script>

<section class="card overflow-hidden">
	<div class="p-4 border-b border-charcoal-100">
		<div class="flex items-center gap-3">
			<Shield class="w-5 h-5 text-jade-500" />
			<div>
				<span class="font-medium text-charcoal-600">{i18n.t.settings.data}</span>
				<p class="text-xs text-charcoal-400">{i18n.t.settings.privacyNote}</p>
			</div>
		</div>
	</div>
	<div class="divide-y divide-charcoal-100">
		<button
			type="button"
			onclick={onExport}
			disabled={isExporting}
			class="w-full p-4 flex items-center justify-between hover:bg-cream-50 transition-colors disabled:opacity-50"
		>
			<div class="flex items-center gap-3">
				<Download class="w-5 h-5 text-charcoal-500" />
				<span class="text-sm text-charcoal-600">{i18n.t.settings.exportData}</span>
			</div>
			<ChevronRight class="w-5 h-5 text-charcoal-400" />
		</button>
		<button
			type="button"
			onclick={onImport}
			disabled={isImporting}
			class="w-full p-4 flex items-center justify-between hover:bg-cream-50 transition-colors disabled:opacity-50"
		>
			<div class="flex items-center gap-3">
				<Upload class="w-5 h-5 text-charcoal-500" />
				<span class="text-sm text-charcoal-600">{i18n.t.settings.importData}</span>
			</div>
			<ChevronRight class="w-5 h-5 text-charcoal-400" />
		</button>
		<button
			type="button"
			onclick={onClearData}
			class="w-full p-4 flex items-center justify-between hover:bg-coral-50 transition-colors"
		>
			<div class="flex items-center gap-3">
				<Trash2 class="w-5 h-5 text-coral-500" />
				<span class="text-sm text-coral-600">{i18n.t.settings.clearData}</span>
			</div>
			<ChevronRight class="w-5 h-5 text-coral-400" />
		</button>
	</div>
</section>

