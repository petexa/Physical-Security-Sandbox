// Data Manager - Utilities for data regeneration, import/export, and statistics

import { generateEvents } from './eventGenerator';
import cardholdersData from '../mock-data/cardholders.json';
import accessGroupsData from '../mock-data/access-groups.json';
import doorsData from '../mock-data/doors.json';
import controllersData from '../mock-data/controllers.json';
import inputsData from '../mock-data/inputs.json';
import outputsData from '../mock-data/outputs.json';
import camerasData from '../mock-data/cameras.json';
import operatorGroupsData from '../mock-data/operator-groups.json';

export function regenerateEvents(options) {
  const {
    startDate,
    endDate,
    volume = 'medium',
    distribution
  } = options;
  
  // Calculate event count based on volume
  const volumeMap = {
    light: 5000,
    medium: 25000,
    heavy: 50000,
    extreme: 100000
  };
  
  const totalEvents = volumeMap[volume];
  
  // Generate events with custom distribution
  const events = generateEvents({
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    targetCount: totalEvents,
    distribution,
    cardholders: cardholdersData,
    doors: doorsData,
    controllers: controllersData
  });
  
  // Save to localStorage
  localStorage.setItem('pacs-events', JSON.stringify(events));
  localStorage.setItem('events-generated-at', new Date().toISOString());
  localStorage.setItem('events-config', JSON.stringify(options));
  localStorage.setItem('pacs-events-generated', 'true');
  
  return events;
}

export function getDataStats() {
  const events = JSON.parse(localStorage.getItem('pacs-events') || '[]');
  const generatedAt = localStorage.getItem('events-generated-at');
  const config = JSON.parse(localStorage.getItem('events-config') || '{}');
  
  // Calculate storage size
  const eventsSize = new Blob([JSON.stringify(events)]).size;
  const cacheSize = estimateCacheSize();
  
  // Calculate date range
  let dateRange = null;
  if (events.length > 0) {
    const timestamps = events.map(e => new Date(e.timestamp));
    dateRange = {
      start: new Date(Math.min(...timestamps)),
      end: new Date(Math.max(...timestamps))
    };
  }
  
  return {
    eventCount: events.length,
    eventsSize: formatBytes(eventsSize),
    cacheSize: formatBytes(cacheSize),
    totalSize: formatBytes(eventsSize + cacheSize),
    generatedAt,
    dateRange,
    config
  };
}

export function getEntityStats() {
  return {
    cardholders: {
      count: cardholdersData.length,
      updated: '3 days ago' // This would be dynamic in a real app
    },
    accessGroups: {
      count: accessGroupsData.length,
      updated: '3 days ago'
    },
    doors: {
      count: doorsData.length,
      updated: '3 days ago'
    },
    controllers: {
      count: controllersData.length,
      updated: '3 days ago'
    },
    inputs: {
      count: inputsData.length,
      updated: '3 days ago'
    },
    outputs: {
      count: outputsData.length,
      updated: '3 days ago'
    },
    cameras: {
      count: camerasData.length,
      updated: '3 days ago'
    },
    operatorGroups: {
      count: operatorGroupsData.length,
      updated: '3 days ago'
    }
  };
}

export function clearCache() {
  // Clear everything except core data and theme
  const keysToKeep = ['pacs-events', 'events-config', 'events-generated-at', 'pacs-events-generated', 'theme'];
  const allKeys = Object.keys(localStorage);
  
  allKeys.forEach(key => {
    if (!keysToKeep.includes(key)) {
      localStorage.removeItem(key);
    }
  });
  
  return true;
}

export function exportData(types = ['all']) {
  const data = {};
  
  if (types.includes('all') || types.includes('events')) {
    data.events = JSON.parse(localStorage.getItem('pacs-events') || '[]');
  }
  if (types.includes('all') || types.includes('cardholders')) {
    data.cardholders = cardholdersData;
  }
  if (types.includes('all') || types.includes('accessGroups')) {
    data.accessGroups = accessGroupsData;
  }
  if (types.includes('all') || types.includes('doors')) {
    data.doors = doorsData;
  }
  if (types.includes('all') || types.includes('controllers')) {
    data.controllers = controllersData;
  }
  if (types.includes('all') || types.includes('inputs')) {
    data.inputs = inputsData;
  }
  if (types.includes('all') || types.includes('outputs')) {
    data.outputs = outputsData;
  }
  if (types.includes('all') || types.includes('cameras')) {
    data.cameras = camerasData;
  }
  if (types.includes('all') || types.includes('operatorGroups')) {
    data.operatorGroups = operatorGroupsData;
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pacs-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportEntityData(entityType) {
  const dataMap = {
    cardholders: cardholdersData,
    accessGroups: accessGroupsData,
    doors: doorsData,
    controllers: controllersData,
    inputs: inputsData,
    outputs: outputsData,
    cameras: camerasData,
    operatorGroups: operatorGroupsData
  };
  
  const data = dataMap[entityType];
  if (!data) return;
  
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${entityType}-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function resetToDefaults() {
  // Clear all localStorage
  localStorage.clear();
  
  // Regenerate with default settings
  return regenerateEvents({
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-12-31'),
    volume: 'medium',
    distribution: null // Use defaults
  });
}

export function getStorageUsage() {
  let totalSize = 0;
  
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      totalSize += localStorage[key].length + key.length;
    }
  }
  
  return {
    used: formatBytes(totalSize),
    usedBytes: totalSize,
    limit: formatBytes(5 * 1024 * 1024), // Typical 5MB limit
    limitBytes: 5 * 1024 * 1024,
    percentage: Math.round((totalSize / (5 * 1024 * 1024)) * 100)
  };
}

function estimateCacheSize() {
  let size = 0;
  
  // Estimate size of all non-events data in localStorage
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key) && key !== 'pacs-events') {
      size += localStorage[key].length + key.length;
    }
  }
  
  return size;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function formatTimeAgo(isoString) {
  if (!isoString) return 'Never';
  
  const date = new Date(isoString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days ago`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} months ago`;
  return `${Math.floor(seconds / 31536000)} years ago`;
}
