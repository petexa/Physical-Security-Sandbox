// Mock API Client - Simulates API endpoints

import cardholdersData from '../mock-data/cardholders.json';
import accessGroupsData from '../mock-data/access-groups.json';
import doorsData from '../mock-data/doors.json';
import controllersData from '../mock-data/controllers.json';
import inputsData from '../mock-data/inputs.json';
import outputsData from '../mock-data/outputs.json';
import camerasData from '../mock-data/cameras.json';
import operatorGroupsData from '../mock-data/operator-groups.json';
import * as gallagherMapper from './gallagherMapper.js';
import { getStorageUsage as getStorageUsageRaw } from './storageHelper.js';
import { logAPICall } from './apiLogger.js';

// Simulate network delay
function delay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Parse query parameters from string
function parseQueryParams(paramString) {
  if (!paramString) return {};
  
  const params = {};
  paramString.split('&').forEach(pair => {
    const [key, value] = pair.split('=');
    params[decodeURIComponent(key)] = decodeURIComponent(value);
  });
  return params;
}

// Log API call helper
function logCall(method, endpoint, response, responseTime) {
  try {
    const request = {
      method,
      url: endpoint,
      headers: {},
      body: null
    };
    
    const responseData = {
      status: response.status,
      statusText: response.status >= 200 && response.status < 300 ? 'OK' : 'Error',
      headers: response.headers || {},
      body: JSON.stringify(response.data || response),
      preview: JSON.stringify(response.data || response).substring(0, 200)
    };
    
    logAPICall(request, responseData, responseTime);
  } catch (error) {
    console.error('[apiClient] Failed to log API call:', error);
  }
}

