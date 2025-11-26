<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Trash2 } from 'lucide-svelte';
	import { i18n } from '$lib/i18n';
	import { formatTime } from '$lib/utils/date';
	import { cn } from '$lib/utils/cn';
	import type { HealthEntryWithDetails, Severity } from '$lib/types';

	interface Props {
		entry: HealthEntryWithDetails;
		onDelete?: (id: string) => void;
	}

	let { entry, onDelete }: Props = $props();

	const severityLabels: Record<Severity, string> = {
		1: i18n.t.severity.level1,
		2: i18n.t.severity.level2,
		3: i18n.t.severity.level3,
		4: i18n.t.severity.level4,
		5: i18n.t.severity.level5
	};

	function getSeverityDots(severity: Severity): { filled: number; empty: number } {
		return { filled: severity, empty: 5 - severity };
	}

	const dots = $derived(getSeverityDots(entry.severity));
</script>

<div class="p-4 animate-slide-up card card-hover">
	<div class="flex items-start gap-3">
		<!-- Icon -->
		<div class="text-3xl">
			{#if entry.ailmentType.icon.includes(':')}
				<Icon icon={entry.ailmentType.icon} />
			{:else}
				{entry.ailmentType.icon}
			{/if}
		</div>

		<!-- Content -->
		<div class="flex-1 min-w-0">
			<div class="flex justify-between items-start gap-2">
				<div>
					<h3 class="font-semibold text-charcoal-600">
						{i18n.localizedName(entry.ailmentType)}
					</h3>
					<p class="text-charcoal-400 text-sm">
						{formatTime(entry.time, i18n.locale)}
					</p>
				</div>

				{#if onDelete}
					<button
						type="button"
						onclick={() => onDelete(entry.id)}
						class="hover:bg-coral-50 p-2 rounded-lg text-charcoal-400 hover:text-coral-500 transition-colors"
						aria-label="Delete entry"
					>
						<Trash2 class="w-4 h-4" />
					</button>
				{/if}
			</div>

			<!-- Severity -->
			<div class="flex items-center gap-2 mt-2">
				<span class="text-charcoal-400 text-xs">{i18n.t.severity.title}:</span>
				<div class="flex gap-1">
					{#each Array(dots.filled) as _}
						<span class={cn('severity-dot', `severity-${entry.severity}`)}></span>
					{/each}
					{#each Array(dots.empty) as _}
						<span class="bg-charcoal-200 severity-dot"></span>
					{/each}
				</div>
				<span class="text-charcoal-500 text-xs">{severityLabels[entry.severity]}</span>
			</div>

			<!-- Triggers -->
			{#if entry.triggers.length > 0}
				<div class="flex flex-wrap gap-1.5 mt-2">
					{#each entry.triggers as trigger}
						<span class="inline-flex items-center gap-1 bg-jade-100 px-2 py-0.5 rounded-full text-jade-700 text-xs">
							{#if trigger.icon.includes(':')}
								<Icon icon={trigger.icon} class="w-3 h-3" />
							{:else}
								<span class="text-xs">{trigger.icon}</span>
							{/if}
							{i18n.localizedName(trigger)}
						</span>
					{/each}
				</div>
			{/if}

			<!-- Notes -->
			{#if entry.notes}
				<p class="mt-2 text-charcoal-500 text-sm italic">
					"{entry.notes}"
				</p>
			{/if}
		</div>
	</div>
</div>

