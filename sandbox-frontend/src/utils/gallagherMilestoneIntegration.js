/**
 * Gallagher-Milestone Integration Utility
 * Provides utilities for PACS-VMS integration workflows
 */

import camerasData from '../mock-data/milestone/cameras.json';
import bookmarksData from '../mock-data/milestone/bookmarks.json';
import doorsData from '../mock-data/doors.json';
import cardholdersData from '../mock-data/cardholders.json';

/**
 * Get cameras linked to a specific door
 * @param {string} doorId - The door ID to find cameras for
 * @returns {Array} Array of cameras linked to the door
 */
export function getCamerasForDoor(doorId) {
  if (!doorId) {
    return [];
  }
  
  return camerasData.filter(camera => 
    camera.linkedDoors && camera.linkedDoors.includes(doorId)
  );
}

/**
 * Create a bookmark from a PACS event
 * @param {Object} pacsEvent - The PACS event object
 * @param {Object} options - Optional parameters (description, tags, timeWindow)
 * @returns {Object} New bookmark object
 */
export function createBookmarkFromPACSEvent(pacsEvent, options = {}) {
  if (!pacsEvent) {
    throw new Error('PACS event is required');
  }
  
  const {
    description = '',
    tags = [],
    timeWindow = 300 // 5 minutes in seconds
  } = options;
  
  // Find cameras for the door
  const doorCameras = getCamerasForDoor(pacsEvent.door_id);
  
  if (doorCameras.length === 0) {
    console.warn(`No cameras found for door ${pacsEvent.door_id}`);
    return null;
  }
  
  // Use the first camera for the bookmark
  const camera = doorCameras[0];
  
  // Calculate time window
  const eventTime = new Date(pacsEvent.timestamp);
  const timeBegin = new Date(eventTime.getTime() - (timeWindow / 2) * 1000);
  const timeEnd = new Date(eventTime.getTime() + (timeWindow / 2) * 1000);
  
  // Generate bookmark ID
  const bookmarkId = `BM-${Date.now()}`;
  
  // Find door info
  const door = doorsData.find(d => d.id === pacsEvent.door_id);
  const doorName = door ? door.name : pacsEvent.door_id;
  
  // Find cardholder info if available
  let cardholderName = 'Unknown';
  if (pacsEvent.cardholder_id) {
    const cardholder = cardholdersData.find(c => c.id === pacsEvent.cardholder_id);
    if (cardholder) {
      cardholderName = `${cardholder.first_name} ${cardholder.last_name}`;
    }
  }
  
  // Generate bookmark name
  const eventTypeMap = {
    'access_granted': 'Access Granted',
    'access_denied': 'Access Denied',
    'door_forced': 'Door Forced Open',
    'door_held': 'Door Held Open',
    'first_card_unlock': 'First Card Unlock',
    'alarm': 'Alarm'
  };
  
  const eventTypeName = eventTypeMap[pacsEvent.event_type] || pacsEvent.event_type;
  const bookmarkName = `${doorName} - ${eventTypeName}${cardholderName !== 'Unknown' ? ` - ${cardholderName}` : ''}`;
  
  // Create bookmark object
  const bookmark = {
    id: bookmarkId,
    href: `https://localhost/milestone/api/rest/v1/bookmarks/${bookmarkId}`,
    name: bookmarkName,
    description: description || `PACS Event: ${eventTypeName} at ${doorName}`,
    created: new Date().toISOString(),
    createdBy: {
      id: 'SYSTEM',
      name: 'PACS Integration',
      email: 'system@acmecorp.com'
    },
    timeBegin: timeBegin.toISOString(),
    timeEnd: timeEnd.toISOString(),
    camera: {
      id: camera.id,
      name: camera.name,
      href: camera.href
    },
    reference: pacsEvent.id || `EVT-${Date.now()}`,
    tags: ['pacs-integration', ...tags],
    relatedPACSEvent: pacsEvent.id
  };
  
  return bookmark;
}

/**
 * Correlate PACS events with existing bookmarks
 * @param {Object} pacsEvent - The PACS event to correlate
 * @param {number} timeThreshold - Time threshold in seconds (default: 300 = 5 minutes)
 * @returns {Array} Array of related bookmarks
 */
