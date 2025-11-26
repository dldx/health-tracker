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
		back: '返去',
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
		times: '次',
		allAilments: '所有不適',
		filterBy: '篩選',
		severityTrend: '嚴重程度趨勢',
		avgSeverity: '平均嚴重度',
		timeOfDay: '時段分佈',
		morning: '朝早',
		afternoon: '下晝',
		evening: '傍晚',
		night: '夜晚',
		weekPattern: '星期分佈',
		triggerCorrelation: '誘因分析',
		correlation: '關聯度',
		highCorrelation: '強關聯',
		mediumCorrelation: '中度關聯',
		lowCorrelation: '弱關聯',
		totalEntries: '總記錄',
		avgPerWeek: '每週平均',
		mostCommonTime: '常發時段',
		summary: '總覽',
		periodCorrelation: '經期關聯',
		duringPeriod: '經期期間',
		outsidePeriod: '經期以外',
		moreCommon: '更常見',
		lessCommon: '較少見',
		avgSeverityDuring: '經期期間平均嚴重度',
		avgSeverityOutside: '經期以外平均嚴重度',
		noPeriodData: '記錄經期資料嚟睇關聯',
		onlyDuringPeriod: '只喺經期期間發生',
		onlyOutsidePeriod: '只喺經期以外發生',
		noCorrelation: '搵唔到關聯'
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
		dataCleared: '所有資料清除咗喇',
		exportSuccess: '匯出咗喇',
		importSuccess: '匯入咗喇',
		importInvalid: '檔案格式唔啱',
		language: '語言',
		privacyNote: '所有資料只會儲存喺你部機',
		addNew: '新增',
		version: '版本',
		editItem: '編輯',
		deleteItem: '刪除',
		deleteConfirm: '你確定要刪除呢個？',
		deleteWarning: '呢個動作冇得撤銷。',
		customOnly: '只有自訂項目可以編輯或刪除',
		updated: '更新咗喇',
		deleted: '刪除咗喇',
		personalization: '個人化',
		customName: '你嘅名',
		customNamePlaceholder: '例如：小明',
		customNameHint: '自訂你嘅應用程式標題',
		customNameSaved: '儲存咗喇！',
		customNameCleared: '清除咗喇',
		appTitleWithName: '{name} 嘅健康追蹤'
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
		loadFailed: '載入唔到資料',
		saveFailed: '儲存唔到',
		deleteFailed: '刪除唔到',
		importFailed: '匯入唔到資料',
		exportFailed: '匯出唔到資料'
	},

	tiles: {
		title: '主頁佈局',
		subtitle: '自訂你嘅主頁',
		editMode: '編輯佈局',
		doneEditing: '搞掂',
		resetLayout: '重設為預設',
		resetSuccess: '重設咗做預設佈局',
		dragHint: '撳住拉嚟排序，開關顯示',
		names: {
			dayPicker: '日期選擇器',
			mood: '心情追蹤',
			period: '經期追蹤',
			ailments: '不適記錄',
			entries: '今日記錄'
		},
		statsNames: {
			summary: '摘要卡片',
			severityTrend: '嚴重程度趨勢',
			timeOfDay: '日間時段分佈',
			weeklyPattern: '每週模式',
			triggerCorrelation: '誘因關聯',
			ailmentFrequency: '不適頻率',
			topTriggers: '主要誘因',
			calendarHeatmap: '日曆熱圖',
			cycleStats: '週期統計',
			periodCorrelation: '經期關聯'
		}
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
	},

	onboarding: {
		welcome: {
			title: '歡迎',
			subtitle: 'Welcome',
			heading: '你嘅私人健康夥伴',
			description: '追蹤你嘅健康旅程，獲得專屬嘅洞察分析'
		},
		features: {
			title: '功能介紹',
			subtitle: 'Features',
			track: {
				title: '記錄不適',
				description: '記低症狀、嚴重程度同時間'
			},
			triggers: {
				title: '搵出誘因',
				description: '發現你健康嘅規律'
			},
			insights: {
				title: '健康洞察',
				description: '睇清趨勢同關聯'
			},
			period: {
				title: '經期追蹤',
				description: '監察你嘅週期同症狀'
			},
			customize: '撳標題嘅設定圖示可以重新排序同隱藏磁貼'
		},
		privacy: {
			title: '你嘅資料由你掌控',
			subtitle: 'Privacy',
			heading: '私隱優先',
			description: '所有健康資料只儲存喺你部機。唔使登入、唔上雲端、唔會追蹤你。',
			localOnly: '本地儲存',
			noAccount: '唔使註冊',
			exportAnytime: '隨時匯出'
		},
		personalize: {
			title: '自訂你嘅體驗',
			subtitle: 'Personalize',
			heading: '你叫咩名？',
			description: '個人化你嘅體驗（可跳過）',
			placeholder: '輸入你嘅名',
			skip: '遲啲先算'
		},
		getStarted: '開始啦！',
		next: '下一步',
		back: '返去',
		skip: '跳過'
	}
};

