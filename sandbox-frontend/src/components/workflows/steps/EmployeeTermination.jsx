import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { get, post, patch, del } from '../../../utils/apiClient';

const EmployeeTermination = ({ stepNumber, workflowType, onComplete, onError, setIsLoading, data }) => {
  const [cardholders, setCardholders] = useState([]);
  const [selectedCardholder, setSelectedCardholder] = useState(null);
  const [credentials, setCredentials] = useState([]);
  const [accessGroups, setAccessGroups] = useState([]);

  // Fetch cardholders on mount
  useEffect(() => {
    const fetchCardholders = async () => {
      try {
        setIsLoading(true);
        const response = await get('/api/gallagher/cardholders');
        setCardholders(response || []);
      } catch (error) {
        console.error('Failed to fetch cardholders:', error);
        onError('Failed to load cardholders. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (stepNumber === 1) {
      fetchCardholders();
    }
  }, [stepNumber, setIsLoading, onError]);

  // Fetch credentials and access groups when cardholder selected
  useEffect(() => {
    const fetchCardholderDetails = async () => {
      if (!selectedCardholder) return;
      try {
        setIsLoading(true);
        const [credResponse, groupResponse] = await Promise.all([
          get(`/api/gallagher/cardholders/${selectedCardholder.id}/credentials`),
          get(`/api/gallagher/cardholders/${selectedCardholder.id}/access-groups`)
        ]);
        setCredentials(credResponse || []);
        setAccessGroups(groupResponse || []);
      } catch (error) {
        console.error('Failed to fetch cardholder details:', error);
        onError('Failed to load cardholder details.');
      } finally {
        setIsLoading(false);
      }
    };

    if (stepNumber === 2 && selectedCardholder) {
      fetchCardholderDetails();
    }
  }, [stepNumber, selectedCardholder, setIsLoading, onError]);

  const handleStep1Submit = () => {
    if (!selectedCardholder) {
      onError('Please select an employee');
      return;
    }
    onComplete({
      cardholder: selectedCardholder
    });
  };

  const handleStep2Submit = async () => {
    if (!selectedCardholder) return;

    try {
      setIsLoading(true);
      // Disable all credentials
      for (const cred of credentials) {
        await patch(`/api/gallagher/credentials/${cred.id}`, {
          status: 'disabled'
        });
      }

      // Remove from all access groups
      for (const group of accessGroups) {
        await del(`/api/gallagher/access-groups/${group.id}/members/${selectedCardholder.id}`);
      }

      onComplete({
        credentialsDisabled: credentials.length,
        groupsRemoved: accessGroups.length
      });
    } catch (error) {
      console.error('Failed to disable credentials:', error);
      onError('Failed to disable credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep3Submit = async () => {
    if (!selectedCardholder) return;

    try {
      setIsLoading(true);
      await patch(`/api/gallagher/cardholders/${selectedCardholder.id}`, {
        authorised: false
      });

      onComplete({
        authorized: false
      });
    } catch (error) {
      console.error('Failed to unauthorize employee:', error);
      onError('Failed to unauthorize employee. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Select Employee
  if (stepNumber === 1) {
    return (
      <div className="step-form">
        <p className="step-info">Select the employee to terminate:</p>

        <div className="select-group">
          <select
            className="form-select"
            value={selectedCardholder?.id || ''}
            onChange={(e) => {
              const selected = cardholders.find(c => c.id === e.target.value);
              setSelectedCardholder(selected || null);
            }}
          >
            <option value="">-- Select Employee --</option>
            {cardholders.map(ch => (
              <option key={ch.id} value={ch.id}>
                {ch.firstName} {ch.lastName} ({ch.department})
              </option>
            ))}
          </select>
        </div>

        {selectedCardholder && (
          <>
            <div className="preview-box">
              <div className="preview-section">
                <label>Name</label>
                <p>{selectedCardholder.firstName} {selectedCardholder.lastName}</p>
              </div>
              <div className="preview-section">
                <label>Department</label>
                <p>{selectedCardholder.department}</p>
              </div>
              <div className="preview-section">
                <label>Status</label>
                <p>
                  <span className={`status-badge ${selectedCardholder.authorised ? 'active' : 'inactive'}`}>
                    {selectedCardholder.authorised ? 'Authorized' : 'Unauthorized'}
                  </span>
                </p>
              </div>
            </div>

            <button 
              className="step-submit-btn"
              onClick={handleStep1Submit}
            >
              <CheckCircle2 size={18} />
              Continue
            </button>
          </>
        )}
      </div>
    );
  }

  // Step 2: Disable Credentials
  if (stepNumber === 2) {
    const hasCredentials = credentials.length > 0;
    
    return (
      <div className="step-form">
        <p className="step-info">
          {hasCredentials 
            ? `This employee has ${credentials.length} credential(s). All will be disabled.`
            : 'This employee has no active credentials.'}
        </p>

        {hasCredentials && (
          <div className="credential-list">
            {credentials.map(cred => (
              <div key={cred.id} className="credential-item">
                <div className="credential-info">
                  <strong>{cred.cardType}</strong>
                  <p>Card: {cred.cardNumber}</p>
                </div>
                <span className="status-badge active">Active</span>
              </div>
            ))}
          </div>
        )}

        <button 
          className="step-submit-btn"
          onClick={handleStep2Submit}
        >
          <CheckCircle2 size={18} />
          Disable All Credentials
        </button>
      </div>
    );
  }

  // Step 3: Unauthorize
  if (stepNumber === 3) {
    return (
      <div className="step-form">
        <div className="warning-box">
          <AlertCircle size={20} />
          <div>
            <strong>Complete Termination</strong>
            <p>Mark {selectedCardholder?.firstName} {selectedCardholder?.lastName} as unauthorized</p>
          </div>
        </div>

        <p className="step-info">
          This will prevent the employee from accessing the system entirely.
        </p>

        <button 
          className="step-submit-btn danger"
          onClick={handleStep3Submit}
        >
          <CheckCircle2 size={18} />
          Unauthorize Employee
        </button>

        {data?.authorized === false && (
          <div className="success-box">
            <CheckCircle2 size={18} />
            <div>
              <strong>Employee Terminated</strong>
              <p>All access revoked</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default EmployeeTermination;
