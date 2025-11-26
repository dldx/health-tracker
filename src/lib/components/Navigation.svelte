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

<nav class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-charcoal-100 safe-bottom">
	<div class="flex items-center justify-around max-w-md mx-auto">
		{#each navItems as item}
			<a
				href={item.route}
				class={cn(
					'nav-item flex-1 py-3',
					isActive(item.route) && 'nav-item-active'
				)}
			>
				<item.icon class="w-6 h-6" />
				<span class="text-xs font-medium">{i18n.t.nav[item.labelKey]}</span>
			</a>
		{/each}
	</div>
</nav>

