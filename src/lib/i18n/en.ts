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
		times: 'times',
		allAilments: 'All Ailments',
		filterBy: 'Filter by',
		severityTrend: 'Severity Over Time',
		avgSeverity: 'Avg Severity',
		timeOfDay: 'Time of Day Patterns',
		morning: 'Morning',
		afternoon: 'Afternoon',
		evening: 'Evening',
		night: 'Night',
		weekPattern: 'Weekly Pattern',
		triggerCorrelation: 'Trigger Analysis',
		correlation: 'correlation',
		highCorrelation: 'Strong link',
		mediumCorrelation: 'Moderate link',
		lowCorrelation: 'Weak link',
		totalEntries: 'Total Entries',
		avgPerWeek: 'Avg per Week',
		mostCommonTime: 'Peak Time',
		summary: 'Summary',
		periodCorrelation: 'Period Correlation',
		duringPeriod: 'During Period',
		outsidePeriod: 'Outside Period',
		moreCommon: 'more common',
		lessCommon: 'less common',
		avgSeverityDuring: 'Avg severity during period',
		avgSeverityOutside: 'Avg severity outside period',
		noPeriodData: 'Log period data to see correlations',
		onlyDuringPeriod: 'Only occurs during period',
		onlyOutsidePeriod: 'Only occurs outside period',
		noCorrelation: 'No correlation found'
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
		version: 'Version',
		editItem: 'Edit',
		deleteItem: 'Delete',
		deleteConfirm: 'Are you sure you want to delete this?',
		deleteWarning: 'This action cannot be undone.',
		customOnly: 'Only custom items can be edited or deleted',
		updated: 'Updated successfully',
		deleted: 'Deleted successfully',
		personalization: 'Personalization',
		customName: 'Your Name',
		customNamePlaceholder: 'e.g., Eliza',
		customNameHint: 'Personalize your app title',
		customNameSaved: 'Name saved!',
		customNameCleared: 'Name cleared',
		appTitleWithName: "{name}'s Health Tracker"
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

	tiles: {
		title: 'Dashboard Layout',
		subtitle: 'Customize your home screen',
		editMode: 'Edit Layout',
		doneEditing: 'Done',
		resetLayout: 'Reset to Default',
		resetSuccess: 'Layout reset to default',
		dragHint: 'Drag to reorder, toggle visibility',
		names: {
			dayPicker: 'Date Picker',
			mood: 'Mood Tracker',
			period: 'Period Tracker',
			ailments: 'Ailment Logger',
			entries: "Today's Entries"
		},
		statsNames: {
			summary: 'Summary Cards',
			severityTrend: 'Severity Trend',
			timeOfDay: 'Time of Day Pattern',
			weeklyPattern: 'Weekly Pattern',
			triggerCorrelation: 'Trigger Correlation',
			ailmentFrequency: 'Ailment Frequency',
			topTriggers: 'Top Triggers',
			calendarHeatmap: 'Calendar Heatmap',
			cycleStats: 'Cycle Statistics',
			periodCorrelation: 'Period Correlation'
		}
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

