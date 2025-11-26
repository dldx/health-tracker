<script lang="ts">
	import { Pencil, Trash2, type Icon as LucideIcon } from 'lucide-svelte';
	import Icon from '@iconify/svelte';
	import { i18n } from '$lib/i18n';
	import { cn } from '$lib/utils/cn';
	import type { AilmentType, TriggerType, CustomPeriodSymptom } from '$lib/types';

	type Item = AilmentType | TriggerType | CustomPeriodSymptom;

	interface Props {
		title: string;
		subtitle: string;
		icon: typeof LucideIcon;
		iconColor: string;
		items: Item[];
		toggleActiveColor?: string;
		maxHeight?: string;
		onToggle: (id: string) => Promise<void>;
		onEdit: (item: Item) => void;
		onDelete: (item: Item) => void;
	}

	let {
		title,
		subtitle,
		icon: IconComponent,
		iconColor,
		items,
		toggleActiveColor = 'jade',
		maxHeight,
		onToggle,
		onEdit,
		onDelete
	}: Props = $props();
</script>

<section class="card overflow-hidden">
	<div class="p-4 border-b border-charcoal-100">
		<div class="flex items-center gap-3">
			<IconComponent class="w-5 h-5 {iconColor}" />
			<div>
				<span class="font-medium text-charcoal-600">{title}</span>
				<p class="text-xs text-charcoal-400">{subtitle}</p>
			</div>
		</div>
	</div>
	<div
		class="divide-y divide-charcoal-100"
		class:max-h-64={maxHeight === 'md'}
		class:max-h-48={maxHeight === 'sm'}
		class:overflow-y-auto={maxHeight}
	>
		{#each items as item}
			<div class="flex items-center hover:bg-cream-50 transition-colors">
				<button
					type="button"
					onclick={() => onToggle(item.id)}
					class="flex-1 p-4 flex items-center justify-between"
				>
					<div class="flex items-center gap-3">
						<span class="text-xl">
							{#if item.icon.includes(':')}
								<Icon icon={item.icon} />
							{:else}
								{item.icon}
							{/if}
						</span>
						<div class="text-left">
							<span class={cn(
								'text-sm block',
								item.isActive ? 'text-charcoal-600' : 'text-charcoal-400 line-through'
							)}>
								{i18n.localizedName(item)}
							</span>
							{#if !item.isDefault}
								<span class="text-[10px] text-jade-500">Custom</span>
							{/if}
						</div>
					</div>
					<div class={cn(
						'w-10 h-6 rounded-full transition-colors relative',
						item.isActive ? `bg-${toggleActiveColor}-400` : 'bg-charcoal-200'
					)}>
						<div class={cn(
							'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform',
							item.isActive ? 'translate-x-5' : 'translate-x-1'
						)}></div>
					</div>
				</button>
				{#if !item.isDefault}
					<div class="flex pr-2 gap-1">
						<button
							type="button"
							onclick={() => onEdit(item)}
							class="p-2 rounded-full hover:bg-jade-100 text-charcoal-400 hover:text-jade-600 transition-colors"
							title={i18n.t.settings.editItem}
						>
							<Pencil class="w-4 h-4" />
						</button>
						<button
							type="button"
							onclick={() => onDelete(item)}
							class="p-2 rounded-full hover:bg-coral-100 text-charcoal-400 hover:text-coral-600 transition-colors"
							title={i18n.t.settings.deleteItem}
						>
							<Trash2 class="w-4 h-4" />
						</button>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</section>

