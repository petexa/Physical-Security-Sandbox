// Event Generator - Creates realistic PACS events over 6 months

import { validateEventCount } from './storageHelper.js';

// Event type distribution weights
const EVENT_TYPES = {
  ACCESS_GRANTED: { weight: 60, type: 'access_granted', category: 'access' },
  ACCESS_DENIED_TIMEZONE: { weight: 8, type: 'access_denied', category: 'access', reason: 'Invalid time zone' },
  ACCESS_DENIED_NO_GROUP: { weight: 4, type: 'access_denied', category: 'access', reason: 'No access group assigned' },
  ACCESS_DENIED_NOT_FOUND: { weight: 3, type: 'access_denied', category: 'access', reason: 'Card not found' },
  DOOR_FORCED: { weight: 5, type: 'door_forced', category: 'door' },
  DOOR_HELD: { weight: 3, type: 'door_held', category: 'door' },
  DOOR_NORMAL: { weight: 2, type: 'door_normal', category: 'door' },
  TAMPER_ALARM: { weight: 4, type: 'tamper_alarm', category: 'alarm' },
  FORCED_ENTRY_ALARM: { weight: 4, type: 'forced_entry_alarm', category: 'alarm' },
  SENSOR_FAULT: { weight: 3, type: 'sensor_fault', category: 'fault' },
  READER_OFFLINE: { weight: 2, type: 'reader_offline', category: 'fault' },
  CONTROLLER_OFFLINE: { weight: 1, type: 'controller_offline', category: 'system' },
  CONTROLLER_ONLINE: { weight: 1, type: 'controller_online', category: 'system' }
};

// Create weighted array for random selection
function createWeightedArray() {
  const arr = [];
  Object.entries(EVENT_TYPES).forEach(([, config]) => {
    for (let i = 0; i < config.weight; i++) {
      arr.push(config);
    }
  });
  return arr;
}

const WEIGHTED_EVENTS = createWeightedArray();

// Get random element from array
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Get random event type based on weights
function getRandomEventType() {
  return getRandomElement(WEIGHTED_EVENTS);
}

// Generate random timestamp with realistic distribution
function generateTimestamp(startDate, endDate) {
  const start = startDate.getTime();
  const end = endDate.getTime();
  const timestamp = new Date(start + Math.random() * (end - start));
  
  const hour = timestamp.getHours();
  const dayOfWeek = timestamp.getDay();
  
  // Apply probability weights based on time and day
  let probability = 1.0;
  
  // Weekend reduction (20% of weekday volume)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    probability *= 0.2;
  }
  
  // Business hours boost (7am-7pm = 70% of events)
  if (hour >= 7 && hour <= 19) {
    probability *= 2.5;
  } else {
    // Overnight reduction (10% of daytime)
    probability *= 0.4;
  }
  
  // Random rejection based on probability
  if (Math.random() > probability) {
    return generateTimestamp(startDate, endDate);
  }
  
  return timestamp;
}

// Generate a single event
function generateEvent(id, timestamp, cardholders, doors, controllers) {
  const eventConfig = getRandomEventType();
  const door = getRandomElement(doors);
  
  let event = {
    id: `EVT-${String(id).padStart(6, '0')}`,
    timestamp: timestamp.toISOString(),
    event_type: eventConfig.type,
    category: eventConfig.category,
    door_id: door.id,
    door_name: door.name,
    location: door.location
  };
  
  // Access events need cardholder info
  if (eventConfig.category === 'access') {
    const cardholder = getRandomElement(cardholders.filter(c => c.status === 'active'));
    event.cardholder_id = cardholder.id;
    event.cardholder_name = `${cardholder.first_name} ${cardholder.last_name}`;
    event.card_number = cardholder.card_number;
    event.access_group = cardholder.access_groups[0];
    
    if (eventConfig.type === 'access_granted') {
      event.result = 'granted';
      event.details = 'Access granted - valid credential and time zone';
    } else {
      event.result = 'denied';
      event.details = eventConfig.reason;
    }
  } else if (eventConfig.category === 'door') {
    event.details = `Door ${eventConfig.type.replace('door_', '')} event`;
  } else if (eventConfig.category === 'alarm') {
    event.severity = 'high';
    event.details = `${eventConfig.type.replace('_', ' ')} detected`;
  } else if (eventConfig.category === 'fault') {
    event.severity = 'medium';
    event.details = `${eventConfig.type.replace('_', ' ')} - maintenance required`;
  } else if (eventConfig.category === 'system') {
    const controller = controllers.find(c => door.controller_id === c.id);
    event.controller_id = controller?.id;
    event.controller_name = controller?.name;
    event.details = `Controller ${eventConfig.type.includes('offline') ? 'lost' : 'restored'} communication`;
  }
  
  return event;
}

