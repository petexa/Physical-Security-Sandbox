import { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Copy, Check, Play } from 'lucide-react';
import './ApiDocs.css';

// API Documentation data
const API_DOCS = {
  gallagher: [
    {
      section: 'Authentication',
      endpoints: [
        {
          method: 'GET',
          path: '/api/health',
          description: 'Check API health and connection status',
          parameters: [],
          response: {
            status: 200,
            example: {
              gallagher: {
                status: 'online',
                version: '8.90',
                uptime: '45 days',
                apiStatus: 'operational'
              },
              milestone: {
                status: 'online',
                version: '2024.01',
                serverCount: 2,
                apiStatus: 'operational'
              }
            }
          }
        }
      ]
    },
    {
      section: 'Cardholders',
      endpoints: [
        {
          method: 'GET',
          path: '/api/gallagher/cardholders',
          description: 'Retrieve list of cardholders',
          parameters: [
            { name: 'top', type: 'integer', required: false, description: 'Max results (default 100)' },
            { name: 'skip', type: 'integer', required: false, description: 'Skip N for pagination' },
            { name: 'search', type: 'string', required: false, description: 'Search by name' }
          ],
          response: {
            status: 200,
            example: {
              results: [
                {
                  id: 'ch-001',
                  firstName: 'John',
                  lastName: 'Smith',
                  email: 'john.smith@company.com',
                  department: 'Security',
                  authorised: true,
                  cardNumber: '12345678'
                }
              ],
              total: 1247
            }
          }
        },
        {
          method: 'POST',
          path: '/api/gallagher/cardholders',
          description: 'Create a new cardholder',
          parameters: [
            { name: 'firstName', type: 'string', required: true, description: 'First name' },
            { name: 'lastName', type: 'string', required: true, description: 'Last name' },
            { name: 'email', type: 'string', required: false, description: 'Email address' },
            { name: 'department', type: 'string', required: false, description: 'Department' },
            { name: 'authorised', type: 'boolean', required: false, description: 'Authorization status (default true)' }
          ],
          response: {
            status: 201,
            example: {
              id: 'ch-001',
              firstName: 'John',
              lastName: 'Smith',
              email: 'john.smith@company.com',
              department: 'Security',
              authorised: true
            }
          }
        },
        {
          method: 'PATCH',
          path: '/api/gallagher/cardholders/{id}',
          description: 'Update cardholder information',
          parameters: [
            { name: 'firstName', type: 'string', required: false, description: 'First name' },
            { name: 'lastName', type: 'string', required: false, description: 'Last name' },
            { name: 'email', type: 'string', required: false, description: 'Email address' },
            { name: 'department', type: 'string', required: false, description: 'Department' },
            { name: 'authorised', type: 'boolean', required: false, description: 'Authorization status' }
          ],
          response: {
            status: 200,
            example: {
              id: 'ch-001',
              firstName: 'John',
              lastName: 'Smith',
              email: 'john.smith@company.com',
              department: 'Management',
              authorised: true
            }
          }
        },
        {
          method: 'DELETE',
          path: '/api/gallagher/cardholders/{id}',
          description: 'Delete a cardholder',
          parameters: [],
          response: {
            status: 204,
            example: {}
          }
        }
      ]
    },
    {
      section: 'Doors',
      endpoints: [
        {
          method: 'GET',
          path: '/api/gallagher/doors',
          description: 'Retrieve list of doors',
          parameters: [
            { name: 'top', type: 'integer', required: false, description: 'Max results (default 100)' },
            { name: 'search', type: 'string', required: false, description: 'Search by name' }
          ],
          response: {
            status: 200,
            example: {
              results: [
                {
                  id: 'dr-001',
                  name: 'Main Entrance',
                  location: 'Floor 1',
                  status: 'online',
                  controller: 'ctrl-001'
                }
              ],
              total: 42
            }
          }
        }
      ]
    },
    {
      section: 'Access Groups',
      endpoints: [
        {
          method: 'GET',
          path: '/api/gallagher/access-groups',
          description: 'Retrieve list of access groups',
          parameters: [
            { name: 'top', type: 'integer', required: false, description: 'Max results' }
          ],
          response: {
            status: 200,
            example: {
              results: [
                {
                  id: 'ag-001',
                  name: 'Executive Team',
                  description: 'Full building access',
                  memberCount: 8,
                  doors: ['dr-001', 'dr-002', 'dr-003']
                }
              ],
              total: 12
            }
          }
        },
        {
          method: 'POST',
          path: '/api/gallagher/access-groups',
          description: 'Create an access group',
          parameters: [
            { name: 'name', type: 'string', required: true, description: 'Group name' },
            { name: 'description', type: 'string', required: false, description: 'Group description' }
          ],
          response: {
            status: 201,
            example: {
              id: 'ag-001',
              name: 'Executive Team',
              description: 'Full building access',
              memberCount: 0,
              doors: []
            }
          }
        }
      ]
    },
    {
      section: 'Events',
      endpoints: [
        {
          method: 'GET',
          path: '/api/gallagher/events',
          description: 'Retrieve access events',
          parameters: [
            { name: 'top', type: 'integer', required: false, description: 'Max results (default 100)' },
            { name: 'filter', type: 'string', required: false, description: 'Filter by status' }
          ],
          response: {
            status: 200,
            example: {
              results: [
                {
                  id: 'evt-001',
                  timestamp: '2024-01-04T10:30:00Z',
                  cardholderId: 'ch-001',
                  cardholderName: 'John Smith',
                  doorId: 'dr-001',
                  doorName: 'Main Entrance',
                  eventType: 'access_granted',
                  status: 'allowed'
                }
              ],
              total: 5429
            }
          }
        }
      ]
    }
  ],
  milestone: [
    {
      section: 'Cameras',
      endpoints: [
        {
          method: 'GET',
          path: '/api/milestone/cameras',
          description: 'Retrieve list of cameras',
          parameters: [
            { name: 'top', type: 'integer', required: false, description: 'Max results' }
          ],
          response: {
            status: 200,
            example: {
              results: [
                {
                  id: 'cam-001',
                  name: 'Main Lobby',
                  location: 'Floor 1',
                  status: 'recording',
                  resolution: '4K',
                  framerate: 30
                }
              ],
              total: 8
            }
          }
        }
      ]
    },
    {
      section: 'Recording Servers',
      endpoints: [
        {
          method: 'GET',
          path: '/api/milestone/recording-servers',
          description: 'Retrieve recording servers',
          parameters: [],
          response: {
            status: 200,
            example: {
              results: [
                {
                  id: 'srv-001',
                  name: 'Primary Recorder',
                  status: 'online',
                  storageUsed: 2.4,
                  storageTotal: 8.0
                }
              ],
              total: 1
            }
          }
        }
      ]
    }
  ]
};

