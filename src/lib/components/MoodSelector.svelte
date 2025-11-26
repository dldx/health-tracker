<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { cn } from '$lib/utils/cn';
	import type { MoodLevel } from '$lib/types';

	interface Props {
		selected?: MoodLevel;
		onSelect: (mood: MoodLevel) => void;
	}

	let { selected, onSelect }: Props = $props();

	const moods: { level: MoodLevel; emoji: string; colorClass: string }[] = [
		{ level: 'good', emoji: '😊', colorClass: 'bg-jade-100 border-jade-400 text-jade-700' },
		{ level: 'okay', emoji: '😐', colorClass: 'bg-gold-100 border-gold-400 text-gold-700' },
		{ level: 'bad', emoji: '😣', colorClass: 'bg-coral-100 border-coral-400 text-coral-700' }
	];
</script>

<div class="card p-4">
	<p class="text-sm text-charcoal-500 mb-3">{i18n.t.mood.selectMood}</p>
	<div class="flex gap-3 justify-center">
		{#each moods as mood}
			<button
				type="button"
				onclick={() => onSelect(mood.level)}
				class={cn(
					'flex flex-col items-center gap-1 px-4 py-3 rounded-xl border-2 transition-all duration-200',
					selected === mood.level
						? mood.colorClass
						: 'border-charcoal-200 bg-cream-50 hover:border-charcoal-300'
				)}
			>
				<span class="text-2xl">{mood.emoji}</span>
				<span class="text-xs font-medium">{i18n.t.mood[mood.level]}</span>
			</button>
		{/each}
	</div>
</div>

