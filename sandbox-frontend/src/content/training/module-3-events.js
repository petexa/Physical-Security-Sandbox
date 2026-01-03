export default {
  "id": "module-3",
  "title": "Event Management",
  "description": "Understanding and analyzing access control events",
  "estimatedTime": "40 minutes",
  "difficulty": "intermediate",
  "prerequisites": ["module-1", "module-2"],
  "sections": [
    {
      "id": "section-1",
      "title": "Understanding Access Events",
      "content": `# Understanding Access Events

**Events** are records of actions and state changes in the PACS.

**Why Events Matter:**
- Security monitoring and investigation
- Compliance and audit trails
- Operational insights
- Troubleshooting system issues
- Integration with other systems

**Event Components:**
- **Timestamp:** When the event occurred
- **Event Type:** What happened (access granted, denied, alarm, etc.)
- **Door/Location:** Where it occurred
- **Cardholder:** Who was involved (if applicable)
- **Result:** Outcome of the action
- **Details:** Additional context

**Event Flow:**
1. Action occurs (card presented, door opened, alarm triggered)
2. Controller detects and logs event
3. Event sent to management server
4. Event stored in database
5. Event available via API for queries and analysis
6. Integrations can react to events in real-time`,
      "codeExamples": [
        {
          "language": "json",
          "code": "{\n  \"id\": 12345,\n  \"timestamp\": \"2024-01-15T14:30:15Z\",\n  \"event_type\": \"access_granted\",\n  \"category\": \"access\",\n  \"door_id\": 5,\n  \"door_name\": \"Server Room - Entry\",\n  \"location\": \"Building A - Floor 2\",\n  \"cardholder_id\": 123,\n  \"cardholder_name\": \"John Doe\",\n  \"card_number\": \"123456\",\n  \"access_group\": \"IT Staff\",\n  \"result\": \"granted\",\n  \"details\": \"Valid credential, access granted\"\n}",
          "description": "Example of a complete access event"
        }
      ],
      "tryItSection": {
        "endpoint": "/api/events?limit=20",
        "method": "GET",
        "description": "View recent events from the system"
      }
    },
    {
      "id": "section-2",
      "title": "Event Types",
      "content": `# Event Types

Events are categorized by type to help with filtering and analysis.

**Access Events:**

**Access Granted**
- Valid credential presented
- Cardholder in correct access group
- Within allowed time zone
- Door unlocked successfully

**Access Denied**
- Invalid or expired credential
- No access group for this door
- Outside allowed time zone
- System in lockdown mode

**Alarm Events:**

**Door Forced**
- Door opened without valid access
- Potential security breach
- Immediate investigation required

**Door Held Open**
- Door remained open beyond timeout
- May indicate propping or malfunction
- Security concern if extended

**Tamper Alarm**
- Reader or controller tampered with
- Physical security compromise
- Critical alert

**Fault Events:**

**Reader Offline**
- Reader lost communication
- Hardware or wiring issue
- Affects access capability

**Door Sensor Fault**
- Door position sensor malfunction
- Cannot determine door state
- Maintenance required

**Controller Offline**
- Controller lost network connection
- May continue operating on local rules
- Communication issue

**System Events:**

**Controller Online/Offline**
- Controller connectivity status changes
- Network or power issues

**Configuration Changed**
- Access rules updated
- System settings modified
- Audit trail entry`,
      "codeExamples": [
        {
          "language": "http",
          "code": "GET /api/events?category=alarm HTTP/1.1",
          "description": "Query all alarm events"
        },
        {
          "language": "http",
          "code": "GET /api/events?event_type=access_denied&limit=100 HTTP/1.1",
          "description": "Get all access denied events"
        },
        {
          "language": "http",
          "code": "GET /api/events?category=fault&door_id=5 HTTP/1.1",
          "description": "Find all faults for a specific door"
        }
      ],
      "tryItSection": {
        "endpoint": "/api/events?category=alarm",
        "method": "GET",
        "description": "Query alarm events to see security incidents"
      }
    },
    {
      "id": "section-3",
      "title": "Event Structure and Data",
      "content": `# Event Structure and Data

Each event contains rich information for analysis and investigation.

**Core Fields:**
- **id:** Unique event identifier
- **timestamp:** ISO 8601 formatted date/time
- **event_type:** Specific type of event
- **category:** High-level grouping (access, alarm, fault, system)

**Location Information:**
- **door_id:** Database ID of the door
- **door_name:** Human-readable door name
- **location:** Physical location description
- **controller_id:** Controller that logged the event

**Cardholder Information:**
(Present for access events)
- **cardholder_id:** Database ID
- **cardholder_name:** Full name
- **card_number:** Credential number used
- **access_group:** Access group at time of event

**Event Details:**
- **result:** Outcome (granted, denied, triggered, etc.)
- **details:** Human-readable description
- **reason_code:** Machine-readable reason (optional)

**Event Relationships:**
- Events can be correlated by time
- Events can be grouped by door or cardholder
- Event patterns can indicate issues
- Events can trigger workflows`,
      "codeExamples": [
        {
          "language": "javascript",
          "code": "// Parsing and using event data\nconst event = {\n  timestamp: \"2024-01-15T14:30:15Z\",\n  event_type: \"access_granted\",\n  cardholder_name: \"John Doe\",\n  door_name: \"Server Room\"\n};\n\n// Convert timestamp to local time\nconst localTime = new Date(event.timestamp)\n  .toLocaleString();\n\n// Create notification message\nconst message = `${event.cardholder_name} accessed ${event.door_name} at ${localTime}`;\n\nconsole.log(message);\n// \"John Doe accessed Server Room at 1/15/2024, 2:30:15 PM\"",
          "description": "Working with event data in JavaScript"
        }
      ]
    },
    {
      "id": "section-4",
      "title": "Querying Events",
      "content": `# Querying Events

Effective event querying is essential for security monitoring and investigation.

**Basic Queries:**

**By Time Range:**
\`\`\`
GET /api/events?start_date=2024-01-01&end_date=2024-01-31
\`\`\`

**By Event Type:**
\`\`\`
GET /api/events?event_type=access_denied
\`\`\`

**By Door:**
\`\`\`
GET /api/events?door_id=5
\`\`\`

**By Cardholder:**
\`\`\`
GET /api/events?cardholder_id=123
\`\`\`

**Combined Filters:**
You can combine multiple filters:
\`\`\`
GET /api/events?door_id=5&event_type=door_forced&start_date=2024-01-15
\`\`\`

**Pagination:**
Use limit and offset for large result sets:
\`\`\`
GET /api/events?limit=100&offset=0
\`\`\`

**Sorting:**
Most recent first (typical):
\`\`\`
GET /api/events?sort=timestamp&order=desc
\`\`\`

**Query Best Practices:**
- Always use time ranges to limit results
- Use specific filters when possible
- Paginate large result sets
- Cache frequently accessed queries
- Index on commonly queried fields`,
      "codeExamples": [
        {
          "language": "javascript",
          "code": "// Building dynamic query URLs\nfunction buildEventQuery(filters) {\n  const params = new URLSearchParams();\n  \n  if (filters.startDate) {\n    params.append('start_date', filters.startDate);\n  }\n  if (filters.endDate) {\n    params.append('end_date', filters.endDate);\n  }\n  if (filters.doorId) {\n    params.append('door_id', filters.doorId);\n  }\n  if (filters.eventType) {\n    params.append('event_type', filters.eventType);\n  }\n  if (filters.limit) {\n    params.append('limit', filters.limit);\n  }\n  \n  return `/api/events?${params.toString()}`;\n}\n\n// Usage\nconst url = buildEventQuery({\n  startDate: '2024-01-01',\n  doorId: 5,\n  eventType: 'access_denied',\n  limit: 50\n});\n// \"/api/events?start_date=2024-01-01&door_id=5&event_type=access_denied&limit=50\"",
          "description": "Dynamic query building in JavaScript"
        }
      ],
      "tryItSection": {
        "endpoint": "/api/events?event_type=access_denied&limit=10",
        "method": "GET",
        "description": "Query for access denied events"
      }
    },
    {
      "id": "section-5",
      "title": "Filtering and Searching",
      "content": `# Filtering and Searching

Advanced filtering helps you find exactly the events you need.

**Filter Types:**

**Exact Match:**
- door_id=5
- event_type=access_denied
- cardholder_id=123

**Range Filters:**
- start_date and end_date
- timestamp_after and timestamp_before

**List Filters:**
- event_type=access_denied,door_forced
- door_id=1,2,3,5

**Text Search:**
- search=Server Room (searches door names, cardholder names, details)

**Category Filters:**
- category=alarm (all alarm types)
- category=fault (all fault types)
- category=access (all access events)

**Common Query Patterns:**

**Investigation Scenario:**
"Show all events for Server Room on January 15th"
\`\`\`
GET /api/events?door_id=5&start_date=2024-01-15&end_date=2024-01-15
\`\`\`

**Security Audit:**
"Show all denied access attempts this week"
\`\`\`
GET /api/events?event_type=access_denied&start_date=2024-01-08
\`\`\`

**Maintenance Check:**
"Find all faults in Building A"
\`\`\`
GET /api/events?category=fault&search=Building A
\`\`\`

**User Activity:**
"What did John Doe access today?"
\`\`\`
GET /api/events?cardholder_id=123&start_date=2024-01-15
\`\`\``,
      "codeExamples": [
        {
          "language": "javascript",
          "code": "// Client-side filtering of events\nfunction filterEvents(events, filters) {\n  return events.filter(event => {\n    // Filter by category\n    if (filters.category && event.category !== filters.category) {\n      return false;\n    }\n    \n    // Filter by event type\n    if (filters.eventType && event.event_type !== filters.eventType) {\n      return false;\n    }\n    \n    // Filter by date range\n    if (filters.startDate) {\n      const eventDate = new Date(event.timestamp);\n      const startDate = new Date(filters.startDate);\n      if (eventDate < startDate) return false;\n    }\n    \n    // Text search\n    if (filters.search) {\n      const searchLower = filters.search.toLowerCase();\n      const searchable = [\n        event.door_name,\n        event.cardholder_name,\n        event.details\n      ].join(' ').toLowerCase();\n      \n      if (!searchable.includes(searchLower)) {\n        return false;\n      }\n    }\n    \n    return true;\n  });\n}",
          "description": "Client-side event filtering function"
        }
      ]
    },
    {
      "id": "section-6",
      "title": "Event Analysis Techniques",
      "content": `# Event Analysis Techniques

Analyzing events helps identify patterns, trends, and issues.

**Counting and Aggregation:**
- Count events by type
- Count events by door
- Count events by hour/day/week
- Calculate success/denial rates

**Pattern Detection:**
- Repeated access denials (same cardholder)
- Multiple forced door events (same door)
- Access attempts outside normal hours
- Unusual access patterns

**Time-Based Analysis:**
- Peak access times
- After-hours activity
- Weekend patterns
- Holiday period activity

**Location Analysis:**
- Most active doors
- Problem areas (frequent faults)
- High-security zones activity
- Traffic flow patterns

**Cardholder Analysis:**
- Most active users
- Users with frequent denials
- Unusual access patterns
- Access group effectiveness

**Statistical Methods:**
- Moving averages
- Trend analysis
- Anomaly detection
- Baseline comparisons`,
      "codeExamples": [
        {
          "language": "javascript",
          "code": "// Event analysis examples\n\n// Count events by type\nfunction countByType(events) {\n  const counts = {};\n  events.forEach(event => {\n    const type = event.event_type;\n    counts[type] = (counts[type] || 0) + 1;\n  });\n  return counts;\n}\n\n// Find repeated denials for same cardholder\nfunction findRepeatedDenials(events, threshold = 3) {\n  const denials = events.filter(e => e.event_type === 'access_denied');\n  const counts = {};\n  \n  denials.forEach(event => {\n    const id = event.cardholder_id;\n    if (id) {\n      counts[id] = (counts[id] || 0) + 1;\n    }\n  });\n  \n  return Object.entries(counts)\n    .filter(([id, count]) => count >= threshold)\n    .map(([id, count]) => ({ cardholder_id: id, denial_count: count }));\n}\n\n// Get events by hour of day\nfunction eventsByHour(events) {\n  const hourCounts = Array(24).fill(0);\n  events.forEach(event => {\n    const hour = new Date(event.timestamp).getHours();\n    hourCounts[hour]++;\n  });\n  return hourCounts;\n}",
          "description": "Event analysis utility functions"
        }
      ],
      "tryItSection": {
        "endpoint": "/api/events",
        "method": "GET",
        "description": "Fetch events to practice analysis techniques"
      }
    },
    {
      "id": "section-7",
      "title": "Investigation Best Practices",
      "content": `# Investigation Best Practices

**Investigation Workflow:**

**1. Identify the Incident**
- Alarm notification received
- Security report filed
- Routine audit finding
- User complaint

**2. Gather Context**
- What happened?
- When did it occur?
- Where did it occur?
- Who was involved?

**3. Query Relevant Events**
- Start with time window around incident
- Include related doors and areas
- Look for cardholder activity
- Check for system faults

**4. Expand Search**
- Look before and after incident
- Check adjacent doors/areas
- Review cardholder history
- Correlate with video

**5. Analyze Patterns**
- Multiple related events?
- Repeated attempts?
- Unusual timing?
- Equipment malfunction?

**6. Document Findings**
- Timeline of events
- Key events identified
- Contributing factors
- Recommended actions

**7. Take Action**
- Security response
- System adjustments
- Training needs
- Policy updates

**Investigation Tips:**
- Start broad, then narrow focus
- Look for correlations
- Consider multiple causes
- Document everything
- Follow up on findings`,
      "codeExamples": [
        {
          "language": "javascript",
          "code": "// Investigation helper: Build timeline\nfunction buildIncidentTimeline(events, incidentTime, windowMinutes = 30) {\n  const incidentDate = new Date(incidentTime);\n  const beforeTime = new Date(incidentDate.getTime() - windowMinutes * 60000);\n  const afterTime = new Date(incidentDate.getTime() + windowMinutes * 60000);\n  \n  // Filter events in time window\n  const timeline = events.filter(event => {\n    const eventDate = new Date(event.timestamp);\n    return eventDate >= beforeTime && eventDate <= afterTime;\n  });\n  \n  // Sort chronologically\n  timeline.sort((a, b) => \n    new Date(a.timestamp) - new Date(b.timestamp)\n  );\n  \n  // Mark the incident event\n  timeline.forEach(event => {\n    if (event.timestamp === incidentTime) {\n      event.isIncident = true;\n    }\n  });\n  \n  return timeline;\n}\n\n// Usage\nconst timeline = buildIncidentTimeline(\n  allEvents,\n  \"2024-01-15T14:30:15Z\",\n  30 // 30 minute window\n);",
          "description": "Building an incident investigation timeline"
        }
      ]
    }
  ],
  "quiz": [
    {
      "question": "What does an 'access denied' event indicate?",
      "options": [
        "Door is malfunctioning",
        "Valid access was granted",
        "Access attempt was rejected",
        "Door is forced open"
      ],
      "correct": 2
    },
    {
      "question": "Which event type indicates a security breach?",
      "options": [
        "access_granted",
        "controller_online",
        "door_forced",
        "access_denied"
      ],
      "correct": 2
    },
    {
      "question": "What is the best practice when investigating an incident?",
      "options": [
        "Only look at the incident event",
        "Query events in a time window around the incident",
        "Ignore cardholder information",
        "Delete old events"
      ],
      "correct": 1
    },
    {
      "question": "Which filter would find all alarm events?",
      "options": [
        "event_type=alarm",
        "category=alarm",
        "door_id=alarm",
        "status=alarm"
      ],
      "correct": 1
    }
  ],
  "references": [
    {
      "title": "Event Analysis Best Practices",
      "url": "https://www.gallaghersecurity.com"
    }
  ]
};
