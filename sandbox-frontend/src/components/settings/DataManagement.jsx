import { useState, useEffect } from 'react';
import { AlertTriangle, Download, Upload, RefreshCw } from 'lucide-react';
import { getDataStats, getEntityStats, regenerateEvents, exportData, exportEntityData, resetToDefaults, formatTimeAgo } from '../../utils/dataManager';
import './DataManagement.css';

export default function DataManagement() {
  const [dataStats, setDataStats] = useState(null);
  const [entityStats, setEntityStats] = useState(null);
  const [regenerating, setRegenerating] = useState(false);
  
  // Event configuration state
  const [eventConfig, setEventConfig] = useState({
    startDate: '2024-07-01',
    endDate: '2024-12-31',
    volume: 'medium',
    distribution: {
      access_granted: 60,
      access_denied: 15,
      door_events: 10,
      alarms: 8,
      faults: 5,
      system: 2
    }
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    setDataStats(getDataStats());
    setEntityStats(getEntityStats());
  };

  const handleDistributionChange = (key, value) => {
    setEventConfig({
      ...eventConfig,
      distribution: {
        ...eventConfig.distribution,
        [key]: parseInt(value) || 0
      }
    });
  };

  const getTotalDistribution = () => {
    return Object.values(eventConfig.distribution).reduce((sum, val) => sum + val, 0);
  };

  const handleRegenerateEvents = () => {
    const total = getTotalDistribution();
    if (total !== 100) {
      alert(`Distribution must equal 100%. Current total: ${total}%`);
      return;
    }

    if (window.confirm('⚠️ This will replace all existing event data. Continue?')) {
      setRegenerating(true);
      setTimeout(() => {
        try {
          regenerateEvents(eventConfig);
          loadStats();
          alert('Events regenerated successfully!');
        } catch (error) {
          alert('Error regenerating events: ' + error.message);
        }
        setRegenerating(false);
      }, 1000);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('⚠️ This will reset all data to factory defaults. Continue?')) {
      setRegenerating(true);
      setTimeout(() => {
        try {
          resetToDefaults();
          loadStats();
          alert('Data reset to defaults successfully!');
        } catch (error) {
          alert('Error resetting data: ' + error.message);
        }
        setRegenerating(false);
      }, 1000);
    }
  };

  const handleExportEntity = (entityType) => {
    exportEntityData(entityType);
  };

  const handleExportAll = () => {
    exportData(['all']);
  };

  const volumeOptions = [
    { value: 'light', label: 'Light', count: '~5,000 events' },
    { value: 'medium', label: 'Medium', count: '~25,000 events' },
    { value: 'heavy', label: 'Heavy', count: '~50,000 events' },
    { value: 'extreme', label: 'Extreme', count: '~100,000 events' }
  ];

  const entityCards = [
    { name: 'Cardholders', key: 'cardholders' },
    { name: 'Access Groups', key: 'accessGroups' },
    { name: 'Doors', key: 'doors' },
    { name: 'Controllers', key: 'controllers' },
    { name: 'Inputs', key: 'inputs' },
    { name: 'Outputs', key: 'outputs' },
    { name: 'Cameras', key: 'cameras' },
    { name: 'Operator Groups', key: 'operatorGroups' }
  ];

  return (
    <div className="data-management">
      <div className="settings-section">
        <h2>Event Data Generator</h2>
        
        <div className="config-group">
          <label className="config-label">Date Range</label>
          <div className="date-inputs">
            <div className="date-input-group">
              <label>Start Date</label>
              <input
                type="date"
                value={eventConfig.startDate}
                onChange={(e) => setEventConfig({ ...eventConfig, startDate: e.target.value })}
              />
            </div>
            <div className="date-input-group">
              <label>End Date</label>
              <input
                type="date"
                value={eventConfig.endDate}
                onChange={(e) => setEventConfig({ ...eventConfig, endDate: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="config-group">
          <label className="config-label">Event Volume</label>
          <div className="volume-options">
            {volumeOptions.map(option => (
              <label key={option.value} className="volume-option">
                <input
                  type="radio"
                  name="volume"
                  value={option.value}
                  checked={eventConfig.volume === option.value}
                  onChange={(e) => setEventConfig({ ...eventConfig, volume: e.target.value })}
                />
                <span className="volume-label">
                  <strong>{option.label}</strong>
                  <span className="volume-count">{option.count}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="config-group">
          <label className="config-label">Event Distribution</label>
          <div className="distribution-sliders">
            {Object.entries(eventConfig.distribution).map(([key, value]) => (
              <div key={key} className="slider-group">
                <div className="slider-header">
                  <label>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
                  <span className="slider-value">{value}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => handleDistributionChange(key, e.target.value)}
                  className="slider"
                  style={{
                    background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${value}%, var(--color-background) ${value}%, var(--color-background) 100%)`
                  }}
                />
              </div>
            ))}
            <div className={`distribution-total ${getTotalDistribution() === 100 ? 'valid' : 'invalid'}`}>
              Total: {getTotalDistribution()}%
              {getTotalDistribution() !== 100 && ' (must equal 100%)'}
            </div>
          </div>
        </div>

        {dataStats && (
          <div className="current-stats">
            <h4>Current Data</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <span>Events:</span>
                <strong>{dataStats.eventCount.toLocaleString()}</strong>
              </div>
              {dataStats.dateRange && (
                <div className="stat-item">
                  <span>Range:</span>
                  <strong>
                    {dataStats.dateRange.start.toLocaleDateString()} - {dataStats.dateRange.end.toLocaleDateString()}
                  </strong>
                </div>
              )}
              <div className="stat-item">
                <span>Last Generated:</span>
                <strong>{formatTimeAgo(dataStats.generatedAt)}</strong>
              </div>
              <div className="stat-item">
                <span>Storage:</span>
                <strong>{dataStats.eventsSize}</strong>
              </div>
            </div>
          </div>
        )}

        <button 
          className="btn btn-primary btn-large btn-regenerate"
          onClick={handleRegenerateEvents}
          disabled={regenerating}
        >
          <AlertTriangle size={20} />
          {regenerating ? 'Regenerating...' : 'Regenerate Events'}
        </button>
      </div>

      <div className="settings-section">
        <h2>Core Data Sets</h2>
        <div className="entity-grid">
          {entityCards.map(entity => (
            <div key={entity.key} className="entity-card">
              <h4>{entity.name}</h4>
              <div className="entity-count">
                {entityStats?.[entity.key]?.count || 0} records
              </div>
              <div className="entity-updated">
                Updated: {entityStats?.[entity.key]?.updated || 'N/A'}
              </div>
              <div className="entity-actions">
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={() => handleExportEntity(entity.key)}
                >
                  <Download size={14} />
                  Export
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h2>Bulk Actions</h2>
        <div className="bulk-actions">
          <button 
            className="btn btn-secondary btn-large"
            onClick={handleResetDefaults}
            disabled={regenerating}
          >
            <RefreshCw size={20} />
            Reset to Factory Defaults
          </button>
          <p className="action-description">
            Returns all data to original demo state
          </p>
        </div>
      </div>

      <div className="settings-section">
        <h2>Data Import/Export</h2>
        
        <div className="export-section">
          <h4>Export Backup</h4>
          <p className="section-help">Download all data as a JSON backup file</p>
          <button 
            className="btn btn-primary"
            onClick={handleExportAll}
          >
            <Download size={18} />
            Export All Data
          </button>
        </div>

        <div className="import-section">
          <h4>Import Custom Data</h4>
          <p className="section-help">
            Import functionality coming in a future update. Currently, data is loaded from JSON files in the codebase.
          </p>
          <div className="import-controls">
            <input 
              type="file" 
              accept=".json"
              disabled
              className="file-input"
            />
            <button className="btn btn-secondary" disabled>
              <Upload size={18} />
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
