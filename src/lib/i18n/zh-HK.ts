/**
 * Traditional Chinese (Cantonese) Translations
 * 繁體中文（廣東話）翻譯
 */

import type { Translations } from './en';

export const zhHK: Translations = {
	common: {
		save: '儲存',
		cancel: '取消',
		delete: '刪除',
		edit: '編輯',
		add: '新增',
		back: '返回',
		close: '關閉',
		done: '搞掂',
		loading: '載入緊...',
		error: '出錯喇',
		success: '成功',
		confirm: '確認',
		yes: '係',
		no: '唔係'
	},

	nav: {
		today: '今日',
		stats: '統計',
		settings: '設定'
	},

	dayView: {
		title: 'Health Tracker',
		subtitle: '健康追蹤',
		howAreYou: '你今日感覺點呀？',
		logAilment: '記錄不適',
		todayEntries: '今日記錄',
		noEntries: '今日仲未有記錄',
		noEntriesHint: '撳上面嚟記錄你嘅狀況',
		at: '於'
	},

	mood: {
		good: '幾好',
		okay: '一般',
		bad: '唔舒服',
		selectMood: '你今日感覺點呀？'
	},

	ailments: {
		headache: '頭痛 / 偏頭痛',
		stomach: '肚痛',
		fatigue: '疲倦',
		allergy: '敏感',
		other: '其他',
		addNew: '新增不適類型',
		addNewTitle: '新增不適',
		nameEn: '名稱 (English)',
		nameZh: '名稱 (中文)',
		iconHint: '選擇圖示',
		customEmoji: '或者自己輸入:',
		added: '新增咗喇！'
	},

	severity: {
		title: '嚴重程度',
		mild: '輕微',
		mildModerate: '輕微至中等',
		moderate: '中等',
		moderateSevere: '中等至嚴重',
		severe: '嚴重',
		level1: '輕微',
		level2: '輕微至中等',
		level3: '中等',
		level4: '中等至嚴重',
		level5: '嚴重'
	},

	triggers: {
		title: '可能嘅誘因',
		addCustom: '新增自訂誘因',
		addNewTitle: '新增誘因',
		selectTriggers: '揀返可能引起呢個不適嘅誘因',
		customEmoji: '或者自己輸入:',
		category: '類別',
		categories: {
			food: '食物',
			lifestyle: '生活習慣',
			environment: '環境',
			substance: '物質',
			other: '其他'
		}
	},

	log: {
		title: '記錄不適',
		selectAilment: '你有咩唔舒服？',
		time: '時間',
		notes: '備註',
		notesPlaceholder: '其他補充...',
		saveEntry: '儲存記錄',
		entrySaved: '儲存咗喇！',
		selectTime: '揀時間'
	},

	stats: {
		title: 'Insights',
		subtitle: '健康分析',
		thisMonth: '本月',
		thisWeek: '本週',
		ailmentFrequency: '不適頻率',
		topTriggers: '常見誘因',
		calendarHeatmap: '日曆概覽',
		noData: '呢段時間冇資料',
		entries: '次記錄',
		times: '次'
	},

	settings: {
		title: 'Settings',
		subtitle: '設定',
		ailmentTypes: '不適類型',
		manageAilments: '管理你想追蹤嘅不適類型',
		triggerTypes: '誘因類型',
		manageTriggers: '管理可能嘅誘因',
		data: '資料管理',
		exportData: '匯出資料',
		importData: '匯入資料',
		clearData: '清除所有資料',
		clearDataConfirm: '你肯定？呢個會刪除你所有嘅健康記錄。',
		dataCleared: '所有資料已清除',
		exportSuccess: '匯出成功',
		importSuccess: '匯入成功',
		importInvalid: '檔案格式唔啱',
		language: '語言',
		privacyNote: '所有資料只會儲存喺你部機',
		addNew: '新增',
		version: '版本'
	},

	calendar: {
		monday: '一',
		tuesday: '二',
		wednesday: '三',
		thursday: '四',
		friday: '五',
		saturday: '六',
		sunday: '日',
		months: [
			'一月',
			'二月',
			'三月',
			'四月',
			'五月',
			'六月',
			'七月',
			'八月',
			'九月',
			'十月',
			'十一月',
			'十二月'
		]
	},

	errors: {
		loadFailed: '載入資料失敗',
		saveFailed: '儲存失敗',
		deleteFailed: '刪除失敗',
		importFailed: '匯入資料失敗',
		exportFailed: '匯出資料失敗'
	},

	period: {
		title: '經期追蹤',
		subtitle: '記錄你嘅週期',
		logPeriod: '記錄經期',
		flowLevel: '流量',
		symptoms: '症狀',
		save: '儲存經期記錄',
		remove: '刪除記錄',
		notesPlaceholder: '關於週期嘅備註...',
		flow: {
			spotting: '少量',
			light: '輕量',
			medium: '中量',
			heavy: '大量'
		},
		symptomLabels: {
			cramps: '經痛',
			bloating: '腹脹',
			headache: '頭痛',
			backPain: '腰痛',
			fatigue: '疲倦',
			moodSwings: '情緒',
			acne: '暗瘡',
			cravings: '食慾',
			insomnia: '失眠',
			nausea: '作嘔'
		},
		addSymptom: '新增症狀',
		addSymptomTitle: '新增症狀',
		symptomAdded: '新增咗喇！',
		stats: {
			title: '週期統計',
			averageCycle: '平均週期',
			averagePeriod: '平均經期',
			lastPeriod: '上次經期',
			nextPredicted: '預計下次',
			days: '日',
			cyclesTracked: '個週期已記錄'
		}
	}
};

