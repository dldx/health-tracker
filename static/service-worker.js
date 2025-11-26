// Service Worker for Health Tracker PWA
const CACHE_NAME = 'health-tracker-v1';
const RUNTIME_CACHE = 'health-tracker-runtime-v1';

// Assets to cache immediately
const PRECACHE_URLS = [
	'/',
	'/stats',
	'/period',
	'/settings',
	'/manifest.json',
	'/favicon.svg'
];

// Install event - cache initial assets
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then((cache) => {
				console.log('[SW] Precaching app shell');
				return cache.addAll(PRECACHE_URLS.map(url => new Request(url, { cache: 'reload' })));
			})
			.catch((error) => {
				console.error('[SW] Precache failed:', error);
			})
	);
	self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
	const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (!currentCaches.includes(cacheName)) {
						console.log('[SW] Deleting old cache:', cacheName);
						return caches.delete(cacheName);
					}
				})
			);
		}).then(() => self.clients.claim())
	);
});

// Fetch event - Network first, falling back to cache
self.addEventListener('fetch', (event) => {
	// Skip cross-origin requests
	if (!event.request.url.startsWith(self.location.origin)) {
		return;
	}

	// Skip non-GET requests
	if (event.request.method !== 'GET') {
		return;
	}

	event.respondWith(
		caches.match(event.request).then((cachedResponse) => {
			// Try network first for HTML pages
			if (event.request.mode === 'navigate') {
				return fetch(event.request)
					.then((response) => {
						// Cache successful responses
						if (response && response.status === 200) {
							const responseToCache = response.clone();
							caches.open(RUNTIME_CACHE).then((cache) => {
								cache.put(event.request, responseToCache);
							});
						}
						return response;
					})
					.catch(() => {
						// Return cached version if network fails
						return cachedResponse || caches.match('/');
					});
			}

			// For other resources, use cache first
			if (cachedResponse) {
				return cachedResponse;
			}

			// If not in cache, fetch from network
			return fetch(event.request).then((response) => {
				// Don't cache non-successful responses
				if (!response || response.status !== 200 || response.type === 'error') {
					return response;
				}

				// Cache successful responses
				const responseToCache = response.clone();
				caches.open(RUNTIME_CACHE).then((cache) => {
					cache.put(event.request, responseToCache);
				});

				return response;
			}).catch((error) => {
				console.error('[SW] Fetch failed:', error);
				// Return offline page for navigation requests
				if (event.request.mode === 'navigate') {
					return caches.match('/');
				}
			});
		})
	);
});

// Handle messages from clients
self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}

	if (event.data && event.data.type === 'CLEAR_CACHE') {
		event.waitUntil(
			caches.keys().then((cacheNames) => {
				return Promise.all(
					cacheNames.map((cacheName) => caches.delete(cacheName))
				);
			})
		);
	}
});

