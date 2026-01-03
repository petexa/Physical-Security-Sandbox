// Data Initialization - Load mock data and generate events

import cardholdersData from '../mock-data/cardholders.json';
import accessGroupsData from '../mock-data/access-groups.json';
import doorsData from '../mock-data/doors.json';
import controllersData from '../mock-data/controllers.json';
import inputsData from '../mock-data/inputs.json';
import outputsData from '../mock-data/outputs.json';
import camerasData from '../mock-data/cameras.json';
import operatorGroupsData from '../mock-data/operator-groups.json';
import { generateEvents } from './eventGenerator.js';

// Initialize all data
export function initializeData() {
  console.log('Initializing PACS data...');
  
  // Check if events already generated (localStorage)
  let events = [];
  const storedEvents = localStorage.getItem('pacs-events');
  const generationFlag = localStorage.getItem('pacs-events-generated');
  
  if (storedEvents && generationFlag === 'true') {
    console.log('Loading events from localStorage...');
    try {
      events = JSON.parse(storedEvents);
      console.log(`Loaded ${events.length} events from cache`);
    } catch (error) {
      console.error('Error parsing stored events:', error);
      events = [];
    }
  }
  
  // Generate events if none exist or cache is invalid
  if (events.length === 0) {
    console.log('No cached events found. Generating new events...');
    events = generateEvents({
      startDate: new Date('2024-07-01'),
      endDate: new Date('2024-12-31'),
      cardholders: cardholdersData,
      doors: doorsData,
      controllers: controllersData,
      targetCount: 25000 // Generate 25,000 events
    });
    
    // Store in localStorage
    console.log('Storing events in localStorage...');
    try {
      localStorage.setItem('pacs-events', JSON.stringify(events));
      localStorage.setItem('pacs-events-generated', 'true');
      console.log('Events stored successfully');
    } catch (error) {
      console.error('Error storing events:', error);
      console.log('Storage quota may be exceeded. Events will not be cached.');
    }
  }
  
  return {
    cardholders: cardholdersData,
    accessGroups: accessGroupsData,
    doors: doorsData,
    controllers: controllersData,
    inputs: inputsData,
    outputs: outputsData,
    cameras: camerasData,
    operatorGroups: operatorGroupsData,
    events: events
  };
}

// Force regenerate events
export function regenerateEvents() {
  console.log('Forcing event regeneration...');
  localStorage.removeItem('pacs-events');
  localStorage.removeItem('pacs-events-generated');
  return initializeData();
}

// Clear all cached data
export function clearCache() {
  console.log('Clearing all cached data...');
  localStorage.removeItem('pacs-events');
  localStorage.removeItem('pacs-events-generated');
  localStorage.removeItem('api-request-history');
  console.log('Cache cleared');
}

// Get data statistics
export function getDataStatistics() {
  const data = initializeData();
  
  return {
    cardholders: {
      total: data.cardholders.length,
      active: data.cardholders.filter(c => c.status === 'active').length,
      inactive: data.cardholders.filter(c => c.status === 'inactive').length
    },
    accessGroups: {
      total: data.accessGroups.length
    },
    doors: {
      total: data.doors.length,
      online: data.doors.filter(d => d.status === 'online').length,
      offline: data.doors.filter(d => d.status === 'offline').length,
      fault: data.doors.filter(d => d.status === 'fault').length
    },
    controllers: {
      total: data.controllers.length,
      online: data.controllers.filter(c => c.status === 'online').length,
      offline: data.controllers.filter(c => c.status === 'offline').length
    },
    inputs: {
      total: data.inputs.length,
      normal: data.inputs.filter(i => i.state === 'normal').length,
      alarm: data.inputs.filter(i => i.state === 'alarm').length,
      fault: data.inputs.filter(i => i.state === 'fault').length
    },
    outputs: {
      total: data.outputs.length,
      active: data.outputs.filter(o => o.state === 'active').length,
      inactive: data.outputs.filter(o => o.state === 'inactive').length
    },
    cameras: {
      total: data.cameras.length,
      online: data.cameras.filter(c => c.status === 'online').length,
      offline: data.cameras.filter(c => c.status === 'offline').length,
      recording: data.cameras.filter(c => c.recording).length
    },
    events: {
      total: data.events.length,
      dateRange: data.events.length > 0 ? {
        start: data.events[0]?.timestamp,
        end: data.events[data.events.length - 1]?.timestamp
      } : null
    }
  };
}

// Export for debugging
export function exportAllData() {
  const data = initializeData();
  return {
    ...data,
    statistics: getDataStatistics()
  };
}
