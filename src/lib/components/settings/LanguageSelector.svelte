<script lang="ts">
	import { Globe } from 'lucide-svelte';
	import { i18n } from '$lib/i18n';
	import { cn } from '$lib/utils/cn';
	import type { Language } from '$lib/types';

	interface Props {
		onSelectLanguage: (lang: Language) => void;
	}

	let { onSelectLanguage }: Props = $props();
</script>

<section class="card overflow-hidden">
	<div class="p-4 border-b border-charcoal-100">
		<div class="flex items-center gap-3">
			<Globe class="w-5 h-5 text-jade-500" />
			<span class="font-medium text-charcoal-600">{i18n.t.settings.language}</span>
		</div>
	</div>
	<div class="divide-y divide-charcoal-100">
		<button
			type="button"
			onclick={() => onSelectLanguage('en')}
			class={cn(
				'w-full p-4 text-left flex items-center justify-between hover:bg-cream-50 transition-colors',
				i18n.locale === 'en' && 'bg-jade-50'
			)}
		>
			<span>🇬🇧 English</span>
			{#if i18n.locale === 'en'}
				<span class="text-jade-500">✓</span>
			{/if}
		</button>
		<button
			type="button"
			onclick={() => onSelectLanguage('zh-HK')}
			class={cn(
				'w-full p-4 text-left flex items-center justify-between hover:bg-cream-50 transition-colors',
				i18n.locale === 'zh-HK' && 'bg-jade-50'
			)}
		>
			<span>🇭🇰 繁體中文（廣東話）</span>
			{#if i18n.locale === 'zh-HK'}
				<span class="text-jade-500">✓</span>
			{/if}
		</button>
	</div>
</section>

