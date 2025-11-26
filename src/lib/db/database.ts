/**
 * Dexie Database Setup
 * IndexedDB 資料庫設定
 */

import Dexie, { type EntityTable } from 'dexie';
import type {
	AilmentType,
	TriggerType,
	HealthEntry,
	DailyCheckIn,
	PeriodEntry,
	CustomPeriodSymptom,
	AppSettings
} from '$lib/types';

/**
 * Health Tracker Database
 * 健康追蹤資料庫
 */
export class HealthTrackerDB extends Dexie {
	ailmentTypes!: EntityTable<AilmentType, 'id'>;
	triggerTypes!: EntityTable<TriggerType, 'id'>;
	healthEntries!: EntityTable<HealthEntry, 'id'>;
	dailyCheckIns!: EntityTable<DailyCheckIn, 'id'>;
	periodEntries!: EntityTable<PeriodEntry, 'id'>;
	customSymptoms!: EntityTable<CustomPeriodSymptom, 'id'>;
	settings!: EntityTable<AppSettings, 'id'>;

	constructor() {
		super('HealthTrackerDB');

		// Version 1: Original schema
		this.version(1).stores({
			ailmentTypes: 'id, name, isDefault, isActive, createdAt',
			triggerTypes: 'id, name, category, isDefault, isActive, createdAt',
			healthEntries: 'id, date, time, ailmentTypeId, severity, createdAt',
			dailyCheckIns: 'id, &date, mood, createdAt',
			settings: 'id'
		});

		// Version 2: Add period tracking
		this.version(2).stores({
			ailmentTypes: 'id, name, isDefault, isActive, createdAt',
			triggerTypes: 'id, name, category, isDefault, isActive, createdAt',
			healthEntries: 'id, date, time, ailmentTypeId, severity, createdAt',
			dailyCheckIns: 'id, &date, mood, createdAt',
			periodEntries: 'id, date, flow, createdAt',
			settings: 'id'
		});

		// Version 3: Add custom symptoms
		this.version(3).stores({
			ailmentTypes: 'id, name, isDefault, isActive, createdAt',
			triggerTypes: 'id, name, category, isDefault, isActive, createdAt',
			healthEntries: 'id, date, time, ailmentTypeId, severity, createdAt',
			dailyCheckIns: 'id, &date, mood, createdAt',
			periodEntries: 'id, date, flow, createdAt',
			customSymptoms: 'id, name, isActive, createdAt',
			settings: 'id'
		});
	}
}

export const db = new HealthTrackerDB();

/**
 * Check if database needs seeding
 * 檢查資料庫係咪需要初始化資料
 */
export async function needsSeeding(): Promise<boolean> {
	const count = await db.ailmentTypes.count();
	return count === 0;
}

/**
 * Seed default data
 * 初始化預設資料
 */
