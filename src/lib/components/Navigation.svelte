<script lang="ts">
	import { page } from '$app/stores';
	import { Calendar, BarChart3, Settings } from 'lucide-svelte';
	import { i18n } from '$lib/i18n';
	import { cn } from '$lib/utils/cn';
	import type { NavRoute } from '$lib/types';

	const navItems: { route: NavRoute; icon: typeof Calendar; labelKey: 'today' | 'stats' | 'settings' }[] = [
		{ route: '/', icon: Calendar, labelKey: 'today' },
		{ route: '/stats', icon: BarChart3, labelKey: 'stats' },
		{ route: '/settings', icon: Settings, labelKey: 'settings' }
	];

	function isActive(route: NavRoute): boolean {
		if (route === '/') {
			return $page.url.pathname === '/';
		}
		return $page.url.pathname.startsWith(route);
	}
</script>

<nav class="right-0 bottom-0 left-0 z-50 fixed bg-white border-charcoal-100 border-t">
	<div class="flex justify-around items-center mx-auto max-w-md">
		{#each navItems as item}
			<a
				href={item.route}
				class={cn(
					'flex-1 py-3 nav-item',
					isActive(item.route) && 'nav-item-active'
				)}
			>
				<item.icon class="w-6 h-6" />
				<span class="font-medium text-xs">{i18n.t.nav[item.labelKey]}</span>
			</a>
		{/each}
	</div>
</nav>

