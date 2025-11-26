/**
 * Health Tracker Type Definitions
 * 健康追蹤類型定義
 */

/**
 * Ailment types that can be tracked
 * 可追蹤嘅不適類型
 */
export interface AilmentType {
	id: string;
	name: string;
	nameZh: string;
	icon: string;
	isDefault: boolean;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Trigger categories
 * 誘因類別
 */
export type TriggerCategory = 'food' | 'lifestyle' | 'environment' | 'substance' | 'other';

/**
 * Trigger types that may cause ailments
 * 可能引發不適嘅誘因類型
 */
export interface TriggerType {
	id: string;
	name: string;
	nameZh: string;
	icon: string;
	category: TriggerCategory;
	isDefault: boolean;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Severity levels for ailments (1-5)
 * 不適嘅嚴重程度
 * 1 = Mild 輕微
 * 2 = Mild-Moderate 輕微至中等
 * 3 = Moderate 中等
 * 4 = Moderate-Severe 中等至嚴重
 * 5 = Severe 嚴重
 */
export type Severity = 1 | 2 | 3 | 4 | 5;

/**
 * A logged health entry
 * 健康記錄條目
 */
export interface HealthEntry {
	id: string;
	date: string; // ISO date string (YYYY-MM-DD)
	time: string; // ISO time string (HH:mm)
	ailmentTypeId: string;
	severity: Severity;
	triggerIds: string[];
	notes: string;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Daily mood levels
 * 每日心情程度
 */
export type MoodLevel = 'good' | 'okay' | 'bad';

/**
 * Period/menstrual flow levels
 * 經期流量程度
 */
export type FlowLevel = 'spotting' | 'light' | 'medium' | 'heavy';

/**
 * Built-in period symptom IDs
 * 內置經期症狀ID
 */
export type BuiltInPeriodSymptom =
	| 'cramps'      // 經痛
	| 'bloating'    // 腹脹
	| 'headache'    // 頭痛
	| 'backPain'    // 腰痛
	| 'fatigue'     // 疲倦
	| 'moodSwings'  // 情緒波動
	| 'acne'        // 暗瘡
	| 'cravings'    // 食慾改變
	| 'insomnia'    // 失眠
	| 'nausea';     // 作嘔

/**
 * Period symptom can be built-in or custom (string ID)
 * 經期症狀可以是內置或自訂（字符串ID）
 */
export type PeriodSymptom = BuiltInPeriodSymptom | string;

/**
 * Custom period symptom type
 * 自訂經期症狀類型
 */
export interface CustomPeriodSymptom {
	id: string;
	name: string;
	nameZh: string;
	icon: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Period/menstrual tracking entry
 * 經期追蹤記錄
 */
export interface PeriodEntry {
	id: string;
	date: string; // ISO date string (YYYY-MM-DD)
	flow: FlowLevel;
	symptoms: PeriodSymptom[];
	notes: string;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Cycle statistics
 * 週期統計
 */
export interface CycleStats {
	averageCycleLength: number;    // Average days between periods
	averagePeriodLength: number;   // Average days of period
	lastPeriodStart: string | null;
	predictedNextStart: string | null;
	totalCyclesTracked: number;
}

/**
 * Daily mood/wellness check-in
 * 每日心情/健康狀況記錄
 */
export interface DailyCheckIn {
	id: string;
	date: string; // ISO date string (YYYY-MM-DD) - unique per day
	mood: MoodLevel;
	notes: string;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Supported languages
 * 支援嘅語言
 */
export type Language = 'en' | 'zh-HK';

/**
 * Theme options
 * 主題選項
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * App settings
 * 應用程式設定
 */
export interface AppSettings {
	id: string; // Always 'settings' (singleton)
	language: Language;
	theme: Theme;
	customName?: string; // Easter egg: personalize the app title (e.g., "Eliza's Health Tracker")
	tileConfig?: TileConfig[]; // Home page tile order and visibility settings
	statsTileConfig?: StatsTileConfig[]; // Stats page tile order and visibility settings
	hasCompletedOnboarding?: boolean; // Whether user has completed the onboarding flow
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Navigation routes
 * 導覽路由
 */
export type NavRoute = '/' | '/stats' | '/settings';

/**
 * Tile identifiers for the main page
 * 主頁面磁貼識別碼
 */
export type TileId = 'dayPicker' | 'mood' | 'period' | 'ailments' | 'entries';

/**
 * Configuration for a single tile
 * 單個磁貼嘅配置
 */
export interface TileConfig {
	id: TileId;
	visible: boolean;
	order: number;
}

/**
 * Default tile configurations
 * 預設磁貼配置
 */
export const DEFAULT_TILE_ORDER: TileConfig[] = [
	{ id: 'dayPicker', visible: true, order: 0 },
	{ id: 'mood', visible: true, order: 1 },
	{ id: 'period', visible: true, order: 2 },
	{ id: 'ailments', visible: true, order: 3 },
	{ id: 'entries', visible: true, order: 4 }
];

/**
 * Tile identifiers for the stats page
 * 統計頁面磁貼識別碼
 */
export type StatsTileId =
	| 'summary'
	| 'severityTrend'
	| 'timeOfDay'
	| 'weeklyPattern'
	| 'triggerCorrelation'
	| 'ailmentFrequency'
	| 'topTriggers'
	| 'calendarHeatmap'
	| 'cycleStats'
	| 'periodCorrelation';

/**
 * Configuration for a stats tile
 * 統計磁貼嘅配置
 */
export interface StatsTileConfig {
	id: StatsTileId;
	visible: boolean;
	order: number;
}

/**
 * Default stats tile configurations
 * 預設統計磁貼配置
 */
export const DEFAULT_STATS_TILE_ORDER: StatsTileConfig[] = [
	{ id: 'summary', visible: true, order: 0 },
	{ id: 'severityTrend', visible: true, order: 1 },
	{ id: 'timeOfDay', visible: true, order: 2 },
	{ id: 'weeklyPattern', visible: true, order: 3 },
	{ id: 'triggerCorrelation', visible: true, order: 4 },
	{ id: 'ailmentFrequency', visible: true, order: 5 },
	{ id: 'topTriggers', visible: true, order: 6 },
	{ id: 'calendarHeatmap', visible: true, order: 7 },
	{ id: 'cycleStats', visible: true, order: 8 },
	{ id: 'periodCorrelation', visible: true, order: 9 }
];

/**
 * Health entry with resolved references
 * 包含解析參照嘅健康記錄
 */
export interface HealthEntryWithDetails extends HealthEntry {
	ailmentType: AilmentType;
	triggers: TriggerType[];
}

/**
 * Statistics for a time period
 * 時間段嘅統計資料
 */
export interface PeriodStats {
	totalEntries: number;
	ailmentCounts: Record<string, number>;
	triggerCounts: Record<string, number>;
	averageSeverity: number;
	moodCounts: Record<MoodLevel, number>;
}

/**
 * Export data format
 * 匯出資料格式
 */
export interface ExportData {
	version: string;
	exportedAt: string;
	ailmentTypes: AilmentType[];
	triggerTypes: TriggerType[];
	healthEntries: HealthEntry[];
	dailyCheckIns: DailyCheckIn[];
	periodEntries: PeriodEntry[];
	customSymptoms?: CustomPeriodSymptom[];
	settings: AppSettings | null;
}

