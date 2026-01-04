import { useState, useEffect } from 'react';
import { getStorageUsage, clearCache } from '../../utils/dataManager';
import { VERSION_INFO } from '../../config/version';
import './SystemInfo.css';

export default function SystemInfo() {
  const [storage, setStorage] = useState(null);
  const [debugMode, setDebugMode] = useState({
    console: false,
    timing: false,
    apiLogging: false
  });
  const [clearingCache, setClearingCache] = useState(false);

  useEffect(() => {
    loadStorageInfo();
  }, []);

  const loadStorageInfo = () => {
    const storageInfo = getStorageUsage();
    setStorage(storageInfo);
  };

  const handleClearCache = () => {
    if (window.confirm('Are you sure you want to clear the cache? Event data will remain but other cached data will be removed.')) {
      setClearingCache(true);
      setTimeout(() => {
        clearCache();
        loadStorageInfo();
        setClearingCache(false);
        alert('Cache cleared successfully!');
      }, 500);
    }
  };

  const handlePerformanceTest = () => {
    const startTime = performance.now();
    
    // Simulate a query
    const events = JSON.parse(localStorage.getItem('pacs-events') || '[]');
    const recentEvents = events.slice(0, 1000);
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    alert(`Performance Test Results:\n\nQuery Time: ${duration.toFixed(2)}ms\nEvents Processed: ${recentEvents.length}\n\nStatus: ${duration < 100 ? 'Excellent' : duration < 300 ? 'Good' : 'Needs Optimization'}`);
  };

  return (
    <div className="system-info">
      <div className="settings-section">
        <h2>System Information</h2>
        
        <div className="info-grid">
          <div className="info-item">
            <div className="info-label">Platform Version</div>
            <div className="info-value">v{VERSION_INFO.version}</div>
          </div>
          
          <div className="info-item">
            <div className="info-label">Build</div>
            <div className="info-value">{VERSION_INFO.date}</div>
          </div>
          
          <div className="info-item">
            <div className="info-label">Environment</div>
            <div className="info-value">Development</div>
          </div>
          
          <div className="info-item">
            <div className="info-label">Browser</div>
            <div className="info-value">{navigator.userAgent.split(' ').slice(-1)[0]}</div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h2>Storage Usage</h2>
        
        {storage && (
          <>
            <div className="storage-details">
              <div className="storage-item">
                <span>Total Used:</span>
                <strong>{storage.used}</strong>
              </div>
              <div className="storage-item">
                <span>Storage Limit:</span>
                <strong>{storage.limit}</strong>
              </div>
              <div className="storage-item">
                <span>Usage:</span>
                <strong>{storage.percentage}%</strong>
              </div>
            </div>
            
            <div className="storage-bar">
              <div 
                className="storage-bar-fill"
                style={{ width: `${Math.min(storage.percentage, 100)}%` }}
              ></div>
            </div>
          </>
        )}
        
        <div className="storage-actions">
          <button 
            className="btn btn-secondary"
            onClick={handleClearCache}
            disabled={clearingCache}
          >
            {clearingCache ? 'Clearing...' : 'Clear Cache'}
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h2>Performance Metrics</h2>
        
        <div className="performance-grid">
          <div className="performance-item">
            <div className="performance-label">Event Query Speed</div>
            <div className="performance-value">~45ms</div>
            <div className="performance-status status-good">Excellent</div>
          </div>
          
          <div className="performance-item">
            <div className="performance-label">Page Load Time</div>
            <div className="performance-value">~1.2s</div>
            <div className="performance-status status-good">Good</div>
          </div>
          
          <div className="performance-item">
            <div className="performance-label">Memory Usage</div>
            <div className="performance-value">~87 MB</div>
            <div className="performance-status status-good">Normal</div>
          </div>
        </div>
        
        <div className="performance-actions">
          <button 
            className="btn btn-secondary"
            onClick={handlePerformanceTest}
          >
            Run Performance Test
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h2>Debug Mode</h2>
        <p className="section-description">
          Enable debugging features for development and troubleshooting
        </p>
        
        <div className="debug-options">
          <label className="debug-option">
            <input
              type="checkbox"
              checked={debugMode.console}
              onChange={(e) => setDebugMode({ ...debugMode, console: e.target.checked })}
            />
            <span>Enable console logging</span>
          </label>
          
          <label className="debug-option">
            <input
              type="checkbox"
              checked={debugMode.timing}
              onChange={(e) => setDebugMode({ ...debugMode, timing: e.target.checked })}
            />
            <span>Show query timings</span>
          </label>
          
          <label className="debug-option">
            <input
              type="checkbox"
              checked={debugMode.apiLogging}
              onChange={(e) => setDebugMode({ ...debugMode, apiLogging: e.target.checked })}
            />
            <span>Enable API request logging</span>
          </label>
        </div>
        
        <p className="debug-note">
          Note: Debug features are for development purposes only
        </p>
      </div>
    </div>
  );
}
