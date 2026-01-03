export default {
  "id": "module-6",
  "title": "Integration Patterns",
  "description": "Best practices for integrating PACS, VMS, and camera systems",
  "estimatedTime": "40 minutes",
  "difficulty": "advanced",
  "prerequisites": ["module-2", "module-3", "module-4"],
  "sections": [
    {
      "id": "section-1",
      "title": "Why Integrate?",
      "content": `# Why Integrate PACS and VMS?

**Benefits of Integration:**
- **Enhanced Security:** Visual verification of access events
- **Faster Investigation:** Correlated data in one view
- **Automation:** Reduce manual tasks
- **Better Compliance:** Complete audit trail
- **Improved Response:** Real-time alerts with context

**Integration Value:**
Separate systems → Data silos
Integrated systems → Unified security platform

**ROI Factors:**
- Reduced investigation time
- Fewer false alarms
- Improved incident response
- Better resource utilization`,
      "codeExamples": []
    },
    {
      "id": "section-2",
      "title": "Common Integration Scenarios",
      "content": `# Common Integration Scenarios

**1. Access Denial with Video Bookmark**
- PACS: Access denied event occurs
- Integration: Captures event details
- VMS: Creates bookmark at camera
- Result: Quick video review of incident

**2. Alarm Triggers Recording**
- PACS: Door forced alarm
- Integration: Detects alarm type
- VMS: Starts recording all nearby cameras
- Result: Complete visual evidence

**3. Cardholder Photo Lookup**
- VMS: Unknown person detected
- Integration: Searches PACS by location/time
- PACS: Returns cardholder matches
- Result: Identity verification

**4. Investigation Workflow**
- Alarm received
- Query PACS for events
- Query VMS for video
- Create correlated timeline
- Generate investigation report`,
      "codeExamples": [
        {
          "language": "javascript",
          "code": "// Scenario: Access denial with bookmark\nasync function handleAccessDenial(pacsEvent) {\n  // 1. Get camera for door location\n  const camera = await getCameraForDoor(pacsEvent.door_id);\n  \n  if (!camera) {\n    console.log('No camera for this door');\n    return;\n  }\n  \n  // 2. Create VMS bookmark\n  const bookmark = await createVMSBookmark({\n    camera_id: camera.id,\n    timestamp: pacsEvent.timestamp,\n    description: `Access Denied: ${pacsEvent.cardholder_name}`,\n    duration: 300 // 5 minutes\n  });\n  \n  // 3. Send alert\n  await sendAlert({\n    type: 'access_denied',\n    message: `${pacsEvent.cardholder_name} denied at ${pacsEvent.door_name}`,\n    bookmark_url: bookmark.url\n  });\n  \n  console.log('Bookmark created:', bookmark.id);\n}",
          "description": "Access denial with automatic video bookmark"
        }
      ]
    },
    {
      "id": "section-3",
      "title": "Event-Driven Integration",
      "content": `# Event-Driven Integration

**Event-Driven Architecture:**
Systems publish events → Integration listens → Actions triggered

**Implementation Approaches:**

**1. Polling:**
- Periodically query for new events
- Simple to implement
- Higher latency
- More load on systems

**2. Webhooks:**
- System sends HTTP POST on event
- Real-time delivery
- Requires endpoint setup
- Better performance

**3. Message Queue:**
- Events published to queue
- Consumers process asynchronously
- Scalable and reliable
- More complex setup

**Event Processing Pattern:**
1. Receive event
2. Validate and parse
3. Determine actions
4. Execute integrations
5. Log results`,
      "codeExamples": [
        {
          "language": "javascript",
          "code": "// Event-driven integration handler\nclass SecurityEventHandler {\n  constructor(pacsClient, vmsClient) {\n    this.pacs = pacsClient;\n    this.vms = vmsClient;\n  }\n  \n  async handleEvent(event) {\n    console.log('Processing event:', event.event_type);\n    \n    switch(event.category) {\n      case 'alarm':\n        await this.handleAlarm(event);\n        break;\n      case 'access':\n        if (event.event_type === 'access_denied') {\n          await this.handleAccessDenial(event);\n        }\n        break;\n      case 'fault':\n        await this.handleFault(event);\n        break;\n    }\n  }\n  \n  async handleAlarm(event) {\n    // Start recording on all cameras in area\n    const cameras = await this.vms.getCamerasForLocation(event.location);\n    for (const camera of cameras) {\n      await this.vms.startRecording(camera.id);\n    }\n    \n    // Create bookmarks\n    await this.createBookmarksForEvent(event, cameras);\n  }\n  \n  async handleAccessDenial(event) {\n    // Create single bookmark\n    const camera = await this.getCameraForDoor(event.door_id);\n    if (camera) {\n      await this.vms.createBookmark({\n        camera_id: camera.id,\n        timestamp: event.timestamp,\n        description: `Access denied: ${event.cardholder_name}`\n      });\n    }\n  }\n  \n  async handleFault(event) {\n    // Log fault for maintenance\n    console.log('Fault event:', event.details);\n  }\n}",
          "description": "Event-driven security integration"
        }
      ]
    },
    {
      "id": "section-4",
      "title": "Correlation Techniques",
      "content": `# Correlation Techniques

**Time-Based Correlation:**
Match events by timestamp proximity
- PACS event at 14:30:15
- VMS motion at 14:30:12
- Likely related

**Location-Based Correlation:**
Match events by physical location
- Door in Building A, Floor 2
- Camera covering same area
- Events correlated by space

**Entity-Based Correlation:**
Match by common entity
- Same cardholder
- Same door
- Same controller

**Pattern Matching:**
Identify related event sequences
- Access denial → Door forced → Alarm
- Multiple denials → Successful access`,
      "codeExamples": [
        {
          "language": "javascript",
          "code": "// Correlate PACS and VMS events by time and location\nfunction correlateEvents(pacsEvents, vmsEvents, timeWindowSeconds = 30) {\n  const correlated = [];\n  \n  pacsEvents.forEach(pacsEvent => {\n    const pacsTime = new Date(pacsEvent.timestamp);\n    \n    // Find VMS events within time window\n    const matchingVMS = vmsEvents.filter(vmsEvent => {\n      const vmsTime = new Date(vmsEvent.timestamp);\n      const timeDiff = Math.abs(vmsTime - pacsTime) / 1000;\n      \n      return timeDiff <= timeWindowSeconds &&\n             vmsEvent.location === pacsEvent.location;\n    });\n    \n    if (matchingVMS.length > 0) {\n      correlated.push({\n        pacsEvent: pacsEvent,\n        vmsEvents: matchingVMS,\n        correlation: 'time_and_location'\n      });\n    }\n  });\n  \n  return correlated;\n}",
          "description": "Event correlation by time and location"
        }
      ]
    },
    {
      "id": "section-5",
      "title": "Authentication Strategies",
      "content": `# Authentication Strategies

**API Key Management:**
- Store securely (environment variables, secrets manager)
- Rotate regularly
- Use separate keys per integration
- Never commit to source control

**Token-Based Auth:**
- Obtain access token
- Include in Authorization header
- Refresh before expiry
- Handle token errors

**Certificate-Based:**
- Use TLS client certificates
- More secure than keys
- Complex setup
- Good for high-security

**Best Practices:**
- Always use HTTPS
- Implement retry logic
- Log authentication failures
- Monitor for unauthorized access`,
      "codeExamples": [
        {
          "language": "javascript",
          "code": "// Secure API client with token management\nclass SecureAPIClient {\n  constructor(baseURL, apiKey) {\n    this.baseURL = baseURL;\n    this.apiKey = apiKey; // From environment variable\n    this.token = null;\n    this.tokenExpiry = null;\n  }\n  \n  async getToken() {\n    // Check if token is still valid\n    if (this.token && this.tokenExpiry > Date.now()) {\n      return this.token;\n    }\n    \n    // Obtain new token\n    const response = await fetch(`${this.baseURL}/auth/token`, {\n      method: 'POST',\n      headers: {\n        'Authorization': `Bearer ${this.apiKey}`,\n        'Content-Type': 'application/json'\n      }\n    });\n    \n    const data = await response.json();\n    this.token = data.access_token;\n    this.tokenExpiry = Date.now() + (data.expires_in * 1000);\n    \n    return this.token;\n  }\n  \n  async request(endpoint, options = {}) {\n    const token = await this.getToken();\n    \n    const response = await fetch(`${this.baseURL}${endpoint}`, {\n      ...options,\n      headers: {\n        'Authorization': `Bearer ${token}`,\n        'Content-Type': 'application/json',\n        ...options.headers\n      }\n    });\n    \n    if (!response.ok) {\n      throw new Error(`API error: ${response.status}`);\n    }\n    \n    return response.json();\n  }\n}",
          "description": "Secure API client with token management"
        }
      ]
    },
    {
      "id": "section-6",
      "title": "Error Handling",
      "content": `# Error Handling Best Practices

**Types of Errors:**
- Network errors (timeout, connection refused)
- Authentication errors (401, 403)
- Not found errors (404)
- Validation errors (400, 422)
- Server errors (500, 503)

**Error Handling Strategy:**
1. **Catch and Log:** Always log errors with context
2. **Retry Logic:** Retry transient errors
3. **Graceful Degradation:** Continue with reduced functionality
4. **User Notification:** Inform users appropriately
5. **Monitoring:** Alert on error patterns

**Retry Patterns:**
- Exponential backoff
- Circuit breaker
- Fallback mechanisms`,
      "codeExamples": [
        {
          "language": "javascript",
          "code": "// Robust error handling with retry\nasync function fetchWithRetry(url, options = {}, maxRetries = 3) {\n  for (let attempt = 0; attempt < maxRetries; attempt++) {\n    try {\n      const response = await fetch(url, options);\n      \n      if (response.status === 401) {\n        throw new Error('Authentication failed');\n      }\n      \n      if (response.status === 404) {\n        throw new Error('Resource not found');\n      }\n      \n      if (response.status >= 500) {\n        // Server error - retry\n        if (attempt < maxRetries - 1) {\n          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff\n          await new Promise(resolve => setTimeout(resolve, delay));\n          continue;\n        }\n        throw new Error(`Server error: ${response.status}`);\n      }\n      \n      return await response.json();\n      \n    } catch (error) {\n      if (attempt === maxRetries - 1) {\n        console.error('Request failed after retries:', error);\n        throw error;\n      }\n      \n      // Network error - retry\n      const delay = Math.pow(2, attempt) * 1000;\n      await new Promise(resolve => setTimeout(resolve, delay));\n    }\n  }\n}",
          "description": "Fetch with retry and exponential backoff"
        }
      ]
    },
    {
      "id": "section-7",
      "title": "Security Considerations",
      "content": `# Security Considerations

**Data Security:**
- Encrypt sensitive data in transit (HTTPS)
- Encrypt at rest when storing
- Sanitize user input
- Validate all data

**Access Control:**
- Implement role-based access
- Least privilege principle
- Audit access logs
- Regular access reviews

**API Security:**
- Rate limiting
- Input validation
- Output encoding
- CORS configuration

**Secrets Management:**
- Never hardcode credentials
- Use secrets manager
- Rotate credentials regularly
- Monitor for exposure`,
      "codeExamples": [
        {
          "language": "javascript",
          "code": "// Input validation example\nfunction validateEventQuery(params) {\n  const errors = [];\n  \n  // Validate date format\n  if (params.start_date) {\n    const date = new Date(params.start_date);\n    if (isNaN(date.getTime())) {\n      errors.push('Invalid start_date format');\n    }\n  }\n  \n  // Validate numeric IDs\n  if (params.door_id && !Number.isInteger(params.door_id)) {\n    errors.push('door_id must be an integer');\n  }\n  \n  // Validate enum values\n  const validCategories = ['access', 'alarm', 'fault', 'system'];\n  if (params.category && !validCategories.includes(params.category)) {\n    errors.push('Invalid category value');\n  }\n  \n  // Sanitize search text\n  if (params.search) {\n    params.search = params.search.replace(/[<>\"']/g, '');\n  }\n  \n  if (errors.length > 0) {\n    throw new Error(`Validation failed: ${errors.join(', ')}`);\n  }\n  \n  return params;\n}",
          "description": "Input validation for security"
        }
      ]
    }
  ],
  "quiz": [
    {
      "question": "What is the main benefit of event-driven integration?",
      "options": [
        "Simpler code",
        "Real-time responses",
        "Lower cost",
        "Easier testing"
      ],
      "correct": 1
    },
    {
      "question": "How should API keys be stored?",
      "options": [
        "In source code",
        "In comments",
        "In environment variables or secrets manager",
        "In the database"
      ],
      "correct": 2
    },
    {
      "question": "What is exponential backoff?",
      "options": [
        "A video codec",
        "A retry strategy with increasing delays",
        "A database optimization",
        "A camera feature"
      ],
      "correct": 1
    }
  ],
  "references": [
    {
      "title": "Integration Best Practices",
      "url": "https://github.com/anomaly/gallagher"
    }
  ]
};
