/**
 * Gallagher API Mapper
 * Maps simplified mock data to Gallagher Command Centre REST API v8.30 compliant structure
 */

const BASE_URL = 'https://localhost:8904/api';
const SERVER_NAME = 'Training Server';

/**
 * Generate full href URL for an entity
 */
function generateHref(entityType, id) {
  return `${BASE_URL}/${entityType}/${id}`;
}

/**
 * Map cardholder to Gallagher format
 */
export function mapCardholder(cardholder) {
  return {
    id: cardholder.id,
    href: generateHref('cardholders', cardholder.id),
    name: `${cardholder.first_name} ${cardholder.last_name}`,
    firstName: cardholder.first_name,
    lastName: cardholder.last_name,
    description: cardholder.job_title || '',
    authorised: cardholder.status === 'active',
    deleted: false,
    serverDisplayName: SERVER_NAME,
    email: cardholder.email || '',
    phone: cardholder.phone || '',
    department: cardholder.department || '',
    division: {
      href: `${BASE_URL}/divisions/DIV-001`,
      name: cardholder.department || 'Default Division'
    },
    accessGroups: (cardholder.access_groups || []).map(agId => ({
      href: generateHref('access_groups', agId),
      name: agId
    })),
    credentials: cardholder.card_number ? [{
      id: `CRED-${cardholder.id}`,
      href: `${BASE_URL}/credentials/CRED-${cardholder.id}`,
      cardNumber: cardholder.card_number,
      cardState: {
        type: cardholder.status === 'active' ? 'active' : 'inactive',
        value: cardholder.status === 'active' ? 0 : 1
      },
      lastSuccessfulAccessTime: null,
      lastSuccessfulAccessZone: null
    }] : [],
    lastSuccessfulAccessTime: null,
    lastSuccessfulAccessZone: null,
    created: cardholder.created || cardholder.hire_date || new Date().toISOString(),
    modified: cardholder.modified || new Date().toISOString(),
    updates: {
      href: `${BASE_URL}/cardholders/${cardholder.id}/updates`
    }
  };
}

/**
 * Map access group to Gallagher format
 */
export function mapAccessGroup(group) {
  return {
    id: group.id,
    href: generateHref('access_groups', group.id),
    name: group.name,
    description: group.description || '',
    serverDisplayName: SERVER_NAME,
    parent: group.parent_id ? {
      href: generateHref('access_groups', group.parent_id),
      name: group.parent_name || 'Parent Group'
    } : null,
    accessGroupType: 'standard',
    memberCount: group.member_count || 0,
    created: group.created || new Date().toISOString(),
    modified: group.modified || new Date().toISOString(),
    updates: {
      href: `${BASE_URL}/access_groups/${group.id}/updates`
    }
  };
}

/**
 * Map door to Gallagher format
 */
export function mapDoor(door) {
  const modeValue = door.status === 'online' ? 'normal' : 
                    door.status === 'fault' ? 'locked' : 'normal';
  
  const alarmValue = door.status === 'fault' ? 'active' : 'normal';

  return {
    id: door.id,
    href: generateHref('items', door.id),
    name: door.name,
    description: door.description || door.location || '',
    serverDisplayName: SERVER_NAME,
    itemType: 'door',
    location: door.location || '',
    mode: {
      mode: modeValue,
      modeChangedTime: door.last_event || new Date().toISOString()
    },
    alarm: {
      state: alarmValue,
      priority: alarmValue === 'active' ? 100 : 0
    },
    readers: [
      {
        id: door.reader_id || `RDR-${door.id.split('-')[1]}`,
        href: `${BASE_URL}/items/${door.reader_id || 'RDR-' + door.id.split('-')[1]}`,
        name: `${door.name} Reader`,
        direction: 'entry'
      }
    ],
    accessZone: {
      href: `${BASE_URL}/access_zones/AZ-001`,
      name: door.location || 'Default Zone'
    },
    controller: door.controller_id ? {
      href: `${BASE_URL}/items/${door.controller_id}`,
      name: door.controller_id
    } : null,
    created: door.created || new Date().toISOString(),
    modified: door.modified || new Date().toISOString(),
    updates: {
      href: `${BASE_URL}/items/${door.id}/updates`
    }
  };
}

/**
 * Map controller to Gallagher format
 */
export function mapController(controller) {
  return {
    id: controller.id,
    href: generateHref('items', controller.id),
    name: controller.name,
    description: controller.description || controller.location || '',
    serverDisplayName: SERVER_NAME,
    itemType: 'controller',
    address: controller.ip_address || '',
    serialNumber: controller.serial_number || '',
    shortAddress: controller.ip_address ? controller.ip_address.split('.').pop() : '100',
    online: controller.status === 'online',
    firmwareVersion: controller.firmware_version || '8.30.1234',
    hardwareVersion: controller.hardware_version || '8.30',
    bootVersion: controller.boot_version || '8.20.1000',
    lastStatusChange: controller.last_communication || new Date().toISOString(),
    mode: {
      mode: controller.status === 'online' ? 'normal' : 'offline',
      modeChangedTime: controller.last_communication || new Date().toISOString()
    },
    alarm: {
      state: controller.status === 'online' ? 'normal' : 'active',
      priority: controller.status === 'online' ? 0 : 200
    },
    created: controller.created || new Date().toISOString(),
    modified: controller.modified || new Date().toISOString(),
    updates: {
      href: `${BASE_URL}/items/${controller.id}/updates`
    }
  };
}

