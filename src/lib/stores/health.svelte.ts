/**
 * Health Data Store
 * 健康資料狀態管理
 */

import { db, initializeDatabase } from '$lib/db/database';
import type {
	HealthEntry,
	AilmentType,
	TriggerType,
	DailyCheckIn,
	PeriodEntry,
	MoodLevel,
	Severity,
	FlowLevel,
	PeriodSymptom,
	CustomPeriodSymptom,
	HealthEntryWithDetails,
	CycleStats,
	AppSettings,
	TileConfig,
	TileId,
	StatsTileConfig,
	StatsTileId,
	Language
} from '$lib/types';
import { DEFAULT_TILE_ORDER, DEFAULT_STATS_TILE_ORDER } from '$lib/types';
import { getTodayISO, addDays } from '$lib/utils/date';
import { generateUUID } from '$lib/utils/uuid';
import { i18n } from '$lib/i18n';

/**
 * Health Store using Svelte 5 runes
 * 使用 Svelte 5 runes 嘅健康資料狀態
 */
class HealthStore {
	// Core data
	entries = $state<HealthEntry[]>([]);
	ailmentTypes = $state<AilmentType[]>([]);
	triggerTypes = $state<TriggerType[]>([]);
	dailyCheckIns = $state<DailyCheckIn[]>([]);
	periodEntries = $state<PeriodEntry[]>([]);
	customSymptoms = $state<CustomPeriodSymptom[]>([]);
	customName = $state<string | undefined>(undefined);
	language = $state<Language>('en');
	tileConfig = $state<TileConfig[]>([...DEFAULT_TILE_ORDER]);
	statsTileConfig = $state<StatsTileConfig[]>([...DEFAULT_STATS_TILE_ORDER]);
	hasCompletedOnboarding = $state<boolean>(false);

	// UI state
	selectedDate = $state<string>(getTodayISO());
	isLoading = $state<boolean>(true);
	isInitialized = $state<boolean>(false);

	// Derived: entries for selected date
	get selectedDateEntries(): HealthEntry[] {
		return this.entries
			.filter((e) => e.date === this.selectedDate)
			.sort((a, b) => b.time.localeCompare(a.time));
	}

	// Derived: entries with full details
	get selectedDateEntriesWithDetails(): HealthEntryWithDetails[] {
		return this.selectedDateEntries.map((entry) => ({
			...entry,
			ailmentType: this.ailmentTypes.find((a) => a.id === entry.ailmentTypeId) || this.ailmentTypes[0],
			triggers: entry.triggerIds
				.map((id) => this.triggerTypes.find((t) => t.id === id))
				.filter((t): t is TriggerType => t !== undefined)
		}));
	}

	// Derived: ailment usage counts (how many entries per ailment)
	get ailmentUsageCounts(): Record<string, number> {
		const counts: Record<string, number> = {};
		for (const entry of this.entries) {
			counts[entry.ailmentTypeId] = (counts[entry.ailmentTypeId] || 0) + 1;
		}
		return counts;
	}

	// Derived: active ailment types sorted by usage (most used first)
	get activeAilmentTypes(): AilmentType[] {
		const usageCounts = this.ailmentUsageCounts;
		return this.ailmentTypes
			.filter((a) => a.isActive)
			.sort((a, b) => (usageCounts[b.id] || 0) - (usageCounts[a.id] || 0));
	}

	// Derived: symptom usage counts (how many times each symptom appears in period entries)
	get symptomUsageCounts(): Record<string, number> {
		const counts: Record<string, number> = {};
		for (const entry of this.periodEntries) {
			for (const symptom of entry.symptoms) {
				counts[symptom] = (counts[symptom] || 0) + 1;
			}
		}
		return counts;
	}

	// Derived: active custom symptoms
	get activeCustomSymptoms(): CustomPeriodSymptom[] {
		return this.customSymptoms.filter((s) => s.isActive);
	}

	// Derived: active trigger types
	get activeTriggerTypes(): TriggerType[] {
		return this.triggerTypes.filter((t) => t.isActive);
	}

