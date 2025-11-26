<script lang="ts">
	import { i18n } from '$lib/i18n';

	interface Props {
		totalEntries: number;
		avgSeverity: string;
		avgPerWeek: string;
		peakTime: string;
	}

	let { totalEntries, avgSeverity, avgPerWeek, peakTime }: Props = $props();
</script>

<section class="gap-3 grid grid-cols-2">
	<div class="p-4 text-center card">
		<p class="font-bold text-jade-600 text-2xl">{totalEntries}</p>
		<p class="mt-1 text-charcoal-400 text-xs">{i18n.t.stats.totalEntries}</p>
	</div>
	<div class="p-4 text-center card">
		<p class="font-bold text-coral-500 text-2xl">{avgSeverity}</p>
		<p class="mt-1 text-charcoal-400 text-xs">{i18n.t.stats.avgSeverity}</p>
	</div>
	<div class="p-4 text-center card">
		<p class="font-bold text-gold-500 text-2xl">{avgPerWeek}</p>
		<p class="mt-1 text-charcoal-400 text-xs">{i18n.t.stats.avgPerWeek}</p>
	</div>
	<div class="p-4 text-center card">
		<p class="font-bold text-charcoal-600 text-lg">{peakTime}</p>
		<p class="mt-1 text-charcoal-400 text-xs">{i18n.t.stats.mostCommonTime}</p>
	</div>
</section>

