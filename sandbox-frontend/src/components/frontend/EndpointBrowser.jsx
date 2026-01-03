import { useState } from 'react';
import { ChevronDown, ChevronRight, Database, Video, Camera, Wifi } from 'lucide-react';
import './EndpointBrowser.css';

const endpoints = {
  gallagher: {
    name: 'Gallagher PACS',
    icon: <Database size={18} />,
    endpoints: [
      {
        name: 'List Cardholders',
        path: '/api/cardholders',
        method: 'GET',
        description: 'Get all cardholders'
      },
      {
        name: 'Get Cardholder',
        path: '/api/cardholders/CH-001',
        method: 'GET',
        description: 'Get specific cardholder by ID'
      },
      {
        name: 'Create Cardholder',
        path: '/api/cardholders',
        method: 'POST',
        description: 'Create a new cardholder',
        exampleBody: JSON.stringify({
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@acmecorp.com",
          department: "Engineering",
          job_title: "Engineer"
        }, null, 2)
      },
      {
        name: 'Update Cardholder',
        path: '/api/cardholders/CH-001',
        method: 'PATCH',
        description: 'Update cardholder details',
        exampleBody: JSON.stringify({
          job_title: "Senior Engineer",
          status: "active"
        }, null, 2)
      },
      {
        name: 'List Access Groups',
        path: '/api/access_groups',
        method: 'GET',
        description: 'Get all access groups'
      },
      {
        name: 'Get Access Group',
        path: '/api/access_groups/AG-ALL-STAFF',
        method: 'GET',
        description: 'Get specific access group'
      },
      {
        name: 'List Doors',
        path: '/api/doors',
        method: 'GET',
        description: 'Get all doors'
      },
      {
        name: 'Get Door',
        path: '/api/doors/DOOR-001',
        method: 'GET',
        description: 'Get specific door by ID'
      },
      {
        name: 'List Controllers',
        path: '/api/controllers',
        method: 'GET',
        description: 'Get all controllers'
      },
      {
        name: 'List Inputs',
        path: '/api/inputs',
        method: 'GET',
        description: 'Get all input points'
      },
      {
        name: 'List Outputs',
        path: '/api/outputs',
        method: 'GET',
        description: 'Get all output points'
      },
      {
        name: 'List Events',
        path: '/api/events',
        method: 'GET',
        description: 'Get events (supports filtering)'
      },
      {
        name: 'Filter Events by Type',
        path: '/api/events?type=access_denied&limit=100',
        method: 'GET',
        description: 'Filter events by type'
      },
      {
        name: 'Filter Events by Date',
        path: '/api/events?start_date=2024-11-01&end_date=2024-11-30',
        method: 'GET',
        description: 'Filter events by date range'
      }
    ]
  },
  milestone: {
    name: 'Milestone XProtect',
    icon: <Video size={18} />,
    endpoints: [
      {
        name: 'List Cameras',
        path: '/api/cameras',
        method: 'GET',
        description: 'Get all cameras'
      },
      {
        name: 'Get Camera',
        path: '/api/cameras/CAM-001',
        method: 'GET',
        description: 'Get specific camera'
      },
      {
        name: 'Get Recordings',
        path: '/api/recordings?camera_id=CAM-001&start=2024-11-01&end=2024-11-30',
        method: 'GET',
        description: 'Get recordings for camera'
      },
      {
        name: 'Create Bookmark',
        path: '/api/bookmarks',
        method: 'POST',
        description: 'Create a video bookmark',
        exampleBody: JSON.stringify({
          camera_id: "CAM-001",
          timestamp: "2024-11-15T10:30:00Z",
          description: "Security incident",
          reference: "INC-12345"
        }, null, 2)
      }
    ]
  },
  axis: {
    name: 'Axis VAPIX',
    icon: <Camera size={18} />,
    endpoints: [
      {
        name: 'Get Parameters',
        path: '/axis-cgi/param.cgi',
        method: 'GET',
        description: 'Get camera parameters'
      },
      {
        name: 'Get Snapshot',
        path: '/axis-cgi/jpg/image.cgi',
        method: 'GET',
        description: 'Capture snapshot from camera'
      }
    ]
  },
  onvif: {
    name: 'ONVIF',
    icon: <Wifi size={18} />,
    endpoints: [
      {
        name: 'Get Device Info',
        path: '/onvif/device_service',
        method: 'POST',
        description: 'Get device information',
        exampleBody: JSON.stringify({
          operation: "GetDeviceInformation"
        }, null, 2)
      },
      {
        name: 'Get Media Profiles',
        path: '/onvif/media_service',
        method: 'POST',
        description: 'Get media profiles',
        exampleBody: JSON.stringify({
          operation: "GetProfiles"
        }, null, 2)
      }
    ]
  }
};

export default function EndpointBrowser({ onSelect }) {
  const [expandedSections, setExpandedSections] = useState(new Set(['gallagher']));

  const toggleSection = (key) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedSections(newExpanded);
  };

  const getMethodClass = (method) => {
    const classes = {
      'GET': 'method-get',
      'POST': 'method-post',
      'PATCH': 'method-patch',
      'DELETE': 'method-delete'
    };
    return classes[method] || 'method-get';
  };

  return (
    <div className="endpoint-browser">
      <div className="endpoint-browser-header">
        <h3>Endpoints</h3>
      </div>

      {Object.entries(endpoints).map(([key, section]) => (
        <div key={key} className="endpoint-section">
          <button
            className="section-header"
            onClick={() => toggleSection(key)}
          >
            <div className="section-title">
              {section.icon}
              <span>{section.name}</span>
            </div>
            {expandedSections.has(key) ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>

          {expandedSections.has(key) && (
            <div className="section-endpoints">
              {section.endpoints.map((endpoint, index) => (
                <button
                  key={index}
                  className="endpoint-item"
                  onClick={() => onSelect(endpoint)}
                  title={endpoint.description}
                >
                  <span className={`method-badge ${getMethodClass(endpoint.method)}`}>
                    {endpoint.method}
                  </span>
                  <span className="endpoint-name">{endpoint.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
