import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { get, post, patch, del } from '../../../utils/apiClient';

const AccessGroupManagement = ({ stepNumber, workflowType, onComplete, onError, setIsLoading, data }) => {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [doors, setDoors] = useState([]);
  const [cardholders, setCardholders] = useState([]);
  const [selectedDoors, setSelectedDoors] = useState([]);
  const [selectedCardholders, setSelectedCardholders] = useState([]);
  const [createdGroupId, setCreatedGroupId] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch doors and cardholders
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [doorsResponse, cardholdersResponse] = await Promise.all([
          get('/api/doors'),
          get('/api/cardholders')
        ]);
        const doorsList = doorsResponse?.data?.results 
          || doorsResponse?.data 
          || doorsResponse?.results 
          || [];
        const holdersList = cardholdersResponse?.data?.results 
          || cardholdersResponse?.data 
          || cardholdersResponse?.results 
          || [];
        setDoors(Array.isArray(doorsList) ? doorsList : []);
        setCardholders(Array.isArray(holdersList) ? holdersList : []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        onError('Failed to load doors and cardholders.');
      } finally {
        setIsLoading(false);
      }
    };

    if (stepNumber === 2) {
      fetchData();
    }
  }, [stepNumber, setIsLoading, onError]);

  const validateStep1 = () => {
    const errors = {};
    if (!groupName.trim()) errors.groupName = 'Group name is required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    if (selectedDoors.length === 0) {
      onError('Please select at least one door');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (selectedCardholders.length === 0) {
      onError('Please select at least one cardholder');
      return false;
    }
    return true;
  };

  const handleStep1Submit = async () => {
    if (!validateStep1()) {
      onError('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      const response = await post('/api/access_groups', {
        name: groupName,
        description: groupDescription
      });

      const group = response?.data || response;
      setCreatedGroupId(group.id);
      onComplete({
        accessGroup: group
      });
    } catch (error) {
      console.error('Failed to create access group:', error);
      onError('Failed to create access group. Please try again.');
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
      const groupId = data?.accessGroup?.id || createdGroupId;

      // Add each door to the access group
      for (const doorId of selectedDoors) {
        await patch(`/api/access_groups/${groupId}/doors`, {
          doorId: doorId
        });
      }

      onComplete({
        doorsAdded: selectedDoors.length
      });
    } catch (error) {
      console.error('Failed to add doors:', error);
      onError('Failed to add doors. Please try again.');
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
      const groupId = data?.accessGroup?.id || createdGroupId;

      // Add each cardholder to the access group
      for (const cardholderId of selectedCardholders) {
        await post(`/api/access_groups/${groupId}/members`, {
          cardholderId: cardholderId
        });
      }

      onComplete({
        cardholdersAdded: selectedCardholders.length
      });
    } catch (error) {
      console.error('Failed to add cardholders:', error);
      onError('Failed to add cardholders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDoor = (doorId) => {
    setSelectedDoors(prev =>
      prev.includes(doorId)
        ? prev.filter(id => id !== doorId)
        : [...prev, doorId]
    );
  };

  const toggleCardholder = (cardholderId) => {
    setSelectedCardholders(prev =>
      prev.includes(cardholderId)
        ? prev.filter(id => id !== cardholderId)
        : [...prev, cardholderId]
    );
  };

  // Step 1: Create Access Group
  if (stepNumber === 1) {
    return (
      <div className="step-form">
        <div className="form-group">
          <label className="form-label">
            Group Name <span className="required">*</span>
          </label>
          <input
            type="text"
            className={`form-input ${validationErrors.groupName ? 'error' : ''}`}
            placeholder="e.g., Engineering Department"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          {validationErrors.groupName && (
            <span className="error-text">{validationErrors.groupName}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-input"
            placeholder="Description (optional)"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
            rows={3}
          />
        </div>

        <button 
          className="step-submit-btn"
          onClick={handleStep1Submit}
        >
          <CheckCircle2 size={18} />
          Create Access Group
        </button>

        {data?.accessGroup && (
          <div className="success-box">
            <CheckCircle2 size={18} />
            <div>
              <strong>Group Created</strong>
              <p>{data.accessGroup.name}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Step 2: Add Doors
  if (stepNumber === 2) {
    return (
      <div className="step-form">
        <p className="step-info">Select which doors this access group can access:</p>

        <div className="checkbox-group">
          {doors.length > 0 ? (
            doors.map(door => (
              <label key={door.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedDoors.includes(door.id)}
                  onChange={() => toggleDoor(door.id)}
                />
                <span className="checkbox-text">
                  <strong>{door.name}</strong>
                  <p>{door.location}</p>
                </span>
              </label>
            ))
          ) : (
            <p className="no-items">No doors available</p>
          )}
        </div>

        {selectedDoors.length > 0 && (
          <>
            <div className="selected-list">
              <h4>Selected Doors ({selectedDoors.length})</h4>
              {selectedDoors.map(doorId => {
                const door = doors.find(d => d.id === doorId);
                return (
                  <div key={doorId} className="selected-item">
                    <CheckCircle2 size={16} />
                    {door?.name}
                  </div>
                );
              })}
            </div>

            <button 
              className="step-submit-btn"
              onClick={handleStep2Submit}
            >
              <CheckCircle2 size={18} />
              Add Doors to Group
            </button>
          </>
        )}
      </div>
    );
  }

  // Step 3: Assign Cardholders
  if (stepNumber === 3) {
    return (
      <div className="step-form">
        <p className="step-info">Select cardholders to add to this access group:</p>

        <div className="checkbox-group">
          {cardholders.length > 0 ? (
            cardholders.map(ch => (
              <label key={ch.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedCardholders.includes(ch.id)}
                  onChange={() => toggleCardholder(ch.id)}
                />
                <span className="checkbox-text">
                  <strong>{ch.firstName} {ch.lastName}</strong>
                  <p>{ch.department}</p>
                </span>
              </label>
            ))
          ) : (
            <p className="no-items">No cardholders available</p>
          )}
        </div>

        {selectedCardholders.length > 0 && (
          <>
            <div className="selected-list">
              <h4>Selected Cardholders ({selectedCardholders.length})</h4>
              {selectedCardholders.map(chId => {
                const ch = cardholders.find(c => c.id === chId);
                return (
                  <div key={chId} className="selected-item">
                    <CheckCircle2 size={16} />
                    {ch?.firstName} {ch?.lastName}
                  </div>
                );
              })}
            </div>

            <button 
              className="step-submit-btn"
              onClick={handleStep3Submit}
            >
              <CheckCircle2 size={18} />
              Assign Cardholders
            </button>
          </>
        )}
      </div>
    );
  }

  return null;
};

export default AccessGroupManagement;
