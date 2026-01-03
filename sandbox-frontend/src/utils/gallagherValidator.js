/**
 * Gallagher API Response Validator
 * Ensures responses match official Gallagher API structure
 */

export function validateCardholderResponse(data) {
  const required = ['id', 'href', 'firstName', 'lastName', 'name', 'serverDisplayName', 'created', 'modified'];
  const missing = required.filter(field => !(field in data));
  
  if (missing.length > 0) {
    return {
      valid: false,
      errors: [`Missing required fields: ${missing.join(', ')}`]
    };
  }
  
  // Validate href format
  if (!data.href.startsWith('https://localhost:8904/api/cardholders/')) {
    return {
      valid: false,
      errors: ['Invalid href format']
    };
  }
  
  // Validate credentials structure
  if (data.credentials && !Array.isArray(data.credentials)) {
    return {
      valid: false,
      errors: ['Credentials must be an array']
    };
  }
  
  return { valid: true, errors: [] };
}

export function validateAccessGroupResponse(data) {
  const required = ['id', 'href', 'name', 'serverDisplayName', 'created', 'modified'];
  const missing = required.filter(field => !(field in data));
  
  if (missing.length > 0) {
    return {
      valid: false,
      errors: [`Missing required fields: ${missing.join(', ')}`]
    };
  }
  
  return { valid: true, errors: [] };
}

export function validateDoorResponse(data) {
  const required = ['id', 'href', 'name', 'serverDisplayName', 'mode', 'readers', 'created', 'modified'];
  const missing = required.filter(field => !(field in data));
  
  if (missing.length > 0) {
    return {
      valid: false,
      errors: [`Missing required fields: ${missing.join(', ')}`]
    };
  }
  
  // Validate readers array
  if (!Array.isArray(data.readers)) {
    return {
      valid: false,
      errors: ['Readers must be an array']
    };
  }
  
  return { valid: true, errors: [] };
}

export function validateEventResponse(data) {
  const required = ['id', 'time', 'type', 'priority', 'serverDisplayName'];
  const missing = required.filter(field => !(field in data));
  
  if (missing.length > 0) {
    return {
      valid: false,
      errors: [`Missing required fields: ${missing.join(', ')}`]
    };
  }
  
  // Validate type structure
  if (!data.type || !data.type.id || !data.type.name) {
    return {
      valid: false,
      errors: ['Event type must have id and name']
    };
  }
  
  return { valid: true, errors: [] };
}

export function validatePaginatedResponse(data) {
  const required = ['results', 'href'];
  const missing = required.filter(field => !(field in data));
  
  if (missing.length > 0) {
    return {
      valid: false,
      errors: [`Missing required fields: ${missing.join(', ')}`]
    };
  }
  
  if (!Array.isArray(data.results)) {
    return {
      valid: false,
      errors: ['Results must be an array']
    };
  }
  
  return { valid: true, errors: [] };
}

export default {
  validateCardholderResponse,
  validateAccessGroupResponse,
  validateDoorResponse,
  validateEventResponse,
  validatePaginatedResponse
};
