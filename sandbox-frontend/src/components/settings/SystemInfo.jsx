import { useState, useEffect } from 'react';
import { Server, CheckCircle, AlertCircle, Download, Upload, RefreshCw, Clock } from 'lucide-react';
import * as apiClient from '../../utils/apiClient';
import './SystemInfo.css';

export default function SystemInfo() {
  const [health, setHealth] = useState(null);
  const [testing, setTesting] = useState(false);
  const [lastTestTime, setLastTestTime] = useState(null);
  const [errorCount, setErrorCount] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState('good');
  const [showImportPreview, setShowImportPreview] = useState(false);
  const [importData, setImportData] = useState(null);

  // Auto-test on load and every 30 seconds
  useEffect(() => {
    testConnection();
    const interval = setInterval(testConnection, 30000);
    
    // Load error count from localStorage
    const savedErrors = localStorage.getItem('api-error-count-24h');
    if (savedErrors) {
      setErrorCount(parseInt(savedErrors));
    }

    return () => clearInterval(interval);
  }, []);

  const testConnection = async () => {
    setTesting(true);
    const startTime = performance.now();
    
    try {
      const result = await apiClient.get('/api/health');
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      
      setHealth(result);
      setLastTestTime(new Date());
      
      // Determine connection quality based on response time
      if (duration < 100) {
        setConnectionQuality('excellent');
      } else if (duration < 300) {
        setConnectionQuality('good');
      } else if (duration < 700) {
        setConnectionQuality('slow');
      } else {
        setConnectionQuality('poor');
      }
    } catch (error) {
      setHealth(null);
      setConnectionQuality('offline');
      
      // Track errors
      const newErrorCount = errorCount + 1;
      setErrorCount(newErrorCount);
      localStorage.setItem('api-error-count-24h', newErrorCount.toString());
    } finally {
      setTesting(false);
    }
  };

  const exportSettings = () => {
    const settings = {
      theme: localStorage.getItem('theme'),
      'api-console-history': JSON.parse(localStorage.getItem('api-console-history') || '[]'),
      'api-console-favorites': JSON.parse(localStorage.getItem('api-console-favorites') || '[]'),
      'workflow-completed': JSON.parse(localStorage.getItem('completedWorkflows') || '[]'),
      'pacs-cardholders': JSON.parse(localStorage.getItem('pacs-cardholders') || '[]'),
      'pacs-doors': JSON.parse(localStorage.getItem('pacs-doors') || '[]'),
      'pacs-access-groups': JSON.parse(localStorage.getItem('pacs-access-groups') || '[]'),
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sandbox-settings-${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result);
        setImportData(imported);
        setShowImportPreview(true);
      } catch (error) {
        alert('Invalid settings file. Please check the format.');
      }
    };
    reader.readAsText(file);
  };

  const confirmImport = (merge) => {
    if (!importData) return;

    if (merge) {
      // Merge with existing
      Object.keys(importData).forEach(key => {
        if (key !== 'exportDate') {
          if (typeof importData[key] === 'object' && !Array.isArray(importData[key])) {
            const existing = JSON.parse(localStorage.getItem(key) || '{}');
            localStorage.setItem(key, JSON.stringify({ ...existing, ...importData[key] }));
          } else {
            localStorage.setItem(key, JSON.stringify(importData[key]));
          }
        }
      });
    } else {
      // Replace all
      Object.keys(importData).forEach(key => {
        if (key !== 'exportDate') {
          localStorage.setItem(key, JSON.stringify(importData[key]));
        }
      });
    }

    setImportData(null);
    setShowImportPreview(false);
    alert('Settings imported successfully. Please refresh the page.');
  };

  const getConnectionBadgeColor = () => {
    switch (connectionQuality) {
      case 'excellent':
        return '#10b981';
      case 'good':
        return '#3b82f6';
      case 'slow':
        return '#f59e0b';
      case 'poor':
      case 'offline':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getLastSyncTime = () => {
    if (!lastTestTime) return 'Never';
    const now = new Date();
    const diff = Math.round((now - lastTestTime) / 1000);
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.round(diff / 60)} minutes ago`;
    return lastTestTime.toLocaleTimeString();
  };

  return (
    <div className="system-info">
      {/* Connection Testing */}
      <section className="info-section">
        <h2>Connection Status</h2>
        
        <div className="test-button-group">
          <button 
            className="test-btn"
            onClick={testConnection}
            disabled={testing}
          >
            {testing ? (
              <>
                <RefreshCw size={16} className="spinner" />
                Testing...
              </>
            ) : (
              <>
                <Server size={16} />
                Test Connection
              </>
            )}
          </button>
        </div>

        {health && (
          <div className="connection-status">
            <div className="status-item">
              <div className="status-header">
                <CheckCircle size={20} style={{ color: '#10b981' }} />
                <span className="status-label">API Status</span>
              </div>
              <p className="status-value">✓ Online</p>
            </div>

            <div className="status-item">
              <div className="status-header">
                <Clock size={20} style={{ color: '#3b82f6' }} />
                <span className="status-label">Last Sync</span>
              </div>
              <p className="status-value">{getLastSyncTime()}</p>
            </div>

            <div className="status-item">
              <div className="status-header">
                <span className="quality-label">Connection Quality</span>
              </div>
              <div className="quality-bar">
                <div 
                  className={`quality-fill ${connectionQuality}`}
                  style={{ background: getConnectionBadgeColor() }}
                ></div>
              </div>
              <p className="quality-text">{connectionQuality.toUpperCase()}</p>
            </div>

            <div className="status-item">
              <div className="status-header">
                <AlertCircle size={20} style={{ color: errorCount > 10 ? '#ef4444' : '#f59e0b' }} />
                <span className="status-label">Errors (24h)</span>
              </div>
              <p className={`status-value ${errorCount > 10 ? 'warning' : ''}`}>
                {errorCount} {errorCount > 10 ? '⚠️ High' : ''}
              </p>
            </div>
          </div>
        )}

        {!health && (
          <div className="offline-message">
            <AlertCircle size={24} />
            <p>API is offline. Click "Test Connection" to check status.</p>
          </div>
        )}
      </section>

      {/* Export/Import Settings */}
      <section className="info-section">
        <h2>Settings Management</h2>
        
        <div className="export-import-grid">
          <div className="export-card">
            <h3>Export Settings</h3>
            <p>Download all settings as JSON file</p>
            <button className="action-btn export-btn" onClick={exportSettings}>
              <Download size={18} />
              Export Settings
            </button>
          </div>

          <div className="import-card">
            <h3>Import Settings</h3>
            <p>Load settings from saved file</p>
            <label htmlFor="import-file" className="action-btn import-btn">
              <Upload size={18} />
              Choose File
            </label>
            <input
              id="import-file"
              type="file"
              accept=".json"
              onChange={handleImportFile}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </section>

      {/* Import Preview Modal */}
      {showImportPreview && importData && (
        <div className="import-modal-overlay" onClick={() => setShowImportPreview(false)}>
          <div className="import-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Import Settings Preview</h3>
            <div className="import-preview">
              <p><strong>Export Date:</strong> {importData.exportDate || 'N/A'}</p>
              <p><strong>Theme:</strong> {importData.theme || 'Not set'}</p>
              <p><strong>API History Entries:</strong> {importData['api-console-history']?.length || 0}</p>
              <p><strong>Favorites:</strong> {importData['api-console-favorites']?.length || 0}</p>
              <p><strong>Cardholders:</strong> {importData['pacs-cardholders']?.length || 0}</p>
              <p><strong>Doors:</strong> {importData['pacs-doors']?.length || 0}</p>
              <p><strong>Access Groups:</strong> {importData['pacs-access-groups']?.length || 0}</p>
            </div>
            <div className="import-options">
              <button 
                className="modal-btn merge-btn"
                onClick={() => confirmImport(true)}
              >
                Merge with Existing
              </button>
              <button 
                className="modal-btn replace-btn"
                onClick={() => confirmImport(false)}
              >
                Replace All Settings
              </button>
              <button 
                className="modal-btn cancel-btn"
                onClick={() => setShowImportPreview(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* System Info */}
      <section className="info-section">
        <h2>System Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Application</span>
            <span className="info-value">Physical Security Sandbox</span>
          </div>
          <div className="info-item">
            <span className="info-label">Version</span>
            <span className="info-value">1.0.0</span>
          </div>
          <div className="info-item">
            <span className="info-label">Build Date</span>
            <span className="info-value">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Storage Used</span>
            <span className="info-value">{(Object.keys(localStorage).length)} keys</span>
          </div>
        </div>
      </section>
    </div>
  );
}
