/**
 * Class name utility
 * 類別名稱工具
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with clsx
 * 合併 Tailwind 類別
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

