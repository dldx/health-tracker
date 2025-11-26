<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { cn } from '$lib/utils/cn';
	import type { Severity } from '$lib/types';

	interface Props {
		value: Severity;
		onChange: (value: Severity) => void;
	}

	let { value, onChange }: Props = $props();

	const levels: { value: Severity; label: string; color: string }[] = [
		{ value: 1, label: i18n.t.severity.level1, color: 'bg-jade-400' },
		{ value: 2, label: i18n.t.severity.level2, color: 'bg-jade-300' },
		{ value: 3, label: i18n.t.severity.level3, color: 'bg-gold-400' },
		{ value: 4, label: i18n.t.severity.level4, color: 'bg-coral-400' },
		{ value: 5, label: i18n.t.severity.level5, color: 'bg-red-500' }
	];

	const currentLevel = $derived(levels.find(l => l.value === value) || levels[0]);
</script>

<div class="space-y-3">
	<div class="flex justify-between items-center">
		<h3 class="text-sm font-medium text-charcoal-500">
			{i18n.t.severity.title}
		</h3>
		<span class={cn('text-sm font-semibold px-2 py-0.5 rounded', currentLevel.color, 'text-white')}>
			{currentLevel.label}
		</span>
	</div>

	<div class="flex gap-2">
		{#each levels as level}
			<button
				type="button"
				onclick={() => onChange(level.value)}
				class={cn(
					'flex-1 h-3 rounded-full transition-all duration-200',
					value >= level.value ? level.color : 'bg-charcoal-200',
					'hover:opacity-80'
				)}
				aria-label={level.label}
			></button>
		{/each}
	</div>

	<div class="flex justify-between text-xs text-charcoal-400">
		<span>{i18n.t.severity.mild}</span>
		<span>{i18n.t.severity.severe}</span>
	</div>
</div>

