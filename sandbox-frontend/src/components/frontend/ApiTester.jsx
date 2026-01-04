import { useState } from 'react';
import { Play, Loader, Copy, Check } from 'lucide-react';
import ResponseViewer from './ResponseViewer';
import EndpointBrowser from './EndpointBrowser';
import RequestHistory from './RequestHistory';
import './ApiTester.css';
import * as apiClient from '../../utils/apiClient';

export default function ApiTester() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState([{ key: 'Content-Type', value: 'application/json', enabled: true }]);
  const [body, setBody] = useState('');
  const [authType, setAuthType] = useState('none');
  const [authValue, setAuthValue] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requestHistory, setRequestHistory] = useState(() => {
    const stored = localStorage.getItem('api-request-history');
    return stored ? JSON.parse(stored) : [];
  });

  const handleEndpointSelect = (endpoint) => {
    setSelectedEndpoint(endpoint);
    setMethod(endpoint.method);
    setBody(endpoint.exampleBody || '');
    
    // Set default headers based on method
    if (endpoint.method === 'GET') {
      setHeaders([{ key: 'Content-Type', value: 'application/json', enabled: true }]);
    } else {
      setHeaders([{ key: 'Content-Type', value: 'application/json', enabled: true }]);
    }
  };

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '', enabled: true }]);
  };

  const updateHeader = (index, field, value) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const removeHeader = (index) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const executeRequest = async () => {
    if (!selectedEndpoint) return;

    setLoading(true);
    const startTime = Date.now();

    try {
      let result;
      const endpoint = selectedEndpoint.path;
      
      // Build headers object
      const requestHeaders = {};
      headers.filter(h => h.enabled && h.key).forEach(h => {
        requestHeaders[h.key] = h.value;
      });

      // Add auth header if needed
      if (authType === 'bearer' && authValue) {
        requestHeaders['Authorization'] = `Bearer ${authValue}`;
      } else if (authType === 'basic' && authValue) {
        requestHeaders['Authorization'] = `Basic ${btoa(authValue)}`;
      } else if (authType === 'apikey' && authValue) {
        requestHeaders['X-API-Key'] = authValue;
      }

      // Execute request based on method
      if (method === 'GET') {
        result = await apiClient.get(endpoint);
      } else if (method === 'POST') {
        const parsedBody = body ? JSON.parse(body) : {};
        result = await apiClient.post(endpoint, parsedBody);
      } else if (method === 'PATCH') {
        const parsedBody = body ? JSON.parse(body) : {};
        result = await apiClient.patch(endpoint, parsedBody);
      } else if (method === 'DELETE') {
        result = await apiClient.del(endpoint);
      }

      const responseTime = Date.now() - startTime;
      
      const responseData = {
        status: result.status,
        data: result.data,
        headers: result.headers || {},
        responseTime,
        timestamp: new Date().toISOString()
      };

      setResponse(responseData);

      // Add to history
      const historyItem = {
        id: Date.now(),
        method,
        endpoint: endpoint,
        status: result.status,
        timestamp: new Date().toISOString(),
        responseTime
      };
      
      const newHistory = [historyItem, ...requestHistory].slice(0, 20);
      setRequestHistory(newHistory);
      localStorage.setItem('api-request-history', JSON.stringify(newHistory));

    } catch (error) {
      const responseTime = Date.now() - startTime;
      setResponse({
        status: 500,
        error: error.message,
        data: null,
        responseTime,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const replayRequest = (historyItem) => {
    // Find the endpoint from history
    const endpoint = {
      name: historyItem.endpoint,
      path: historyItem.endpoint,
      method: historyItem.method
    };
    setSelectedEndpoint(endpoint);
    setMethod(historyItem.method);
  };

  return (
    <div className="api-tester">
      <div className="api-tester-sidebar">
        <EndpointBrowser onSelect={handleEndpointSelect} />
      </div>

      <div className="api-tester-main">
        <div className="api-tester-header">
          <h1>API Testing Console</h1>
          <p>Test Gallagher, Milestone, Axis, and ONVIF API endpoints</p>
        </div>

        {/* Request Configuration */}
        <div className="request-panel">
          <div className="request-line">
            <select 
              className="method-selector"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>
            
            <input
              type="text"
              className="endpoint-input"
              value={selectedEndpoint?.path || ''}
              placeholder="Select an endpoint from the sidebar"
              readOnly
            />
            
            <button
              className="btn btn-primary try-button"
              onClick={executeRequest}
              disabled={!selectedEndpoint || loading}
            >
              {loading ? (
                <>
                  <Loader size={20} className="spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play size={20} />
                  Try It
                </>
              )}
            </button>
          </div>

          {/* Headers Section */}
          <div className="request-section">
            <h3>Headers</h3>
            <div className="headers-editor">
              {headers.map((header, index) => (
                <div key={index} className="header-row">
                  <input
                    type="checkbox"
                    checked={header.enabled}
                    onChange={(e) => updateHeader(index, 'enabled', e.target.checked)}
                  />
                  <input
                    type="text"
                    placeholder="Header name"
                    value={header.key}
                    onChange={(e) => updateHeader(index, 'key', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={header.value}
                    onChange={(e) => updateHeader(index, 'value', e.target.value)}
                  />
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => removeHeader(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button className="btn btn-ghost btn-sm" onClick={addHeader}>
                + Add Header
              </button>
            </div>
          </div>

          {/* Body Section (for POST/PATCH) */}
          {(method === 'POST' || method === 'PATCH') && (
            <div className="request-section">
              <h3>Body</h3>
              <textarea
                className="body-editor"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder='{"key": "value"}'
                rows={10}
              />
            </div>
          )}

          {/* Auth Section */}
          <div className="request-section">
            <h3>Authentication</h3>
            <div className="auth-section">
              <select
                value={authType}
                onChange={(e) => setAuthType(e.target.value)}
              >
                <option value="none">No Auth</option>
                <option value="bearer">Bearer Token</option>
                <option value="basic">Basic Auth</option>
                <option value="apikey">API Key</option>
              </select>
              
              {authType !== 'none' && (
                <input
                  type="text"
                  placeholder={
                    authType === 'bearer' ? 'Token' :
                    authType === 'basic' ? 'username:password' :
                    'API Key'
                  }
                  value={authValue}
                  onChange={(e) => setAuthValue(e.target.value)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Response Panel */}
        {response && <ResponseViewer response={response} />}
      </div>

      <div className="api-tester-history">
        <RequestHistory 
          history={requestHistory}
          onReplay={replayRequest}
          onClear={() => {
            setRequestHistory([]);
            localStorage.removeItem('api-request-history');
          }}
        />
      </div>
    </div>
  );
}
