// Mock API Client - Simulates API endpoints

import cardholdersData from '../mock-data/cardholders.json';
import accessGroupsData from '../mock-data/access-groups.json';
import doorsData from '../mock-data/doors.json';
import controllersData from '../mock-data/controllers.json';
import inputsData from '../mock-data/inputs.json';
import outputsData from '../mock-data/outputs.json';
import camerasData from '../mock-data/cameras.json';

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

// Mock GET request
export async function get(endpoint, params = {}) {
  await delay(300);
  
  const [path, queryString] = endpoint.split('?');
  const queryParams = { ...params, ...parseQueryParams(queryString) };
  
  // Cardholders
  if (path === '/api/cardholders') {
    return {
      status: 200,
      data: cardholdersData,
      headers: { 'content-type': 'application/json' }
    };
  }
  
  if (path.match(/^\/api\/cardholders\/[^/]+$/)) {
    const id = path.split('/').pop();
    const cardholder = cardholdersData.find(c => c.id === id);
    if (cardholder) {
      return { status: 200, data: cardholder };
    }
    return { status: 404, error: 'Cardholder not found' };
  }
  
  // Access Groups
  if (path === '/api/access_groups') {
    return {
      status: 200,
      data: accessGroupsData,
      headers: { 'content-type': 'application/json' }
    };
  }
  
  if (path.match(/^\/api\/access_groups\/[^/]+$/)) {
    const id = path.split('/').pop();
    const group = accessGroupsData.find(g => g.id === id);
    if (group) {
      return { status: 200, data: group };
    }
    return { status: 404, error: 'Access group not found' };
  }
  
  // Doors
  if (path === '/api/doors') {
    return {
      status: 200,
      data: doorsData,
      headers: { 'content-type': 'application/json' }
    };
  }
  
  if (path.match(/^\/api\/doors\/[^/]+$/)) {
    const id = path.split('/').pop();
    const door = doorsData.find(d => d.id === id);
    if (door) {
      return { status: 200, data: door };
    }
    return { status: 404, error: 'Door not found' };
  }
  
  // Controllers
  if (path === '/api/controllers') {
    return {
      status: 200,
      data: controllersData,
      headers: { 'content-type': 'application/json' }
    };
  }
  
  if (path.match(/^\/api\/controllers\/[^/]+$/)) {
    const id = path.split('/').pop();
    const controller = controllersData.find(c => c.id === id);
    if (controller) {
      return { status: 200, data: controller };
    }
    return { status: 404, error: 'Controller not found' };
  }
  
  // Inputs
  if (path === '/api/inputs') {
    return {
      status: 200,
      data: inputsData,
      headers: { 'content-type': 'application/json' }
    };
  }
  
  // Outputs
  if (path === '/api/outputs') {
    return {
      status: 200,
      data: outputsData,
      headers: { 'content-type': 'application/json' }
    };
  }
  
  // Events
  if (path === '/api/events') {
    const events = JSON.parse(localStorage.getItem('pacs-events') || '[]');
    
    // Apply filters from query params
    let filtered = events;
    
    if (queryParams.start_date) {
      const startDate = new Date(queryParams.start_date);
      filtered = filtered.filter(e => new Date(e.timestamp) >= startDate);
    }
    
    if (queryParams.end_date) {
      const endDate = new Date(queryParams.end_date);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(e => new Date(e.timestamp) <= endDate);
    }
    
    if (queryParams.type) {
      filtered = filtered.filter(e => e.event_type === queryParams.type);
    }
    
    if (queryParams.door_id) {
      filtered = filtered.filter(e => e.door_id === queryParams.door_id);
    }
    
    if (queryParams.cardholder_id) {
      filtered = filtered.filter(e => e.cardholder_id === queryParams.cardholder_id);
    }
    
    // Apply limit
    const limit = parseInt(queryParams.limit) || filtered.length;
    filtered = filtered.slice(0, limit);
    
    return {
      status: 200,
      data: filtered,
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
  return {
    status: 404,
    error: 'Endpoint not found',
    message: `No mock data available for ${endpoint}`
  };
}

// Mock POST request
export async function post(endpoint, body = {}) {
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
  
  return {
    status: 201,
    data: { message: 'Created successfully', body }
  };
}

// Mock PATCH request
export async function patch(endpoint, body = {}) {
  await delay(500);
  
  const [path] = endpoint.split('?');
  
  if (path.match(/^\/api\/cardholders\/[^/]+$/)) {
    const id = path.split('/').pop();
    return {
      status: 200,
      data: {
        id: id,
        ...body,
        updated_at: new Date().toISOString()
      }
    };
  }
  
  if (path.match(/^\/api\/doors\/[^/]+$/)) {
    const id = path.split('/').pop();
    return {
      status: 200,
      data: {
        id: id,
        ...body,
        updated_at: new Date().toISOString()
      }
    };
  }
  
  return {
    status: 200,
    data: { message: 'Updated successfully', body }
  };
}

// Mock DELETE request
export async function del() {
  await delay(500);
  
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
