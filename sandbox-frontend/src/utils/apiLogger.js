// API Logger - Intercepts and logs all API calls for audit purposes

const MAX_ENTRIES = 100;
const STORAGE_KEY = 'api-audit-log';

/**
 * Log entry structure
 */
class APILogEntry {
  constructor(request, response, responseTime) {
    this.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.timestamp = new Date().toISOString();
    this.method = request.method;
    this.endpoint = request.url;
    this.statusCode = response?.status || 0;
    this.responseTime = responseTime;
    this.requestHeaders = request.headers || {};
    this.requestBody = request.body || null;
    this.responsePreview = response?.preview || '';
    this.responseBody = response?.body || null;
  }
}

/**
 * Initialize the logger - should be called once at app startup
 */
export function initAPILogger() {
  // Ensure storage exists
  if (!sessionStorage.getItem(STORAGE_KEY)) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
  
  console.log('[APILogger] Initialized - logging to sessionStorage');
}

/**
 * Log an API call
 */
export function logAPICall(request, response, responseTime) {
  try {
    const entries = getLogEntries();
    const entry = new APILogEntry(request, response, responseTime);
    
    // Add to beginning of array (newest first)
    entries.unshift(entry);
    
    // Keep only MAX_ENTRIES
    if (entries.length > MAX_ENTRIES) {
      entries.splice(MAX_ENTRIES);
    }
    
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    console.log(`[APILogger] Logged ${request.method} ${request.url} - ${response?.status} (${responseTime}ms)`);
  } catch (error) {
    console.error('[APILogger] Failed to log API call:', error);
  }
}

/**
 * Get all log entries
 */
export function getLogEntries() {
  try {
    const data = sessionStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('[APILogger] Failed to retrieve log entries:', error);
    return [];
  }
}

/**
 * Clear all log entries
 */
export function clearLogEntries() {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  console.log('[APILogger] Cleared all log entries');
}

/**
 * Export log entries as JSON file
 */
export function exportLogEntries() {
  const entries = getLogEntries();
  const dataStr = JSON.stringify(entries, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `api-audit-log-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  console.log('[APILogger] Exported log entries');
}

/**
 * Wrapper for fetch that logs all API calls
 */
export async function loggedFetch(url, options = {}) {
  const startTime = performance.now();
  const method = options.method || 'GET';
  
  const request = {
    method,
    url,
    headers: options.headers || {},
    body: options.body ? (typeof options.body === 'string' ? options.body : JSON.stringify(options.body)) : null
  };
  
  try {
    const response = await fetch(url, options);
    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);
    
    // Clone response so we can read it
    const clonedResponse = response.clone();
    let responseBody = null;
    let responsePreview = '';
    
    try {
      const text = await clonedResponse.text();
      responseBody = text;
      responsePreview = text.substring(0, 200);
      if (text.length > 200) {
        responsePreview += '...';
      }
    } catch (e) {
      responsePreview = '[Unable to read response]';
    }
    
    const responseData = {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseBody,
      preview: responsePreview
    };
    
    logAPICall(request, responseData, responseTime);
    
    return response;
  } catch (error) {
    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);
    
    const responseData = {
      status: 0,
      statusText: 'Network Error',
      headers: {},
      body: null,
      preview: error.message
    };
    
    logAPICall(request, responseData, responseTime);
    
    throw error;
  }
}

/**
 * Filter log entries based on criteria
 */
export function filterLogEntries(entries, filters) {
  let filtered = [...entries];
  
  // Filter by method
  if (filters.method && filters.method !== 'all') {
    filtered = filtered.filter(e => e.method === filters.method);
  }
  
  // Filter by status code range
  if (filters.statusMin !== '' && filters.statusMin !== undefined) {
    const minStatus = parseInt(filters.statusMin, 10);
    filtered = filtered.filter(e => e.statusCode >= minStatus);
  }
  if (filters.statusMax !== '' && filters.statusMax !== undefined) {
    const maxStatus = parseInt(filters.statusMax, 10);
    filtered = filtered.filter(e => e.statusCode <= maxStatus);
  }
  
  // Filter by endpoint search
  if (filters.search && filters.search.trim()) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(e => 
      e.endpoint.toLowerCase().includes(searchLower)
    );
  }
  
  return filtered;
}
