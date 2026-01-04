import { useState } from 'react';
import { BookOpen, Users, Shield, Clock, AlertCircle } from 'lucide-react';
import GuidedWorkflow from '../components/workflows/GuidedWorkflow';
import './WorkflowsPage.css';

const workflows = [
  {
    id: 'onboarding',
    name: 'New Employee Onboarding',
    description: 'Learn how to create a cardholder, assign access groups, and issue credentials',
    icon: Users,
    steps: 3,
    estimatedTime: '10 min',
    color: '#4CAF50'
  },
  {
    id: 'termination',
    name: 'Employee Termination',
    description: 'Properly disable credentials, remove access, and unauthorized an employee',
    icon: Shield,
    steps: 3,
    estimatedTime: '8 min',
    color: '#FF9800'
  },
  {
    id: 'investigation',
    name: 'Investigate Security Event',
    description: 'Learn how to filter events, view details, and check permissions',
    icon: AlertCircle,
    steps: 4,
    estimatedTime: '12 min',
    color: '#2196F3'
  },
  {
    id: 'access-group',
    name: 'Access Group Management',
    description: 'Create access groups, add doors, and assign cardholders in bulk',
    icon: Clock,
    steps: 3,
    estimatedTime: '10 min',
    color: '#9C27B0'
  }
];

const COMPLETED_KEY = 'workflows-completed';

export default function WorkflowsPage() {
  const [activeWorkflow, setActiveWorkflow] = useState(null);
  const [completedWorkflows, setCompletedWorkflows] = useState(() => {
    try {
      const stored = localStorage.getItem(COMPLETED_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to read completed workflows from storage', e);
      return [];
    }
  });

  const handleWorkflowComplete = (workflowId) => {
    const updated = [...new Set([...completedWorkflows, workflowId])];
    setCompletedWorkflows(updated);
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(updated));
    setActiveWorkflow(null);
  };

  return (
    <div className="workflows-page">
      <div className="workflows-header">
        <div className="header-content">
          <div className="header-icon">
            <BookOpen size={32} />
          </div>
          <div>
            <h1>Guided Workflows</h1>
            <p>Interactive tutorials to help you master physical security operations</p>
          </div>
        </div>
      </div>

      <div className="workflows-grid">
        {workflows.map(workflow => {
          const Icon = workflow.icon;
          const isCompleted = completedWorkflows.includes(workflow.id);
          
          return (
            <div
              key={workflow.id}
              className={`workflow-card ${isCompleted ? 'completed' : ''}`}
              style={{ borderLeftColor: workflow.color }}
            >
              <div className="card-header">
                <div className="icon-wrapper" style={{ backgroundColor: `${workflow.color}15` }}>
                  <Icon size={24} style={{ color: workflow.color }} />
                </div>
                {isCompleted && <div className="completed-badge">✓ Completed</div>}
              </div>

              <h3>{workflow.name}</h3>
              <p>{workflow.description}</p>

              <div className="card-meta">
                <span className="meta-item">
                  <span className="label">Steps:</span>
                  <span className="value">{workflow.steps}</span>
                </span>
                <span className="meta-item">
                  <span className="label">Time:</span>
                  <span className="value">{workflow.estimatedTime}</span>
                </span>
              </div>

              <button
                className={`workflow-button ${isCompleted ? 'secondary' : 'primary'}`}
                onClick={() => setActiveWorkflow(workflow.id)}
              >
                {isCompleted ? 'Review' : 'Start'} Workflow
              </button>
            </div>
          );
        })}
      </div>

      {activeWorkflow && (
        <GuidedWorkflow
          workflowId={activeWorkflow}
          onClose={() => setActiveWorkflow(null)}
          onComplete={() => handleWorkflowComplete(activeWorkflow)}
        />
      )}
    </div>
  );
}