	// Derived: today's check-in
	get todayCheckIn(): DailyCheckIn | undefined {
		return this.dailyCheckIns.find((c) => c.date === getTodayISO());
	}

	// Derived: selected date's check-in
	get selectedDateCheckIn(): DailyCheckIn | undefined {
		return this.dailyCheckIns.find((c) => c.date === this.selectedDate);
	}

	// Derived: selected date's period entry
	get selectedDatePeriod(): PeriodEntry | undefined {
		return this.periodEntries.find((p) => p.date === this.selectedDate);
	}

	// Derived: period dates for calendar highlighting
	get periodDates(): Set<string> {
		return new Set(this.periodEntries.map((p) => p.date));
	}

	// Derived: cycle statistics
	get cycleStats(): CycleStats {
		return this.calculateCycleStats();
	}

	// Derived: visible tiles sorted by order
	get visibleTiles(): TileConfig[] {
		return [...this.tileConfig]
			.filter(t => t.visible)
			.sort((a, b) => a.order - b.order);
	}

	// Derived: all tiles sorted by order (for settings)
	get sortedTiles(): TileConfig[] {
		return [...this.tileConfig].sort((a, b) => a.order - b.order);
	}

	// Derived: visible stats tiles sorted by order
	get visibleStatsTiles(): StatsTileConfig[] {
		return [...this.statsTileConfig]
			.filter(t => t.visible)
			.sort((a, b) => a.order - b.order);
	}

	// Derived: all stats tiles sorted by order (for settings)
	get sortedStatsTiles(): StatsTileConfig[] {
		return [...this.statsTileConfig].sort((a, b) => a.order - b.order);
	}

	/**
	 * Initialize the store
	 * 初始化狀態
	 */
	async initialize(): Promise<void> {
		if (this.isInitialized) return;

		this.isLoading = true;
		try {
			await initializeDatabase();
			await this.loadAllData();
			this.isInitialized = true;
		} finally {
			this.isLoading = false;
		}
	}

	/**
	 * Load all data from database
	 * 從資料庫載入所有資料
	 */
	async loadAllData(): Promise<void> {
		const [ailments, triggers, entries, checkIns, periods, symptoms, settings] = await Promise.all([
			db.ailmentTypes.toArray(),
			db.triggerTypes.toArray(),
			db.healthEntries.toArray(),
			db.dailyCheckIns.toArray(),
			db.periodEntries.toArray(),
			db.customSymptoms.toArray(),
			db.settings.get('settings')
		]);

		this.ailmentTypes = ailments;
		this.triggerTypes = triggers;
		this.entries = entries;
		this.dailyCheckIns = checkIns;
		this.periodEntries = periods;
		this.customSymptoms = symptoms;
		this.customName = settings?.customName;
		this.language = settings?.language ?? 'en';
		this.tileConfig = settings?.tileConfig ?? [...DEFAULT_TILE_ORDER];
		this.statsTileConfig = settings?.statsTileConfig ?? [...DEFAULT_STATS_TILE_ORDER];
		this.hasCompletedOnboarding = settings?.hasCompletedOnboarding ?? false;

		// Sync language to i18n store
		i18n.setLocale(this.language);
	}

	/**
	 * Check URL for custom name parameter and save it
	 * 檢查URL嘅自訂名稱參數並儲存
	 */
	async checkUrlForCustomName(): Promise<void> {
		if (typeof window === 'undefined') return;

		const urlParams = new URLSearchParams(window.location.search);
		const nameFromUrl = urlParams.get('name');

		if (nameFromUrl && nameFromUrl.trim()) {
			await this.setCustomName(nameFromUrl.trim());
			// Clean up URL without reloading
			const newUrl = window.location.pathname + window.location.hash;
			window.history.replaceState({}, '', newUrl);
		}
	}

