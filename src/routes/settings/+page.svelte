<script lang="ts">
	import { Heart, Zap, Droplets } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { i18n } from '$lib/i18n';
	import { healthStore } from '$lib/stores/health.svelte';
	import { db, resetDatabase } from '$lib/db/database';
	import {
		LanguageSelector,
		PersonalizationSection,
		ToggleListSection,
		DataManagement,
		EditItemModal,
		DeleteConfirmModal,
		ClearDataModal
	} from '$lib/components/settings';
	import type { Language, ExportData, AilmentType, TriggerType, CustomPeriodSymptom, TriggerCategory } from '$lib/types';

	let showClearConfirm = $state(false);
	let isExporting = $state(false);
	let isImporting = $state(false);

	// Edit/Delete state
	type EditItemType = 'ailment' | 'trigger' | 'symptom';
	let editingItem = $state<{ type: EditItemType; item: AilmentType | TriggerType | CustomPeriodSymptom } | null>(null);
	let deleteItem = $state<{ type: EditItemType; item: AilmentType | TriggerType | CustomPeriodSymptom } | null>(null);

	function openEditModal(type: EditItemType, item: AilmentType | TriggerType | CustomPeriodSymptom) {
		editingItem = { type, item };
	}

	function closeEditModal() {
		editingItem = null;
	}

	async function handleSaveEdit(name: string, nameZh: string, icon: string, category?: TriggerCategory) {
		if (!editingItem) return;

		try {
			const updates = {
				name: name.trim(),
				nameZh: nameZh.trim(),
				icon: icon.trim()
			};

			if (editingItem.type === 'ailment') {
				await healthStore.updateAilmentType(editingItem.item.id, updates);
			} else if (editingItem.type === 'trigger') {
				await healthStore.updateTriggerType(editingItem.item.id, { ...updates, category: category || 'other' });
			} else if (editingItem.type === 'symptom') {
				await healthStore.updateCustomSymptom(editingItem.item.id, updates);
			}

			toast.success(i18n.t.settings.updated);
			closeEditModal();
		} catch (error) {
			console.error('Update failed:', error);
			toast.error(i18n.t.errors.saveFailed);
		}
	}

	async function handleDelete() {
		if (!deleteItem) return;

		try {
			if (deleteItem.type === 'ailment') {
				await healthStore.deleteAilmentType(deleteItem.item.id);
			} else if (deleteItem.type === 'trigger') {
				await healthStore.deleteTriggerType(deleteItem.item.id);
			} else if (deleteItem.type === 'symptom') {
				await healthStore.deleteCustomSymptom(deleteItem.item.id);
			}

			toast.success(i18n.t.settings.deleted);
			deleteItem = null;
		} catch (error) {
			console.error('Delete failed:', error);
			toast.error(i18n.t.errors.deleteFailed);
		}
	}

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

							if (data.dailyCheckIns && data.dailyCheckIns.length > 0) {
								const datesToImport = data.dailyCheckIns.map(c => c.date);
								await db.dailyCheckIns.where('date').anyOf(datesToImport).delete();
								await db.dailyCheckIns.bulkPut(data.dailyCheckIns);
							}

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

<main class="max-w-md mx-auto px-4 py-6 space-y-6 pb-24">
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
	<LanguageSelector onSelectLanguage={setLanguage} />

	<!-- Personalization (Easter Egg) -->
	<PersonalizationSection />

	<!-- Ailment Types -->
	<ToggleListSection
		title={i18n.t.settings.ailmentTypes}
		subtitle={i18n.t.settings.manageAilments}
		icon={Heart}
		iconColor="text-coral-500"
		items={healthStore.ailmentTypes}
		onToggle={healthStore.toggleAilmentActive.bind(healthStore)}
		onEdit={(item) => openEditModal('ailment', item)}
		onDelete={(item) => deleteItem = { type: 'ailment', item }}
	/>

	<!-- Trigger Types -->
	<ToggleListSection
		title={i18n.t.settings.triggerTypes}
		subtitle={i18n.t.settings.manageTriggers}
		icon={Zap}
		iconColor="text-gold-500"
		items={healthStore.triggerTypes}
		maxHeight="md"
		onToggle={healthStore.toggleTriggerActive.bind(healthStore)}
		onEdit={(item) => openEditModal('trigger', item)}
		onDelete={(item) => deleteItem = { type: 'trigger', item }}
	/>

	<!-- Custom Period Symptoms -->
	{#if healthStore.customSymptoms.length > 0}
		<ToggleListSection
			title={i18n.t.period.symptoms}
			subtitle={i18n.t.settings.manageAilments}
			icon={Droplets}
			iconColor="text-pink-500"
			items={healthStore.customSymptoms}
			toggleActiveColor="pink"
			maxHeight="sm"
			onToggle={healthStore.toggleCustomSymptomActive.bind(healthStore)}
			onEdit={(item) => openEditModal('symptom', item)}
			onDelete={(item) => deleteItem = { type: 'symptom', item }}
		/>
	{/if}

	<!-- Data Management -->
	<DataManagement
		{isExporting}
		{isImporting}
		onExport={handleExport}
		onImport={handleImport}
		onClearData={() => showClearConfirm = true}
	/>

	<!-- Version -->
	<p class="text-center text-xs text-charcoal-300">
		{i18n.t.settings.version} 1.0.0
	</p>
</main>

<!-- Edit Modal -->
{#if editingItem}
	<EditItemModal
		type={editingItem.type}
		name={editingItem.item.name}
		nameZh={editingItem.item.nameZh || ''}
		icon={editingItem.item.icon}
		category={editingItem.type === 'trigger' && 'category' in editingItem.item ? editingItem.item.category : undefined}
		onClose={closeEditModal}
		onSave={handleSaveEdit}
	/>
{/if}

<!-- Delete Confirmation Modal -->
{#if deleteItem}
	<DeleteConfirmModal
		item={deleteItem.item}
		onClose={() => deleteItem = null}
		onConfirm={handleDelete}
	/>
{/if}

<!-- Clear Data Confirmation Modal -->
{#if showClearConfirm}
	<ClearDataModal
		onClose={() => showClearConfirm = false}
		onConfirm={handleClearData}
	/>
{/if}