export function correlatePACSEventsWithBookmark(pacsEvent, timeThreshold = 300) {
  if (!pacsEvent || !pacsEvent.timestamp) {
    return [];
  }
  
  const eventTime = new Date(pacsEvent.timestamp);
  const doorCameras = getCamerasForDoor(pacsEvent.door_id);
  const cameraIds = doorCameras.map(c => c.id);
  
  // Find bookmarks within time threshold and for related cameras
  const relatedBookmarks = bookmarksData.filter(bookmark => {
    // Check if bookmark is for one of the door's cameras
    if (!cameraIds.includes(bookmark.camera.id)) {
      return false;
    }
    
    // Check time correlation
    const bookmarkStart = new Date(bookmark.timeBegin);
    const bookmarkEnd = new Date(bookmark.timeEnd);
    
    const timeDiffStart = Math.abs(eventTime - bookmarkStart) / 1000;
    const timeDiffEnd = Math.abs(eventTime - bookmarkEnd) / 1000;
    
    // Event within bookmark time range or within threshold
    const withinTimeRange = eventTime >= bookmarkStart && eventTime <= bookmarkEnd;
    const withinThreshold = timeDiffStart <= timeThreshold || timeDiffEnd <= timeThreshold;
    
    return withinTimeRange || withinThreshold;
  });
  
  return relatedBookmarks;
}

/**
 * Handle access denied workflow - create bookmark and return context
 * @param {Object} pacsEvent - Access denied event
 * @returns {Object} Workflow result with bookmark and context
 */
export function handleAccessDeniedWorkflow(pacsEvent) {
  if (!pacsEvent) {
    throw new Error('PACS event is required');
  }
  
  // Find cardholder info
  let cardholderInfo = null;
  if (pacsEvent.cardholder_id) {
    cardholderInfo = cardholdersData.find(c => c.id === pacsEvent.cardholder_id);
  }
  
  // Find door info
  const doorInfo = doorsData.find(d => d.id === pacsEvent.door_id);
  
  // Determine reason for denial
  let denialReason = 'Unknown reason';
  if (pacsEvent.details) {
    if (pacsEvent.details.includes('invalid_credential')) {
      denialReason = 'Invalid or deactivated credential';
    } else if (pacsEvent.details.includes('access_group')) {
      denialReason = 'Insufficient access permissions';
    } else if (pacsEvent.details.includes('schedule')) {
      denialReason = 'Outside permitted access schedule';
    }
  }
  
  // Create description
  const cardholderName = cardholderInfo 
    ? `${cardholderInfo.first_name} ${cardholderInfo.last_name}` 
    : 'Unknown individual';
  
  const description = `Access denied for ${cardholderName} at ${doorInfo?.name || pacsEvent.door_id}. Reason: ${denialReason}. Investigation required to determine if this was legitimate or a security concern.`;
  
  // Create bookmark with appropriate tags
  const tags = ['access-denied', 'investigation'];
  
  // Add priority tag based on door sensitivity
  if (doorInfo?.location && (
    doorInfo.location.includes('Server Room') ||
    doorInfo.location.includes('Data Center') ||
    doorInfo.location.includes('Executive')
  )) {
    tags.push('high-priority');
  }
  
  const bookmark = createBookmarkFromPACSEvent(pacsEvent, {
    description,
    tags,
    timeWindow: 600 // 10 minutes for access denied events
  });
  
  // Build context
  const context = {
    event: pacsEvent,
    bookmark,
    cardholder: cardholderInfo,
    door: doorInfo,
    cameras: getCamerasForDoor(pacsEvent.door_id),
    denialReason,
    recommendedAction: determineRecommendedAction(pacsEvent, doorInfo, cardholderInfo)
  };
  
  return context;
}

/**
 * Handle door forced workflow - create multiple bookmarks and return context
 * @param {Object} pacsEvent - Door forced event
 * @returns {Object} Workflow result with bookmarks and context
 */
