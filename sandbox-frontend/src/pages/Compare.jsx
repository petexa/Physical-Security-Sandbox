import { useState, useEffect } from 'react';
import './Compare.css';

function Compare() {
  const [entityType, setEntityType] = useState('');
  const [entityId, setEntityId] = useState('');
  const [entities, setEntities] = useState([]);
  const [gallagherData, setGallagherData] = useState(null);
  const [milestoneData, setMilestoneData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load entities when type changes
  useEffect(() => {
    if (!entityType) {
      setEntities([]);
      return;
    }

    const loadEntities = async () => {
      try {
        // Load from both vendors
        const gallagherRes = await fetch(`/api/gallagher/${entityType}s`);
        const gallagherList = await gallagherRes.json();
        
        // For milestone, only load cameras
        if (entityType === 'camera') {
          const milestoneRes = await fetch('/api/milestone/cameras');
          const milestoneList = await milestoneRes.json();
          setEntities([...gallagherList, ...milestoneList]);
        } else {
          setEntities(gallagherList);
        }
      } catch (error) {
        console.error('Error loading entities:', error);
        setEntities([]);
      }
    };

    loadEntities();
  }, [entityType]);

  // Load entity data from both vendors
  const handleEntitySelect = async (id) => {
    if (!id || !entityType) return;
    
    setEntityId(id);
    setLoading(true);
    setGallagherData(null);
    setMilestoneData(null);

    try {
      // Try Gallagher
      try {
        const gallagherRes = await fetch(`/api/gallagher/${entityType}s/${id}`);
        if (gallagherRes.ok) {
          const data = await gallagherRes.json();
          setGallagherData(data);
        }
      } catch (err) {
        console.log('Gallagher data not available');
      }

      // Try Milestone (cameras only)
      if (entityType === 'camera') {
        try {
          const milestoneRes = await fetch(`/api/milestone/cameras/${id}`);
          if (milestoneRes.ok) {
            const data = await milestoneRes.json();
            setMilestoneData(data);
          }
        } catch (err) {
          console.log('Milestone data not available');
        }
      }
    } catch (error) {
      console.error('Error loading entity data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Find differences between two objects
  const findDifferences = (obj1, obj2) => {
    if (!obj1 || !obj2) return [];
    
    const differences = [];
    const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
    
    allKeys.forEach(key => {
      if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
        differences.push(key);
      }
    });
    
    return differences;
  };

  const differences = findDifferences(gallagherData, milestoneData);

  // Render field value
  const renderValue = (value) => {
    if (value === null || value === undefined) {
      return <span className="value-null">null</span>;
    }
    if (typeof value === 'object') {
      return <span className="value-object">{JSON.stringify(value, null, 2)}</span>;
    }
    if (typeof value === 'boolean') {
      return <span className={`value-boolean ${value ? 'true' : 'false'}`}>{String(value)}</span>;
    }
    return <span className="value-string">{String(value)}</span>;
  };

  // Render data panel
  const renderDataPanel = (data, vendor, isDifference) => {
    if (!data) {
      return <div className="no-data">No data available</div>;
    }

    return (
      <div className="data-fields">
        {Object.entries(data).map(([key, value]) => (
          <div 
            key={key} 
            className={`field ${differences.includes(key) ? 'field-difference' : ''}`}
          >
            <span className="field-key">{key}:</span>
            <span className="field-value">{renderValue(value)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="compare-page">
      <div className="compare-header">
        <h1>Vendor Comparison</h1>
        <p>Compare the same entity across different vendor APIs to see format differences</p>
      </div>

      <div className="compare-controls">
        <div className="control-group">
          <label>Entity Type:</label>
          <select 
            value={entityType} 
            onChange={(e) => {
              setEntityType(e.target.value);
              setEntityId('');
              setGallagherData(null);
              setMilestoneData(null);
            }}
          >
            <option value="">Select entity type...</option>
            <option value="cardholder">Cardholders</option>
            <option value="door">Doors</option>
            <option value="access-group">Access Groups</option>
            <option value="camera">Cameras</option>
            <option value="event">Events</option>
          </select>
        </div>

        <div className="control-group">
          <label>Entity:</label>
          <select 
            value={entityId} 
            onChange={(e) => handleEntitySelect(e.target.value)}
            disabled={!entityType || entities.length === 0}
          >
            <option value="">Select entity...</option>
            {entities.map(entity => (
              <option key={entity.id} value={entity.id}>
                {entity.name || entity.firstName || entity.description || `ID: ${entity.id}`}
              </option>
            ))}
          </select>
        </div>

        {differences.length > 0 && (
          <div className="differences-count">
            {differences.length} field{differences.length !== 1 ? 's' : ''} differ
          </div>
        )}
      </div>

      {loading && (
        <div className="compare-loading">Loading entity data...</div>
      )}

      {!loading && (gallagherData || milestoneData) && (
        <div className="compare-container">
          <div className="column gallagher">
            <h2>Gallagher API</h2>
            {renderDataPanel(gallagherData, 'Gallagher')}
          </div>
          
          <div className="column milestone">
            <h2>Milestone API</h2>
            {renderDataPanel(milestoneData, 'Milestone')}
          </div>
        </div>
      )}

      {!loading && !gallagherData && !milestoneData && entityId && (
        <div className="compare-empty">
          <p>No data available for this entity in either vendor system.</p>
        </div>
      )}

      {!entityId && (
        <div className="compare-empty">
          <p>👆 Select an entity type and specific entity to compare vendor data formats.</p>
        </div>
      )}
    </div>
  );
}

export default Compare;
