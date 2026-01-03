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

// Advanced Event Querying Functions

/**
 * Natural language query parsing for events
 * Parses queries like:
 * - "How many times has the Server Room door faulted in the last 6 months?"
 * - "Show all access denials for Building A last month"
 */
export function naturalLanguageQuery(query, events) {
  const queryLower = query.toLowerCase();
  let filtered = [...events];
  const summary = {
    query: query,
    matched: 0,
    summary: '',
    events: []
  };

  // Parse time ranges
  let timeFilter = null;
  const lastMonthsMatch = queryLower.match(/last (\d+) months?/);
  const lastWeeksMatch = queryLower.match(/last (\d+) weeks?/);
  const lastDaysMatch = queryLower.match(/last (\d+) days?/);
  
  if (queryLower.includes('last month')) {
    timeFilter = { value: 1, unit: 'months' };
  } else if (queryLower.includes('last week')) {
    timeFilter = { value: 1, unit: 'weeks' };
  } else if (lastMonthsMatch) {
    const months = parseInt(lastMonthsMatch[1]);
    timeFilter = { value: months, unit: 'months' };
  } else if (lastWeeksMatch) {
    const weeks = parseInt(lastWeeksMatch[1]);
    timeFilter = { value: weeks, unit: 'weeks' };
  } else if (lastDaysMatch) {
    const days = parseInt(lastDaysMatch[1]);
    timeFilter = { value: days, unit: 'days' };
  }

  if (timeFilter) {
    filtered = getRecentEvents(filtered, timeFilter.value, timeFilter.unit);
  }

  // Parse event types
  if (queryLower.includes('fault') || queryLower.includes('faulted')) {
    filtered = filtered.filter(e => e.category === 'fault');
  } else if (queryLower.includes('denial') || queryLower.includes('denied')) {
    filtered = filtered.filter(e => e.event_type === 'access_denied');
  } else if (queryLower.includes('alarm')) {
    filtered = filtered.filter(e => e.category === 'alarm');
  } else if (queryLower.includes('access granted') || queryLower.includes('successful access')) {
    filtered = filtered.filter(e => e.event_type === 'access_granted');
  }

  // Parse location/door
  const doorMatch = queryLower.match(/(?:door|room)\s+(?:named\s+)?["']?([^"']+)["']?/);
  if (doorMatch) {
    const doorName = doorMatch[1].trim();
    filtered = filtered.filter(e => 
      e.door_name && e.door_name.toLowerCase().includes(doorName)
    );
  }

  // Parse building
  const buildingMatch = queryLower.match(/building\s+([a-z])/i);
  if (buildingMatch) {
    const building = buildingMatch[1].toUpperCase();
    filtered = filtered.filter(e => 
      e.location && e.location.includes(`Building ${building}`)
    );
  }

  summary.matched = filtered.length;
  summary.events = filtered;

  // Generate summary text
  if (queryLower.includes('how many')) {
    summary.summary = `Found ${filtered.length} matching events.`;
  } else if (queryLower.includes('show') || queryLower.includes('list')) {
    summary.summary = `Displaying ${filtered.length} matching events.`;
  } else {
    summary.summary = `Query returned ${filtered.length} events.`;
  }

  return summary;
}

/**
 * Get event timeline grouped by time period
 * Returns timeline data for visualization
 */
export function getEventTimeline(events, options = {}) {
  const {
    period = 'hour', // hour, day, week, month
    eventTypes = null, // filter by specific event types
    startDate = null,
    endDate = null
  } = options;

  let filtered = [...events];

  // Apply date filters
  if (startDate) {
    const start = new Date(startDate);
    filtered = filtered.filter(e => new Date(e.timestamp) >= start);
  }
  if (endDate) {
    const end = new Date(endDate);
    filtered = filtered.filter(e => new Date(e.timestamp) <= end);
  }

  // Apply event type filter
  if (eventTypes && eventTypes.length > 0) {
    filtered = filtered.filter(e => eventTypes.includes(e.event_type));
  }

  // Group by time period
  const timeline = aggregateByTimePeriod(filtered, period);

  // Convert to array format for visualization
  const timelineArray = Object.entries(timeline).map(([time, events]) => ({
    time,
    count: events.length,
    events: events,
    byType: countEvents(events, 'event_type'),
    byCategory: countEvents(events, 'category')
  })).sort((a, b) => a.time.localeCompare(b.time));

  return timelineArray;
}

/**
 * Detect patterns in events
 * Identifies repeated issues, anomalies, and trends
 */