export function handleDoorForcedWorkflow(pacsEvent) {
  if (!pacsEvent) {
    throw new Error('PACS event is required');
  }
  
  // Find door info
  const doorInfo = doorsData.find(d => d.id === pacsEvent.door_id);
  const doorCameras = getCamerasForDoor(pacsEvent.door_id);
  
  // Create description
  const description = `SECURITY ALERT: Door forced open at ${doorInfo?.name || pacsEvent.door_id}. Immediate investigation required. Potential security breach.`;
  
  // Create primary bookmark for forced entry
  const primaryBookmark = createBookmarkFromPACSEvent(pacsEvent, {
    description,
    tags: ['forced-entry', 'alarm', 'high-priority', 'security-breach'],
    timeWindow: 900 // 15 minutes for forced entry
  });
  
  // Create additional bookmarks for all cameras covering the door
  const additionalBookmarks = doorCameras.slice(1).map(camera => {
    const bookmarkId = `BM-${Date.now()}-${camera.id}`;
    const eventTime = new Date(pacsEvent.timestamp);
    const timeBegin = new Date(eventTime.getTime() - 450 * 1000); // 7.5 min before
    const timeEnd = new Date(eventTime.getTime() + 450 * 1000); // 7.5 min after
    
    return {
      id: bookmarkId,
      href: `https://localhost/milestone/api/rest/v1/bookmarks/${bookmarkId}`,
      name: `${doorInfo?.name || pacsEvent.door_id} - Door Forced (${camera.name})`,
      description: `Additional camera coverage for forced entry investigation at ${doorInfo?.name || pacsEvent.door_id}`,
      created: new Date().toISOString(),
      createdBy: {
        id: 'SYSTEM',
        name: 'PACS Integration',
        email: 'system@acmecorp.com'
      },
      timeBegin: timeBegin.toISOString(),
      timeEnd: timeEnd.toISOString(),
      camera: {
        id: camera.id,
        name: camera.name,
        href: camera.href
      },
      reference: pacsEvent.id || `EVT-${Date.now()}`,
      tags: ['forced-entry', 'alarm', 'high-priority', 'additional-coverage'],
      relatedPACSEvent: pacsEvent.id
    };
  });
  
  // Look for suspicious events before the forced entry
  const eventTime = new Date(pacsEvent.timestamp);
  const lookbackTime = new Date(eventTime.getTime() - 1800 * 1000); // 30 minutes before
  
  // Build comprehensive context
  const context = {
    event: pacsEvent,
    primaryBookmark,
    additionalBookmarks,
    door: doorInfo,
    cameras: doorCameras,
    severity: 'CRITICAL',
    requiresImmediate: true,
    investigationScope: {
      timeRange: {
        start: lookbackTime.toISOString(),
        end: new Date(eventTime.getTime() + 900 * 1000).toISOString()
      },
      areasToCheck: getAdjacentAreas(doorInfo),
      personnelToNotify: ['Security Lead', 'Facility Manager', 'IT Security']
    },
    recommendedActions: [
      'Dispatch security personnel immediately',
      'Review all camera footage for the time window',
      'Check for any access attempts in the 30 minutes prior',
      'Verify door integrity and alarm system',
      'Review access logs for unusual patterns',
      'Consider facility lockdown if threat is confirmed'
    ]
  };
  
  return context;
}

/**
 * Build comprehensive incident context from PACS event
 * @param {Object} pacsEvent - The PACS event
 * @param {Object} options - Options for context building
 * @returns {Object} Comprehensive incident context
 */
