import React, { useState, useEffect } from 'react';
import { CheckCircle2, Play } from 'lucide-react';
import { get, post, patch, del } from '../../../utils/apiClient';

const SecurityInvestigation = ({ stepNumber, workflowType, onComplete, onError, setIsLoading, data }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [doorDetails, setDoorDetails] = useState(null);
  const [cardholderPermissions, setCardholderPermissions] = useState(null);

  // Fetch events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await get('/api/events?limit=50');
        const eventsList = response?.data?.results 
          || response?.data 
          || response?.results 
          || [];
        setEvents(Array.isArray(eventsList) ? eventsList : []);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        onError('Failed to load events. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (stepNumber === 1) {
      fetchEvents();
    }
  }, [stepNumber, setIsLoading, onError]);

  const handleStep1Submit = () => {
    if (!selectedEvent) {
      onError('Please select an event to investigate');
      return;
    }
    onComplete({
      event: selectedEvent
    });
  };

  const handleStep2Submit = async () => {
    if (!selectedEvent?.doorId) {
      onError('No door information available for this event');
      return;
    }

    try {
      setIsLoading(true);
      const response = await get(`/api/doors/${selectedEvent.doorId}`);
      const door = response?.data || response;
      setDoorDetails(door);
      onComplete({
        door: door
      });
    } catch (error) {
      console.error('Failed to fetch door details:', error);
      onError('Failed to load door details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep3Submit = async () => {
    if (!selectedEvent?.cardholderId) {
      onError('No cardholder information available for this event');
      return;
    }

    try {
      setIsLoading(true);
      const response = await get(`/api/cardholders/${selectedEvent.cardholderId}/access-groups`);
      const perms = response?.data?.results 
        || response?.data 
        || response?.results 
        || response
        || [];
      setCardholderPermissions(perms);
      onComplete({
        permissions: perms
      });
    } catch (error) {
      console.error('Failed to fetch cardholder permissions:', error);
      onError('Failed to load cardholder permissions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep4Submit = () => {
    onComplete({
      cameraReviewed: true,
      timestamp: new Date().toISOString()
    });
  };

  // Step 1: Filter Events
  if (stepNumber === 1) {
    return (
      <div className="step-form">
        <p className="step-info">Find and select the event you want to investigate:</p>

        <div className="event-list">
          {events.length > 0 ? (
            events.map(event => (
              <button
                key={event.id}
                className={`event-item ${selectedEvent?.id === event.id ? 'selected' : ''}`}
                onClick={() => setSelectedEvent(event)}
              >
                <div className="event-time">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </div>
                <div className="event-details">
                  <div className="event-type">{event.eventType}</div>
                  <div className="event-cardholder">{event.cardholderName || 'Unknown'}</div>
                  <div className="event-location">{event.doorName || 'Unknown Door'}</div>
                </div>
                <div className={`event-status ${event.status}`}>
                  {event.status}
                </div>
              </button>
            ))
          ) : (
            <p className="no-items">No events available</p>
          )}
        </div>

        {selectedEvent && (
          <button 
            className="step-submit-btn"
            onClick={handleStep1Submit}
          >
            <CheckCircle2 size={18} />
            Select This Event
          </button>
        )}
      </div>
    );
  }

  // Step 2: View Door Details
  if (stepNumber === 2) {
    return (
      <div className="step-form">
        <p className="step-info">Door details for the access location:</p>

        {doorDetails ? (
          <div className="preview-box">
            <div className="preview-section">
              <label>Door Name</label>
              <p>{doorDetails.name}</p>
            </div>
            <div className="preview-section">
              <label>Location</label>
              <p>{doorDetails.location}</p>
            </div>
            <div className="preview-section">
              <label>Status</label>
              <p><span className={`status-badge ${doorDetails.status}`}>{doorDetails.status}</span></p>
            </div>
            <div className="preview-section">
              <label>Access Mode</label>
              <p>{doorDetails.accessMode || 'Standard'}</p>
            </div>
          </div>
        ) : (
          <p className="step-info">Loading door details...</p>
        )}

        <button 
          className="step-submit-btn"
          onClick={handleStep2Submit}
        >
          <CheckCircle2 size={18} />
          Continue
        </button>
      </div>
    );
  }

  // Step 3: Check Permissions
  if (stepNumber === 3) {
    return (
      <div className="step-form">
        <p className="step-info">Cardholder's access groups and permissions:</p>

        {cardholderPermissions && cardholderPermissions.length > 0 ? (
          <div className="access-group-list">
            {cardholderPermissions.map(group => (
              <div key={group.id} className="access-group-item">
                <CheckCircle2 size={18} />
                <div>
                  <strong>{group.name}</strong>
                  {group.description && <p>{group.description}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-items">No access groups assigned</p>
        )}

        <button 
          className="step-submit-btn"
          onClick={handleStep3Submit}
        >
          <CheckCircle2 size={18} />
          Continue
        </button>
      </div>
    );
  }

  // Step 4: Camera Feed
  if (stepNumber === 4) {
    return (
      <div className="step-form">
        <p className="step-info">Review camera feed for the event location:</p>

        <div className="video-placeholder">
          <div className="video-frame">
            <Play size={64} />
            <p>Camera Feed</p>
          </div>
          <div className="video-info">
            <div className="video-detail">
              <label>Camera</label>
              <p>Main Entrance Cam 1</p>
            </div>
            <div className="video-detail">
              <label>Time</label>
              <p>{selectedEvent ? new Date(selectedEvent.timestamp).toLocaleString() : 'N/A'}</p>
            </div>
            <div className="video-detail">
              <label>Duration</label>
              <p>5 minutes</p>
            </div>
          </div>
        </div>

        <button 
          className="step-submit-btn"
          onClick={handleStep4Submit}
        >
          <CheckCircle2 size={18} />
          Finish Investigation
        </button>
      </div>
    );
  }

  return null;
};

export default SecurityInvestigation;
