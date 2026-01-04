import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { get, post, patch } from '../../../utils/apiClient';

const EmployeeOnboarding = ({ stepNumber, workflowType, onComplete, onError, setIsLoading, data }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    department: '',
    selectedAccessGroups: []
  });
  const [accessGroups, setAccessGroups] = useState([]);
  const [createdCardholderId, setCreatedCardholderId] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch access groups on mount
  useEffect(() => {
    const fetchAccessGroups = async () => {
      try {
        setIsLoading(true);
        const response = await get('/api/access_groups');
        const groups = response?.data?.results 
          || response?.data 
          || response?.results 
          || [];
        setAccessGroups(Array.isArray(groups) ? groups : []);
      } catch (error) {
        console.error('Failed to fetch access groups:', error);
        onError('Failed to load access groups. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (stepNumber === 2) {
      fetchAccessGroups();
    }
  }, [stepNumber, setIsLoading, onError]);

  const validateStep1 = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.department.trim()) errors.department = 'Department is required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    if (formData.selectedAccessGroups.length === 0) {
      onError('Please select at least one access group');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    return true;
  };

  const handleStep1Submit = async () => {
    if (!validateStep1()) {
      onError('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      const response = await post('/api/cardholders', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        department: formData.department,
        authorised: true,
        email: `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}@company.com`
      });

      setCreatedCardholderId(response.data?.id || response.id);
      onComplete({
        cardholder: response.data || response,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to create cardholder:', error);
      onError('Failed to create cardholder. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Submit = async () => {
    if (!validateStep2()) {
      return;
    }

    try {
      setIsLoading(true);
      const cardholderId = data?.cardholder?.id || createdCardholderId;

      if (!cardholderId) {
        onError('Cardholder ID not found. Please complete step 1 first.');
        return;
      }

      // Add each selected access group to the cardholder
      for (const groupId of formData.selectedAccessGroups) {
        const group = accessGroups.find(g => g.id === groupId);
        if (group) {
          await post(`/api/cardholders/${cardholderId}/access-groups`, {
            accessGroupName: group.name
          });
        }
      }

      onComplete({
        accessGroups: formData.selectedAccessGroups
      });
    } catch (error) {
      console.error('Failed to assign access groups:', error);
      onError('Failed to assign access groups. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep3Submit = async () => {
    if (!validateStep3()) {
      return;
    }

    try {
      setIsLoading(true);
      const cardholderId = data?.cardholder?.id || createdCardholderId;

      const credential = {
        cardholderId: cardholderId,
        cardType: 'PROXIMITY',
        cardNumber: `CARD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        facilityCode: 1,
        status: 'active'
      };

      onComplete({
        credential: credential
      });
    } catch (error) {
      console.error('Failed to create credential:', error);
      onError('Failed to issue credential. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const toggleAccessGroup = (groupId) => {
    setFormData(prev => ({
      ...prev,
      selectedAccessGroups: prev.selectedAccessGroups.includes(groupId)
        ? prev.selectedAccessGroups.filter(id => id !== groupId)
        : [...prev.selectedAccessGroups, groupId]
    }));
  };

  // Step 1: Create Cardholder
  if (stepNumber === 1) {
    return (
      <div className="step-form">
        <div className="form-group">
          <label className="form-label">
            First Name <span className="required">*</span>
          </label>
          <input
            type="text"
            className={`form-input ${validationErrors.firstName ? 'error' : ''}`}
            placeholder="John"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
          />
          {validationErrors.firstName && (
            <span className="error-text">{validationErrors.firstName}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Last Name <span className="required">*</span>
          </label>
          <input
            type="text"
            className={`form-input ${validationErrors.lastName ? 'error' : ''}`}
            placeholder="Smith"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
          />
          {validationErrors.lastName && (
            <span className="error-text">{validationErrors.lastName}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Department <span className="required">*</span>
          </label>
          <input
            type="text"
            className={`form-input ${validationErrors.department ? 'error' : ''}`}
            placeholder="Engineering"
            value={formData.department}
            onChange={(e) => handleInputChange('department', e.target.value)}
          />
          {validationErrors.department && (
            <span className="error-text">{validationErrors.department}</span>
          )}
        </div>

        <button 
          className="step-submit-btn"
          onClick={handleStep1Submit}
        >
          <CheckCircle2 size={18} />
          Create Cardholder
        </button>

        {data?.cardholder && (
          <div className="success-box">
            <CheckCircle2 size={18} />
            <div>
              <strong>Cardholder Created</strong>
              <p>{data.cardholder.firstName} {data.cardholder.lastName}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Step 2: Assign Access Groups
  if (stepNumber === 2) {
    return (
      <div className="step-form">
        <p className="step-info">Select which access groups this employee should belong to:</p>

        <div className="checkbox-group">
          {accessGroups.length > 0 ? (
            accessGroups.map(group => (
              <label key={group.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.selectedAccessGroups.includes(group.id)}
                  onChange={() => toggleAccessGroup(group.id)}
                />
                <span className="checkbox-text">
                  <strong>{group.name}</strong>
                  {group.description && <p>{group.description}</p>}
                </span>
              </label>
            ))
          ) : (
            <p className="no-items">No access groups available</p>
          )}
        </div>

        {formData.selectedAccessGroups.length > 0 && (
          <>
            <div className="selected-list">
              <h4>Selected Groups ({formData.selectedAccessGroups.length})</h4>
              {formData.selectedAccessGroups.map(groupId => {
                const group = accessGroups.find(g => g.id === groupId);
                return (
                  <div key={groupId} className="selected-item">
                    <CheckCircle2 size={16} />
                    {group?.name}
                  </div>
                );
              })}
            </div>

            <button 
              className="step-submit-btn"
              onClick={handleStep2Submit}
            >
              <CheckCircle2 size={18} />
              Assign Access Groups
            </button>
          </>
        )}
      </div>
    );
  }

  // Step 3: Issue Credential
  if (stepNumber === 3) {
    return (
      <div className="step-form">
        <div className="credential-preview">
          <div className="preview-section">
            <label>Card Type</label>
            <p>PROXIMITY</p>
          </div>
          <div className="preview-section">
            <label>Card Number</label>
            <p>CARD-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>
          <div className="preview-section">
            <label>Status</label>
            <p><span className="status-badge active">Active</span></p>
          </div>
        </div>

        <p className="step-info">
          Review the credential details above. Click "Issue Credential" to activate the employee's access card.
        </p>

        <button 
          className="step-submit-btn"
          onClick={handleStep3Submit}
        >
          <CheckCircle2 size={18} />
          Issue Credential
        </button>

        {data?.credential && (
          <div className="success-box">
            <CheckCircle2 size={18} />
            <div>
              <strong>Credential Issued</strong>
              <p>Card {data.credential.cardNumber} is now active</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default EmployeeOnboarding;
