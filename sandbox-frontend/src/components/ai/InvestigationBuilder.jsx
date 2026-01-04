import { useState } from 'react';
import { Search, CheckSquare, FileText, Code } from 'lucide-react';
import Button from '../Button.jsx';
import PromptInspector from './PromptInspector.jsx';
import './InvestigationBuilder.css';

export default function InvestigationBuilder({ events = [], doors = [], cardholders = [], cameras = [], onBuild }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [investigation, setInvestigation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  
  const filteredEvents = events.filter(e =>
    (e.category === 'alarm' || e.category === 'fault') &&
    (e.door_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     e.event_type?.toLowerCase().includes(searchTerm.toLowerCase()))
  ).slice(0, 20);
  
  const handleEventSelect = (event) => {
    setSelectedEvent(event);
  };
  
  const handleBuild = async () => {
    if (!selectedEvent) return;
    
    setLoading(true);
    try {
      if (onBuild) {
        const result = await onBuild(selectedEvent, events);
        setInvestigation(result);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const toggleStep = (index) => {
    setInvestigation(prev => {
      const newSteps = [...prev.investigationSteps];
      newSteps[index].completed = !newSteps[index].completed;
      return { ...prev, investigationSteps: newSteps };
    });
  };
  
  const toggleEvidence = (index) => {
    setInvestigation(prev => {
      const newChecklist = [...prev.evidenceChecklist];
      newChecklist[index].collected = !newChecklist[index].collected;
      return { ...prev, evidenceChecklist: newChecklist };
    });
  };
  
  return (
    <div className="investigation-builder">
      <div className="builder-header">
        <Search size={24} />
        <h3>Investigation Builder</h3>
      </div>
      
      {!investigation && (
        <div className="builder-controls">
          <div className="event-selector">
            <h4>Select Initial Event</h4>
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search alarms and faults..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="event-list">
              {filteredEvents.map(event => (
                <div
                  key={event.id}
                  className={`event-item ${selectedEvent?.id === event.id ? 'selected' : ''}`}
                  onClick={() => handleEventSelect(event)}
                >
                  <div className="event-type">{event.event_type}</div>
                  <div className="event-door">{event.door_name}</div>
                  <div className="event-time">{new Date(event.timestamp).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
          
          {selectedEvent && (
            <div className="selected-event">
              <h4>Selected Event</h4>
              <div className="event-details-box">
                <div className="detail-row">
                  <span className="label">Type:</span>
                  <span>{selectedEvent.event_type}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Location:</span>
                  <span>{selectedEvent.door_name}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Time:</span>
                  <span>{new Date(selectedEvent.timestamp).toLocaleString()}</span>
                </div>
              </div>
              
              <Button onClick={handleBuild} disabled={loading} variant="primary">
                {loading ? 'Building Investigation...' : 'Build Investigation Workflow'}
              </Button>
            </div>
          )}
        </div>
      )}
      
      {investigation && (
        <div className="investigation-content">
          <div className="investigation-header">
            <h3>Investigation: {investigation.initialEvent.type}</h3>
            <div className="investigation-meta">
              <div>Location: {investigation.initialEvent.location}</div>
              <div>Time: {new Date(investigation.initialEvent.timestamp).toLocaleString()}</div>
              <div>Complexity: {investigation.complexity}</div>
              <div>Est. Duration: {investigation.estimatedDuration}</div>
            </div>
          </div>
          
          <div className="investigation-section">
            <h4>Investigation Steps</h4>
            <div className="steps-list">
              {investigation.investigationSteps.map((step, index) => (
                <div key={index} className={`step-item ${step.completed ? 'completed' : ''}`}>
                  <div className="step-checkbox" onClick={() => toggleStep(index)}>
                    {step.completed ? '☑' : '☐'}
                  </div>
                  <div className="step-content">
                    <div className="step-title">
                      {step.step}. {step.title}
                    </div>
                    <div className="step-description">{step.description}</div>
                    <div className="step-action">Action: {step.action}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="investigation-section">
            <h4>Key Questions</h4>
            <div className="questions-list">
              {investigation.keyQuestions.map((q, index) => (
                <div key={index} className="question-item">
                  <div className="question-text">❓ {q.question}</div>
                  <div className="question-relevance">Relevance: {q.relevance}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="investigation-section">
            <h4>Evidence Checklist</h4>
            <div className="evidence-list">
              {investigation.evidenceChecklist.map((item, index) => (
                <div key={index} className="evidence-item">
                  <div className="evidence-checkbox" onClick={() => toggleEvidence(index)}>
                    {item.collected ? '☑' : '☐'}
                  </div>
                  <div className="evidence-content">
                    <div className="evidence-text">{item.item}</div>
                    <div className="evidence-priority priority-{item.priority.toLowerCase()}">
                      {item.priority} Priority
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="investigation-section">
            <h4>Timeline Reconstruction</h4>
            <div className="timeline-list">
              {investigation.timelineReconstruction.map((event, index) => (
                <div key={index} className={`timeline-event ${event.isInitial ? 'initial' : ''}`}>
                  <div className="timeline-time">{event.timestamp}</div>
                  <div className="timeline-event-details">
                    <div className="timeline-event-type">{event.event}</div>
                    <div className="timeline-location">{event.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="investigation-section">
            <h4>Next Actions</h4>
            <div className="actions-list">
              {investigation.nextActions.map((action, index) => (
                <div key={index} className="action-card">
                  <div className="action-priority priority-{action.priority.toLowerCase()}">
                    {action.priority}
                  </div>
                  <div className="action-details">
                    <div className="action-title">{action.action}</div>
                    <div className="action-description">{action.description}</div>
                    <div className="action-assignee">Assigned: {action.assignee}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="investigation-footer">
            <Button onClick={() => setShowInspector(true)} variant="secondary">
              <Code size={16} />
              Inspect Prompt
            </Button>
            <Button onClick={() => setInvestigation(null)} variant="secondary">
              New Investigation
            </Button>
            <div className="created-at">
              Created: {new Date(investigation.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      )}
      
      <PromptInspector
        promptType="investigationBuilder"
        events={events}
        doors={doors}
        cardholders={cardholders}
        cameras={cameras}
        selectedEvents={selectedEvent ? [selectedEvent] : []}
        isOpen={showInspector}
        onClose={() => setShowInspector(false)}
      />
    </div>
  );
}
