<script lang="ts">
	import { i18n } from '$lib/i18n';
	import HealthEntryCard from '$lib/components/HealthEntryCard.svelte';
	import type { HealthEntryWithDetails } from '$lib/types';

	interface Props {
		entries: HealthEntryWithDetails[];
		onEdit: (entry: HealthEntryWithDetails) => void;
		onDelete: (id: string) => Promise<void>;
	}

	let { entries, onEdit, onDelete }: Props = $props();
</script>

<section>
	<div class="my-4 divider-gold">
		{i18n.t.dayView.todayEntries}
	</div>

	{#if entries.length === 0}
		<div class="p-8 text-center card">
			<p class="text-charcoal-400">{i18n.t.dayView.noEntries}</p>
			<p class="mt-1 text-charcoal-300 text-sm">{i18n.t.dayView.noEntriesHint}</p>
		</div>
	{:else}
		<div class="space-y-3">
			{#each entries as entry, index}
				<div class="stagger-{Math.min(index + 1, 5)}">
					<HealthEntryCard
						{entry}
						{onEdit}
						{onDelete}
					/>
				</div>
			{/each}
		</div>
	{/if}
</section>

