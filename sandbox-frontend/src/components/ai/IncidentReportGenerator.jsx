import { useState } from 'react';
import { ClipboardList, Search, Download, Mail, Loader } from 'lucide-react';
import Button from '../Button.jsx';
import './IncidentReportGenerator.css';

export default function IncidentReportGenerator({ events = [], doors = [], cardholders = [], cameras = [], onGenerate }) {
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCameras, setSelectedCameras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  
  const filteredEvents = events.filter(e =>
    e.door_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.cardholder_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.event_type?.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 50);
  
  const handleEventToggle = (event) => {
    setSelectedEvents(prev => {
      const exists = prev.find(e => e.id === event.id);
      if (exists) {
        return prev.filter(e => e.id !== event.id);
      } else {
        return [...prev, event];
      }
    });
  };
  
  const handleCameraToggle = (camera) => {
    setSelectedCameras(prev => {
      if (prev.includes(camera.id)) {
        return prev.filter(c => c !== camera.id);
      } else {
        return [...prev, camera.id];
      }
    });
  };
  
  const handleGenerate = async () => {
    if (selectedEvents.length === 0) return;
    
    setLoading(true);
    
    try {
      if (onGenerate) {
        const context = {
          doors: doors.filter(d => selectedEvents.some(e => e.door_id === d.id)),
          cardholders: cardholders.filter(ch => selectedEvents.some(e => e.cardholder_id === ch.id)),
          cameras: cameras.filter(c => selectedCameras.includes(c.id))
        };
        
        const result = await onGenerate(selectedEvents, context);
        setReport(result);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleExport = () => {
    if (!report) return;
    
    const content = JSON.stringify(report, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incident-report-${report.incidentId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="incident-report-generator">
      <div className="generator-header">
        <ClipboardList size={24} />
        <h3>Incident Report Generator</h3>
      </div>
      
      {!report && (
        <div className="generator-controls">
          <div className="event-selector">
            <h4>Select Events</h4>
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="event-list">
              {filteredEvents.map(event => (
                <label key={event.id} className="event-item">
                  <input
                    type="checkbox"
                    checked={selectedEvents.some(e => e.id === event.id)}
                    onChange={() => handleEventToggle(event)}
                  />
                  <div className="event-details">
                    <span className="event-type">{event.event_type}</span>
                    <span className="event-door">{event.door_name}</span>
                    <span className="event-time">{new Date(event.timestamp).toLocaleString()}</span>
                  </div>
                </label>
              ))}
            </div>
            <div className="selection-count">
              {selectedEvents.length} event(s) selected
            </div>
          </div>
          
          <div className="camera-selector">
            <h4>Add Context - Cameras</h4>
            <div className="camera-list">
              {cameras.slice(0, 10).map(camera => (
                <label key={camera.id} className="camera-item">
                  <input
                    type="checkbox"
                    checked={selectedCameras.includes(camera.id)}
                    onChange={() => handleCameraToggle(camera)}
                  />
                  <span>{camera.name}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="generate-section">
            <Button
              onClick={handleGenerate}
              disabled={selectedEvents.length === 0 || loading}
              variant="primary"
            >
              {loading ? (
                <>
                  <Loader size={18} className="spinner" />
                  Generating Report...
                </>
              ) : (
                'Generate Report'
              )}
            </Button>
          </div>
        </div>
      )}
      
      {report && (
        <div className="report-content">
          <div className="report-header-section">
            <h2>INCIDENT REPORT</h2>
            <div className="report-meta">
              <div className="meta-item">
                <span className="meta-label">Incident ID:</span>
                <span className="meta-value">{report.incidentId}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Date/Time:</span>
                <span className="meta-value">{new Date(report.dateTime).toLocaleString()}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Duration:</span>
                <span className="meta-value">{report.duration}</span>
              </div>
            </div>
          </div>
          
          <div className="report-section">
            <h3>Executive Summary</h3>
            <p>{report.summary}</p>
          </div>
          
          <div className="report-section">
            <h3>Timeline</h3>
            <div className="timeline">
              {report.timeline.map((item, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-marker">
                    <span className="timeline-number">{item.sequence}</span>
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-time">{item.timestamp}</div>
                    <div className="timeline-event">
                      <span className="event-type-badge">{item.eventType}</span>
                      <span className="severity-badge severity-{item.severity.toLowerCase()}">{item.severity}</span>
                    </div>
                    <div className="timeline-location">{item.location}</div>
                    {item.cardholder !== 'N/A' && (
                      <div className="timeline-cardholder">Cardholder: {item.cardholder}</div>
                    )}
                    {item.details && (
                      <div className="timeline-details">{item.details}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="report-section">
            <h3>Persons/Assets Involved</h3>
            {report.involved.doors.length > 0 && (
              <div className="involved-group">
                <h4>Doors</h4>
                {report.involved.doors.map((door, i) => (
                  <div key={i} className="involved-item">
                    {door.name} - {door.location}
                  </div>
                ))}
              </div>
            )}
            {report.involved.cardholders.length > 0 && (
              <div className="involved-group">
                <h4>Cardholders</h4>
                {report.involved.cardholders.map((ch, i) => (
                  <div key={i} className="involved-item">
                    {ch.name} - {ch.department} ({ch.role})
                  </div>
                ))}
              </div>
            )}
            {report.involved.cameras.length > 0 && (
              <div className="involved-group">
                <h4>Cameras</h4>
                {report.involved.cameras.map((cam, i) => (
                  <div key={i} className="involved-item">
                    {cam.name} - {cam.location}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="report-section">
            <h3>Evidence Available</h3>
            {report.evidence.map((ev, index) => (
              <div key={index} className="evidence-item">
                <div className="evidence-type">{ev.type}</div>
                <div className="evidence-description">{ev.description}</div>
                <div className="evidence-priority priority-{ev.priority.toLowerCase()}">
                  Priority: {ev.priority}
                </div>
              </div>
            ))}
          </div>
          
          <div className="report-section">
            <h3>Recommended Actions</h3>
            {report.actions.map((action, index) => (
              <div key={index} className="action-item">
                <div className="action-priority priority-{action.priority.toLowerCase()}">
                  {action.priority}
                </div>
                <div className="action-content">
                  <div className="action-title">{action.action}</div>
                  <div className="action-description">{action.description}</div>
                  <div className="action-assignee">Assigned to: {action.assignedTo}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="report-section">
            <h3>Follow-up Items</h3>
            {report.followUp.map((item, index) => (
              <div key={index} className="followup-item">
                <div className="followup-checkbox">☐</div>
                <div className="followup-content">
                  <div className="followup-item-text">{item.item}</div>
                  <div className="followup-meta">
                    <span>Deadline: {item.deadline}</span>
                    <span>Owner: {item.owner}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="report-footer">
            <div className="report-meta-footer">
              Generated by: {report.generatedBy}<br />
              Generated at: {new Date(report.generatedAt).toLocaleString()}
            </div>
            
            <div className="report-actions">
              <Button onClick={() => setReport(null)} variant="secondary">
                New Report
              </Button>
              <Button onClick={handleExport} variant="primary">
                <Download size={16} />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