export function getEventPatterns(events) {
  const patterns = {
    repeatedFaults: [],
    repeatedDenials: [],
    unusualActivity: [],
    peakTimes: [],
    problemDoors: [],
    problemCardholders: []
  };

  // Find repeated faults (same door, multiple faults)
  const faultEvents = events.filter(e => e.category === 'fault');
  const faultsByDoor = {};
  faultEvents.forEach(event => {
    const doorId = event.door_id;
    if (!faultsByDoor[doorId]) {
      faultsByDoor[doorId] = [];
    }
    faultsByDoor[doorId].push(event);
  });

  Object.entries(faultsByDoor).forEach(([doorId, doorFaults]) => {
    if (doorFaults.length >= 3) {
      patterns.repeatedFaults.push({
        door_id: doorId,
        door_name: doorFaults[0].door_name,
        count: doorFaults.length,
        events: doorFaults
      });
    }
  });

  // Find repeated denials (same cardholder, multiple denials)
  const denialEvents = events.filter(e => e.event_type === 'access_denied' && e.cardholder_id);
  const denialsByCardholder = {};
  denialEvents.forEach(event => {
    const cardholderId = event.cardholder_id;
    if (!denialsByCardholder[cardholderId]) {
      denialsByCardholder[cardholderId] = [];
    }
    denialsByCardholder[cardholderId].push(event);
  });

  Object.entries(denialsByCardholder).forEach(([cardholderId, denials]) => {
    if (denials.length >= 3) {
      patterns.repeatedDenials.push({
        cardholder_id: cardholderId,
        cardholder_name: denials[0].cardholder_name,
        count: denials.length,
        events: denials
      });
    }
  });

  // Identify unusual activity times (events outside 7 AM - 7 PM)
  events.forEach(event => {
    const hour = new Date(event.timestamp).getHours();
    if (hour < 7 || hour >= 19) {
      patterns.unusualActivity.push(event);
    }
  });

  // Find peak activity times
  const hourCounts = {};
  events.forEach(event => {
    const hour = new Date(event.timestamp).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  const sortedHours = Object.entries(hourCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  patterns.peakTimes = sortedHours.map(([hour, count]) => ({
    hour: parseInt(hour),
    count: count,
    timeRange: `${hour}:00 - ${hour}:59`
  }));

  // Identify problem doors (high fault/alarm rate)
  const doorEvents = {};
  events.forEach(event => {
    if (!doorEvents[event.door_id]) {
      doorEvents[event.door_id] = {
        door_id: event.door_id,
        door_name: event.door_name,
        total: 0,
        faults: 0,
        alarms: 0
      };
    }
    doorEvents[event.door_id].total++;
    if (event.category === 'fault') doorEvents[event.door_id].faults++;
    if (event.category === 'alarm') doorEvents[event.door_id].alarms++;
  });

  patterns.problemDoors = Object.values(doorEvents)
    .filter(door => door.faults + door.alarms >= 5)
    .sort((a, b) => (b.faults + b.alarms) - (a.faults + a.alarms))
    .slice(0, 5);

  // Identify problem cardholders (high denial rate)
  const cardholderStats = {};
  events.filter(e => e.cardholder_id).forEach(event => {
    if (!cardholderStats[event.cardholder_id]) {
      cardholderStats[event.cardholder_id] = {
        cardholder_id: event.cardholder_id,
        cardholder_name: event.cardholder_name,
        total: 0,
        denials: 0
      };
    }
    cardholderStats[event.cardholder_id].total++;
    if (event.event_type === 'access_denied') {
      cardholderStats[event.cardholder_id].denials++;
    }
  });

  patterns.problemCardholders = Object.values(cardholderStats)
    .filter(ch => ch.denials >= 3)
    .sort((a, b) => b.denials - a.denials)
    .slice(0, 5);

  return patterns;
}

/**
 * Correlate PACS and VMS events by timestamp and location
 * Returns combined timeline
 */
export function correlateEvents(pacsEvents, vmsEvents, options = {}) {
  const {
    timeWindowSeconds = 30, // events within this window are considered related
    matchByLocation = true
  } = options;

  const correlatedEvents = [];

  pacsEvents.forEach(pacsEvent => {
    const pacsTime = new Date(pacsEvent.timestamp);
    
    // Find matching VMS events and calculate time differences
    const matchingVMS = [];
    const timeDifferences = [];
    
    vmsEvents.forEach(vmsEvent => {
      const vmsTime = new Date(vmsEvent.timestamp);
      const timeDiff = Math.abs(vmsTime - pacsTime) / 1000; // difference in seconds
      
      // Time correlation
      if (timeDiff > timeWindowSeconds) return;
      
      // Location correlation (optional)
      if (matchByLocation) {
        const locationMatch = vmsEvent.location === pacsEvent.location ||
               vmsEvent.camera_name?.includes(pacsEvent.door_name) ||
               pacsEvent.door_name?.includes(vmsEvent.camera_name);
        if (!locationMatch) return;
      }
      
      matchingVMS.push(vmsEvent);
      timeDifferences.push(timeDiff);
    });

    if (matchingVMS.length > 0) {
      correlatedEvents.push({
        pacsEvent: pacsEvent,
        vmsEvents: matchingVMS,
        correlationType: matchByLocation ? 'time_and_location' : 'time_only',
        timeDifference: timeDifferences
      });
    }
  });

  // Sort by timestamp
  correlatedEvents.sort((a, b) => 
    new Date(a.pacsEvent.timestamp) - new Date(b.pacsEvent.timestamp)
  );

  return correlatedEvents;
}

