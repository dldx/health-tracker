<script lang="ts">
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { i18n } from '$lib/i18n';
	import { formatDate, addDays, isToday, getTodayISO } from '$lib/utils/date';

	interface Props {
		selectedDate: string;
		onDateChange: (date: string) => void;
	}

	let { selectedDate, onDateChange }: Props = $props();

	function goToPreviousDay() {
		onDateChange(addDays(selectedDate, -1));
	}

	function goToNextDay() {
		onDateChange(addDays(selectedDate, 1));
	}

	function goToToday() {
		onDateChange(getTodayISO());
	}

	// Derived
	const formattedDate = $derived(formatDate(selectedDate, i18n.locale));
	const isTodaySelected = $derived(isToday(selectedDate));
	const canGoForward = $derived(!isTodaySelected);
</script>

<div class="card p-4">
	<div class="flex items-center justify-between">
		<button
			type="button"
			onclick={goToPreviousDay}
			class="p-2 rounded-lg hover:bg-cream-200 transition-colors"
			aria-label="Previous day"
		>
			<ChevronLeft class="w-5 h-5 text-charcoal-500" />
		</button>

		<button
			type="button"
			onclick={goToToday}
			class="flex flex-col items-center gap-0.5"
		>
			<span class="text-lg font-semibold text-charcoal-600">{formattedDate}</span>
			{#if !isTodaySelected}
				<span class="text-xs text-jade-500 font-medium">Tap to go to today</span>
			{/if}
		</button>

		<button
			type="button"
			onclick={goToNextDay}
			disabled={!canGoForward}
			class="p-2 rounded-lg hover:bg-cream-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
			aria-label="Next day"
		>
			<ChevronRight class="w-5 h-5 text-charcoal-500" />
		</button>
	</div>
</div>