export function buildIncidentContext(pacsEvent, options = {}) {
  if (!pacsEvent) {
    throw new Error('PACS event is required');
  }
  
  const {
    includeSurroundingEvents = true,
    timeWindowMinutes = 30,
    includeCardholderHistory = true
  } = options;
  
  // Get door and camera information
  const doorInfo = doorsData.find(d => d.id === pacsEvent.door_id);
  const doorCameras = getCamerasForDoor(pacsEvent.door_id);
  
  // Get cardholder information
  let cardholderInfo = null;
  let cardholderHistory = null;
  
  if (pacsEvent.cardholder_id) {
    cardholderInfo = cardholdersData.find(c => c.id === pacsEvent.cardholder_id);
    
    if (includeCardholderHistory && cardholderInfo) {
      cardholderHistory = {
        id: cardholderInfo.id,
        name: `${cardholderInfo.first_name} ${cardholderInfo.last_name}`,
        status: cardholderInfo.status,
        department: cardholderInfo.department,
        accessGroups: cardholderInfo.access_groups || [],
        recentActivity: `Recent activity for ${cardholderInfo.first_name} ${cardholderInfo.last_name}`
      };
    }
  }
  
  // Find correlated bookmarks
  const correlatedBookmarks = correlatePACSEventsWithBookmark(pacsEvent, timeWindowMinutes * 60);
  
  // Get adjacent areas for broader context
  const adjacentAreas = getAdjacentAreas(doorInfo);
  
  // Build timeline
  const eventTime = new Date(pacsEvent.timestamp);
  const timeline = {
    eventTime: eventTime.toISOString(),
    lookbackStart: new Date(eventTime.getTime() - timeWindowMinutes * 60 * 1000).toISOString(),
    lookforwardEnd: new Date(eventTime.getTime() + timeWindowMinutes * 60 * 1000).toISOString()
  };
  
  // Assess severity
  const severity = assessEventSeverity(pacsEvent, doorInfo);
  
  // Build comprehensive context
  const context = {
    event: {
      id: pacsEvent.id,
      type: pacsEvent.event_type,
      timestamp: pacsEvent.timestamp,
      details: pacsEvent.details || {}
    },
    location: {
      door: doorInfo,
      cameras: doorCameras,
      adjacentAreas
    },
    personnel: {
      cardholder: cardholderInfo,
      history: cardholderHistory
    },
    video: {
      availableCameras: doorCameras.map(c => ({
        id: c.id,
        name: c.name,
        location: c.location,
        features: c.features
      })),
      correlatedBookmarks
    },
    timeline,
    assessment: {
      severity,
      requiresInvestigation: severity.level !== 'Low',
      recommendedActions: determineRecommendedAction(pacsEvent, doorInfo, cardholderInfo)
    },
    metadata: {
      contextBuiltAt: new Date().toISOString(),
      integrationSource: 'Gallagher-Milestone Integration'
    }
  };
  
  return context;
}

/**
 * Helper function to determine recommended actions
 */
function determineRecommendedAction(pacsEvent, doorInfo, cardholderInfo) {
  const actions = [];
  
  switch (pacsEvent.event_type) {
    case 'access_denied':
      actions.push('Review video footage to identify individual');
      actions.push('Verify cardholder credentials are active');
      if (doorInfo?.location?.includes('Secure') || doorInfo?.location?.includes('Server')) {
        actions.push('Notify security personnel immediately');
      } else {
        actions.push('Contact cardholder to verify access requirements');
      }
      break;
      
    case 'door_forced':
      actions.push('URGENT: Dispatch security immediately');
      actions.push('Review all camera angles');
      actions.push('Verify physical door status');
      actions.push('Consider facility lockdown');
      break;
      
    case 'door_held':
      actions.push('Review footage to identify if door was propped open');
      actions.push('Verify no unauthorized access occurred');
      actions.push('Remind staff of door policy if needed');
      break;
      
    default:
      actions.push('Review associated video footage');
      actions.push('Document incident details');
  }
  
  return actions;
}

/**
 * Helper function to assess event severity
 */
function assessEventSeverity(pacsEvent, doorInfo) {
  let level = 'Low';
  let score = 1;
  const factors = [];
  
  // Check event type
  if (pacsEvent.event_type === 'door_forced' || pacsEvent.event_type === 'alarm') {
    level = 'Critical';
    score = 10;
    factors.push('Forced entry or alarm event');
  } else if (pacsEvent.event_type === 'access_denied') {
    level = 'Medium';
    score = 5;
    factors.push('Access denial requires review');
  }
  
  // Check door location
  if (doorInfo?.location) {
    if (doorInfo.location.includes('Server Room') || 
        doorInfo.location.includes('Data Center') ||
        doorInfo.location.includes('Executive')) {
      score += 3;
      level = score >= 8 ? 'Critical' : 'High';
      factors.push('High-security area');
    }
  }
  
  // Check time of day
  const eventHour = new Date(pacsEvent.timestamp).getHours();
  if (eventHour < 6 || eventHour > 20) {
    score += 2;
    if (score >= 8) level = 'Critical';
    else if (score >= 5) level = 'High';
    factors.push('After-hours event');
  }
  
  return {
    level,
    score,
    factors
  };
}

