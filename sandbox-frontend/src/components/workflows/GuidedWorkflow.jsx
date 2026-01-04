import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, RotateCcw, SkipForward } from 'lucide-react';
import EmployeeOnboarding from './steps/EmployeeOnboarding';
import EmployeeTermination from './steps/EmployeeTermination';
import SecurityInvestigation from './steps/SecurityInvestigation';
import AccessGroupManagement from './steps/AccessGroupManagement';
import WorkflowSummary from './WorkflowSummary';
import { initializeWorkflowTracker, getTrackedApiCalls } from '../../utils/workflowApiTracker';
import './GuidedWorkflow.css';
import './steps/WorkflowSteps.css';

const GuidedWorkflow = ({ workflowId, onClose, onComplete }) => {
  const COMPLETED_KEY = 'workflows-completed';
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [workflowData, setWorkflowData] = useState({});
  const [trackedApiCalls, setTrackedApiCalls] = useState([]);

  // Initialize API call tracker when workflow mounts
  useEffect(() => {
    initializeWorkflowTracker(workflowId);
  }, [workflowId]);

  // Workflow definitions with their steps
  const workflows = {
    onboarding: {
      name: 'New Employee Onboarding',
      description: 'Learn how to onboard a new employee into the system',
      steps: [
        {
          title: 'Create Cardholder',
          instructions: 'Fill in the employee details and create a new cardholder record.',
          component: EmployeeOnboarding,
          stepNumber: 1
        },
        {
          title: 'Assign Access Groups',
          instructions: 'Select which access groups this employee should belong to.',
          component: EmployeeOnboarding,
          stepNumber: 2
        },
        {
          title: 'Issue Credential',
          instructions: 'Create and activate the employee\'s access card.',
          component: EmployeeOnboarding,
          stepNumber: 3
        }
      ]
    },
    termination: {
      name: 'Employee Termination',
      description: 'Safely remove an employee from the system',
      steps: [
        {
          title: 'Disable Credentials',
          instructions: 'Select the employee and disable all their access credentials.',
          component: EmployeeTermination,
          stepNumber: 1
        },
        {
          title: 'Remove Access Groups',
          instructions: 'Remove the employee from all access groups.',
          component: EmployeeTermination,
          stepNumber: 2
        },
        {
          title: 'Unauthorize Employee',
          instructions: 'Set the employee status to unauthorized to complete termination.',
          component: EmployeeTermination,
          stepNumber: 3
        }
      ]
    },
    investigation: {
      name: 'Investigate Security Event',
      description: 'Investigate a security event with complete context',
      steps: [
        {
          title: 'Filter Events',
          instructions: 'Find the event you want to investigate.',
          component: SecurityInvestigation,
          stepNumber: 1
        },
        {
          title: 'View Door Details',
          instructions: 'Check the door location and properties.',
          component: SecurityInvestigation,
          stepNumber: 2
        },
        {
          title: 'Check Cardholder Permissions',
          instructions: 'Verify the cardholder\'s access groups and permissions.',
          component: SecurityInvestigation,
          stepNumber: 3
        },
        {
          title: 'Review Camera Feed',
          instructions: 'Watch the associated camera feed for context.',
          component: SecurityInvestigation,
          stepNumber: 4
        }
      ]
    },
    'access-group': {
      name: 'Access Group Management',
      description: 'Create and manage access groups',
      steps: [
        {
          title: 'Create Access Group',
          instructions: 'Define a new access group with name and description.',
          component: AccessGroupManagement,
          stepNumber: 1
        },
        {
          title: 'Add Doors to Group',
          instructions: 'Select which doors this access group can access.',
          component: AccessGroupManagement,
          stepNumber: 2
        },
        {
          title: 'Assign Cardholders',
          instructions: 'Add cardholders to this access group.',
          component: AccessGroupManagement,
          stepNumber: 3
        }
      ]
    }
  };

  const workflow = workflows[workflowId];

  if (!workflow) {
    return null;
  }

  const totalSteps = workflow.steps.length;
  const stepProgress = ((currentStep + 1) / totalSteps) * 100;
  const CurrentStepComponent = workflow.steps[currentStep].component;

  // Load saved state from sessionStorage
  useEffect(() => {
    const savedState = sessionStorage.getItem(`workflow-${workflowId}-state`);
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setCurrentStep(state.currentStep || 0);
        setWorkflowData(state.data || {});
      } catch (e) {
        console.error('Failed to load workflow state:', e);
      }
    }
  }, [workflowId]);

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem(
      `workflow-${workflowId}-state`,
      JSON.stringify({
        currentStep,
        data: workflowData,
        timestamp: Date.now()
      })
    );
  }, [currentStep, workflowData, workflowId]);

  const handleStepComplete = (data) => {
    setWorkflowData(prev => ({
      ...prev,
      ...data
    }));

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      setError(null);
    } else {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        handleWorkflowComplete();
      }, 2000);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      setError(null);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setWorkflowData({});
    setError(null);
    setShowSuccess(false);
    sessionStorage.removeItem(`workflow-${workflowId}-state`);
  };

  const handleWorkflowComplete = () => {
    // Mark as completed in localStorage
    const completed = JSON.parse(localStorage.getItem(COMPLETED_KEY) || '[]');
    if (!completed.includes(workflowId)) {
      completed.push(workflowId);
      localStorage.setItem(COMPLETED_KEY, JSON.stringify(completed));
    }
    
    // Clear session state
    sessionStorage.removeItem(`workflow-${workflowId}-state`);
    
    // Get tracked API calls
    const calls = getTrackedApiCalls();
    setTrackedApiCalls(calls);
    
    // Show summary instead of closing immediately
    setShowSummary(true);
  };

  const handleCloseSummary = () => {
    // Call onComplete when actually closing the modal
    if (onComplete) {
      onComplete(workflowId, workflowData);
    }
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && !showSuccess) {
      handleNext();
    }
  };

  const currentStepData = workflow.steps[currentStep];

  return (
    <div className="guided-workflow-overlay" onClick={onClose} onKeyDown={handleKeyDown}>
      <div className="guided-workflow-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="workflow-header">
          <div>
            <h2 className="workflow-title">{workflow.name}</h2>
            <p className="workflow-breadcrumb">
              Step {currentStep + 1} of {totalSteps} • {currentStepData.title}
            </p>
          </div>
          <button 
            className="close-button"
            onClick={onClose}
            aria-label="Close workflow"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill"
              style={{ width: `${stepProgress}%` }}
            />
          </div>
          <span className="progress-text">{Math.round(stepProgress)}%</span>
        </div>

        {/* Main Content */}
        <div className="workflow-content">
          {/* Instructions Panel */}
          <div className="instructions-panel">
            <div className="step-indicator">
              <span className="step-number">{currentStep + 1}</span>
              <div>
                <h3 className="step-title">{currentStepData.title}</h3>
                <p className="step-instructions">{currentStepData.instructions}</p>
              </div>
            </div>
          </div>

          {/* Interactive Panel */}
          <div className="interactive-panel">
            {error && (
              <div className="error-banner">
                <p className="error-message">{error}</p>
                <button 
                  className="error-retry"
                  onClick={() => setError(null)}
                >
                  Dismiss
                </button>
              </div>
            )}

            {showSummary ? (
              <WorkflowSummary 
                workflowId={workflowId}
                workflowName={workflow.name}
                workflowData={workflowData}
                trackedApiCalls={trackedApiCalls}
              />
            ) : showSuccess ? (
              <div className="success-state">
                <div className="success-checkmark">✓</div>
                <h3>Step Complete!</h3>
                <p>Moving to next step...</p>
              </div>
            ) : (
              <CurrentStepComponent
                stepNumber={currentStepData.stepNumber}
                workflowType={workflowId}
                onComplete={handleStepComplete}
                onError={setError}
                setIsLoading={setIsLoading}
                data={workflowData}
              />
            )}

            {isLoading && (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading...</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer with Controls */}
        <div className="workflow-footer">
          {showSummary ? (
            <div className="summary-footer">
              <button
                className="btn btn-primary"
                onClick={handleCloseSummary}
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="button-group">
                <button
                  className="btn btn-secondary"
                  onClick={handlePrevious}
                  disabled={currentStep === 0 || isLoading || showSuccess}
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={handleSkip}
                  disabled={isLoading || showSuccess}
                >
                  <SkipForward size={18} />
                  Skip
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={handleRestart}
                  disabled={isLoading || showSuccess}
                >
                  <RotateCcw size={18} />
                  Restart
                </button>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleNext}
                disabled={currentStep === totalSteps - 1 || isLoading || showSuccess}
              >
                Next
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {/* Keyboard Hint */}
        <div className="keyboard-hint">
          <kbd>Enter</kbd> = Next • <kbd>Esc</kbd> = Exit
        </div>
      </div>
    </div>
  );
};

export default GuidedWorkflow;