// Mock GET request
export async function get(endpoint, params = {}) {
  const startTime = performance.now();
  await delay(300);
  
  const [path, queryString] = endpoint.split('?');
  const queryParams = { ...params, ...parseQueryParams(queryString) };
  
  // Health check endpoint
  if (path === '/api/health') {
    const events = JSON.parse(localStorage.getItem('pacs-events') || '[]');
    
    // Use storageHelper for consistent storage reporting
    const storage = getStorageUsageRaw();
    
    const response = {
      status: 200,
      data: {
        status: 'online',
        version: '1.0.11',
        uptime: Math.floor(performance.now() / 1000), // seconds since page load
        timestamp: new Date().toISOString(),
        services: {
          gallagher: { 
            status: 'online', 
            responseTime: 2,
            endpoints: 7
          },
          milestone: { 
            status: 'online', 
            responseTime: 5,
            cameras: camerasData.length
          },
          database: { 
            status: 'online', 
            connections: 1,
            events: events.length
          }
        },
        stats: {
          requestsPerMinute: Math.floor(Math.random() * 50) + 100,
          cpuUsage: `${Math.floor(Math.random() * 20) + 10}%`,
          memoryUsage: `${(Math.random() * 2 + 3).toFixed(1)} GB / 16 GB`,
          storageUsage: `${storage.usedMB} MB (${storage.percentUsed}%)`
        }
      }
    };
    
    const endTime = performance.now();
    logCall('GET', endpoint, response, Math.round(endTime - startTime));
    
    return response;
  }
  
  // Cardholders
  if (path === '/api/cardholders') {
    const mapped = cardholdersData.map(gallagherMapper.mapCardholder);
    const top = queryParams.top ? parseInt(queryParams.top) : 100;
    const skip = queryParams.skip ? parseInt(queryParams.skip) : 0;
    const paginated = gallagherMapper.createPaginatedResponse(mapped, '/cardholders', top, skip);
    
    const response = {
      status: 200,
      data: paginated,
      headers: { 'content-type': 'application/json' }
    };
    
    const endTime = performance.now();
    logCall('GET', endpoint, response, Math.round(endTime - startTime));
    
    return response;
  }
  
  if (path.match(/^\/api\/cardholders\/[^/]+$/)) {
    const id = path.split('/').pop();
    const cardholder = cardholdersData.find(c => c.id === id);
    if (cardholder) {
      return { status: 200, data: gallagherMapper.mapCardholder(cardholder) };
    }
    return { status: 404, error: 'Cardholder not found' };
  }
  
  // Get cardholder credentials
  if (path.match(/^\/api\/cardholders\/[^/]+\/credentials$/)) {
    const id = path.split('/')[3];
    const cardholder = cardholdersData.find(c => c.id === id);
    if (!cardholder) {
      return { status: 404, error: 'Cardholder not found' };
    }
    
    // Return cardholder's credentials (mock data)
    const credentials = cardholder.credentials || [
      {
        id: `CRED-${id}-001`,
        type: 'Card',
        cardNumber: cardholder.cardNumber || '12345',
        status: 'Active',
        issueDate: cardholder.created_at || new Date().toISOString()
      }
    ];
    
    return {
      status: 200,
      data: {
        results: credentials,
        href: `/api/cardholders/${id}/credentials`
      }
    };
  }
  
  // Get cardholder access groups
  if (path.match(/^\/api\/cardholders\/[^/]+\/access-groups$/)) {
    const id = path.split('/')[3];
    const cardholder = cardholdersData.find(c => c.id === id);
    if (!cardholder) {
      return { status: 404, error: 'Cardholder not found' };
    }
    
    // Return cardholder's access groups (mock data from cardholder.accessGroups)
    const groups = (cardholder.accessGroups || []).map(groupName => {
      const group = accessGroupsData.find(g => g.name === groupName);
      return group ? gallagherMapper.mapAccessGroup(group) : { name: groupName };
    });
    
    return {
      status: 200,
      data: {
        results: groups,
        href: `/api/cardholders/${id}/access-groups`
      }
    };
  }
  
  // Access Groups
  if (path === '/api/access_groups') {
    const mapped = accessGroupsData.map(gallagherMapper.mapAccessGroup);
    const top = queryParams.top ? parseInt(queryParams.top) : 100;
    const skip = queryParams.skip ? parseInt(queryParams.skip) : 0;
    const paginated = gallagherMapper.createPaginatedResponse(mapped, '/access_groups', top, skip);
    
    return {
      status: 200,
      data: paginated,
      headers: { 'content-type': 'application/json' }
    };
  }
  
  if (path.match(/^\/api\/access_groups\/[^/]+$/)) {
    const id = path.split('/').pop();
    const group = accessGroupsData.find(g => g.id === id);
    if (group) {
      return { status: 200, data: gallagherMapper.mapAccessGroup(group) };
    }
    return { status: 404, error: 'Access group not found' };
  }
  
  // Doors
  if (path === '/api/doors') {
    const mapped = doorsData.map(gallagherMapper.mapDoor);
    const top = queryParams.top ? parseInt(queryParams.top) : 100;
    const skip = queryParams.skip ? parseInt(queryParams.skip) : 0;
    const paginated = gallagherMapper.createPaginatedResponse(mapped, '/doors', top, skip);
    
    return {
      status: 200,
      data: paginated,
      headers: { 'content-type': 'application/json' }
    };
  }
  
  if (path.match(/^\/api\/doors\/[^/]+$/)) {
    const id = path.split('/').pop();
    const door = doorsData.find(d => d.id === id);
    if (door) {
      return { status: 200, data: gallagherMapper.mapDoor(door) };
    }
    return { status: 404, error: 'Door not found' };
  }
  
  // Items endpoint (Gallagher-style)
  if (path === '/api/items') {
    let items = [];
    const type = queryParams.type;
    
    if (!type || type === 'door') {
      items = [...items, ...doorsData.map(gallagherMapper.mapDoor)];
    }
    if (!type || type === 'controller') {
      items = [...items, ...controllersData.map(gallagherMapper.mapController)];
    }
    if (!type || type === 'input') {
      items = [...items, ...inputsData.map(gallagherMapper.mapInput)];
    }
    if (!type || type === 'output') {
      items = [...items, ...outputsData.map(gallagherMapper.mapOutput)];
    }
    
    const top = queryParams.top ? parseInt(queryParams.top) : 100;
    const skip = queryParams.skip ? parseInt(queryParams.skip) : 0;
    const paginated = gallagherMapper.createPaginatedResponse(items, `/items${type ? '?type=' + type : ''}`, top, skip);
    
    return {
      status: 200,
      data: paginated,
      headers: { 'content-type': 'application/json' }
    };
  }
  
  if (path.match(/^\/api\/items\/[^/]+$/)) {
    const id = path.split('/').pop();
    
    // Check all item types
    let door = doorsData.find(d => d.id === id);
    if (door) return { status: 200, data: gallagherMapper.mapDoor(door) };
    
    let controller = controllersData.find(c => c.id === id);
    if (controller) return { status: 200, data: gallagherMapper.mapController(controller) };
    
    let input = inputsData.find(i => i.id === id);
    if (input) return { status: 200, data: gallagherMapper.mapInput(input) };
    
    let output = outputsData.find(o => o.id === id);
    if (output) return { status: 200, data: gallagherMapper.mapOutput(output) };
    
    return { status: 404, error: 'Item not found' };
  }
  
  // Controllers
  if (path === '/api/controllers') {
    const mapped = controllersData.map(gallagherMapper.mapController);
    const top = queryParams.top ? parseInt(queryParams.top) : 100;
    const skip = queryParams.skip ? parseInt(queryParams.skip) : 0;
    const paginated = gallagherMapper.createPaginatedResponse(mapped, '/controllers', top, skip);
    
    return {
      status: 200,
      data: paginated,
      headers: { 'content-type': 'application/json' }
    };
  }
  
  if (path.match(/^\/api\/controllers\/[^/]+$/)) {
    const id = path.split('/').pop();
    const controller = controllersData.find(c => c.id === id);
    if (controller) {
      return { status: 200, data: gallagherMapper.mapController(controller) };
    }
    return { status: 404, error: 'Controller not found' };
  }
  
  // Inputs
  if (path === '/api/inputs') {
    const mapped = inputsData.map(gallagherMapper.mapInput);
    const top = queryParams.top ? parseInt(queryParams.top) : 100;
    const skip = queryParams.skip ? parseInt(queryParams.skip) : 0;
    const paginated = gallagherMapper.createPaginatedResponse(mapped, '/inputs', top, skip);
    
    return {
      status: 200,
      data: paginated,
      headers: { 'content-type': 'application/json' }
    };
  }
  
  // Outputs
  if (path === '/api/outputs') {
    const mapped = outputsData.map(gallagherMapper.mapOutput);
    const top = queryParams.top ? parseInt(queryParams.top) : 100;
    const skip = queryParams.skip ? parseInt(queryParams.skip) : 0;
    const paginated = gallagherMapper.createPaginatedResponse(mapped, '/outputs', top, skip);
    
    return {
      status: 200,
      data: paginated,
      headers: { 'content-type': 'application/json' }
    };
  }
  
  // Operator Groups
  if (path === '/api/operator_groups') {
    const mapped = operatorGroupsData.map(gallagherMapper.mapOperatorGroup);
    const top = queryParams.top ? parseInt(queryParams.top) : 100;
    const skip = queryParams.skip ? parseInt(queryParams.skip) : 0;
    const paginated = gallagherMapper.createPaginatedResponse(mapped, '/operator_groups', top, skip);
    
    return {
      status: 200,
      data: paginated,
      headers: { 'content-type': 'application/json' }
    };
  }
  
  if (path.match(/^\/api\/operator_groups\/[^/]+$/)) {
    const id = path.split('/').pop();
    const group = operatorGroupsData.find(g => g.id === id);
    if (group) {
      return { status: 200, data: gallagherMapper.mapOperatorGroup(group) };
    }
    return { status: 404, error: 'Operator group not found' };
  }
  
  // Events
  if (path === '/api/events') {
    const events = JSON.parse(localStorage.getItem('pacs-events') || '[]');
    
    console.log(`[API] Total events in storage: ${events.length}`);
    
    // Apply filters (don't mutate original array)
    let filtered = [...events];
    
    if (queryParams.start_time || queryParams.start_date) {
      const startDate = new Date(queryParams.start_time || queryParams.start_date);
      filtered = filtered.filter(e => new Date(e.timestamp) >= startDate);
    }
    
    if (queryParams.end_time || queryParams.end_date) {
      const endDate = new Date(queryParams.end_time || queryParams.end_date);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(e => new Date(e.timestamp) <= endDate);
    }
    
    if (queryParams.type || queryParams.event_type) {
      const eventType = queryParams.type || queryParams.event_type;
      filtered = filtered.filter(e => e.event_type === eventType);
    }
    
    if (queryParams.door_id) {
      filtered = filtered.filter(e => e.door_id === queryParams.door_id);
    }
    
    if (queryParams.cardholder_id) {
      filtered = filtered.filter(e => e.cardholder_id === queryParams.cardholder_id);
    }
    
    console.log(`[API] Filtered to: ${filtered.length} events`);
    
    // Sort by timestamp descending (newest first)
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Apply pagination
    const top = parseInt(queryParams.top) || parseInt(queryParams.limit) || 100;
    const skip = parseInt(queryParams.skip) || 0;
    const paginated = filtered.slice(skip, skip + top);
    
    // Map to Gallagher format with hrefs
    const mapped = paginated.map(event => ({
      ...event,
      href: `https://sandbox.petefox.co.uk/api/events/${event.id}`
    }));
    
    return {
      status: 200,
      data: {
        results: mapped,
        next: skip + top < filtered.length ? {
          href: `https://sandbox.petefox.co.uk/api/events?skip=${skip + top}&top=${top}`
        } : null,
        href: 'https://sandbox.petefox.co.uk/api/events',
        totalResults: filtered.length
      },
      headers: { 'content-type': 'application/json' }
    };
  }
  
  // Cameras (Milestone)
  if (path === '/api/cameras') {
    return {
      status: 200,
      data: camerasData,
      headers: { 'content-type': 'application/json' }
    };
  }
  
  if (path.match(/^\/api\/cameras\/[^/]+$/)) {
    const id = path.split('/').pop();
    const camera = camerasData.find(c => c.id === id);
    if (camera) {
      return { status: 200, data: camera };
    }
    return { status: 404, error: 'Camera not found' };
  }
  
  // Recordings
  if (path === '/api/recordings') {
    return {
      status: 200,
      data: {
        message: 'Recordings endpoint - use query params: camera_id, start, end'
      }
    };
  }
  
  // Axis VAPIX
  if (path === '/axis-cgi/param.cgi') {
    return {
      status: 200,
      data: {
        'root.Brand.Brand': 'AXIS',
        'root.Properties.System.Architecture': 'armv7hf',
        'root.Properties.Firmware.Version': '11.11.82',
        'root.ImageSource.I0.Sensor.Name': 'IMX334'
      }
    };
  }
  
  if (path === '/axis-cgi/jpg/image.cgi') {
    return {
      status: 200,
      data: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA2gP8A/9k=',
      headers: { 'content-type': 'image/jpeg' }
    };
  }
  
  // ONVIF
  if (path === '/onvif/device_service') {
    return {
      status: 200,
      data: {
        Envelope: {
          Body: {
            GetDeviceInformationResponse: {
              Manufacturer: 'AXIS',
              Model: 'P3245-LVE',
              FirmwareVersion: '11.11.82',
              SerialNumber: 'ACCC8E123456',
              HardwareId: '12A'
            }
          }
        }
      }
    };
  }
  
  if (path === '/onvif/media_service') {
    return {
      status: 200,
      data: {
        Envelope: {
          Body: {
            GetProfilesResponse: {
              Profiles: [
                { Name: 'High Quality', token: 'profile_1' },
                { Name: 'Low Quality', token: 'profile_2' }
              ]
            }
          }
        }
      }
    };
  }
  
  // Default 404
  const response = {
    status: 404,
    error: 'Endpoint not found',
    message: `No mock data available for ${endpoint}`
  };
  
  const endTime = performance.now();
  logCall('GET', endpoint, response, Math.round(endTime - startTime));
  
  return response;
}

