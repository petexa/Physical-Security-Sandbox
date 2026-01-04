import { useState } from 'react';
import { X, Edit2, Save, X as XIcon } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { patch } from '../utils/apiClient';
import './EditableDetailModal.css';

export default function EditableDetailModal({ item, type, onClose, onSave }) {
  console.log('EditableDetailModal rendered with item:', item, 'type:', type);
  if (!item) {
    console.log('Item is null/undefined, returning null');
    return null;
  }

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(item || {});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // Determine the API endpoint based on type
      let endpoint = '';
      switch (type) {
        case 'cardholder':
          endpoint = `/api/cardholders/${formData.id}`;
          break;
        case 'door':
          endpoint = `/api/doors/${formData.id}`;
          break;
        case 'access-group':
          endpoint = `/api/access_groups/${formData.id}`;
          break;
        case 'controller':
          endpoint = `/api/controllers/${formData.id}`;
          break;
        default:
          throw new Error(`Unsupported type for editing: ${type}`);
      }

      // Send PATCH request to update
      const response = await patch(endpoint, {
        ...formData,
        modified: new Date().toISOString()
      });

      if (response.status === 200) {
        setIsEditing(false);
        if (onSave) {
          onSave(response.data);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to save changes');
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(item);
    setIsEditing(false);
    setError(null);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isEditing) {
      onClose();
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'cardholder':
        return `${formData.first_name} ${formData.last_name}`;
      case 'door':
        return formData.name;
      case 'access-group':
        return formData.name;
      case 'controller':
        return formData.name;
      default:
        return 'Details';
    }
  };

  const renderEditableField = (label, field, value, options = {}) => {
    if (isEditing && options.editable !== false) {
      if (options.type === 'select') {
        const choices = Array.isArray(options.choices) ? options.choices : [];
        return (
          <div className="form-group" key={field}>
            <label>{label}</label>
            <select 
              value={formData[field] || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
            >
              {choices.map(choice => (
                <option key={choice} value={choice}>{choice}</option>
              ))}
            </select>
          </div>
        );
      }
      return (
        <div className="form-group" key={field}>
          <label>{label}</label>
          <input
            type={options.type || 'text'}
            value={formData[field] || value || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            disabled={options.disabled}
          />
        </div>
      );
    }
    return (
      <div className="detail-row" key={field}>
        <div className="detail-label">{label}</div>
        <div className="detail-value">{value || 'N/A'}</div>
      </div>
    );
  };

  const renderCardholderForm = () => {
    if (isEditing) {
      return (
        <form className="edit-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            {renderEditableField('First Name', 'first_name', formData.first_name)}
            {renderEditableField('Last Name', 'last_name', formData.last_name)}
            {renderEditableField('Email', 'email', formData.email, { type: 'email' })}
            {renderEditableField('Phone', 'phone', formData.phone)}
          </div>

          <div className="form-section">
            <h3>Organization</h3>
            {renderEditableField('Department', 'department', formData.department)}
            {renderEditableField('Job Title', 'job_title', formData.job_title)}
            {renderEditableField('Division', 'division', formData.division)}
          </div>

          <div className="form-section">
            <h3>Credentials</h3>
            {renderEditableField('Card Number', 'card_number', formData.card_number, { disabled: true })}
            {renderEditableField('Card Type', 'card_type', formData.card_type)}
          </div>

          <div className="form-section">
            <h3>Status</h3>
            {renderEditableField('Status', 'status', formData.status, {
              type: 'select',
              choices: ['active', 'inactive', 'suspended'],
              editable: true
            })}
          </div>
        </form>
      );
    }

    return (
      <div className="detail-grid">
        <div className="detail-section">
          <h3>Basic Information</h3>
          <div className="detail-rows">
            <div className="detail-row">
              <div className="detail-label">ID</div>
              <div className="detail-value"><code>{formData.id}</code></div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Name</div>
              <div className="detail-value">{formData.first_name} {formData.last_name}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Email</div>
              <div className="detail-value">{formData.email}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Phone</div>
              <div className="detail-value">{formData.phone || 'N/A'}</div>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Organization</h3>
          <div className="detail-rows">
            <div className="detail-row">
              <div className="detail-label">Department</div>
              <div className="detail-value">{formData.department}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Job Title</div>
              <div className="detail-value">{formData.job_title}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Division</div>
              <div className="detail-value">{formData.division || 'N/A'}</div>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Credentials</h3>
          <div className="detail-rows">
            <div className="detail-row">
              <div className="detail-label">Card Number</div>
              <div className="detail-value"><code>{formData.card_number}</code></div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Card Type</div>
              <div className="detail-value">{formData.card_type || 'Standard'}</div>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Status</h3>
          <div className="detail-rows">
            <div className="detail-row">
              <div className="detail-label">Status</div>
              <div className="detail-value">
                <StatusBadge 
                  status={formData.status === 'active' ? 'success' : 'error'} 
                  text={formData.status}
                  showIcon={false}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Metadata</h3>
          <div className="detail-rows">
            <div className="detail-row">
              <div className="detail-label">Created</div>
              <div className="detail-value">{formData.created ? new Date(formData.created).toLocaleString() : 'N/A'}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Modified</div>
              <div className="detail-value">{formData.modified ? new Date(formData.modified).toLocaleString() : 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDoorForm = () => {
    if (isEditing) {
      return (
        <form className="edit-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            {renderEditableField('Name', 'name', formData.name)}
            {renderEditableField('Location', 'location', formData.location)}
            {renderEditableField('Description', 'description', formData.description)}
          </div>

          <div className="form-section">
            <h3>Hardware</h3>
            {renderEditableField('Controller', 'controller_id', formData.controller_id, { disabled: true })}
            {renderEditableField('Reader ID', 'reader_id', formData.reader_id)}
          </div>

          <div className="form-section">
            <h3>Configuration</h3>
            {renderEditableField('Mode', 'mode', formData.mode, {
              type: 'select',
              choices: ['Normal', 'Restricted', 'Emergency'],
              editable: true
            })}
          </div>
        </form>
      );
    }

    return (
      <div className="detail-grid">
        <div className="detail-section">
          <h3>Basic Information</h3>
          <div className="detail-rows">
            <div className="detail-row">
              <div className="detail-label">ID</div>
              <div className="detail-value"><code>{formData.id}</code></div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Name</div>
              <div className="detail-value">{formData.name}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Location</div>
              <div className="detail-value">{formData.location}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Description</div>
              <div className="detail-value">{formData.description || 'N/A'}</div>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Hardware</h3>
          <div className="detail-rows">
            <div className="detail-row">
              <div className="detail-label">Controller</div>
              <div className="detail-value"><code>{formData.controller_id}</code></div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Reader ID</div>
              <div className="detail-value"><code>{formData.reader_id || 'N/A'}</code></div>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Status</h3>
          <div className="detail-rows">
            <div className="detail-row">
              <div className="detail-label">Status</div>
              <div className="detail-value">
                <StatusBadge 
                  status={formData.status === 'online' ? 'success' : formData.status === 'offline' ? 'error' : 'warning'}
                  text={formData.status}
                  showIcon={true}
                />
              </div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Mode</div>
              <div className="detail-value">{formData.mode || 'Normal'}</div>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Metadata</h3>
          <div className="detail-rows">
            <div className="detail-row">
              <div className="detail-label">Created</div>
              <div className="detail-value">{formData.created ? new Date(formData.created).toLocaleString() : 'N/A'}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Modified</div>
              <div className="detail-value">{formData.modified ? new Date(formData.modified).toLocaleString() : 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAccessGroupForm = () => {
    if (isEditing) {
      return (
        <form className="edit-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            {renderEditableField('Name', 'name', formData.name)}
            {renderEditableField('Description', 'description', formData.description)}
          </div>

          <div className="form-section">
            <h3>Configuration</h3>
            {renderEditableField('Schedule', 'schedule', formData.schedule)}
          </div>
        </form>
      );
    }

    return (
      <div className="detail-grid">
        <div className="detail-section">
          <h3>Basic Information</h3>
          <div className="detail-rows">
            <div className="detail-row">
              <div className="detail-label">ID</div>
              <div className="detail-value"><code>{formData.id}</code></div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Name</div>
              <div className="detail-value">{formData.name}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Description</div>
              <div className="detail-value">{formData.description}</div>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Access Configuration</h3>
          <div className="detail-rows">
            <div className="detail-row">
              <div className="detail-label">Member Count</div>
              <div className="detail-value">{formData.member_count || 0}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Schedule</div>
              <div className="detail-value">{formData.schedule || 'N/A'}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Doors</div>
              <div className="detail-value">
                {formData.doors && formData.doors.length > 0 ? (
                  <ul className="detail-list">
                    {formData.doors.map((door, idx) => (
                      <li key={idx}>{door}</li>
                    ))}
                  </ul>
                ) : 'No doors assigned'}
              </div>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Metadata</h3>
          <div className="detail-rows">
            <div className="detail-row">
              <div className="detail-label">Created</div>
              <div className="detail-value">{formData.created ? new Date(formData.created).toLocaleString() : 'N/A'}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Modified</div>
              <div className="detail-value">{formData.modified ? new Date(formData.modified).toLocaleString() : 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDetails = () => {
    switch (type) {
      case 'cardholder':
        return renderCardholderForm();
      case 'door':
        return renderDoorForm();
      case 'access-group':
        return renderAccessGroupForm();
      default:
        return <div>Editing not available for this entity type</div>;
    }
  };

  console.log('About to render modal, isEditing:', isEditing);
  console.log('renderDetails will return:', renderDetails());

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{getTitle()}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}
          {renderDetails()}
        </div>
        <div className="modal-footer">
          <div className="last-updated">
            Last Updated: {formData.modified ? new Date(formData.modified).toLocaleString() : 'N/A'}
          </div>
          <div className="actions">
            {!isEditing ? (
              <>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setIsEditing(true)}
                  disabled={isSaving}
                >
                  <Edit2 size={16} /> Edit
                </button>
                <button className="btn btn-primary" onClick={onClose}>
                  Close
                </button>
              </>
            ) : (
              <>
                <button 
                  className="btn btn-primary" 
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  <Save size={16} /> {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  <XIcon size={16} /> Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
