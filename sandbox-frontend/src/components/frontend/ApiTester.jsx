import { useState, useEffect } from 'react';
import { Play, Loader, Copy, Check, Clock, History, Star, Trash2, Code } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import atomOneDark from 'react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark';
import atomOneLight from 'react-syntax-highlighter/dist/esm/styles/hljs/atom-one-light';
import ResponseViewer from './ResponseViewer';
import EndpointBrowser from './EndpointBrowser';
import RequestHistory from './RequestHistory';
import './ApiTester.css';
import * as apiClient from '../../utils/apiClient';

export default function ApiTester() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState([{ key: 'Content-Type', value: 'application/json', enabled: true }]);
  const [body, setBody] = useState('');
  const [authType, setAuthType] = useState('none');
  const [authValue, setAuthValue] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [responseTiming, setResponseTiming] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [requestHistory, setRequestHistory] = useState(() => {
    const stored = localStorage.getItem('api-request-history');
    return stored ? JSON.parse(stored) : [];
  });
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('api-console-favorites');
    return stored ? JSON.parse(stored) : [];
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [idDropdowns, setIdDropdowns] = useState({});
  const [showIdDropdown, setShowIdDropdown] = useState(null);

  // Detect theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      setIsDarkMode(localStorage.getItem('theme') === 'dark');
    };
    window.addEventListener('storage', handleThemeChange);
    return () => window.removeEventListener('storage', handleThemeChange);
  }, []);

  // Parse URL for ID placeholders
  useEffect(() => {
    const idMatches = url.match(/\{([a-zA-Z]+)\}/g) || [];
    const dropdowns = {};
    
    idMatches.forEach(match => {
      const key = match.replace(/[{}]/g, '');
      const dataKey = key.toLowerCase();
      
      if (!dropdowns[key]) {
        let data = [];
        try {
          if (dataKey.includes('cardholder')) {
            const cardholders = localStorage.getItem('pacs-cardholders');
            data = cardholders ? JSON.parse(cardholders).map(ch => ({
              id: ch.id,
              label: `${ch.firstName} ${ch.lastName}`
            })) : [];
          } else if (dataKey.includes('door')) {
            const doors = localStorage.getItem('pacs-doors');
            data = doors ? JSON.parse(doors).map(d => ({
              id: d.id,
              label: d.name
            })) : [];
          } else if (dataKey.includes('group') || dataKey.includes('access')) {
            const groups = localStorage.getItem('pacs-access-groups');
            data = groups ? JSON.parse(groups).map(g => ({
              id: g.id,
              label: g.name
            })) : [];
          }
        } catch (e) {
          console.error('Failed to load dropdown data:', e);
        }
        dropdowns[key] = data;
      }
    });
    setIdDropdowns(dropdowns);
  }, [url]);

  const handleEndpointSelect = (endpoint) => {
    setSelectedEndpoint(endpoint);
    setMethod(endpoint.method || 'GET');
    setUrl(endpoint.path || '');
    setBody(endpoint.exampleBody || '');
    setHeaders([{ key: 'Content-Type', value: 'application/json', enabled: true }]);
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

  // Feature 1: Copy as curl
  const copyAsCurl = () => {
    const enabledHeaders = headers.filter(h => h.enabled && h.key);
    let curlCmd = `curl -X ${method}`;
    
    enabledHeaders.forEach(h => {
      curlCmd += ` -H "${h.key}: ${h.value}"`;
    });
    
    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      curlCmd += ` -d '${body}'`;
    }
    
    curlCmd += ` "${url}"`;
    
    navigator.clipboard.writeText(curlCmd).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Feature 3: Add to history
  const addToHistory = (req, res) => {
    const entry = {
      id: Date.now(),
      method,
      url,
      body: body || null,
      timestamp: new Date().toISOString(),
      response: res,
      timing: responseTiming
    };
    
    const updated = [entry, ...requestHistory].slice(0, 20);
    setRequestHistory(updated);
    localStorage.setItem('api-request-history', JSON.stringify(updated));
  };

  // Feature 4: ID dropdown handler
  const fillIdFromDropdown = (key, id, label) => {
    setUrl(url.replace(`{${key}}`, id));
    setShowIdDropdown(null);
  };

  const executeRequest = async () => {
    if (!url) return;
    
    const startTime = performance.now();
    setLoading(true);
    
    try {
      const enabledHeaders = headers.filter(h => h.enabled && h.key);
      const headerObj = {};
      enabledHeaders.forEach(h => {
        headerObj[h.key] = h.value;
      });

      let result;
      
      if (method === 'GET') {
        result = await apiClient.get(url);
      } else if (method === 'POST') {
        result = await apiClient.post(url, body ? JSON.parse(body) : {});
      } else if (method === 'PATCH') {
        result = await apiClient.patch(url, body ? JSON.parse(body) : {});
      } else if (method === 'DELETE') {
        result = await apiClient.del(url);
      }

      const endTime = performance.now();
      const timing = Math.round(endTime - startTime);
      setResponseTiming(timing);
      setResponse(result);
      addToHistory({ method, url, body }, result);
    } catch (error) {
      const endTime = performance.now();
      const timing = Math.round(endTime - startTime);
      setResponseTiming(timing);
      setResponse({ error: error.message, status: 500 });
    } finally {
      setLoading(false);
    }
  };

  // Feature 3: Restore from history
  const restoreFromHistory = (entry) => {
    setMethod(entry.method);
    setUrl(entry.url);
    setBody(entry.body || '');
    setShowHistory(false);
  };

  // Feature 3: Toggle favorite
  const toggleFavorite = (entry) => {
    const isFav = favorites.some(f => f.id === entry.id);
    const updated = isFav 
      ? favorites.filter(f => f.id !== entry.id)
      : [...favorites, entry];
    setFavorites(updated);
    localStorage.setItem('api-console-favorites', JSON.stringify(updated));
  };

  const clearHistory = () => {
    if (confirm('Clear all request history?')) {
      setRequestHistory([]);
      localStorage.removeItem('api-request-history');
    }
  };

  // Feature 2: Timing color coding
  const getTimingColor = (ms) => {
    if (ms < 100) return 'timing-fast';
    if (ms < 500) return 'timing-medium';
    return 'timing-slow';
  };

  return (
    <div className="api-tester">
      <div className="api-container">
        <div className="api-layout">
          <EndpointBrowser onSelectEndpoint={handleEndpointSelect} />

          <div className="api-main">
            <div className="api-request-section">
              <h3>Request Builder</h3>
              
              <div className="request-method-url">
                <select 
                  value={method} 
                  onChange={(e) => setMethod(e.target.value)}
                  className="method-select"
                >
                  <option>GET</option>
                  <option>POST</option>
                  <option>PATCH</option>
                  <option>DELETE</option>
                </select>

                <div className="url-input-wrapper">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="/api/cardholders"
                    className="url-input"
                  />
                  {Object.entries(idDropdowns).some(([_, data]) => data.length > 0) && (
                    <div className="id-dropdowns">
                      {Object.entries(idDropdowns).map(([key, data]) => (
                        data.length > 0 && (
                          <div key={key} className="id-dropdown-wrapper">
                            <button
                              className="id-dropdown-btn"
                              onClick={() => setShowIdDropdown(showIdDropdown === key ? null : key)}
                            >
                              {key}
                            </button>
                            {showIdDropdown === key && (
                              <div className="id-dropdown-menu">
                                {data.map(item => (
                                  <button
                                    key={item.id}
                                    className="id-dropdown-item"
                                    onClick={() => fillIdFromDropdown(key, item.id, item.label)}
                                  >
                                    {item.id}: {item.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="request-headers">
                <label>Headers</label>
                {headers.map((header, index) => (
                  <div key={index} className="header-row">
                    <input
                      type="text"
                      placeholder="Key"
                      value={header.key}
                      onChange={(e) => updateHeader(index, 'key', e.target.value)}
                      className="header-key"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={header.value}
                      onChange={(e) => updateHeader(index, 'value', e.target.value)}
                      className="header-value"
                    />
                    <input
                      type="checkbox"
                      checked={header.enabled}
                      onChange={(e) => updateHeader(index, 'enabled', e.target.checked)}
                      className="header-enabled"
                    />
                    <button onClick={() => removeHeader(index)} className="header-remove">×</button>
                  </div>
                ))}
                <button onClick={addHeader} className="header-add">+ Add Header</button>
              </div>

              {['POST', 'PUT', 'PATCH'].includes(method) && (
                <div className="request-body">
                  <label>Body (JSON)</label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder='{"key": "value"}'
                    className="body-input"
                  />
                </div>
              )}

              <div className="request-actions">
                <button 
                  className="action-btn curl-btn"
                  onClick={copyAsCurl}
                  title="Copy as curl command"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? 'Copied!' : 'Copy Curl'}
                </button>

                <button 
                  className="action-btn history-btn"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  <History size={18} />
                  History ({requestHistory.length})
                </button>

                <button 
                  onClick={executeRequest} 
                  disabled={loading || !url}
                  className="action-btn submit-btn"
                >
                  {loading ? <Loader className="spinner" size={18} /> : <Play size={18} />}
                  {loading ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </div>

            {showHistory && (
              <div className="history-sidebar">
                <div className="history-header">
                  <h4>Request History</h4>
                  <button 
                    className="history-clear"
                    onClick={clearHistory}
                    title="Clear history"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="history-list">
                  {requestHistory.length === 0 ? (
                    <p className="history-empty">No requests yet</p>
                  ) : (
                    requestHistory.map(entry => (
                      <div key={entry.id} className="history-item">
                        <div className="history-item-header">
                          <span className="history-method">{entry.method}</span>
                          <button
                            className="history-favorite"
                            onClick={() => toggleFavorite(entry)}
                            title="Add to favorites"
                          >
                            <Star 
                              size={14} 
                              fill={favorites.some(f => f.id === entry.id) ? 'currentColor' : 'none'}
                            />
                          </button>
                        </div>
                        <p className="history-url">{entry.url}</p>
                        <p className="history-time">{new Date(entry.timestamp).toLocaleTimeString()}</p>
                        <button
                          className="history-restore"
                          onClick={() => restoreFromHistory(entry)}
                        >
                          Restore
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {response && (
              <div className="api-response-section">
                <div className="response-header">
                  <h3>Response</h3>
                  {responseTiming && (
                    <div className={`timing-badge ${getTimingColor(responseTiming)}`}>
                      <Clock size={16} />
                      {responseTiming}ms
                    </div>
                  )}
                </div>

                {typeof response === 'object' && response !== null && !response.error && (
                  <div className="response-highlight">
                    <SyntaxHighlighter 
                      language="json" 
                      style={isDarkMode ? atomOneDark : atomOneLight}
                      showLineNumbers
                      lineNumberStyle={{ color: 'var(--text-secondary)', marginRight: '12px' }}
                      customStyle={{
                        background: 'var(--bg-secondary)',
                        padding: '16px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        maxHeight: '400px',
                        overflow: 'auto'
                      }}
                      wrapLines
                    >
                      {JSON.stringify(response, null, 2)}
                    </SyntaxHighlighter>
                    <button 
                      className="response-copy"
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(response, null, 2));
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                    >
                      {copied ? 'Copied!' : 'Copy Response'}
                    </button>
                  </div>
                )}

                {response.error && (
                  <div className="response-error">
                    <p className="error-message">{response.error}</p>
                  </div>
                )}

                {typeof response !== 'object' && (
                  <pre className="response-raw">{String(response)}</pre>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
