const NodeCache = require('node-cache');

// Create cache instance with default TTL of 5 minutes
const cache = new NodeCache({
    stdTTL: 300, // 5 minutes default
    checkperiod: 60, // Check for expired keys every 60 seconds
    useClones: false, // Don't clone data for better performance
});

/**
 * Middleware to cache GET requests
 * @param {number} duration - Cache duration in seconds
 */
const cacheMiddleware = (duration) => {
    return (req, res, next) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        // Generate cache key from URL and query params
        const key = `__express__${req.originalUrl || req.url}`;

        // Try to get cached response
        const cachedResponse = cache.get(key);

        if (cachedResponse) {
            console.log(`Cache HIT: ${key}`);
            return res.json(cachedResponse);
        }

        console.log(`Cache MISS: ${key}`);

        // Store original res.json
        const originalJson = res.json.bind(res);

        // Override res.json to cache the response
        res.json = (body) => {
            // Only cache successful responses
            if (res.statusCode === 200) {
                cache.set(key, body, duration);
            }
            return originalJson(body);
        };

        next();
    };
};

/**
 * Clear cache by pattern
 * @param {string} pattern - Pattern to match cache keys
 */
const clearCacheByPattern = (pattern) => {
    const keys = cache.keys();
    const matchedKeys = keys.filter(key => key.includes(pattern));

    matchedKeys.forEach(key => {
        cache.del(key);
    });

    console.log(`Cleared ${matchedKeys.length} cache entries matching: ${pattern}`);
    return matchedKeys.length;
};

/**
 * Clear specific cache key
 * @param {string} key - Cache key to clear
 */
const clearCache = (key) => {
    return cache.del(key);
};

/**
 * Clear all cache
 */
const clearAllCache = () => {
    cache.flushAll();
    console.log('All cache cleared');
};

module.exports = {
    cacheMiddleware,
    clearCacheByPattern,
    clearCache,
    clearAllCache,
    cache,
};
