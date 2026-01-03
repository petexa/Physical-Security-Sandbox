import { useState } from 'react';
import { FileText, Download, Loader } from 'lucide-react';
import Button from '../Button.jsx';
import './SummaryGenerator.css';

export default function SummaryGenerator({ events = [], onGenerate }) {
  const [dateRange, setDateRange] = useState('last30days');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  
  const dateRangeOptions = [
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last90days', label: 'Last 90 Days' },
    { value: 'last6months', label: 'Last 6 Months' }
  ];
  
  const eventTypeOptions = [
    { value: 'all', label: 'All Event Types' },
    { value: 'access', label: 'Access Events' },
    { value: 'alarm', label: 'Alarms' },
    { value: 'fault', label: 'Faults' }
  ];
  
  const handleGenerate = async () => {
    setLoading(true);
    
    try {
      if (onGenerate) {
        const result = await onGenerate(dateRange, eventTypeFilter);
        setSummary(result);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleExport = (format) => {
    if (!summary) return;
    
    const content = JSON.stringify(summary, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `event-summary-${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="summary-generator">
      <div className="summary-header">
        <FileText size={24} />
        <h3>Event Summary Generator</h3>
      </div>
      
      <div className="summary-controls">
        <div className="control-group">
          <label htmlFor="date-range">Date Range</label>
          <select
            id="date-range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            disabled={loading}
          >
            {dateRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="control-group">
          <label htmlFor="event-type">Event Types</label>
          <select
            id="event-type"
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            disabled={loading}
          >
            {eventTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <Button
          onClick={handleGenerate}
          disabled={loading}
          variant="primary"
        >
          {loading ? (
            <>
              <Loader size={18} className="spinner" />
              Generating...
            </>
          ) : (
            'Generate Summary'
          )}
        </Button>
      </div>
      
      {summary && (
        <div className="summary-content">
          <div className="summary-section">
            <h4>Overview</h4>
            <p>{summary.overview}</p>
          </div>
          
          <div className="summary-section">
            <h4>Key Findings</h4>
            <ul className="findings-list">
              {summary.keyFindings.map((finding, index) => (
                <li key={index}>{finding}</li>
              ))}
            </ul>
          </div>
          
          {summary.statistics && (
            <div className="summary-section">
              <h4>Statistics</h4>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{summary.statistics.totalEvents.toLocaleString()}</div>
                  <div className="stat-label">Total Events</div>
                </div>
                {summary.statistics.byCategory && Object.entries(summary.statistics.byCategory).map(([category, count]) => (
                  <div key={category} className="stat-card">
                    <div className="stat-value">{count.toLocaleString()}</div>
                    <div className="stat-label">{category.charAt(0).toUpperCase() + category.slice(1)}</div>
                  </div>
                ))}
              </div>
              
              {summary.statistics.topDoors && summary.statistics.topDoors.length > 0 && (
                <div className="top-doors">
                  <h5>Top Active Doors</h5>
                  <div className="door-list">
                    {summary.statistics.topDoors.map((door, index) => (
                      <div key={index} className="door-item">
                        <span className="door-rank">{index + 1}</span>
                        <span className="door-name">{door.door_name}</span>
                        <span className="door-count">{door.count} events</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {summary.concerns && summary.concerns.length > 0 && (
            <div className="summary-section">
              <h4>Security Concerns</h4>
              {summary.concerns.map((concern, index) => (
                <div key={index} className="concern-item">
                  <div className="concern-type">{concern.type}</div>
                  <p className="concern-description">{concern.description}</p>
                  {concern.doors && (
                    <div className="concern-details">
                      Affected doors: {concern.doors.join(', ')}
                    </div>
                  )}
                  {concern.cardholders && (
                    <div className="concern-details">
                      Affected cardholders: {concern.cardholders.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {summary.recommendations && summary.recommendations.length > 0 && (
            <div className="summary-section">
              <h4>Recommendations</h4>
              <div className="recommendations-list">
                {summary.recommendations.map((rec, index) => (
                  <div key={index} className="recommendation-item">
                    <div className="rec-priority priority-{rec.priority.toLowerCase()}">{rec.priority}</div>
                    <div className="rec-content">
                      <div className="rec-action">{rec.action}</div>
                      <p className="rec-description">{rec.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="summary-footer">
            <div className="export-buttons">
              <Button
                onClick={() => handleExport('json')}
                variant="secondary"
                size="sm"
              >
                <Download size={16} />
                Export to JSON
              </Button>
            </div>
            <div className="generated-at">
              Generated: {new Date(summary.generatedAt).toLocaleString()}
            </div>
          </div>
        </div>
      )}
      
      {!summary && !loading && (
        <div className="summary-placeholder">
          <FileText size={48} />
          <p>Configure options above and click "Generate Summary" to create a comprehensive event analysis report.</p>
        </div>
      )}
    </div>
  );
}