export default function ApiDocs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVendor, setActiveVendor] = useState('gallagher');
  const [expandedSection, setExpandedSection] = useState('Cardholders');
  const [expandedEndpoint, setExpandedEndpoint] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const vendors = [
    { id: 'gallagher', label: 'Gallagher' },
    { id: 'milestone', label: 'Milestone' }
  ];

  // Filter documentation based on search
  const filteredDocs = API_DOCS[activeVendor].filter(section => {
    const query = searchQuery.toLowerCase();
    return (
      section.section.toLowerCase().includes(query) ||
      section.endpoints.some(endpoint =>
        endpoint.path.toLowerCase().includes(query) ||
        endpoint.description.toLowerCase().includes(query) ||
        endpoint.method.toLowerCase().includes(query)
      )
    );
  });

  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const generateCurl = (endpoint) => {
    const path = endpoint.path.replace('{id}', 'ch-001');
    return `curl -X ${endpoint.method} https://sandbox.petefox.co.uk${path} \\
  -H "Content-Type: application/json"`;
  };

  return (
    <div className="api-docs">
      <div className="docs-header">
        <h1>API Documentation</h1>
        <p className="docs-subtitle">Complete reference for Gallagher and Milestone APIs</p>
      </div>

      <div className="docs-container">
        {/* Sidebar */}
        <aside className="docs-sidebar">
          <div className="vendor-selector">
            {vendors.map(vendor => (
              <button
                key={vendor.id}
                className={`vendor-btn ${activeVendor === vendor.id ? 'active' : ''}`}
                onClick={() => setActiveVendor(vendor.id)}
              >
                {vendor.label}
              </button>
            ))}
          </div>

          <div className="docs-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search endpoints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <nav className="docs-nav">
            {filteredDocs.map((section, idx) => (
              <div key={idx} className="nav-section">
                <button
                  className={`nav-section-btn ${expandedSection === section.section ? 'expanded' : ''}`}
                  onClick={() => setExpandedSection(expandedSection === section.section ? null : section.section)}
                >
                  {expandedSection === section.section ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  {section.section}
                </button>
                {expandedSection === section.section && (
                  <div className="nav-endpoints">
                    {section.endpoints.map((endpoint, idx2) => (
                      <button
                        key={idx2}
                        className={`nav-endpoint ${expandedEndpoint === `${idx}-${idx2}` ? 'active' : ''}`}
                        onClick={() => setExpandedEndpoint(`${idx}-${idx2}`)}
                      >
                        <span className={`method-badge ${endpoint.method.toLowerCase()}`}>
                          {endpoint.method}
                        </span>
                        <span className="endpoint-path">{endpoint.path.split('/').pop()}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="docs-main">
          {filteredDocs.length === 0 ? (
            <div className="docs-empty">
              <p>No endpoints found matching "{searchQuery}"</p>
            </div>
          ) : (
            filteredDocs.map((section, sectionIdx) => (
              <section key={sectionIdx} className="doc-section">
                <h2>{section.section}</h2>
                {section.endpoints.map((endpoint, endpointIdx) => (
                  <article key={endpointIdx} className="endpoint-docs">
                    <div className="endpoint-header">
                      <div className="endpoint-title">
                        <span className={`method-badge ${endpoint.method.toLowerCase()}`}>
                          {endpoint.method}
                        </span>
                        <code className="endpoint-path">{endpoint.path}</code>
                      </div>
                      <p className="endpoint-desc">{endpoint.description}</p>
                    </div>

                    {endpoint.parameters.length > 0 && (
                      <div className="endpoint-section">
                        <h3>Parameters</h3>
                        <table className="params-table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Type</th>
                              <th>Required</th>
                              <th>Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {endpoint.parameters.map((param, idx) => (
                              <tr key={idx}>
                                <td><code>{param.name}</code></td>
                                <td><code>{param.type}</code></td>
                                <td>{param.required ? '✓' : '-'}</td>
                                <td>{param.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div className="endpoint-section">
                      <h3>Response</h3>
                      <div className="response-info">
                        <span className="status-badge">HTTP {endpoint.response.status}</span>
                      </div>
                      <div className="code-block">
                        <div className="code-header">
                          <span>Response Example</span>
                          <button
                            className={`copy-btn ${copiedIndex === `${sectionIdx}-${endpointIdx}` ? 'copied' : ''}`}
                            onClick={() => handleCopyCode(JSON.stringify(endpoint.response.example, null, 2), `${sectionIdx}-${endpointIdx}`)}
                          >
                            {copiedIndex === `${sectionIdx}-${endpointIdx}` ? (
                              <><Check size={14} /> Copied!</>
                            ) : (
                              <><Copy size={14} /> Copy</>
                            )}
                          </button>
                        </div>
                        <pre><code>{JSON.stringify(endpoint.response.example, null, 2)}</code></pre>
                      </div>
                    </div>

                    <div className="endpoint-section">
                      <h3>Example Request</h3>
                      <div className="code-block">
                        <div className="code-header">
                          <span>cURL</span>
                          <button
                            className={`copy-btn ${copiedIndex === `curl-${sectionIdx}-${endpointIdx}` ? 'copied' : ''}`}
                            onClick={() => handleCopyCode(generateCurl(endpoint), `curl-${sectionIdx}-${endpointIdx}`)}
                          >
                            {copiedIndex === `curl-${sectionIdx}-${endpointIdx}` ? (
                              <><Check size={14} /> Copied!</>
                            ) : (
                              <><Copy size={14} /> Copy</>
                            )}
                          </button>
                        </div>
                        <pre><code>{generateCurl(endpoint)}</code></pre>
                      </div>
                    </div>

                    <div className="endpoint-actions">
                      <button className="try-btn">
                        <Play size={16} />
                        Try in API Console
                      </button>
                    </div>
                  </article>
                ))}
              </section>
            ))
          )}
        </main>
      </div>
    </div>
  );
}
