import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Database, Cpu, FileText, CheckCircle } from 'lucide-react';
import './HowItWorksPanel.css';

function HowItWorksPanel({ workflow, title = "How This Works" }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!workflow || workflow.length === 0) return null;

  return (
    <div className="how-it-works-panel">
      <div className="panel-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>{title}</h3>
        <button className="toggle-button">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      
      {isExpanded && (
        <div className="workflow-steps">
          {workflow.map((step, index) => (
            <WorkflowStep 
              key={index} 
              step={step} 
              index={index + 1}
              isLast={index === workflow.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function WorkflowStep({ step, index, isLast }) {
  const [showDetails, setShowDetails] = useState(false);

  const getStepIcon = () => {
    switch (step.type) {
      case 'database': return <Database size={20} />;
      case 'processing': return <Cpu size={20} />;
      case 'output': return <FileText size={20} />;
      case 'complete': return <CheckCircle size={20} />;
      default: return <Cpu size={20} />;
    }
  };

  return (
    <div className="workflow-step">
      <div className="step-indicator">
        <div className="step-number">{index}</div>
        {!isLast && <div className="step-connector" />}
      </div>
      
      <div className="step-content">
        <div className="step-header">
          <div className="step-icon">{getStepIcon()}</div>
          <h4>{step.title}</h4>
          {step.duration && <span className="step-duration">{step.duration}</span>}
        </div>
        
        <p className="step-description">{step.description}</p>
        
        {step.details && (
          <div className="step-details">
            <em>{step.details}</em>
          </div>
        )}
        
        {step.dataSource && (
          <div className="data-source">
            <strong>Data Source:</strong> {step.dataSource}
          </div>
        )}
        
        {step.query && (
          <div className="query-section">
            <button 
              className="show-query-button"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Hide' : 'Show'} Query Details
            </button>
            {showDetails && (
              <div className="query-details">
                <code>{step.query}</code>
              </div>
            )}
          </div>
        )}
        
        {step.result && (
          <div className="step-result">
            <strong>Result:</strong> {step.result}
          </div>
        )}
      </div>
    </div>
  );
}

export default HowItWorksPanel;
