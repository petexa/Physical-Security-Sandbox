// API Fetch with Retry Logic and Exponential Backoff
// Retries failed requests with 1s, 2s, 4s delays

/**
 * Fetch with automatic retry and exponential backoff
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @param {number} maxRetries - Maximum retry attempts (default: 3)
 * @returns {Promise<Response>} - Fetch response
 */
export const fetchWithRetry = async (
  url,
  options = {},
  maxRetries = 3
) => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // Success - return immediately
      if (response.ok) {
        if (attempt > 0) {
          console.log(`[Retry SUCCESS] ${url} after ${attempt} retries`);
        }
        return response;
      }
      
      // Don't retry client errors (4xx) - fail fast
      if (response.status >= 400 && response.status < 500) {
        console.error(`[Retry SKIP] Client error ${response.status} for ${url}`);
        throw new Error(`Client error: ${response.status} ${response.statusText}`);
      }
      
      // Server error (5xx) - will retry
      lastError = new Error(`Server error: ${response.status} ${response.statusText}`);
      console.warn(`[Retry] Server error ${response.status} for ${url}, attempt ${attempt + 1}/${maxRetries}`);
      
    } catch (error) {
      // Network error or timeout
      lastError = error;
      
      // Don't retry on abort
      if (error.name === 'AbortError') {
        console.error(`[Retry SKIP] Request aborted: ${url}`);
        throw error;
      }
      
      console.warn(`[Retry] Network error for ${url}, attempt ${attempt + 1}/${maxRetries}:`, error.message);
    }
    
    // Calculate exponential backoff: 1s, 2s, 4s
    if (attempt < maxRetries - 1) {
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`[Retry ${attempt + 1}/${maxRetries}] Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // All retries exhausted
  console.error(`[Retry FAILED] ${url} after ${maxRetries} attempts`);
  throw lastError || new Error(`Request failed after ${maxRetries} retries`);
};

/**
 * Fetch with retry and timeout
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds (default: 10000)
 * @param {number} maxRetries - Maximum retry attempts (default: 3)
 * @returns {Promise<Response>} - Fetch response
 */
export const fetchWithRetryAndTimeout = async (
  url,
  options = {},
  timeout = 10000,
  maxRetries = 3
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetchWithRetry(
      url,
      { ...options, signal: controller.signal },
      maxRetries
    );
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

/**
 * Get retry statistics (for monitoring)
 */
export const getRetryStats = () => {
  return {
    maxRetries: 3,
    backoffStrategy: 'exponential',
    delays: [1000, 2000, 4000],
    retryOn: ['5xx', 'network errors'],
    skipOn: ['4xx', 'AbortError']
  };
};

// Export for debugging in browser console
if (typeof window !== 'undefined') {
  window.__apiFetch = {
    fetchWithRetry,
    fetchWithRetryAndTimeout,
    getRetryStats
  };
}