// Mock POST request
export async function post(endpoint, body = {}) {
  const startTime = performance.now();
  await delay(500);
  
  const [path] = endpoint.split('?');
  
  // Create cardholder
  if (path === '/api/cardholders') {
    return {
      status: 201,
      data: {
        id: `CH-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        ...body,
        created_at: new Date().toISOString()
      }
    };
  }
  
  // Add access group to cardholder
  if (path.match(/^\/api\/cardholders\/[^/]+\/access-groups$/)) {
    const id = path.split('/')[3]; // Extract cardholder ID
    const { accessGroupName } = body;
    
    // Load cardholders from localStorage
    const cardholders = JSON.parse(localStorage.getItem('pacs-cardholders') || JSON.stringify(cardholdersData));
    const cardholder = cardholders.find(c => c.id === id);
    
    if (!cardholder) {
      return {
        status: 404,
        error: 'CardholderNotFoundException',
        message: `Cardholder with ID ${id} not found`
      };
    }
    
    // Validate access group exists by fetching from actual data
    const accessGroups = JSON.parse(localStorage.getItem('pacs-access-groups') || JSON.stringify(accessGroupsData));
    const validGroup = accessGroups.find(g => g.name === accessGroupName);
    
    if (!validGroup) {
      const validGroupNames = accessGroups.map(g => g.name);
      return {
        status: 400,
        error: 'InvalidAccessGroupException',
        message: `Access group '${accessGroupName}' does not exist. Valid groups: ${validGroupNames.join(', ')}`
      };
    }
    
    // Check if already has the group
    if (!cardholder.access_groups) {
      cardholder.access_groups = [];
    }
    
    if (cardholder.access_groups.includes(validGroup.id)) {
      return {
        status: 409,
        error: 'DuplicateAccessGroupException',
        message: `Cardholder already has access group '${accessGroupName}'`
      };
    }
    
    // Add the access group
    cardholder.access_groups.push(validGroup.id);
    cardholder.modified = new Date().toISOString();
    
    // Save back to localStorage
    const index = cardholders.findIndex(c => c.id === id);
    cardholders[index] = cardholder;
    localStorage.setItem('pacs-cardholders', JSON.stringify(cardholders));
    
    console.log(`[API] Added access group '${accessGroupName}' to cardholder ${id}`);
    
    return {
      status: 200,
      data: {
        message: `Successfully added access group '${accessGroupName}' to cardholder`,
        cardholder: {
          id: cardholder.id,
          firstName: cardholder.first_name,
          lastName: cardholder.last_name,
          accessGroups: cardholder.access_groups
        }
      }
    };
  }
  
  // Add member to access group
  if (path.match(/^\/api\/access_groups\/[^/]+\/members$/)) {
    const id = path.split('/')[3];
    const { cardholderId } = body;
    
    const accessGroups = JSON.parse(localStorage.getItem('pacs-access-groups') || '[]');
    const group = accessGroups.find(g => g.id === id);
    
    if (!group) {
      return {
        status: 404,
        error: 'AccessGroupNotFoundException',
        message: `Access group with ID ${id} not found`
      };
    }
    
    // Add member
    if (!group.members) {
      group.members = [];
    }
    
    if (group.members.includes(cardholderId)) {
      return {
        status: 409,
        error: 'DuplicateMemberException',
        message: `Cardholder ${cardholderId} is already a member`
      };
    }
    
    group.members.push(cardholderId);
    group.modified = new Date().toISOString();
    
    const index = accessGroups.findIndex(g => g.id === id);
    accessGroups[index] = group;
    localStorage.setItem('pacs-access-groups', JSON.stringify(accessGroups));
    
    return {
      status: 200,
      data: {
        message: `Successfully added member to access group`,
        group: {
          id: group.id,
          name: group.name,
          members: group.members
        }
      }
    };
  }
  
  // Create bookmark
  if (path === '/api/bookmarks') {
    return {
      status: 201,
      data: {
        id: `BM-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
        ...body,
        created_at: new Date().toISOString()
      }
    };
  }
  
  // ONVIF operations
  if (path === '/onvif/device_service' || path === '/onvif/media_service') {
    return {
      status: 200,
      data: {
        Envelope: {
          Body: {
            Response: {
              message: 'Operation successful'
            }
          }
        }
      }
    };
  }
  
  const response = {
    status: 201,
    data: { message: 'Created successfully', body }
  };
  
  const endTime = performance.now();
  logCall('POST', endpoint, response, Math.round(endTime - startTime));
  
  return response;
}

