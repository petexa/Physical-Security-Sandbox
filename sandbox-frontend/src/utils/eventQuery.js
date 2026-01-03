// Event Query Utility - Filter, count, and export events

// Filter events by various criteria
export function filterEvents(events, filters = {}) {
  const {
    startDate,
    endDate,
    eventTypes,
    doorIds,
    cardholderIds,
    categories,
    searchText
  } = filters;
  
  let filtered = [...events];
  
  // Filter by date range
  if (startDate) {
    const start = new Date(startDate);
    filtered = filtered.filter(e => new Date(e.timestamp) >= start);
  }
  
  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include the entire end date
    filtered = filtered.filter(e => new Date(e.timestamp) <= end);
  }
  
  // Filter by event types
  if (eventTypes && eventTypes.length > 0) {
    filtered = filtered.filter(e => eventTypes.includes(e.event_type));
  }
  
  // Filter by categories
  if (categories && categories.length > 0) {
    filtered = filtered.filter(e => categories.includes(e.category));
  }
  
  // Filter by door IDs
  if (doorIds && doorIds.length > 0) {
    filtered = filtered.filter(e => doorIds.includes(e.door_id));
  }
  
  // Filter by cardholder IDs
  if (cardholderIds && cardholderIds.length > 0) {
    filtered = filtered.filter(e => e.cardholder_id && cardholderIds.includes(e.cardholder_id));
  }
  
  // Filter by search text (searches door name, cardholder name, details)
  if (searchText && searchText.trim()) {
    const search = searchText.toLowerCase();
    filtered = filtered.filter(e => 
      (e.door_name && e.door_name.toLowerCase().includes(search)) ||
      (e.cardholder_name && e.cardholder_name.toLowerCase().includes(search)) ||
      (e.details && e.details.toLowerCase().includes(search)) ||
      (e.event_type && e.event_type.toLowerCase().includes(search))
    );
  }
  
  return filtered;
}

// Count events, optionally grouped by a field
export function countEvents(events, groupBy = null) {
  if (!groupBy) {
    return events.length;
  }
  
  const counts = {};
  events.forEach(event => {
    const key = event[groupBy] || 'unknown';
    counts[key] = (counts[key] || 0) + 1;
  });
  
  return counts;
}

// Get events for a specific door
export function getEventsByDoor(events, doorId) {
  return events.filter(e => e.door_id === doorId);
}

// Get events for a specific cardholder
export function getEventsByCardholder(events, cardholderId) {
  return events.filter(e => e.cardholder_id === cardholderId);
}

// Get events by type
export function getEventsByType(events, eventType) {
  return events.filter(e => e.event_type === eventType);
}

// Get events by category
export function getEventsByCategory(events, category) {
  return events.filter(e => e.category === category);
}

// Export to CSV
export function exportToCSV(events) {
  if (events.length === 0) {
    return 'No events to export';
  }
  
  // Headers
  const headers = [
    'ID',
    'Timestamp',
    'Event Type',
    'Category',
    'Door ID',
    'Door Name',
    'Location',
    'Cardholder ID',
    'Cardholder Name',
    'Card Number',
    'Access Group',
    'Result',
    'Details'
  ];
  
  // Create CSV rows
  const rows = [headers.join(',')];
  
  events.forEach(event => {
    const row = [
      event.id,
      event.timestamp,
      event.event_type,
      event.category,
      event.door_id,
      `"${event.door_name}"`,
      `"${event.location}"`,
      event.cardholder_id || '',
      event.cardholder_name ? `"${event.cardholder_name}"` : '',
      event.card_number || '',
      event.access_group || '',
      event.result || '',
      event.details ? `"${event.details.replace(/"/g, '""')}"` : ''
    ];
    rows.push(row.join(','));
  });
  
  return rows.join('\n');
}

// Export to JSON
export function exportToJSON(events) {
  return JSON.stringify(events, null, 2);
}