export async function seedDefaultData(): Promise<void> {
	const now = new Date();

	// Default ailment types 預設不適類型
	const defaultAilments: AilmentType[] = [
		{
			id: 'headache',
			name: 'Headache / Migraine',
			nameZh: '頭痛 / 偏頭痛',
			icon: 'noto:face-with-head-bandage',
			isDefault: true,
			isActive: true,
			createdAt: now,
			updatedAt: now
		},
		{
			id: 'stomach',
			name: 'Stomach Pain',
			nameZh: '肚痛',
			icon: 'noto:nauseated-face',
			isDefault: true,
			isActive: true,
			createdAt: now,
			updatedAt: now
		},
		{
			id: 'fatigue',
			name: 'Fatigue',
			nameZh: '疲倦',
			icon: 'noto:sleeping-face',
			isDefault: true,
			isActive: true,
			createdAt: now,
			updatedAt: now
		},
		{
			id: 'allergy',
			name: 'Allergies',
			nameZh: '敏感',
			icon: 'noto:sneezing-face',
			isDefault: true,
			isActive: true,
			createdAt: now,
			updatedAt: now
		}
	];

	// Default trigger types 預設誘因類型
	const defaultTriggers: TriggerType[] = [
		{
			id: 'caffeine',
			name: 'Caffeine',
			nameZh: '咖啡因',
			icon: 'noto:hot-beverage',
			category: 'substance',
			isDefault: true,
			isActive: true,
			createdAt: now,
			updatedAt: now
		},
		{
			id: 'food',
			name: 'Food',
			nameZh: '食物',
			icon: 'noto:hamburger',
			category: 'food',
			isDefault: true,
			isActive: true,
			createdAt: now,
			updatedAt: now
		},
		{
			id: 'sleep',
			name: 'Poor Sleep',
			nameZh: '瞓得唔好',
			icon: 'noto:sleeping-face',
			category: 'lifestyle',
			isDefault: true,
			isActive: true,
			createdAt: now,
			updatedAt: now
		},
		{
			id: 'stress',
			name: 'Stress',
			nameZh: '壓力',
			icon: 'noto:anxious-face-with-sweat',
			category: 'lifestyle',
			isDefault: true,
			isActive: true,
			createdAt: now,
			updatedAt: now
		},
		{
			id: 'weather',
			name: 'Weather',
			nameZh: '天氣',
			icon: 'noto:sun-behind-cloud',
			category: 'environment',
			isDefault: true,
			isActive: true,
			createdAt: now,
			updatedAt: now
		},
		{
			id: 'medication',
			name: 'Medication',
			nameZh: '藥物',
			icon: 'noto:pill',
			category: 'substance',
			isDefault: true,
			isActive: true,
			createdAt: now,
			updatedAt: now
		},
		{
			id: 'alcohol',
			name: 'Alcohol',
			nameZh: '酒精',
			icon: 'noto:wine-glass',
			category: 'substance',
			isDefault: true,
			isActive: true,
			createdAt: now,
			updatedAt: now
		},
		{
			id: 'dairy',
			name: 'Dairy',
			nameZh: '奶製品',
			icon: 'noto:glass-of-milk',
			category: 'food',
			isDefault: true,
			isActive: true,
			createdAt: now,
			updatedAt: now
		},
		{
			id: 'gluten',
			name: 'Gluten',
			nameZh: '麩質',
			icon: 'noto:bread',
			category: 'food',
			isDefault: true,
			isActive: true,
			createdAt: now,
			updatedAt: now
		},
		{
			id: 'spicy',
			name: 'Spicy Food',
			nameZh: '辣嘢',
			icon: 'noto:hot-pepper',
			category: 'food',
			isDefault: true,
			isActive: true,
			createdAt: now,
			updatedAt: now
		}
	];

	// Default settings 預設設定
	const defaultSettings: AppSettings = {
		id: 'settings',
		language: 'en',
		theme: 'light',
		createdAt: now,
		updatedAt: now
	};

	await db.transaction('rw', [db.ailmentTypes, db.triggerTypes, db.settings], async () => {
		await db.ailmentTypes.bulkPut(defaultAilments);
		await db.triggerTypes.bulkPut(defaultTriggers);
		await db.settings.put(defaultSettings);
	});
}

/**
 * Initialize database with default data if needed
 * 如有需要，初始化資料庫預設資料
 */
export async function initializeDatabase(): Promise<void> {
	if (await needsSeeding()) {
		await seedDefaultData();
	}
}

/**
 * Clear all user data (keeps default ailments and triggers)
 * 清除所有用戶資料（保留預設不適同誘因類型）
 */
export async function clearUserData(): Promise<void> {
	await db.transaction('rw', [db.healthEntries, db.dailyCheckIns, db.periodEntries, db.customSymptoms], async () => {
		await db.healthEntries.clear();
		await db.dailyCheckIns.clear();
		await db.periodEntries.clear();
		await db.customSymptoms.clear();
	});
}

/**
 * Clear all data and reseed defaults
 * 清除所有資料並重新初始化預設值
 */
export async function resetDatabase(): Promise<void> {
	await db.transaction(
		'rw',
		[db.ailmentTypes, db.triggerTypes, db.healthEntries, db.dailyCheckIns, db.periodEntries, db.customSymptoms, db.settings],
		async () => {
			await db.ailmentTypes.clear();
			await db.triggerTypes.clear();
			await db.healthEntries.clear();
			await db.dailyCheckIns.clear();
			await db.periodEntries.clear();
			await db.customSymptoms.clear();
			await db.settings.clear();
		}
	);
	await seedDefaultData();
}

