/**
 * UUID utilities with fallback for non-secure contexts
 * UUID 工具（支援非安全環境）
 */

/**
 * Generate a UUID v4
 * Uses crypto.randomUUID() if available, otherwise falls back to manual generation
 * 生成 UUID v4，如果 crypto.randomUUID 不可用則使用備用方案
 */
export function generateUUID(): string {
	// Try native crypto.randomUUID first (requires secure context)
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
		return crypto.randomUUID();
	}

	// Fallback: Generate UUID v4 manually using crypto.getRandomValues if available
	if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
		const bytes = new Uint8Array(16);
		crypto.getRandomValues(bytes);

		// Set version (4) and variant (RFC4122)
		bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
		bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant RFC4122

		const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
		return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
	}

	// Last resort fallback using Math.random (less secure but works everywhere)
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

