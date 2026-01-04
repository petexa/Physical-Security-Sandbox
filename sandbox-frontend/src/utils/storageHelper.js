// Storage Helper - Manage localStorage quota and prevent overflow errors

const MAX_EVENTS = 8000; // Safe limit for localStorage
const STORAGE_WARNING_THRESHOLD = 0.8; // Warn at 80% capacity
const ESTIMATED_QUOTA = 5 * 1024 * 1024; // 5MB typical browser limit

/**
 * Get current localStorage usage statistics
 * @returns {Object} Storage usage information
 */
export function getStorageUsage() {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return {
    used: total,
    usedMB: (total / (1024 * 1024)).toFixed(2),
    capacity: ESTIMATED_QUOTA,
    capacityMB: 5,
    percentUsed: ((total / ESTIMATED_QUOTA) * 100).toFixed(1)
  };
}

/**
 * Check if we can safely store a given number of events
 * @param {number} eventCount - Number of events to store
 * @returns {boolean} True if we have enough space
 */
export function canStoreEvents(eventCount) {
  // Sample event for size estimation
  const sampleEvent = {
    id: "EVT-000000",
    timestamp: "2024-01-01T00:00:00Z",
    event_type: "access_granted",
    door_id: "DOOR-001",
    door_name: "Main Entrance",
    cardholder_id: "CH-001",
    cardholder_name: "John Doe",
    card_number: "1234567890",
    access_group: "AG-ALL-STAFF",
    result: "granted",
    details: "Access granted - valid credential and time zone"
  };
  
  const estimatedSize = JSON.stringify(sampleEvent).length * eventCount;
  const usage = getStorageUsage();
  
  return (usage.used + estimatedSize) < usage.capacity * STORAGE_WARNING_THRESHOLD;
}

/**
 * Validate if an event count is acceptable
 * @param {number} count - Number of events to validate
 * @returns {Object} Validation result with valid flag and message
 */
export function validateEventCount(count) {
  if (count > MAX_EVENTS) {
    return {
      valid: false,
      message: `Maximum ${MAX_EVENTS} events allowed to prevent storage quota errors`
    };
  }
  
  if (!canStoreEvents(count)) {
    return {
      valid: false,
      message: 'Insufficient storage space. Clear browser data or reduce event count.'
    };
  }
  
  return { valid: true };
}

/**
 * Clear events from storage
 */
export function clearEventsFromStorage() {
  localStorage.removeItem('pacs-events');
  console.log('[Storage] Events cleared from localStorage');
}

/**
 * Get storage warning level
 * @returns {string} 'safe', 'warning', or 'critical'
 */
export function getStorageWarningLevel() {
  const usage = getStorageUsage();
  const percent = parseFloat(usage.percentUsed);
  
  if (percent >= 90) return 'critical';
  if (percent >= 75) return 'warning';
  return 'safe';
}

/**
 * Get recommended max event count based on current storage
 * @returns {number} Recommended maximum events
 */
export function getRecommendedMaxEvents() {
  const usage = getStorageUsage();
  const availableSpace = usage.capacity * STORAGE_WARNING_THRESHOLD - usage.used;
  
  // Estimate bytes per event (from sample)
  const bytesPerEvent = 250; // Conservative estimate
  const maxFromSpace = Math.floor(availableSpace / bytesPerEvent);
  
  return Math.min(MAX_EVENTS, Math.max(1000, maxFromSpace));
}