// Generate regular patterns for specific cardholders (arrive 8am, leave 5pm)
function generateRegularPatterns(cardholders, doors, startDate, endDate) {
  const patterns = [];
  const regularEmployees = cardholders.filter(c => 
    c.status === 'active' && 
    ['Engineering', 'Finance', 'HR'].includes(c.department)
  ).slice(0, 20); // Pick 20 regular employees
  
  const mainDoor = doors.find(d => d.name === 'Main Entrance');
  
  // Generate weekday patterns
  const current = new Date(startDate);
  let eventId = 1000000;
  
  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    
    // Monday to Friday
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      regularEmployees.forEach(cardholder => {
        // 90% chance they come to work
        if (Math.random() < 0.9) {
          // Arrival (8am +/- 30 min)
          const arrivalTime = new Date(current);
          arrivalTime.setHours(8, Math.floor(Math.random() * 60) - 30, 0, 0);
          
          patterns.push({
            id: `EVT-${String(eventId++).padStart(6, '0')}`,
            timestamp: arrivalTime.toISOString(),
            event_type: 'access_granted',
            category: 'access',
            door_id: mainDoor.id,
            door_name: mainDoor.name,
            location: mainDoor.location,
            cardholder_id: cardholder.id,
            cardholder_name: `${cardholder.first_name} ${cardholder.last_name}`,
            card_number: cardholder.card_number,
            access_group: cardholder.access_groups[0],
            result: 'granted',
            details: 'Access granted - valid credential and time zone'
          });
          
          // Departure (5pm +/- 60 min)
          const departureTime = new Date(current);
          departureTime.setHours(17, Math.floor(Math.random() * 120) - 60, 0, 0);
          
          patterns.push({
            id: `EVT-${String(eventId++).padStart(6, '0')}`,
            timestamp: departureTime.toISOString(),
            event_type: 'access_granted',
            category: 'access',
            door_id: mainDoor.id,
            door_name: mainDoor.name,
            location: mainDoor.location,
            cardholder_id: cardholder.id,
            cardholder_name: `${cardholder.first_name} ${cardholder.last_name}`,
            card_number: cardholder.card_number,
            access_group: cardholder.access_groups[0],
            result: 'granted',
            details: 'Access granted - valid credential and time zone'
          });
        }
      });
    }
    
    // Move to next day
    current.setDate(current.getDate() + 1);
  }
  
  return patterns;
}

// Generate fault patterns for specific doors
function generateFaultPatterns(doors, startDate, endDate) {
  const faults = [];
  const faultyDoor = doors.find(d => d.name.includes('Server Room'));
  
  if (!faultyDoor) return faults;
  
  // Generate intermittent sensor faults (one per week)
  const current = new Date(startDate);
  let eventId = 2000000;
  
  while (current <= endDate) {
    const faultTime = new Date(current);
    faultTime.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0, 0);
    
    faults.push({
      id: `EVT-${String(eventId++).padStart(6, '0')}`,
      timestamp: faultTime.toISOString(),
      event_type: 'sensor_fault',
      category: 'fault',
      door_id: faultyDoor.id,
      door_name: faultyDoor.name,
      location: faultyDoor.location,
      severity: 'medium',
      details: 'sensor_fault - maintenance required'
    });
    
    // Move to next week
    current.setDate(current.getDate() + 7);
  }
  
  return faults;
}

// Main event generation function
export function generateEvents(options = {}) {
  const {
    startDate = new Date('2024-07-01'),
    endDate = new Date('2024-12-31'),
    cardholders = [],
    doors = [],
    controllers = [],
    targetCount = 5000  // Reduced default from 25000 to 5000
  } = options;
  
  // Validate event count before generating
  const validation = validateEventCount(targetCount);
  if (!validation.valid) {
    throw new Error(validation.message);
  }
  
  console.log(`Generating ${targetCount} events from ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}...`);
  
  const events = [];
  
  // Generate regular patterns (employee arrival/departure)
  const regularPatterns = generateRegularPatterns(cardholders, doors, startDate, endDate);
  events.push(...regularPatterns);
  console.log(`Generated ${regularPatterns.length} regular pattern events`);
  
  // Generate fault patterns
  const faultPatterns = generateFaultPatterns(doors, startDate, endDate);
  events.push(...faultPatterns);
  console.log(`Generated ${faultPatterns.length} fault pattern events`);
  
  // Generate random events to reach target count
  const remainingCount = targetCount - events.length;
  console.log(`Generating ${remainingCount} random events...`);
  
  for (let i = 0; i < remainingCount; i++) {
    const timestamp = generateTimestamp(startDate, endDate);
    const event = generateEvent(i, timestamp, cardholders, doors, controllers);
    events.push(event);
    
    if ((i + 1) % 5000 === 0) {
      console.log(`  ${i + 1}/${remainingCount} random events generated`);
    }
  }
  
  // Sort by timestamp
  events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  // Reassign sequential IDs
  events.forEach((event, index) => {
    event.id = `EVT-${String(index + 1).padStart(6, '0')}`;
  });
  
  console.log(`Total events generated: ${events.length}`);
  
  return events;
}

// Export event type distribution for reference
export function getEventTypeDistribution() {
  return EVENT_TYPES;
}

// Generate single event for testing
export function generateEventForDoor(door, cardholder, timestamp, eventType) {
  return {
    id: `EVT-CUSTOM`,
    timestamp: timestamp.toISOString(),
    event_type: eventType,
    door_id: door.id,
    door_name: door.name,
    location: door.location,
    cardholder_id: cardholder?.id,
    cardholder_name: cardholder ? `${cardholder.first_name} ${cardholder.last_name}` : undefined,
    card_number: cardholder?.card_number,
    access_group: cardholder?.access_groups?.[0],
    result: eventType === 'access_granted' ? 'granted' : 'denied',
    details: `Test event - ${eventType}`
  };
}