	/**
	 * Set custom name (easter egg personalization)
	 * 設定自訂名稱（彩蛋個人化功能）
	 */
	async setCustomName(name: string | undefined): Promise<void> {
		const trimmedName = name?.trim() || undefined;
		this.customName = trimmedName;

		const now = new Date();
		const settings = await db.settings.get('settings');

		if (settings) {
			await db.settings.update('settings', { customName: trimmedName, updatedAt: now });
		} else {
			const newSettings: AppSettings = {
				id: 'settings',
				language: 'en',
				theme: 'light',
				customName: trimmedName,
				createdAt: now,
				updatedAt: now
			};
			await db.settings.put(newSettings);
		}
	}

	/**
	 * Clear custom name
	 * 清除自訂名稱
	 */
	async clearCustomName(): Promise<void> {
		await this.setCustomName(undefined);
	}

	/**
	 * Complete onboarding flow
	 * 完成引導流程
	 */
	async completeOnboarding(): Promise<void> {
		this.hasCompletedOnboarding = true;

		const now = new Date();
		const settings = await db.settings.get('settings');

		if (settings) {
			await db.settings.update('settings', { hasCompletedOnboarding: true, updatedAt: now });
		} else {
			const newSettings: AppSettings = {
				id: 'settings',
				language: this.language,
				theme: 'light',
				hasCompletedOnboarding: true,
				createdAt: now,
				updatedAt: now
			};
			await db.settings.put(newSettings);
		}
	}

	/**
	 * Set language and persist to database
	 * 設定語言並儲存到資料庫
	 */
	async setLanguage(lang: Language): Promise<void> {
		this.language = lang;
		i18n.setLocale(lang);

		const now = new Date();
		const settings = await db.settings.get('settings');

		if (settings) {
			await db.settings.update('settings', { language: lang, updatedAt: now });
		} else {
			const newSettings: AppSettings = {
				id: 'settings',
				language: lang,
				theme: 'light',
				createdAt: now,
				updatedAt: now
			};
			await db.settings.put(newSettings);
		}
	}

	/**
	 * Update tile configuration (order and visibility)
	 * 更新磁貼配置（順序同可見性）
	 */
	async setTileConfig(config: TileConfig[]): Promise<void> {
		// Clone the array to ensure it's not a Svelte proxy
		const plainConfig = config.map(t => ({ ...t }));
		this.tileConfig = plainConfig;

		const now = new Date();
		const settings = await db.settings.get('settings');

		// Use put instead of update to ensure the entire object is saved
		await db.settings.put({
			id: 'settings',
			language: settings?.language ?? 'en',
			theme: settings?.theme ?? 'light',
			customName: settings?.customName,
			tileConfig: plainConfig,
			statsTileConfig: settings?.statsTileConfig ?? [...DEFAULT_STATS_TILE_ORDER],
			hasCompletedOnboarding: settings?.hasCompletedOnboarding ?? false,
			createdAt: settings?.createdAt ?? now,
			updatedAt: now
		});
	}

	/**
	 * Toggle tile visibility
	 * 切換磁貼可見性
	 */
	async toggleTileVisibility(tileId: TileId): Promise<void> {
		const newConfig = this.tileConfig.map(t =>
			t.id === tileId ? { ...t, visible: !t.visible } : t
		);
		await this.setTileConfig(newConfig);
	}

	/**
	 * Reorder tiles
	 * 重新排序磁貼
	 */
	async reorderTiles(newOrder: TileId[]): Promise<void> {
		const newConfig = newOrder.map((id, index) => {
			const existing = this.tileConfig.find(t => t.id === id);
			return existing ? { ...existing, order: index } : { id, visible: true, order: index };
		});
		await this.setTileConfig(newConfig);
	}

	/**
	 * Reset tile configuration to defaults
	 * 重設磁貼配置為預設值
	 */
	async resetTileConfig(): Promise<void> {
		await this.setTileConfig([...DEFAULT_TILE_ORDER]);
	}

	/**
	 * Set stats tile configuration
	 * 設定統計磁貼配置
	 */
	async setStatsTileConfig(config: StatsTileConfig[]): Promise<void> {
		// Clone the array to ensure it's not a Svelte proxy
		const plainConfig = config.map(t => ({ ...t }));
		this.statsTileConfig = plainConfig;

		const now = new Date();
		const settings = await db.settings.get('settings');

		// Use put to ensure the entire object is saved
		await db.settings.put({
			id: 'settings',
			language: settings?.language ?? 'en',
			theme: settings?.theme ?? 'light',
			customName: settings?.customName,
			tileConfig: settings?.tileConfig ?? [...DEFAULT_TILE_ORDER],
			statsTileConfig: plainConfig,
			hasCompletedOnboarding: settings?.hasCompletedOnboarding ?? false,
			createdAt: settings?.createdAt ?? now,
			updatedAt: now
		});
	}