/**
 * Helper function to get adjacent areas
 */
function getAdjacentAreas(doorInfo) {
  if (!doorInfo) return [];
  
  // In a real implementation, this would query a database of facility layout
  // For now, return mock adjacent areas based on location
  const location = doorInfo.location || '';
  const adjacentAreas = [];
  
  if (location.includes('Main Entrance')) {
    adjacentAreas.push('Reception Area', 'Lobby', 'Parking Lot');
  } else if (location.includes('Server Room')) {
    adjacentAreas.push('IT Room', 'Data Center', 'Server Hallway');
  } else if (location.includes('Loading Dock')) {
    adjacentAreas.push('Warehouse', 'Receiving Area', 'Exterior Parking');
  }
  
  return adjacentAreas;
}

/**
 * Get all bookmarks for a specific door
 * @param {string} doorId - The door ID
 * @returns {Array} Array of bookmarks related to the door
 */
export function getBookmarksForDoor(doorId) {
  const doorCameras = getCamerasForDoor(doorId);
  const cameraIds = doorCameras.map(c => c.id);
  
  return bookmarksData.filter(bookmark => 
    cameraIds.includes(bookmark.camera.id)
  );
}

/**
 * Search bookmarks by criteria
 * @param {Object} criteria - Search criteria (tags, dateRange, cameraId, etc.)
 * @returns {Array} Filtered bookmarks
 */
export function searchBookmarks(criteria = {}) {
  const {
    tags = [],
    startDate = null,
    endDate = null,
    cameraId = null,
    searchText = ''
  } = criteria;
  
  let results = [...bookmarksData];
  
  // Filter by tags
  if (tags.length > 0) {
    results = results.filter(bookmark =>
      tags.some(tag => bookmark.tags.includes(tag))
    );
  }
  
  // Filter by date range
  if (startDate) {
    const start = new Date(startDate);
    results = results.filter(bookmark => 
      new Date(bookmark.timeBegin) >= start
    );
  }
  
  if (endDate) {
    const end = new Date(endDate);
    results = results.filter(bookmark =>
      new Date(bookmark.timeEnd) <= end
    );
  }
  
  // Filter by camera
  if (cameraId) {
    results = results.filter(bookmark =>
      bookmark.camera.id === cameraId
    );
  }
  
  // Filter by search text
  if (searchText) {
    const searchLower = searchText.toLowerCase();
    results = results.filter(bookmark =>
      bookmark.name.toLowerCase().includes(searchLower) ||
      bookmark.description.toLowerCase().includes(searchLower)
    );
  }
  
  return results;
}

/**
 * Get statistics about camera coverage for doors
 * @returns {Object} Coverage statistics
 */
export function getCameraCoverageStats() {
  const doorsWithCameras = doorsData.filter(door => 
    getCamerasForDoor(door.id).length > 0
  );
  
  const doorsWithMultipleCameras = doorsData.filter(door =>
    getCamerasForDoor(door.id).length > 1
  );
  
  const totalDoors = doorsData.length;
  const coveredDoors = doorsWithCameras.length;
  const coveragePercent = (coveredDoors / totalDoors * 100).toFixed(1);
  
  return {
    totalDoors,
    coveredDoors,
    uncoveredDoors: totalDoors - coveredDoors,
    doorsWithMultipleCameras: doorsWithMultipleCameras.length,
    coveragePercent: parseFloat(coveragePercent),
    cameras: {
      total: camerasData.length,
      active: camerasData.filter(c => c.state === 'Recording').length,
      inactive: camerasData.filter(c => c.state !== 'Recording').length
    }
  };
}

export default {
  getCamerasForDoor,
  createBookmarkFromPACSEvent,
  correlatePACSEventsWithBookmark,
  handleAccessDeniedWorkflow,
  handleDoorForcedWorkflow,
  buildIncidentContext,
  getBookmarksForDoor,
  searchBookmarks,
  getCameraCoverageStats
};