/**
 * Map input to Gallagher format
 */
export function mapInput(input) {
  return {
    id: input.id,
    href: generateHref('items', input.id),
    name: input.name,
    description: input.description || input.location || '',
    serverDisplayName: SERVER_NAME,
    itemType: 'input',
    type: {
      type: input.type || 'door_contact',
      value: 1
    },
    normalState: input.state === 'normal' ? 'open' : 'closed',
    currentState: {
      state: input.state || 'normal',
      stateChangedTime: new Date().toISOString()
    },
    door: input.door_id ? {
      href: `${BASE_URL}/items/${input.door_id}`,
      name: input.door_id
    } : null,
    controller: input.controller_id ? {
      href: `${BASE_URL}/items/${input.controller_id}`,
      name: input.controller_id
    } : null,
    created: input.created || new Date().toISOString(),
    modified: input.modified || new Date().toISOString(),
    updates: {
      href: `${BASE_URL}/items/${input.id}/updates`
    }
  };
}

/**
 * Map output to Gallagher format
 */
export function mapOutput(output) {
  return {
    id: output.id,
    href: generateHref('items', output.id),
    name: output.name,
    description: output.description || output.location || '',
    serverDisplayName: SERVER_NAME,
    itemType: 'output',
    type: {
      type: output.type || 'door_strike',
      value: 1
    },
    pulseTime: 5,
    currentState: {
      state: output.state || 'inactive',
      stateChangedTime: new Date().toISOString()
    },
    door: output.door_id ? {
      href: `${BASE_URL}/items/${output.door_id}`,
      name: output.door_id
    } : null,
    controller: output.controller_id ? {
      href: `${BASE_URL}/items/${output.controller_id}`,
      name: output.controller_id
    } : null,
    created: output.created || new Date().toISOString(),
    modified: output.modified || new Date().toISOString(),
    updates: {
      href: `${BASE_URL}/items/${output.id}/updates`
    }
  };
}

/**
 * Map event to Gallagher format
 */
export function mapEvent(event) {
  return {
    id: event.id,
    time: event.timestamp || new Date().toISOString(),
    type: {
      id: event.event_type || 'access_granted',
      name: event.event_type || 'Access Granted'
    },
    priority: event.priority || 100,
    serverDisplayName: SERVER_NAME,
    source: event.door_id ? {
      href: `${BASE_URL}/items/${event.door_id}`,
      name: event.door_id
    } : null,
    cardholder: event.cardholder_id ? {
      href: generateHref('cardholders', event.cardholder_id),
      name: event.cardholder_id
    } : null,
    cardNumber: event.card_number || null,
    accessGroup: event.access_group ? {
      href: generateHref('access_groups', event.access_group),
      name: event.access_group
    } : null,
    division: {
      href: `${BASE_URL}/divisions/DIV-001`,
      name: 'Default Division'
    },
    details: event.details || event.description || ''
  };
}

/**
 * Create paginated response
 */
export function createPaginatedResponse(items, endpoint, top = 100, skip = 0) {
  const start = parseInt(skip) || 0;
  const limit = parseInt(top) || 100;
  const paginatedItems = items.slice(start, start + limit);
  
  const hasMore = start + limit < items.length;
  const response = {
    results: paginatedItems,
    href: `${BASE_URL}${endpoint}?top=${limit}&skip=${start}`
  };
  
  if (hasMore) {
    response.next = {
      href: `${BASE_URL}${endpoint}?top=${limit}&skip=${start + limit}`
    };
  }
  
  return response;
}

/**
 * Map operator group to Gallagher format
 */
export function mapOperatorGroup(group) {
  return {
    id: group.id,
    href: `${BASE_URL}/operator_groups/${group.id}`,
    name: group.name,
    description: group.description || '',
    serverDisplayName: SERVER_NAME,
    members: (group.members || []).map(member => ({
      href: `${BASE_URL}/operators/${member.id}`,
      name: member.name || member.id,
      email: member.email || ''
    })),
    roles: (group.roles || []).map(role => ({
      name: role,
      permissions: []
    })),
    created: group.created || new Date().toISOString(),
    modified: group.modified || new Date().toISOString()
  };
}

export default {
  mapCardholder,
  mapAccessGroup,
  mapDoor,
  mapController,
  mapInput,
  mapOutput,
  mapEvent,
  mapOperatorGroup,
  createPaginatedResponse
};
