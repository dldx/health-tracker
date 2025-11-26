/**
 * Internationalization Setup
 * 國際化設定
 */

import { en, type Translations } from './en';
import { zhHK } from './zh-HK';
import type { Language } from '$lib/types';

const translations: Record<Language, Translations> = {
	en,
	'zh-HK': zhHK
};

/**
 * i18n store using Svelte 5 runes
 * 使用 Svelte 5 runes 嘅 i18n 狀態
 */
class I18nStore {
	locale = $state<Language>('en');

	get t(): Translations {
		return translations[this.locale];
	}

	setLocale(locale: Language) {
		this.locale = locale;
	}

	/**
	 * Get bilingual text (English + Chinese)
	 * 獲取雙語文字
	 */
	bilingual(en: string, zh: string): string {
		return this.locale === 'en' ? en : zh;
	}

	/**
	 * Get localized name from an object with name/nameZh
	 * 從物件獲取本地化名稱
	 */
	localizedName(item: { name: string; nameZh: string }): string {
		return this.locale === 'en' ? item.name : item.nameZh;
	}
}

export const i18n = new I18nStore();

// Re-export types
export type { Translations };