// Mock PATCH request
export async function patch(endpoint, body = {}) {
  await delay(500);
  
  const [path] = endpoint.split('?');
  
  // PATCH cardholder - persist to localStorage
  if (path.match(/^\/api\/cardholders\/[^/]+$/)) {
    const id = path.split('/').pop();
    
    // Load existing cardholders from localStorage
    const cardholders = JSON.parse(localStorage.getItem('pacs-cardholders') || '[]');
    const existing = cardholders.find(c => c.id === id);
    
    if (!existing) {
      return { 
        status: 404, 
        data: { message: 'Cardholder not found' } 
      };
    }
    
    // Merge updates with existing data
    const updated = { 
      ...existing, 
      ...body, 
      modified: new Date().toISOString() 
    };
    
    // Update in storage
    const index = cardholders.findIndex(c => c.id === id);
    cardholders[index] = updated;
    localStorage.setItem('pacs-cardholders', JSON.stringify(cardholders));
    
    console.log(`[API] PATCH cardholder ${id} - updated and persisted to localStorage`);
    
    return {
      status: 200,
      data: {
        ...updated,
        href: `https://sandbox.petefox.co.uk/api/cardholders/${id}`
      }
    };
  }
  
  // PATCH door - persist to localStorage
  if (path.match(/^\/api\/doors\/[^/]+$/)) {
    const id = path.split('/').pop();
    
    // Load existing doors from localStorage
    const doors = JSON.parse(localStorage.getItem('pacs-doors') || '[]');
    const existing = doors.find(d => d.id === id);
    
    if (!existing) {
      return { 
        status: 404, 
        data: { message: 'Door not found' } 
      };
    }
    
    // Merge updates with existing data
    const updated = { 
      ...existing, 
      ...body, 
      modified: new Date().toISOString() 
    };
    
    // Update in storage
    const index = doors.findIndex(d => d.id === id);
    doors[index] = updated;
    localStorage.setItem('pacs-doors', JSON.stringify(doors));
    
    console.log(`[API] PATCH door ${id} - updated and persisted to localStorage`);
    
    return {
      status: 200,
      data: {
        ...updated,
        href: `https://sandbox.petefox.co.uk/api/doors/${id}`
      }
    };
  }
  
  // PATCH access group - persist to localStorage
  if (path.match(/^\/api\/access_groups\/[^/]+$/)) {
    const id = path.split('/').pop();
    
    // Load existing access groups from localStorage
    const accessGroups = JSON.parse(localStorage.getItem('pacs-access-groups') || '[]');
    const existing = accessGroups.find(g => g.id === id);
    
    if (!existing) {
      return { 
        status: 404, 
        data: { message: 'Access group not found' } 
      };
    }
    
    // Merge updates with existing data
    const updated = { 
      ...existing, 
      ...body, 
      modified: new Date().toISOString() 
    };
    
    // Update in storage
    const index = accessGroups.findIndex(g => g.id === id);
    accessGroups[index] = updated;
    localStorage.setItem('pacs-access-groups', JSON.stringify(accessGroups));
    
    console.log(`[API] PATCH access group ${id} - updated and persisted to localStorage`);
    
    return {
      status: 200,
      data: {
        ...updated,
        href: `https://sandbox.petefox.co.uk/api/access_groups/${id}`
      }
    };
  }
  
  // PATCH access group doors
  if (path.match(/^\/api\/access_groups\/[^/]+\/doors$/)) {
    const id = path.split('/')[3];
    
    const accessGroups = JSON.parse(localStorage.getItem('pacs-access-groups') || '[]');
    const existing = accessGroups.find(g => g.id === id);
    
    if (!existing) {
      return { 
        status: 404, 
        data: { message: 'Access group not found' } 
      };
    }
    
    // Update doors
    existing.doors = body.doors || body;
    existing.modified = new Date().toISOString();
    
    const index = accessGroups.findIndex(g => g.id === id);
    accessGroups[index] = existing;
    localStorage.setItem('pacs-access-groups', JSON.stringify(accessGroups));
    
    return {
      status: 200,
      data: {
        ...existing,
        href: `https://sandbox.petefox.co.uk/api/access_groups/${id}`
      }
    };
  }
  
  // PATCH credential
  if (path.match(/^\/api\/credentials\/[^/]+$/)) {
    const id = path.split('/').pop();
    
    // Mock credential update - in real app would update in database
    return {
      status: 200,
      data: {
        id,
        ...body,
        modified: new Date().toISOString(),
        href: `https://sandbox.petefox.co.uk/api/credentials/${id}`
      }
    };
  }
  
  return {
    status: 200,
    data: { message: 'Updated successfully', body }
  };
}