// Get comprehensive statistics
export function getEventStatistics(events) {
  const stats = {
    total: events.length,
    byType: {},
    byCategory: {},
    byDoor: {},
    byCardholder: {},
    byHour: {},
    byDayOfWeek: {}
  };
  
  // Count by type
  stats.byType = countEvents(events, 'event_type');
  
  // Count by category
  stats.byCategory = countEvents(events, 'category');
  
  // Count by door (top 10)
  const doorCounts = countEvents(events, 'door_id');
  stats.byDoor = Object.entries(doorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
  
  // Count by cardholder (top 10)
  const cardholderEvents = events.filter(e => e.cardholder_id);
  const cardholderCounts = countEvents(cardholderEvents, 'cardholder_id');
  stats.byCardholder = Object.entries(cardholderCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
  
  // Count by hour
  events.forEach(event => {
    const hour = new Date(event.timestamp).getHours();
    stats.byHour[hour] = (stats.byHour[hour] || 0) + 1;
  });
  
  // Count by day of week
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  events.forEach(event => {
    const day = dayNames[new Date(event.timestamp).getDay()];
    stats.byDayOfWeek[day] = (stats.byDayOfWeek[day] || 0) + 1;
  });
  
  return stats;
}

// Get events in a time range (last N hours/days)
export function getRecentEvents(events, value, unit = 'hours') {
  const now = new Date();
  const cutoff = new Date(now);
  
  if (unit === 'hours') {
    cutoff.setHours(now.getHours() - value);
  } else if (unit === 'days') {
    cutoff.setDate(now.getDate() - value);
  } else if (unit === 'weeks') {
    cutoff.setDate(now.getDate() - (value * 7));
  } else if (unit === 'months') {
    cutoff.setMonth(now.getMonth() - value);
  }
  
  return events.filter(e => new Date(e.timestamp) >= cutoff);
}

// Aggregate events by time period
export function aggregateByTimePeriod(events, period = 'day') {
  const aggregated = {};
  
  events.forEach(event => {
    const date = new Date(event.timestamp);
    let key;
    
    if (period === 'hour') {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`;
    } else if (period === 'day') {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    } else if (period === 'week') {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      key = `${weekStart.getFullYear()}-W${String(Math.ceil((weekStart.getDate()) / 7)).padStart(2, '0')}`;
    } else if (period === 'month') {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }
    
    if (!aggregated[key]) {
      aggregated[key] = [];
    }
    aggregated[key].push(event);
  });
  
  return aggregated;
}

// Get top doors by activity
export function getTopDoorsByActivity(events, limit = 5) {
  const doorCounts = countEvents(events, 'door_id');
  const sorted = Object.entries(doorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
  
  return sorted.map(([doorId, count]) => {
    const event = events.find(e => e.door_id === doorId);
    return {
      door_id: doorId,
      door_name: event?.door_name || doorId,
      count: count
    };
  });
}

// Get top cardholders by activity
export function getTopCardholdersByActivity(events, limit = 5) {
  const cardholderEvents = events.filter(e => e.cardholder_id);
  const cardholderCounts = countEvents(cardholderEvents, 'cardholder_id');
  const sorted = Object.entries(cardholderCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
  
  return sorted.map(([cardholderId, count]) => {
    const event = cardholderEvents.find(e => e.cardholder_id === cardholderId);
    return {
      cardholder_id: cardholderId,
      cardholder_name: event?.cardholder_name || cardholderId,
      count: count
    };
  });
}

// Get fault/alarm events
export function getFaultsAndAlarms(events) {
  return events.filter(e => 
    e.category === 'fault' || 
    e.category === 'alarm' ||
    e.event_type === 'access_denied'
  );
}

// Get event type options for filtering
export function getEventTypeOptions(events) {
  const types = new Set();
  events.forEach(e => types.add(e.event_type));
  return Array.from(types).sort();
}

// Get category options for filtering
export function getCategoryOptions(events) {
  const categories = new Set();
  events.forEach(e => categories.add(e.category));
  return Array.from(categories).sort();
}