	/**
	 * Toggle stats tile visibility
	 * 切換統計磁貼可見性
	 */
	async toggleStatsTileVisibility(tileId: StatsTileId): Promise<void> {
		const newConfig = this.statsTileConfig.map(t =>
			t.id === tileId ? { ...t, visible: !t.visible } : t
		);
		await this.setStatsTileConfig(newConfig);
	}

	/**
	 * Reorder stats tiles
	 * 重新排序統計磁貼
	 */
	async reorderStatsTiles(newOrder: StatsTileId[]): Promise<void> {
		const newConfig = newOrder.map((id, index) => {
			const existing = this.statsTileConfig.find(t => t.id === id);
			return existing ? { ...existing, order: index } : { id, visible: true, order: index };
		});
		await this.setStatsTileConfig(newConfig);
	}

	/**
	 * Reset stats tile configuration to defaults
	 * 重設統計磁貼配置為預設值
	 */
	async resetStatsTileConfig(): Promise<void> {
		await this.setStatsTileConfig([...DEFAULT_STATS_TILE_ORDER]);
	}

	/**
	 * Set selected date
	 * 設定選擇嘅日期
	 */
	setSelectedDate(date: string): void {
		this.selectedDate = date;
	}

	/**
	 * Add a new health entry
	 * 新增健康記錄
	 */
	async addEntry(entry: Omit<HealthEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<HealthEntry> {
		// Ensure database is initialized
		if (!this.isInitialized) {
			await this.initialize();
		}

		const now = new Date();
		// Create a plain object (not a reactive proxy) for IndexedDB
		const newEntry: HealthEntry = {
			id: generateUUID(),
			date: entry.date,
			time: entry.time,
			ailmentTypeId: entry.ailmentTypeId,
			severity: entry.severity,
			triggerIds: [...entry.triggerIds], // Clone the array to avoid proxy issues
			notes: entry.notes,
			createdAt: now,
			updatedAt: now
		};

		await db.healthEntries.add(newEntry);
		this.entries = [...this.entries, newEntry];
		return newEntry;
	}

	/**
	 * Update a health entry
	 * 更新健康記錄
	 */
	async updateEntry(
		id: string,
		updates: Partial<Omit<HealthEntry, 'id' | 'createdAt' | 'updatedAt'>>
	): Promise<void> {
		const updatedAt = new Date();
		await db.healthEntries.update(id, { ...updates, updatedAt });
		this.entries = this.entries.map((e) => (e.id === id ? { ...e, ...updates, updatedAt } : e));
	}

	/**
	 * Delete a health entry
	 * 刪除健康記錄
	 */
	async deleteEntry(id: string): Promise<void> {
		await db.healthEntries.delete(id);
		this.entries = this.entries.filter((e) => e.id !== id);
	}

	/**
	 * Set daily mood check-in
	 * 設定每日心情記錄
	 */
	async setMood(date: string, mood: MoodLevel, notes: string = ''): Promise<void> {
		const existing = this.dailyCheckIns.find((c) => c.date === date);
		const now = new Date();

		if (existing) {
			await db.dailyCheckIns.update(existing.id, { mood, notes, updatedAt: now });
			this.dailyCheckIns = this.dailyCheckIns.map((c) =>
				c.id === existing.id ? { ...c, mood, notes, updatedAt: now } : c
			);
		} else {
			// Create a plain object for IndexedDB
			const newCheckIn: DailyCheckIn = {
				id: generateUUID(),
				date: date,
				mood: mood,
				notes: notes,
				createdAt: now,
				updatedAt: now
			};
			await db.dailyCheckIns.add(newCheckIn);
			this.dailyCheckIns = [...this.dailyCheckIns, newCheckIn];
		}
	}

	/**
	 * Get entries for a date range
	 * 獲取日期範圍內嘅記錄
	 */
	getEntriesInRange(startDate: string, endDate: string): HealthEntry[] {
		return this.entries.filter((e) => e.date >= startDate && e.date <= endDate);
	}

	/**
	 * Get entries count by date
	 * 按日期獲取記錄數量
	 */
	getEntriesCountByDate(): Record<string, number> {
		const counts: Record<string, number> = {};
		for (const entry of this.entries) {
			counts[entry.date] = (counts[entry.date] || 0) + 1;
		}
		return counts;
	}

	/**
	 * Get max severity by date
	 * 按日期獲取最高嚴重程度
	 */
	getMaxSeverityByDate(): Record<string, Severity> {
		const severities: Record<string, Severity> = {};
		for (const entry of this.entries) {
			const current = severities[entry.date] || 0;
			if (entry.severity > current) {
				severities[entry.date] = entry.severity;
			}
		}
		return severities;
	}

	/**
	 * Add custom ailment type
	 * 新增自訂不適類型
	 */
	async addAilmentType(
		ailment: Omit<AilmentType, 'id' | 'isDefault' | 'createdAt' | 'updatedAt'>
	): Promise<AilmentType> {
		const now = new Date();
		const newAilment: AilmentType = {
			...ailment,
			id: generateUUID(),
			isDefault: false,
			createdAt: now,
			updatedAt: now
		};

		await db.ailmentTypes.add(newAilment);
		this.ailmentTypes = [...this.ailmentTypes, newAilment];
		return newAilment;
	}

	/**
	 * Add custom trigger type
	 * 新增自訂誘因類型
	 */
	async addTriggerType(
		trigger: Omit<TriggerType, 'id' | 'isDefault' | 'createdAt' | 'updatedAt'>
	): Promise<TriggerType> {
		const now = new Date();
		const newTrigger: TriggerType = {
			...trigger,
			id: generateUUID(),
			isDefault: false,
			createdAt: now,
			updatedAt: now
		};

		await db.triggerTypes.add(newTrigger);
		this.triggerTypes = [...this.triggerTypes, newTrigger];
		return newTrigger;
	}

	/**
	 * Toggle ailment type active status
	 * 切換不適類型啟用狀態
	 */
	async toggleAilmentActive(id: string): Promise<void> {
		const ailment = this.ailmentTypes.find((a) => a.id === id);
		if (!ailment) return;

		const updatedAt = new Date();
		const isActive = !ailment.isActive;
		await db.ailmentTypes.update(id, { isActive, updatedAt });
		this.ailmentTypes = this.ailmentTypes.map((a) =>
			a.id === id ? { ...a, isActive, updatedAt } : a
		);
	}

	/**
	 * Update a custom ailment type
	 * 更新自訂不適類型
	 */
	async updateAilmentType(
		id: string,
		updates: Partial<Pick<AilmentType, 'name' | 'nameZh' | 'icon'>>
	): Promise<void> {
		const ailment = this.ailmentTypes.find((a) => a.id === id);
		if (!ailment || ailment.isDefault) return;

		const updatedAt = new Date();
		await db.ailmentTypes.update(id, { ...updates, updatedAt });
		this.ailmentTypes = this.ailmentTypes.map((a) =>
			a.id === id ? { ...a, ...updates, updatedAt } : a
		);
	}

	/**
	 * Delete a custom ailment type
	 * 刪除自訂不適類型
	 */
	async deleteAilmentType(id: string): Promise<void> {
		const ailment = this.ailmentTypes.find((a) => a.id === id);
		if (!ailment || ailment.isDefault) return;

		await db.ailmentTypes.delete(id);
		this.ailmentTypes = this.ailmentTypes.filter((a) => a.id !== id);
	}

	/**
	 * Toggle trigger type active status
	 * 切換誘因類型啟用狀態
	 */
	async toggleTriggerActive(id: string): Promise<void> {
		const trigger = this.triggerTypes.find((t) => t.id === id);
		if (!trigger) return;

		const updatedAt = new Date();
		const isActive = !trigger.isActive;
		await db.triggerTypes.update(id, { isActive, updatedAt });
		this.triggerTypes = this.triggerTypes.map((t) =>
			t.id === id ? { ...t, isActive, updatedAt } : t
		);
	}

	/**
	 * Update a custom trigger type
	 * 更新自訂誘因類型
	 */
	async updateTriggerType(
		id: string,
		updates: Partial<Pick<TriggerType, 'name' | 'nameZh' | 'icon' | 'category'>>
	): Promise<void> {
		const trigger = this.triggerTypes.find((t) => t.id === id);
		if (!trigger || trigger.isDefault) return;

		const updatedAt = new Date();
		await db.triggerTypes.update(id, { ...updates, updatedAt });
		this.triggerTypes = this.triggerTypes.map((t) =>
			t.id === id ? { ...t, ...updates, updatedAt } : t
		);
	}

	/**
	 * Delete a custom trigger type
	 * 刪除自訂誘因類型
	 */
	async deleteTriggerType(id: string): Promise<void> {
		const trigger = this.triggerTypes.find((t) => t.id === id);
		if (!trigger || trigger.isDefault) return;

		await db.triggerTypes.delete(id);
		this.triggerTypes = this.triggerTypes.filter((t) => t.id !== id);
	}

	/**
	 * Add custom period symptom
	 * 新增自訂經期症狀
	 */
	async addCustomSymptom(
		symptom: Omit<CustomPeriodSymptom, 'id' | 'createdAt' | 'updatedAt'>
	): Promise<CustomPeriodSymptom> {
		const now = new Date();
		const newSymptom: CustomPeriodSymptom = {
			...symptom,
			id: generateUUID(),
			createdAt: now,
			updatedAt: now
		};

		await db.customSymptoms.add(newSymptom);
		this.customSymptoms = [...this.customSymptoms, newSymptom];
		return newSymptom;
	}

	/**
	 * Toggle custom symptom active status
	 * 切換自訂症狀啟用狀態
	 */
	async toggleCustomSymptomActive(id: string): Promise<void> {
		const symptom = this.customSymptoms.find((s) => s.id === id);
		if (!symptom) return;

		const updatedAt = new Date();
		const isActive = !symptom.isActive;
		await db.customSymptoms.update(id, { isActive, updatedAt });
		this.customSymptoms = this.customSymptoms.map((s) =>
			s.id === id ? { ...s, isActive, updatedAt } : s
		);
	}

	/**
	 * Update a custom symptom
	 * 更新自訂症狀
	 */
	async updateCustomSymptom(
		id: string,
		updates: Partial<Pick<CustomPeriodSymptom, 'name' | 'nameZh' | 'icon'>>
	): Promise<void> {
		const symptom = this.customSymptoms.find((s) => s.id === id);
		if (!symptom) return;

		const updatedAt = new Date();
		await db.customSymptoms.update(id, { ...updates, updatedAt });
		this.customSymptoms = this.customSymptoms.map((s) =>
			s.id === id ? { ...s, ...updates, updatedAt } : s
		);
	}

	/**
	 * Delete a custom symptom
	 * 刪除自訂症狀
	 */
	async deleteCustomSymptom(id: string): Promise<void> {
		await db.customSymptoms.delete(id);
		this.customSymptoms = this.customSymptoms.filter((s) => s.id !== id);
	}

	// ═══════════════════════════════════════════════════════════
	// Period Tracking Methods 經期追蹤方法
	// ═══════════════════════════════════════════════════════════

	/**
	 * Add or update period entry for a date
	 * 新增或更新某日嘅經期記錄
	 */
	async setPeriodEntry(
		date: string,
		flow: FlowLevel,
		symptoms: PeriodSymptom[],
		notes: string = ''
	): Promise<PeriodEntry> {
		if (!this.isInitialized) {
			await this.initialize();
		}

		const existing = this.periodEntries.find((p) => p.date === date);
		const now = new Date();

		if (existing) {
			// Update existing entry
			await db.periodEntries.update(existing.id, {
				flow,
				symptoms: [...symptoms],
				notes,
				updatedAt: now
			});
			const updated = { ...existing, flow, symptoms: [...symptoms], notes, updatedAt: now };
			this.periodEntries = this.periodEntries.map((p) =>
				p.id === existing.id ? updated : p
			);
			return updated;
		} else {
			// Create new entry (plain object for IndexedDB)
			const newEntry: PeriodEntry = {
				id: generateUUID(),
				date: date,
				flow: flow,
				symptoms: [...symptoms],
				notes: notes,
				createdAt: now,
				updatedAt: now
			};
			await db.periodEntries.add(newEntry);
			this.periodEntries = [...this.periodEntries, newEntry];
			return newEntry;
		}
	}

	/**
	 * Delete period entry for a date
	 * 刪除某日嘅經期記錄
	 */
	async deletePeriodEntry(date: string): Promise<void> {
		const entry = this.periodEntries.find((p) => p.date === date);
		if (!entry) return;

		await db.periodEntries.delete(entry.id);
		this.periodEntries = this.periodEntries.filter((p) => p.id !== entry.id);
	}

	/**
	 * Get period entries in a date range
	 * 獲取日期範圍內嘅經期記錄
	 */
	getPeriodEntriesInRange(startDate: string, endDate: string): PeriodEntry[] {
		return this.periodEntries.filter((p) => p.date >= startDate && p.date <= endDate);
	}

	/**
	 * Calculate cycle statistics
	 * 計算週期統計
	 */
	calculateCycleStats(): CycleStats {
		const sortedEntries = [...this.periodEntries].sort((a, b) => a.date.localeCompare(b.date));

		if (sortedEntries.length === 0) {
			return {
				averageCycleLength: 28,
				averagePeriodLength: 5,
				lastPeriodStart: null,
				predictedNextStart: null,
				totalCyclesTracked: 0
			};
		}

		// Find period start dates (first day of each period)
		const periodStarts: string[] = [];
		let currentPeriodStart: string | null = null;
		let lastDate: string | null = null;

		for (const entry of sortedEntries) {
			if (!lastDate || this.daysBetween(lastDate, entry.date) > 2) {
				// New period started (gap of more than 2 days)
				currentPeriodStart = entry.date;
				periodStarts.push(entry.date);
			}
			lastDate = entry.date;
		}

		// Calculate average cycle length
		const cycleLengths: number[] = [];
		for (let i = 1; i < periodStarts.length; i++) {
			const days = this.daysBetween(periodStarts[i - 1], periodStarts[i]);
			if (days >= 20 && days <= 45) {
				cycleLengths.push(days);
			}
		}

		const averageCycleLength = cycleLengths.length > 0
			? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
			: 28;

		// Calculate average period length
		const periodLengths: number[] = [];
		let periodLength = 1;
		lastDate = null;

		for (const entry of sortedEntries) {
			if (lastDate && this.daysBetween(lastDate, entry.date) <= 2) {
				periodLength++;
			} else if (lastDate) {
				periodLengths.push(periodLength);
				periodLength = 1;
			}
			lastDate = entry.date;
		}
		periodLengths.push(periodLength);

		const averagePeriodLength = periodLengths.length > 0
			? Math.round(periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length)
			: 5;

		// Last period start
		const lastPeriodStart = periodStarts.length > 0 ? periodStarts[periodStarts.length - 1] : null;

		// Predict next period
		const predictedNextStart = lastPeriodStart
			? addDays(lastPeriodStart, averageCycleLength)
			: null;

		return {
			averageCycleLength,
			averagePeriodLength,
			lastPeriodStart,
			predictedNextStart,
			totalCyclesTracked: periodStarts.length
		};
	}

	/**
	 * Helper: Calculate days between two dates
	 * 輔助函數：計算兩個日期之間嘅天數
	 */
	private daysBetween(date1: string, date2: string): number {
		const d1 = new Date(date1 + 'T00:00:00');
		const d2 = new Date(date2 + 'T00:00:00');
		return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
	}
}

export const healthStore = new HealthStore();