// Mock DELETE request
export async function del(endpoint) {
  await delay(500);
  
  const [path] = endpoint.split('?');
  
  // Remove access group from cardholder
  if (path.match(/^\/api\/cardholders\/[^/]+\/access-groups\/[^/]+$/)) {
    const parts = path.split('/');
    const cardholderId = parts[3];
    const accessGroupId = parts[5];
    
    // Load cardholders from localStorage
    const cardholders = JSON.parse(localStorage.getItem('pacs-cardholders') || JSON.stringify(cardholdersData));
    const cardholder = cardholders.find(c => c.id === cardholderId);
    
    if (!cardholder) {
      return {
        status: 404,
        error: 'CardholderNotFoundException',
        message: `Cardholder with ID ${cardholderId} not found`
      };
    }
    
    if (!cardholder.access_groups || !cardholder.access_groups.includes(accessGroupId)) {
      return {
        status: 404,
        error: 'AccessGroupNotFoundException',
        message: `Cardholder does not have access group ${accessGroupId}`
      };
    }
    
    // Remove the access group
    cardholder.access_groups = cardholder.access_groups.filter(g => g !== accessGroupId);
    cardholder.modified = new Date().toISOString();
    
    // Save back to localStorage
    const index = cardholders.findIndex(c => c.id === cardholderId);
    cardholders[index] = cardholder;
    localStorage.setItem('pacs-cardholders', JSON.stringify(cardholders));
    
    console.log(`[API] Removed access group ${accessGroupId} from cardholder ${cardholderId}`);
    
    return {
      status: 204,
      data: null,
      message: 'Access group removed successfully'
    };
  }
  
  // Remove member from access group
  if (path.match(/^\/api\/access_groups\/[^/]+\/members\/[^/]+$/)) {
    const parts = path.split('/');
    const groupId = parts[3];
    const memberId = parts[5];
    
    const accessGroups = JSON.parse(localStorage.getItem('pacs-access-groups') || '[]');
    const group = accessGroups.find(g => g.id === groupId);
    
    if (!group) {
      return {
        status: 404,
        error: 'AccessGroupNotFoundException',
        message: `Access group with ID ${groupId} not found`
      };
    }
    
    if (!group.members || !group.members.includes(memberId)) {
      return {
        status: 404,
        error: 'MemberNotFoundException',
        message: `Member ${memberId} not found in access group`
      };
    }
    
    // Remove the member
    group.members = group.members.filter(m => m !== memberId);
    group.modified = new Date().toISOString();
    
    const index = accessGroups.findIndex(g => g.id === groupId);
    accessGroups[index] = group;
    localStorage.setItem('pacs-access-groups', JSON.stringify(accessGroups));
    
    return {
      status: 204,
      data: null,
      message: 'Member removed successfully'
    };
  }
  
  return {
    status: 204,
    data: null,
    message: 'Deleted successfully'
  };
}

// Endpoint definitions
export const endpoints = {
  // Gallagher-style PACS
  cardholders: '/api/cardholders',
  cardholderById: (id) => `/api/cardholders/${id}`,
  accessGroups: '/api/access_groups',
  accessGroupById: (id) => `/api/access_groups/${id}`,
  doors: '/api/doors',
  doorById: (id) => `/api/doors/${id}`,
  controllers: '/api/controllers',
  controllerById: (id) => `/api/controllers/${id}`,
  inputs: '/api/inputs',
  outputs: '/api/outputs',
  events: '/api/events',
  
  // Milestone XProtect
  cameras: '/api/cameras',
  cameraById: (id) => `/api/cameras/${id}`,
  recordings: '/api/recordings',
  bookmarks: '/api/bookmarks',
  
  // Axis VAPIX
  axisSnapshot: '/axis-cgi/jpg/image.cgi',
  axisParams: '/axis-cgi/param.cgi',
  axisEvents: '/axis-cgi/eventsub.cgi',
  
  // ONVIF
  onvifDevice: '/onvif/device_service',
  onvifMedia: '/onvif/media_service',
  onvifEvents: '/onvif/event_service'
};
