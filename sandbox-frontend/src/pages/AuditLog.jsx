import { useState, useEffect } from 'react';
import { Download, Trash2, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { getLogEntries, clearLogEntries, exportLogEntries, filterLogEntries } from '../utils/apiLogger';
import './AuditLog.css';

export default function AuditLog() {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [filters, setFilters] = useState({
    method: 'all',
    statusMin: '',
    statusMax: '',
    search: ''
  });

  useEffect(() => {
    loadEntries();
    
    // Auto-refresh every 2 seconds
    const interval = setInterval(loadEntries, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [entries, filters]);

  const loadEntries = () => {
    const logs = getLogEntries();
    setEntries(logs);
  };

  const applyFilters = () => {
    const filtered = filterLogEntries(entries, filters);
    setFilteredEntries(filtered);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all audit log entries? This cannot be undone.')) {
      clearLogEntries();
      loadEntries();
      setExpandedId(null);
    }
  };

  const handleExport = () => {
    exportLogEntries();
  };

  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'status-success';
    if (status >= 400 && status < 500) return 'status-warning';
    if (status >= 500) return 'status-error';
    if (status === 0) return 'status-error';
    return 'status-info';
  };

  const getMethodColor = (method) => {
    const colors = {
      'GET': 'method-get',
      'POST': 'method-post',
      'PUT': 'method-put',
      'PATCH': 'method-patch',
      'DELETE': 'method-delete'
    };
    return colors[method] || 'method-default';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString() + '.' + date.getMilliseconds().toString().padStart(3, '0');
  };

  const formatJSON = (str) => {
    try {
      const obj = typeof str === 'string' ? JSON.parse(str) : str;
      return JSON.stringify(obj, null, 2);
    } catch (e) {
      return str;
    }
  };

  return (
    <div className="audit-log-page">
      <div className="audit-log-header">
        <div className="header-content">
          <h1>API Audit Log</h1>
          <p className="subtitle">Track all API calls made during this session</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleExport}>
            <Download size={18} />
            Export
          </button>
          <button className="btn btn-danger" onClick={handleClear}>
            <Trash2 size={18} />
            Clear
          </button>
        </div>
      </div>

      <div className="audit-log-filters">
        <div className="filter-group">
          <Filter size={18} />
          <select 
            value={filters.method} 
            onChange={(e) => setFilters({ ...filters, method: e.target.value })}
            className="filter-select"
          >
            <option value="all">All Methods</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        <div className="filter-group">
          <span className="filter-label">Status:</span>
          <input
            type="number"
            placeholder="Min"
            value={filters.statusMin}
            onChange={(e) => setFilters({ ...filters, statusMin: e.target.value })}
            className="filter-input-small"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.statusMax}
            onChange={(e) => setFilters({ ...filters, statusMax: e.target.value })}
            className="filter-input-small"
          />
        </div>

        <div className="filter-group search-group">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search endpoints..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="filter-input"
          />
        </div>

        <div className="filter-stats">
          Showing {filteredEntries.length} of {entries.length} entries
        </div>
      </div>

      <div className="audit-log-content">
        {filteredEntries.length === 0 ? (
          <div className="audit-log-empty">
            <div className="empty-icon">📋</div>
            <h3>No API calls logged yet</h3>
            <p>Make some API calls to see them appear here. The log tracks all requests made during this session.</p>
          </div>
        ) : (
          <div className="audit-log-table">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '50px' }}></th>
                  <th style={{ width: '100px' }}>Time</th>
                  <th style={{ width: '80px' }}>Method</th>
                  <th>Endpoint</th>
                  <th style={{ width: '80px' }}>Status</th>
                  <th style={{ width: '100px' }}>Time (ms)</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry) => (
                  <>
                    <tr 
                      key={entry.id} 
                      className={`audit-row ${expandedId === entry.id ? 'expanded' : ''}`}
                      onClick={() => toggleExpanded(entry.id)}
                    >
                      <td className="expand-cell">
                        {expandedId === entry.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </td>
                      <td className="time-cell">{formatTimestamp(entry.timestamp)}</td>
                      <td>
                        <span className={`method-badge ${getMethodColor(entry.method)}`}>
                          {entry.method}
                        </span>
                      </td>
                      <td className="endpoint-cell">{entry.endpoint}</td>
                      <td>
                        <span className={`status-badge ${getStatusColor(entry.statusCode)}`}>
                          {entry.statusCode || 'ERR'}
                        </span>
                      </td>
                      <td className="time-value">{entry.responseTime}ms</td>
                    </tr>
                    {expandedId === entry.id && (
                      <tr className="detail-row">
                        <td colSpan="6">
                          <div className="detail-content">
                            <div className="detail-section">
                              <h4>Request Headers</h4>
                              <pre>{formatJSON(entry.requestHeaders)}</pre>
                            </div>
                            
                            {entry.requestBody && (
                              <div className="detail-section">
                                <h4>Request Body</h4>
                                <pre>{formatJSON(entry.requestBody)}</pre>
                              </div>
                            )}
                            
                            <div className="detail-section">
                              <h4>Response Preview</h4>
                              <pre>{entry.responsePreview}</pre>
                            </div>
                            
                            {entry.responseBody && (
                              <div className="detail-section">
                                <h4>Full Response</h4>
                                <pre className="response-body">{formatJSON(entry.responseBody)}</pre>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
