// Track API calls made during workflow execution

const TRACKER_KEY = 'workflow-api-calls';

export function initializeWorkflowTracker(workflowId) {
  sessionStorage.setItem(TRACKER_KEY, JSON.stringify([]));
}

export function trackApiCall(method, endpoint, data = null) {
  try {
    const calls = JSON.parse(sessionStorage.getItem(TRACKER_KEY) || '[]');
    calls.push({
      method,
      endpoint,
      data,
      timestamp: new Date().toISOString()
    });
    sessionStorage.setItem(TRACKER_KEY, JSON.stringify(calls));
  } catch (error) {
    console.error('Failed to track API call:', error);
  }
}

export function getTrackedApiCalls() {
  try {
    return JSON.parse(sessionStorage.getItem(TRACKER_KEY) || '[]');
  } catch (error) {
    console.error('Failed to get tracked API calls:', error);
    return [];
  }
}

export function clearTrackedApiCalls() {
  sessionStorage.removeItem(TRACKER_KEY);
}

// Convert tracked calls to displayable format
export function formatTrackedCalls(calls) {
  return calls.map(call => ({
    method: call.method,
    endpoint: call.endpoint,
    description: `${call.method} ${call.endpoint}`,
    data: call.data,
    curl: generateCurl(call.method, call.endpoint, call.data),
    code: {
      javascript: generateJavaScript(call.method, call.endpoint, call.data),
      python: generatePython(call.method, call.endpoint, call.data)
    }
  }));
}

function generateCurl(method, endpoint, data) {
  let cmd = `curl -X ${method} http://localhost:3000${endpoint}`;
  if (data && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
    cmd += ` \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(data)}'`;
  }
  return cmd;
}

function generateJavaScript(method, endpoint, data) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  
  if (data && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
    options.body = `JSON.stringify(${JSON.stringify(data)})`;
  }
  
  return `const response = await fetch('${endpoint}', ${JSON.stringify(options, null, 2)});
const result = await response.json();`;
}

function generatePython(method, endpoint, data) {
  if (method === 'GET') {
    return `import requests

response = requests.get('http://localhost:3000${endpoint}')
result = response.json()`;
  } else {
    return `import requests

response = requests.${method.toLowerCase()}('http://localhost:3000${endpoint}', json=${JSON.stringify(data)})
result = response.json()`;
  }
}
