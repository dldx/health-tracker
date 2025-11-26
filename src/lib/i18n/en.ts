/**
 * English Translations
 */

export const en = {
	common: {
		save: 'Save',
		cancel: 'Cancel',
		delete: 'Delete',
		edit: 'Edit',
		add: 'Add',
		back: 'Back',
		close: 'Close',
		done: 'Done',
		loading: 'Loading...',
		error: 'Error',
		success: 'Success',
		confirm: 'Confirm',
		yes: 'Yes',
		no: 'No'
	},

	nav: {
		today: 'Today',
		stats: 'Stats',
		settings: 'Settings'
	},

	dayView: {
		title: 'Health Tracker',
		subtitle: '健康追蹤',
		howAreYou: 'How are you feeling?',
		logAilment: 'Log an Ailment',
		todayEntries: "Today's Entries",
		noEntries: 'No entries yet today',
		noEntriesHint: 'Tap above to log how you feel',
		at: 'at'
	},

	mood: {
		good: 'Good',
		okay: 'Okay',
		bad: 'Bad',
		selectMood: 'How are you feeling today?'
	},

	ailments: {
		headache: 'Headache / Migraine',
		stomach: 'Stomach Pain',
		fatigue: 'Fatigue',
		allergy: 'Allergies',
		other: 'Other',
		addNew: 'Add New Ailment',
		addNewTitle: 'Add Ailment',
		nameEn: 'Name (English)',
		nameZh: 'Name (中文)',
		iconHint: 'Choose an icon',
		customEmoji: 'Or type your own:',
		added: 'Ailment added!'
	},

	severity: {
		title: 'Severity',
		mild: 'Mild',
		mildModerate: 'Mild-Moderate',
		moderate: 'Moderate',
		moderateSevere: 'Moderate-Severe',
		severe: 'Severe',
		level1: 'Mild',
		level2: 'Mild-Moderate',
		level3: 'Moderate',
		level4: 'Moderate-Severe',
		level5: 'Severe'
	},

	triggers: {
		title: 'Potential Triggers',
		addCustom: 'Add Custom Trigger',
		addNewTitle: 'Add Trigger',
		selectTriggers: 'Select any triggers that might have caused this',
		customEmoji: 'Or type your own:',
		category: 'Category',
		categories: {
			food: 'Food',
			lifestyle: 'Lifestyle',
			environment: 'Environment',
			substance: 'Substances',
			other: 'Other'
		}
	},

	log: {
		title: 'Log Ailment',
		selectAilment: 'What are you experiencing?',
		time: 'Time',
		notes: 'Notes',
		notesPlaceholder: 'Any additional notes...',
		saveEntry: 'Save Entry',
		entrySaved: 'Entry saved!',
		selectTime: 'Select time'
	},

	stats: {
		title: 'Insights',
		subtitle: '健康分析',
		thisMonth: 'This Month',
		thisWeek: 'This Week',
		ailmentFrequency: 'Ailment Frequency',
		topTriggers: 'Top Triggers',
		calendarHeatmap: 'Calendar Overview',
		noData: 'No data for this period',
		entries: 'entries',
		times: 'times'
	},

	settings: {
		title: 'Settings',
		subtitle: '設定',
		ailmentTypes: 'Ailment Types',
		manageAilments: 'Manage what ailments you can track',
		triggerTypes: 'Trigger Types',
		manageTriggers: 'Manage potential triggers',
		data: 'Data',
		exportData: 'Export Data',
		importData: 'Import Data',
		clearData: 'Clear All Data',
		clearDataConfirm: 'Are you sure? This will delete all your health entries.',
		dataCleared: 'All data cleared',
		exportSuccess: 'Data exported successfully',
		importSuccess: 'Data imported successfully',
		importInvalid: 'Invalid file format',
		language: 'Language',
		privacyNote: 'All data is stored locally on your device only',
		addNew: 'Add New',
		version: 'Version'
	},

	calendar: {
		monday: 'Mon',
		tuesday: 'Tue',
		wednesday: 'Wed',
		thursday: 'Thu',
		friday: 'Fri',
		saturday: 'Sat',
		sunday: 'Sun',
		months: [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		]
	},

	errors: {
		loadFailed: 'Failed to load data',
		saveFailed: 'Failed to save',
		deleteFailed: 'Failed to delete',
		importFailed: 'Failed to import data',
		exportFailed: 'Failed to export data'
	},

	period: {
		title: 'Period Tracking',
		subtitle: 'Log your cycle',
		logPeriod: 'Log Period',
		flowLevel: 'Flow Level',
		symptoms: 'Symptoms',
		save: 'Save Period Entry',
		remove: 'Remove Entry',
		notesPlaceholder: 'Any notes about your cycle...',
		flow: {
			spotting: 'Spotting',
			light: 'Light',
			medium: 'Medium',
			heavy: 'Heavy'
		},
		symptomLabels: {
			cramps: 'Cramps',
			bloating: 'Bloating',
			headache: 'Headache',
			backPain: 'Back Pain',
			fatigue: 'Fatigue',
			moodSwings: 'Mood',
			acne: 'Acne',
			cravings: 'Cravings',
			insomnia: 'Insomnia',
			nausea: 'Nausea'
		},
		addSymptom: 'Add Symptom',
		addSymptomTitle: 'Add Symptom',
		symptomAdded: 'Symptom added!',
		stats: {
			title: 'Cycle Stats',
			averageCycle: 'Average Cycle',
			averagePeriod: 'Average Period',
			lastPeriod: 'Last Period',
			nextPredicted: 'Next Predicted',
			days: 'days',
			cyclesTracked: 'cycles tracked'
		}
	}
};

export type Translations = typeof en;

