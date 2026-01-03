import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronRight } from 'lucide-react';
import StatusBadge from '../StatusBadge';
import './ResponseViewer.css';

export default function ResponseViewer({ response }) {
  const [activeTab, setActiveTab] = useState('body');
  const [copied, setCopied] = useState(false);
  const [formatted, setFormatted] = useState(true);
  const [expandedKeys, setExpandedKeys] = useState(new Set());

  const copyResponse = () => {
    const text = formatted 
      ? JSON.stringify(response.data, null, 2)
      : JSON.stringify(response.data);
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusType = (status) => {
    if (status >= 200 && status < 300) return 'success';
    if (status >= 400 && status < 500) return 'warning';
    if (status >= 500) return 'error';
    return 'info';
  };

  const toggleKey = (path) => {
    const newExpanded = new Set(expandedKeys);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedKeys(newExpanded);
  };

  const renderJSON = (data, path = '') => {
    if (data === null) return <span className="json-null">null</span>;
    if (data === undefined) return <span className="json-undefined">undefined</span>;
    
    const type = typeof data;
    
    if (type === 'boolean') {
      return <span className="json-boolean">{String(data)}</span>;
    }
    
    if (type === 'number') {
      return <span className="json-number">{data}</span>;
    }
    
    if (type === 'string') {
      return <span className="json-string">"{data}"</span>;
    }
    
    if (Array.isArray(data)) {
      const isExpanded = expandedKeys.has(path);
      
      if (data.length === 0) {
        return <span className="json-bracket">[]</span>;
      }
      
      return (
        <div className="json-array">
          <span 
            className="json-bracket json-collapsible"
            onClick={() => toggleKey(path)}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            [{data.length} items]
          </span>
          {isExpanded && (
            <div className="json-content">
              {data.map((item, index) => (
                <div key={index} className="json-item">
                  <span className="json-key">{index}:</span>
                  {renderJSON(item, `${path}[${index}]`)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    if (type === 'object') {
      const isExpanded = expandedKeys.has(path);
      const keys = Object.keys(data);
      
      if (keys.length === 0) {
        return <span className="json-bracket">{'{}'}</span>;
      }
      
      return (
        <div className="json-object">
          <span 
            className="json-bracket json-collapsible"
            onClick={() => toggleKey(path)}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            {'{'}...{'}'}
          </span>
          {isExpanded && (
            <div className="json-content">
              {keys.map((key) => (
                <div key={key} className="json-item">
                  <span className="json-key">"{key}":</span>
                  {renderJSON(data[key], `${path}.${key}`)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    return <span>{String(data)}</span>;
  };

  return (
    <div className="response-viewer">
      <div className="response-header">
        <div className="response-status">
          <StatusBadge 
            status={getStatusType(response.status)} 
            text={`${response.status} ${response.status >= 200 && response.status < 300 ? 'OK' : response.status >= 400 && response.status < 500 ? 'Client Error' : 'Server Error'}`}
            showIcon={true}
          />
          <span className="response-time">{response.responseTime}ms</span>
        </div>
        
        <div className="response-actions">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setFormatted(!formatted)}
          >
            {formatted ? 'Raw' : 'Formatted'}
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={copyResponse}
          >
            {copied ? (
              <>
                <Check size={16} />
                Copied
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      <div className="response-tabs">
        <button
          className={`response-tab ${activeTab === 'body' ? 'active' : ''}`}
          onClick={() => setActiveTab('body')}
        >
          Body
        </button>
        <button
          className={`response-tab ${activeTab === 'headers' ? 'active' : ''}`}
          onClick={() => setActiveTab('headers')}
        >
          Headers
        </button>
      </div>

      <div className="response-content">
        {activeTab === 'body' && (
          <div className="response-body">
            {response.error ? (
              <div className="response-error">
                <h4>Error</h4>
                <p>{response.error}</p>
              </div>
            ) : formatted ? (
              <div className="json-viewer">
                {renderJSON(response.data)}
              </div>
            ) : (
              <pre className="response-raw">
                {JSON.stringify(response.data, null, 2)}
              </pre>
            )}
          </div>
        )}

        {activeTab === 'headers' && (
          <div className="response-headers">
            {Object.entries(response.headers || {}).map(([key, value]) => (
              <div key={key} className="header-item">
                <span className="header-key">{key}:</span>
                <span className="header-value">{value}</span>
              </div>
            ))}
            {Object.keys(response.headers || {}).length === 0 && (
              <p className="empty-state">No headers available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
