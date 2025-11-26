<script lang="ts">
	import { useSortable } from '@dnd-kit-svelte/svelte/sortable';
	import { GripVertical } from 'lucide-svelte';
	import type { TileId } from '$lib/types';
	import type { Snippet } from 'svelte';

	interface Props {
		id: TileId;
		index: number;
		group?: string;
		isEditMode?: boolean;
		children: Snippet;
	}

	let { id, index, group = 'tiles', isEditMode = false, children }: Props = $props();

	const { ref, handleRef, isDragging, isDropTarget } = useSortable({
		id,
		index: () => index,
		group,
		data: () => ({ id, index }),
		disabled: () => !isEditMode
	});
</script>

<div
	{@attach ref}
	class="sortable-tile relative transition-all duration-200"
	class:opacity-50={isDragging.current}
	class:scale-[1.02]={isDropTarget.current}
	class:ring-2={isDropTarget.current}
	class:ring-jade-400={isDropTarget.current}
	class:ring-opacity-50={isDropTarget.current}
>
	{#if isEditMode}
		<button
			{@attach handleRef}
			type="button"
			class="absolute -left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-charcoal-100 hover:bg-charcoal-200 rounded-lg cursor-grab active:cursor-grabbing touch-none shadow-sm"
			aria-label="Drag to reorder"
		>
			<GripVertical class="w-4 h-4 text-charcoal-500" />
		</button>
	{/if}

	<div class:pl-6={isEditMode}>
		{@render children()}
	</div>
</div>

<style>
	.sortable-tile {
		touch-action: none;
	}
</style>

