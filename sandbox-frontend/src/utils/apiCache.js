// API Response Caching Utility
// Caches GET requests for 5 seconds to reduce backend load

const cache = new Map();
const CACHE_TTL = 5000; // 5 seconds for live data

/**
 * Cached fetch wrapper - only caches GET requests
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @returns {Promise<Response>} - Fetch response
 */
export const cachedFetch = async (url, options = {}) => {
  // Only cache GET requests
  const method = options?.method || 'GET';
  if (method !== 'GET') {
    console.log(`[Cache BYPASS] ${method} ${url}`);
    return fetch(url, options);
  }
  
  const cacheKey = url;
  const cached = cache.get(cacheKey);
  
  // Return cached if fresh
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[Cache HIT] ${url} (age: ${Date.now() - cached.timestamp}ms)`);
    return Promise.resolve(cached.response.clone());
  }
  
  // Fetch fresh
  console.log(`[Cache MISS] ${url}`);
  try {
    const response = await fetch(url, options);
    
    // Cache successful response
    if (response.ok) {
      // Clone response before caching (response can only be read once)
      const clonedResponse = response.clone();
      
      cache.set(cacheKey, {
        response: clonedResponse,
        timestamp: Date.now()
      });
      
      // Limit cache to 100 entries (FIFO eviction)
      if (cache.size > 100) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
        console.log(`[Cache EVICT] Removed oldest entry: ${firstKey}`);
      }
    }
    
    return response;
  } catch (error) {
    console.error(`[Cache ERROR] ${url}:`, error.message);
    throw error;
  }
};

/**
 * Clear cache on write operations (POST/PUT/PATCH/DELETE)
 */
export const invalidateCache = () => {
  const size = cache.size;
  cache.clear();
  console.log(`[Cache CLEAR] Invalidated ${size} entries`);
};

/**
 * Manual cache clear (for settings or debugging)
 */
export const clearCache = () => {
  invalidateCache();
};

/**
 * Get cache statistics
 */
export const getCacheStats = () => {
  return {
    size: cache.size,
    entries: Array.from(cache.keys()),
    ttl: CACHE_TTL
  };
};

// Export for debugging in browser console
if (typeof window !== 'undefined') {
  window.__apiCache = {
    getCacheStats,
    clearCache,
    cache
  };
}
