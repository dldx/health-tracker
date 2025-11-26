<script lang="ts">
	import {
		ChevronRight,
		Download,
		Upload,
		Trash2,
		Globe,
		Heart,
		Zap,
		Shield,
		Droplets
	} from 'lucide-svelte';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';
	import { i18n } from '$lib/i18n';
	import { healthStore } from '$lib/stores/health.svelte';
	import { db, resetDatabase } from '$lib/db/database';
	import { cn } from '$lib/utils/cn';
	import type { Language, ExportData } from '$lib/types';

	let showClearConfirm = $state(false);
	let isExporting = $state(false);
	let isImporting = $state(false);

	async function handleExport() {
		isExporting = true;
		try {
			const data: ExportData = {
				version: '1.2.0',
				exportedAt: new Date().toISOString(),
				ailmentTypes: await db.ailmentTypes.toArray(),
				triggerTypes: await db.triggerTypes.toArray(),
				healthEntries: await db.healthEntries.toArray(),
				dailyCheckIns: await db.dailyCheckIns.toArray(),
				periodEntries: await db.periodEntries.toArray(),
				customSymptoms: await db.customSymptoms.toArray(),
				settings: await db.settings.get('settings') || null
			};

			const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `health-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
			a.click();
			URL.revokeObjectURL(url);

			toast.success(i18n.t.settings.exportSuccess);
		} catch (error) {
			console.error('Export failed:', error);
			toast.error(i18n.t.errors.exportFailed);
		} finally {
			isExporting = false;
		}
	}

	async function handleImport() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.json';
		input.onchange = async (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (!file) return;

			isImporting = true;
			try {
				const text = await file.text();
				const data: ExportData = JSON.parse(text);

				// Validate and import
				if (data.version && data.healthEntries) {
					await db.transaction('rw',
						[db.ailmentTypes, db.triggerTypes, db.healthEntries, db.dailyCheckIns, db.periodEntries, db.customSymptoms, db.settings],
						async () => {
							if (data.ailmentTypes) await db.ailmentTypes.bulkPut(data.ailmentTypes);
							if (data.triggerTypes) await db.triggerTypes.bulkPut(data.triggerTypes);
							if (data.healthEntries) await db.healthEntries.bulkPut(data.healthEntries);

							// dailyCheckIns has unique constraint on date - delete existing records with same dates first
							if (data.dailyCheckIns && data.dailyCheckIns.length > 0) {
								const datesToImport = data.dailyCheckIns.map(c => c.date);
								await db.dailyCheckIns.where('date').anyOf(datesToImport).delete();
								await db.dailyCheckIns.bulkPut(data.dailyCheckIns);
							}

							// periodEntries - delete existing records with same dates to avoid conflicts
							if (data.periodEntries && data.periodEntries.length > 0) {
								const periodDatesToImport = data.periodEntries.map(p => p.date);
								await db.periodEntries.where('date').anyOf(periodDatesToImport).delete();
								await db.periodEntries.bulkPut(data.periodEntries);
							}

							if (data.customSymptoms) await db.customSymptoms.bulkPut(data.customSymptoms);
							if (data.settings) await db.settings.put(data.settings);
						}
					);
					await healthStore.loadAllData();
					toast.success(i18n.t.settings.importSuccess);
				} else {
					toast.error(i18n.t.settings.importInvalid);
				}
			} catch (error) {
				console.error('Import failed:', error);
				toast.error(i18n.t.errors.importFailed);
			} finally {
				isImporting = false;
			}
		};
		input.click();
	}

	async function handleClearData() {
		try {
			await resetDatabase();
			await healthStore.loadAllData();
			showClearConfirm = false;
			toast.success(i18n.t.settings.dataCleared);
		} catch (error) {
			console.error('Clear data failed:', error);
			toast.error(i18n.t.errors.deleteFailed);
		}
	}

	function setLanguage(lang: Language) {
		i18n.setLocale(lang);
	}
</script>

<main class="max-w-md mx-auto px-4 py-6 space-y-6">
	<!-- Header -->
	<header class="text-center">
		<h1 class="text-2xl font-bold text-jade-600 neon-glow">
			{i18n.t.settings.title}
		</h1>
		<p class="text-sm text-charcoal-400">
			{i18n.t.settings.subtitle}
		</p>
	</header>

	<!-- Language -->
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
				onclick={() => setLanguage('en')}
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
				onclick={() => setLanguage('zh-HK')}
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

	<!-- Ailment Types -->
	<section class="card overflow-hidden">
		<div class="p-4 border-b border-charcoal-100">
			<div class="flex items-center gap-3">
				<Heart class="w-5 h-5 text-coral-500" />
				<div>
					<span class="font-medium text-charcoal-600">{i18n.t.settings.ailmentTypes}</span>
					<p class="text-xs text-charcoal-400">{i18n.t.settings.manageAilments}</p>
				</div>
			</div>
		</div>
		<div class="divide-y divide-charcoal-100">
			{#each healthStore.ailmentTypes as ailment}
				<button
					type="button"
					onclick={() => healthStore.toggleAilmentActive(ailment.id)}
					class="w-full p-4 flex items-center justify-between hover:bg-cream-50 transition-colors"
				>
					<div class="flex items-center gap-3">
						<span class="text-xl">
							{#if ailment.icon.includes(':')}
								<Icon icon={ailment.icon} />
							{:else}
								{ailment.icon}
							{/if}
						</span>
						<span class={cn(
							'text-sm',
							ailment.isActive ? 'text-charcoal-600' : 'text-charcoal-400 line-through'
						)}>
							{i18n.localizedName(ailment)}
						</span>
					</div>
					<div class={cn(
						'w-10 h-6 rounded-full transition-colors relative',
						ailment.isActive ? 'bg-jade-400' : 'bg-charcoal-200'
					)}>
						<div class={cn(
							'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform',
							ailment.isActive ? 'translate-x-5' : 'translate-x-1'
						)}></div>
					</div>
				</button>
			{/each}
		</div>
	</section>

	<!-- Trigger Types -->
	<section class="card overflow-hidden">
		<div class="p-4 border-b border-charcoal-100">
			<div class="flex items-center gap-3">
				<Zap class="w-5 h-5 text-gold-500" />
				<div>
					<span class="font-medium text-charcoal-600">{i18n.t.settings.triggerTypes}</span>
					<p class="text-xs text-charcoal-400">{i18n.t.settings.manageTriggers}</p>
				</div>
			</div>
		</div>
		<div class="divide-y divide-charcoal-100 max-h-64 overflow-y-auto">
			{#each healthStore.triggerTypes as trigger}
				<button
					type="button"
					onclick={() => healthStore.toggleTriggerActive(trigger.id)}
					class="w-full p-4 flex items-center justify-between hover:bg-cream-50 transition-colors"
				>
					<div class="flex items-center gap-3">
						<span class="text-xl">
							{#if trigger.icon.includes(':')}
								<Icon icon={trigger.icon} />
							{:else}
								{trigger.icon}
							{/if}
						</span>
						<span class={cn(
							'text-sm',
							trigger.isActive ? 'text-charcoal-600' : 'text-charcoal-400 line-through'
						)}>
							{i18n.localizedName(trigger)}
						</span>
					</div>
					<div class={cn(
						'w-10 h-6 rounded-full transition-colors relative',
						trigger.isActive ? 'bg-jade-400' : 'bg-charcoal-200'
					)}>
						<div class={cn(
							'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform',
							trigger.isActive ? 'translate-x-5' : 'translate-x-1'
						)}></div>
					</div>
				</button>
			{/each}
		</div>
	</section>

	<!-- Custom Period Symptoms -->
	{#if healthStore.customSymptoms.length > 0}
		<section class="card overflow-hidden">
			<div class="p-4 border-b border-charcoal-100">
				<div class="flex items-center gap-3">
					<Droplets class="w-5 h-5 text-pink-500" />
					<div>
						<span class="font-medium text-charcoal-600">{i18n.t.period.symptoms}</span>
						<p class="text-xs text-charcoal-400">{i18n.t.settings.manageAilments}</p>
					</div>
				</div>
			</div>
			<div class="divide-y divide-charcoal-100 max-h-48 overflow-y-auto">
				{#each healthStore.customSymptoms as symptom}
					<button
						type="button"
						onclick={() => healthStore.toggleCustomSymptomActive(symptom.id)}
						class="w-full p-4 flex items-center justify-between hover:bg-cream-50 transition-colors"
					>
						<div class="flex items-center gap-3">
							<span class="text-xl">{symptom.icon}</span>
							<span class={cn(
								'text-sm',
								symptom.isActive ? 'text-charcoal-600' : 'text-charcoal-400 line-through'
							)}>
								{i18n.locale === 'zh-HK' && symptom.nameZh ? symptom.nameZh : symptom.name}
							</span>
						</div>
						<div class={cn(
							'w-10 h-6 rounded-full transition-colors relative',
							symptom.isActive ? 'bg-pink-400' : 'bg-charcoal-200'
						)}>
							<div class={cn(
								'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform',
								symptom.isActive ? 'translate-x-5' : 'translate-x-1'
							)}></div>
						</div>
					</button>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Data Management -->
	<section class="card overflow-hidden">
		<div class="p-4 border-b border-charcoal-100">
			<div class="flex items-center gap-3">
				<Shield class="w-5 h-5 text-jade-500" />
				<div>
					<span class="font-medium text-charcoal-600">{i18n.t.settings.data}</span>
					<p class="text-xs text-charcoal-400">{i18n.t.settings.privacyNote}</p>
				</div>
			</div>
		</div>
		<div class="divide-y divide-charcoal-100">
			<button
				type="button"
				onclick={handleExport}
				disabled={isExporting}
				class="w-full p-4 flex items-center justify-between hover:bg-cream-50 transition-colors disabled:opacity-50"
			>
				<div class="flex items-center gap-3">
					<Download class="w-5 h-5 text-charcoal-500" />
					<span class="text-sm text-charcoal-600">{i18n.t.settings.exportData}</span>
				</div>
				<ChevronRight class="w-5 h-5 text-charcoal-400" />
			</button>
			<button
				type="button"
				onclick={handleImport}
				disabled={isImporting}
				class="w-full p-4 flex items-center justify-between hover:bg-cream-50 transition-colors disabled:opacity-50"
			>
				<div class="flex items-center gap-3">
					<Upload class="w-5 h-5 text-charcoal-500" />
					<span class="text-sm text-charcoal-600">{i18n.t.settings.importData}</span>
				</div>
				<ChevronRight class="w-5 h-5 text-charcoal-400" />
			</button>
			<button
				type="button"
				onclick={() => showClearConfirm = true}
				class="w-full p-4 flex items-center justify-between hover:bg-coral-50 transition-colors"
			>
				<div class="flex items-center gap-3">
					<Trash2 class="w-5 h-5 text-coral-500" />
					<span class="text-sm text-coral-600">{i18n.t.settings.clearData}</span>
				</div>
				<ChevronRight class="w-5 h-5 text-coral-400" />
			</button>
		</div>
	</section>

	<!-- Version -->
	<p class="text-center text-xs text-charcoal-300">
		{i18n.t.settings.version} 1.0.0
	</p>
</main>

<!-- Clear Data Confirmation Modal -->
{#if showClearConfirm}
	<div
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in"
		onclick={() => showClearConfirm = false}
		onkeydown={(e) => e.key === 'Escape' && (showClearConfirm = false)}
		role="button"
		tabindex="-1"
	>
		<div
			class="bg-white rounded-2xl p-6 max-w-sm w-full animate-slide-up"
			onclick={(e) => e.stopPropagation()}
			onkeydown={() => {}}
			role="dialog"
			tabindex="-1"
		>
			<h3 class="text-lg font-semibold text-charcoal-600 mb-2">
				{i18n.t.settings.clearData}
			</h3>
			<p class="text-sm text-charcoal-500 mb-6">
				{i18n.t.settings.clearDataConfirm}
			</p>
			<div class="flex gap-3">
				<button
					type="button"
					onclick={() => showClearConfirm = false}
					class="btn-secondary flex-1"
				>
					{i18n.t.common.cancel}
				</button>
				<button
					type="button"
					onclick={handleClearData}
					class="btn-primary flex-1 !bg-coral-500 hover:!bg-coral-600"
				>
					{i18n.t.common.delete}
				</button>
			</div>
		</div>
	</div>
{/if}

