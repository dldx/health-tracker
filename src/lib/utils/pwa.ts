/**
 * PWA Utilities
 * Progressive Web App 工具函數
 */

/**
 * Register service worker
 * 註冊 Service Worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
	if (!('serviceWorker' in navigator)) {
		console.log('Service Worker not supported');
		return null;
	}

	try {
		const registration = await navigator.serviceWorker.register('/service-worker.js', {
			scope: '/'
		});

		console.log('Service Worker registered:', registration.scope);

		// Check for updates periodically
		registration.addEventListener('updatefound', () => {
			const newWorker = registration.installing;
			if (newWorker) {
				newWorker.addEventListener('statechange', () => {
					if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
						console.log('New service worker available');
						// Optionally notify user about update
					}
				});
			}
		});

		// Check for updates every hour
		setInterval(() => {
			registration.update();
		}, 60 * 60 * 1000);

		return registration;
	} catch (error) {
		console.error('Service Worker registration failed:', error);
		return null;
	}
}

/**
 * Unregister service worker (for debugging)
 * 取消註冊 Service Worker（用於調試）
 */
export async function unregisterServiceWorker(): Promise<boolean> {
	if (!('serviceWorker' in navigator)) {
		return false;
	}

	try {
		const registration = await navigator.serviceWorker.getRegistration();
		if (registration) {
			const result = await registration.unregister();
			console.log('Service Worker unregistered:', result);
			return result;
		}
		return false;
	} catch (error) {
		console.error('Service Worker unregistration failed:', error);
		return false;
	}
}

/**
 * Clear all caches
 * 清除所有緩存
 */
export async function clearCaches(): Promise<void> {
	if (!('caches' in window)) {
		return;
	}

	try {
		const cacheNames = await caches.keys();
		await Promise.all(cacheNames.map(name => caches.delete(name)));
		console.log('All caches cleared');
	} catch (error) {
		console.error('Failed to clear caches:', error);
	}
}

/**
 * Check if app is installed (running in standalone mode)
 * 檢查應用是否已安裝（在獨立模式下運行）
 */
export function isAppInstalled(): boolean {
	// Check if running in standalone mode
	const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
	const isIOSStandalone = (window.navigator as any).standalone === true;

	return isStandalone || isIOSStandalone;
}

/**
 * Check if app can be installed
 * 檢查應用是否可以安裝
 */
export function canInstallApp(): boolean {
	// Check if beforeinstallprompt event has been fired
	return 'BeforeInstallPromptEvent' in window || isAppInstalled();
}

/**
 * Request persistent storage
 * 請求持久化存儲
 */
export async function requestPersistentStorage(): Promise<boolean> {
	if (!navigator.storage || !navigator.storage.persist) {
		return false;
	}

	try {
		const isPersisted = await navigator.storage.persisted();
		if (isPersisted) {
			console.log('Storage is already persistent');
			return true;
		}

		const result = await navigator.storage.persist();
		console.log('Persistent storage request result:', result);
		return result;
	} catch (error) {
		console.error('Failed to request persistent storage:', error);
		return false;
	}
}

