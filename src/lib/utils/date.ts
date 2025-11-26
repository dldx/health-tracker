/**
 * Date utilities
 * 日期工具
 */

/**
 * Get today's date as ISO string (YYYY-MM-DD)
 * 獲取今日日期（ISO 格式）
 */
export function getTodayISO(): string {
	return new Date().toISOString().split('T')[0];
}

/**
 * Get current time as string (HH:mm)
 * 獲取當前時間
 */
export function getCurrentTime(): string {
	const now = new Date();
	return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

/**
 * Format date for display
 * 格式化日期顯示
 */
export function formatDate(dateStr: string, locale: 'en' | 'zh-HK' = 'en'): string {
	const date = new Date(dateStr + 'T00:00:00');

	if (locale === 'zh-HK') {
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			weekday: 'long'
		};
		return date.toLocaleDateString('zh-HK', options);
	}

	const options: Intl.DateTimeFormatOptions = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	};
	return date.toLocaleDateString('en-US', options);
}

/**
 * Format date short (e.g., "Nov 26")
 * 簡短日期格式
 */
export function formatDateShort(dateStr: string, locale: 'en' | 'zh-HK' = 'en'): string {
	const date = new Date(dateStr + 'T00:00:00');

	if (locale === 'zh-HK') {
		const month = date.getMonth() + 1;
		const day = date.getDate();
		return `${month}月${day}日`;
	}

	const options: Intl.DateTimeFormatOptions = {
		month: 'short',
		day: 'numeric'
	};
	return date.toLocaleDateString('en-US', options);
}

/**
 * Format time for display (12-hour or 24-hour)
 * 格式化時間顯示
 */
export function formatTime(timeStr: string, locale: 'en' | 'zh-HK' = 'en'): string {
	const [hours, minutes] = timeStr.split(':').map(Number);

	if (locale === 'zh-HK') {
		// Use 24-hour format for Chinese
		return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
	}

	// Use 12-hour format for English
	const period = hours >= 12 ? 'PM' : 'AM';
	const displayHours = hours % 12 || 12;
	return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
}

/**
 * Get weekday name
 * 獲取星期名稱
 */
export function getWeekdayName(dateStr: string, locale: 'en' | 'zh-HK' = 'en'): string {
	const date = new Date(dateStr + 'T00:00:00');
	return date.toLocaleDateString(locale === 'zh-HK' ? 'zh-HK' : 'en-US', { weekday: 'long' });
}

/**
 * Check if date is today
 * 檢查係咪今日
 */
export function isToday(dateStr: string): boolean {
	return dateStr === getTodayISO();
}

/**
 * Add days to a date string
 * 日期加減日數
 */
export function addDays(dateStr: string, days: number): string {
	const date = new Date(dateStr + 'T00:00:00');
	date.setDate(date.getDate() + days);
	return date.toISOString().split('T')[0];
}

/**
 * Get start and end of month
 * 獲取月份開始同結束日期
 */
export function getMonthRange(year: number, month: number): { start: string; end: string } {
	const start = new Date(year, month, 1);
	const end = new Date(year, month + 1, 0);
	return {
		start: start.toISOString().split('T')[0],
		end: end.toISOString().split('T')[0]
	};
}

/**
 * Get all dates in a month
 * 獲取一個月內所有日期
 */
export function getDatesInMonth(year: number, month: number): string[] {
	const dates: string[] = [];
	const lastDay = new Date(year, month + 1, 0).getDate();

	for (let day = 1; day <= lastDay; day++) {
		const date = new Date(year, month, day);
		dates.push(date.toISOString().split('T')[0]);
	}

	return dates;
}

/**
 * Get month and year from date string
 * 從日期字串獲取月份同年份
 */
export function getMonthYear(dateStr: string): { year: number; month: number } {
	const date = new Date(dateStr + 'T00:00:00');
	return {
		year: date.getFullYear(),
		month: date.getMonth()
	};
}

