<script lang="ts">
	import { DragDropProvider, DragOverlay, KeyboardSensor, PointerSensor } from '@dnd-kit-svelte/svelte';
	import { useSortable } from '@dnd-kit-svelte/svelte/sortable';
	import { move } from '@dnd-kit/helpers';
	import { LayoutGrid, GripVertical, Eye, EyeOff, RotateCcw } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { i18n } from '$lib/i18n';
	import { healthStore } from '$lib/stores/health.svelte';
	import type { TileConfig, TileId } from '$lib/types';

	interface TileItemProps {
		tile: TileConfig;
		index: number;
	}

	let tiles = $state<TileConfig[]>([...healthStore.sortedTiles]);

	// Sync tiles when store changes
	$effect(() => {
		tiles = [...healthStore.sortedTiles];
	});

	function getTileName(id: TileId): string {
		return i18n.t.tiles.names[id];
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function handleDragOver(event: any) {
		tiles = move(tiles, event) as TileConfig[];
	}

	async function handleDragEnd(event: { canceled?: boolean }) {
		if (event.canceled) return;

		// Save the new order
		const newOrder = tiles.map(t => t.id);
		await healthStore.reorderTiles(newOrder);
	}

	async function toggleVisibility(tileId: TileId) {
		await healthStore.toggleTileVisibility(tileId);
		tiles = [...healthStore.sortedTiles];
	}

	async function resetLayout() {
		await healthStore.resetTileConfig();
		tiles = [...healthStore.sortedTiles];
		toast.success(i18n.t.tiles.resetSuccess);
	}
</script>

{#snippet TileItem({ tile, index }: TileItemProps)}
	{@const sortable = useSortable({
		id: tile.id,
		index: () => index,
		group: 'settings-tiles',
		data: () => ({ tile, index })
	})}
	<div
		{@attach sortable.ref}
		class="flex items-center gap-3 p-3 bg-cream-50 rounded-lg transition-all"
		class:opacity-50={sortable.isDragging.current}
		class:ring-2={sortable.isDropTarget.current}
		class:ring-jade-400={sortable.isDropTarget.current}
	>
		<button
			{@attach sortable.handleRef}
			type="button"
			class="p-1 hover:bg-charcoal-100 rounded cursor-grab active:cursor-grabbing touch-none"
			aria-label="Drag to reorder"
		>
			<GripVertical class="w-4 h-4 text-charcoal-400" />
		</button>

		<span class="flex-1 text-sm text-charcoal-600" class:text-charcoal-400={!tile.visible}>
			{getTileName(tile.id)}
		</span>

		<button
			type="button"
			onclick={() => toggleVisibility(tile.id)}
			class="p-1.5 rounded-lg transition-colors"
			class:bg-jade-100={tile.visible}
			class:text-jade-600={tile.visible}
			class:bg-charcoal-100={!tile.visible}
			class:text-charcoal-400={!tile.visible}
			aria-label={tile.visible ? 'Hide tile' : 'Show tile'}
		>
			{#if tile.visible}
				<Eye class="w-4 h-4" />
			{:else}
				<EyeOff class="w-4 h-4" />
			{/if}
		</button>
	</div>
{/snippet}

<section class="card overflow-hidden">
	<div class="p-4 border-b border-charcoal-100">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<LayoutGrid class="w-5 h-5 text-jade-500" />
				<div>
					<span class="font-medium text-charcoal-600">{i18n.t.tiles.title}</span>
					<p class="text-xs text-charcoal-400">{i18n.t.tiles.subtitle}</p>
				</div>
			</div>
			<button
				type="button"
				onclick={resetLayout}
				class="p-2 text-charcoal-400 hover:text-charcoal-600 hover:bg-charcoal-50 rounded-lg transition-colors"
				title={i18n.t.tiles.resetLayout}
			>
				<RotateCcw class="w-4 h-4" />
			</button>
		</div>
	</div>

	<div class="p-4">
		<p class="text-xs text-charcoal-400 mb-3">{i18n.t.tiles.dragHint}</p>

		<DragDropProvider
			sensors={[KeyboardSensor, PointerSensor]}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
		>
			<div class="space-y-2">
				{#each tiles as tile, index (tile.id)}
					{@render TileItem({ tile, index })}
				{/each}
			</div>

			<DragOverlay>
				{#snippet children(source)}
					{@const tile = tiles.find(t => t.id === source.id)}
					{#if tile}
						<div class="flex items-center gap-3 p-3 bg-cream-50 rounded-lg shadow-lg border border-jade-200">
							<div class="p-1">
								<GripVertical class="w-4 h-4 text-charcoal-400" />
							</div>
							<span class="flex-1 text-sm text-charcoal-600">
								{getTileName(tile.id)}
							</span>
							<div class="p-1.5 bg-jade-100 text-jade-600 rounded-lg">
								{#if tile.visible}
									<Eye class="w-4 h-4" />
								{:else}
									<EyeOff class="w-4 h-4" />
								{/if}
							</div>
						</div>
					{/if}
				{/snippet}
			</DragOverlay>
		</DragDropProvider>
	</div>
</section>

