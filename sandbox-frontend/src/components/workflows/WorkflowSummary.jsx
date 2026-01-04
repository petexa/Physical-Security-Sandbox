import React, { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { formatTrackedCalls } from '../../utils/workflowApiTracker';
import './WorkflowSummary.css';

const WorkflowSummary = ({ workflowId, workflowName, apiCalls, workflowData, trackedApiCalls }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [expandedCall, setExpandedCall] = useState(0);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Use tracked API calls if available, otherwise use workflow-specific examples
  const getDisplayApiCalls = () => {
    if (trackedApiCalls && trackedApiCalls.length > 0) {
      return formatTrackedCalls(trackedApiCalls);
    }
    
    // Fallback to workflow-specific examples
    return getWorkflowApiCallExamples();
  };

  // Define API call examples for each workflow type
  const getWorkflowApiCallExamples = () => {
    switch (workflowId) {
      case 'onboarding':
        return [
          {
            title: '1. Create Cardholder',
            method: 'POST',
            endpoint: '/api/cardholders',
            description: 'Create a new cardholder with employee information',
            curl: `curl -X POST http://localhost:3000/api/cardholders \\
  -H "Content-Type: application/json" \\
  -d '{
    "firstName": "${workflowData?.cardholder?.firstName || 'John'}",
    "lastName": "${workflowData?.cardholder?.lastName || 'Doe'}",
    "email": "${workflowData?.cardholder?.email || 'john.doe@company.com'}",
    "department": "${workflowData?.cardholder?.department || 'Sales'}"
  }'`,
            code: {
              javascript: `const cardholder = await fetch('/api/cardholders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: '${workflowData?.cardholder?.firstName || 'John'}',
    lastName: '${workflowData?.cardholder?.lastName || 'Doe'}',
    email: '${workflowData?.cardholder?.email || 'john.doe@company.com'}',
    department: '${workflowData?.cardholder?.department || 'Sales'}'
  })
}).then(r => r.json());`,
              python: `import requests

cardholder = requests.post('http://localhost:3000/api/cardholders', json={
    'firstName': '${workflowData?.cardholder?.firstName || 'John'}',
    'lastName': '${workflowData?.cardholder?.lastName || 'Doe'}',
    'email': '${workflowData?.cardholder?.email || 'john.doe@company.com'}',
    'department': '${workflowData?.cardholder?.department || 'Sales'}'
}).json()`
            }
          },
          {
            title: '2. Assign Access Groups',
            method: 'POST',
            endpoint: '/api/access_groups/{id}/members',
            description: 'Add the cardholder to selected access groups',
            curl: `curl -X POST http://localhost:3000/api/access_groups/{groupId}/members \\
  -H "Content-Type: application/json" \\
  -d '{
    "cardholderId": "${workflowData?.cardholder?.id || 'cardholder_id'}"
  }'`,
            code: {
              javascript: `// Repeat for each selected access group
for (const groupId of accessGroupIds) {
  await fetch(\`/api/access_groups/\${groupId}/members\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cardholderId: cardholder.id
    })
  });
}`,
              python: `# Repeat for each selected access group
for group_id in access_group_ids:
    requests.post(f'http://localhost:3000/api/access_groups/{group_id}/members', json={
        'cardholderId': cardholder['id']
    })`
            }
          },
          {
            title: '3. Issue Credential',
            method: 'POST',
            endpoint: '/api/credentials',
            description: 'Create and issue an access credential for the cardholder',
            curl: `curl -X POST http://localhost:3000/api/credentials \\
  -H "Content-Type: application/json" \\
  -d '{
    "cardholderId": "${workflowData?.cardholder?.id || 'cardholder_id'}",
    "cardType": "PROXIMITY",
    "cardNumber": "CARD-${workflowData?.credential?.cardNumber?.split('-')[1] || 'XXXXX'}",
    "facilityCode": 1,
    "status": "active"
  }'`,
            code: {
              javascript: `const credential = await fetch('/api/credentials', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cardholderId: cardholder.id,
    cardType: 'PROXIMITY',
    cardNumber: 'CARD-${workflowData?.credential?.cardNumber?.split('-')[1] || 'XXXXX'}',
    facilityCode: 1,
    status: 'active'
  })
}).then(r => r.json());`,
              python: `credential = requests.post('http://localhost:3000/api/credentials', json={
    'cardholderId': cardholder['id'],
    'cardType': 'PROXIMITY',
    'cardNumber': 'CARD-${workflowData?.credential?.cardNumber?.split('-')[1] || 'XXXXX'}',
    'facilityCode': 1,
    'status': 'active'
}).json()`
            }
          }
        ];
      case 'termination':
        return [
          {
            title: '1. Disable Credentials',
            method: 'PATCH',
            endpoint: '/api/credentials/{id}',
            description: 'Deactivate all credentials for the employee',
            curl: `curl -X PATCH http://localhost:3000/api/credentials/{credentialId} \\
  -H "Content-Type: application/json" \\
  -d '{
    "status": "inactive"
  }'`
          },
          {
            title: '2. Remove from Access Groups',
            method: 'DELETE',
            endpoint: '/api/access_groups/{id}/members/{memberId}',
            description: 'Remove the employee from all access groups',
            curl: `curl -X DELETE http://localhost:3000/api/access_groups/{groupId}/members/{cardholderId}`
          },
          {
            title: '3. Update Cardholder Status',
            method: 'PATCH',
            endpoint: '/api/cardholders/{id}',
            description: 'Mark the cardholder as terminated',
            curl: `curl -X PATCH http://localhost:3000/api/cardholders/{cardholderId} \\
  -H "Content-Type: application/json" \\
  -d '{
    "status": "terminated",
    "terminationDate": "${new Date().toISOString()}"
  }'`
          }
        ];
      case 'investigation':
        return [
          {
            title: '1. Query Events',
            method: 'GET',
            endpoint: '/api/events',
            description: 'Retrieve security events with filters',
            curl: `curl -X GET "http://localhost:3000/api/events?eventType=ENTRY_DENIED&limit=100"`
          },
          {
            title: '2. Get Event Details',
            method: 'GET',
            endpoint: '/api/events/{id}',
            description: 'Retrieve detailed information about a specific event',
            curl: `curl -X GET http://localhost:3000/api/events/{eventId}`
          },
          {
            title: '3. Check Cardholder Permissions',
            method: 'GET',
            endpoint: '/api/cardholders/{id}/access-groups',
            description: 'Verify what access groups a cardholder belongs to',
            curl: `curl -X GET http://localhost:3000/api/cardholders/{cardholderId}/access-groups`
          }
        ];
      case 'access-group':
        return [
          {
            title: '1. Create Access Group',
            method: 'POST',
            endpoint: '/api/access_groups',
            description: 'Create a new access group with a name and description',
            curl: `curl -X POST http://localhost:3000/api/access_groups \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "${workflowData?.accessGroup?.name || 'Building A - Level 2'}",
    "description": "${workflowData?.accessGroup?.description || 'Access to Building A, 2nd floor'}"
  }'`
          },
          {
            title: '2. Assign Doors',
            method: 'PATCH',
            endpoint: '/api/access_groups/{id}/doors',
            description: 'Add doors to the access group',
            curl: `curl -X PATCH http://localhost:3000/api/access_groups/{groupId}/doors \\
  -H "Content-Type: application/json" \\
  -d '{
    "doorIds": ["door1", "door2", "door3"]
  }'`
          },
          {
            title: '3. Add Cardholders',
            method: 'POST',
            endpoint: '/api/access_groups/{id}/members',
            description: 'Assign cardholders to the access group in bulk',
            curl: `curl -X POST http://localhost:3000/api/access_groups/{groupId}/members \\
  -H "Content-Type: application/json" \\
  -d '{
    "cardholderId": "{cardholderId}"
  }'`
          }
        ];
      default:
        return [];
    }
  };

  const calls = getDisplayApiCalls();

  return (
    <div className="workflow-summary">
      <div className="summary-header">
        <div className="checkmark-circle">✓</div>
        <h2>Workflow Complete!</h2>
        <p className="workflow-title">{workflowName}</p>
      </div>

      <div className="summary-content">
        <div className="api-calls-section">
          <h3>API Calls Used</h3>
          <p className="section-description">
            Below are the API calls that were performed during this workflow. You can use these as a reference to automate this process programmatically.
          </p>

          <div className="api-calls-list">
            {calls.map((call, index) => (
              <div key={index} className="api-call-card">
                <div
                  className="api-call-header"
                  onClick={() => setExpandedCall(expandedCall === index ? null : index)}
                >
                  <div className="api-call-title">
                    <span className={`method-badge method-${call.method.toLowerCase()}`}>
                      {call.method}
                    </span>
                    <div className="api-info">
                      <h4>{call.title}</h4>
                      <code className="endpoint">{call.endpoint}</code>
                    </div>
                  </div>
                  {expandedCall === index ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>

                {expandedCall === index && (
                  <div className="api-call-details">
                    <p className="description">{call.description}</p>

                    <div className="code-example">
                      <div className="code-header">
                        <span>cURL</span>
                        <button
                          className={`copy-btn ${copiedIndex === index ? 'copied' : ''}`}
                          onClick={() => copyToClipboard(call.curl, index)}
                        >
                          {copiedIndex === index ? (
                            <>
                              <Check size={14} /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={14} /> Copy
                            </>
                          )}
                        </button>
                      </div>
                      <pre>
                        <code>{call.curl}</code>
                      </pre>
                    </div>

                    {call.code && (
                      <>
                        <div className="code-example">
                          <div className="code-header">
                            <span>JavaScript</span>
                            <button
                              className="copy-btn"
                              onClick={() =>
                                copyToClipboard(call.code.javascript, `js-${index}`)
                              }
                            >
                              <Copy size={14} /> Copy
                            </button>
                          </div>
                          <pre>
                            <code>{call.code.javascript}</code>
                          </pre>
                        </div>

                        <div className="code-example">
                          <div className="code-header">
                            <span>Python</span>
                            <button
                              className="copy-btn"
                              onClick={() =>
                                copyToClipboard(call.code.python, `py-${index}`)
                              }
                            >
                              <Copy size={14} /> Copy
                            </button>
                          </div>
                          <pre>
                            <code>{call.code.python}</code>
                          </pre>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="next-steps">
          <h3>Next Steps</h3>
          <p>
            You've successfully completed the <strong>{workflowName}</strong> workflow! 
            Use the API examples above to integrate this process into your own applications.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkflowSummary;
