export default {
  "id": "module-4",
  "title": "Video Management Systems (VMS)",
  "description": "Understanding VMS architecture and Milestone XProtect",
  "estimatedTime": "35 minutes",
  "difficulty": "intermediate",
  "prerequisites": ["module-1", "module-2"],
  "sections": [
    {
      "id": "section-1",
      "title": "What is VMS?",
      "content": `# Video Management Systems (VMS)

A Video Management System manages video surveillance cameras and recordings.

**Key Functions:**
- Record video from multiple cameras
- Live viewing and playback
- Event-based recording
- Video search and export
- Integration with other security systems

**Benefits:**
- Centralized video management
- Efficient storage utilization
- Quick incident investigation
- Evidence collection
- Integration capabilities`,
      "codeExamples": []
    },
    {
      "id": "section-2",
      "title": "Milestone XProtect Overview",
      "content": `# Milestone XProtect

Industry-leading VMS platform with comprehensive API support.

**Key Features:**
- Scalable architecture
- Multi-site support
- Advanced analytics
- Mobile access
- Open platform API
- Third-party integrations

**API Capabilities:**
- Camera management
- Live and recorded video access
- Bookmark creation
- Event management
- Device configuration`,
      "codeExamples": [
        {
          "language": "http",
          "code": "GET /api/cameras HTTP/1.1\nAuthorization: Bearer YOUR_TOKEN",
          "description": "List all cameras in VMS"
        }
      ],
      "tryItSection": {
        "endpoint": "/api/cameras",
        "method": "GET",
        "description": "View all cameras in the system"
      }
    },
    {
      "id": "section-3",
      "title": "Cameras and Recording",
      "content": `# Cameras and Recording

**Camera Properties:**
- Name and location
- IP address
- Recording status
- Storage allocation
- Associated doors/areas

**Recording Modes:**
- Continuous recording
- Motion-based recording
- Event-triggered recording
- Scheduled recording

**Accessing Recordings:**
\`\`\`
GET /api/recordings?camera_id=1&start=2024-01-15T10:00:00Z&end=2024-01-15T12:00:00Z
\`\`\``,
      "codeExamples": [
        {
          "language": "http",
          "code": "GET /api/cameras/1 HTTP/1.1",
          "description": "Get camera details and status"
        },
        {
          "language": "http",
          "code": "GET /api/recordings?camera_id=1&start=2024-01-15T10:00:00Z HTTP/1.1",
          "description": "Query recordings by time range"
        }
      ],
      "tryItSection": {
        "endpoint": "/api/cameras",
        "method": "GET",
        "description": "List all cameras"
      }
    },
    {
      "id": "section-4",
      "title": "Bookmarks and Evidence",
      "content": `# Bookmarks and Evidence

**Bookmarks** mark important moments in video for investigation.

**Creating Bookmarks:**
- Timestamp reference
- Associated camera
- Description/notes
- Retention settings

**Use Cases:**
- Mark security incidents
- Evidence collection
- Investigation reference
- Compliance documentation`,
      "codeExamples": [
        {
          "language": "http",
          "code": "POST /api/bookmarks HTTP/1.1\nContent-Type: application/json\n\n{\n  \"camera_id\": 1,\n  \"timestamp\": \"2024-01-15T14:30:00Z\",\n  \"description\": \"Unauthorized access attempt\",\n  \"duration\": 300\n}",
          "description": "Create a bookmark for an incident"
        }
      ]
    },
    {
      "id": "section-5",
      "title": "Integration with PACS",
      "content": `# Integration with PACS

**Why Integrate VMS and PACS?**
- Visual verification of access events
- Enhanced security investigations
- Automated video bookmarking
- Correlated event timelines

**Common Integration Patterns:**
- Access denial triggers video bookmark
- Alarm creates video clip
- Door forced starts recording
- Cardholder access links to video

**Correlation Example:**
1. PACS event: Access denied at Server Room
2. Query VMS for camera at Server Room
3. Create bookmark at event timestamp
4. Include in investigation report`,
      "codeExamples": [
        {
          "language": "javascript",
          "code": "// Correlate PACS event with VMS\nasync function handleAccessDenied(event) {\n  // Get camera for the door\n  const camera = await getCameraForDoor(event.door_id);\n  \n  // Create bookmark in VMS\n  const bookmark = await createBookmark({\n    camera_id: camera.id,\n    timestamp: event.timestamp,\n    description: `Access denied: ${event.cardholder_name} at ${event.door_name}`,\n    duration: 300 // 5 minutes\n  });\n  \n  return bookmark;\n}",
          "description": "Auto-create VMS bookmark on PACS event"
        }
      ]
    }
  ],
  "quiz": [
    {
      "question": "What is the purpose of a bookmark in VMS?",
      "options": [
        "To save camera settings",
        "To mark important video moments",
        "To delete recordings",
        "To add cameras"
      ],
      "correct": 1
    },
    {
      "question": "Why integrate PACS with VMS?",
      "options": [
        "To save storage space",
        "To reduce camera count",
        "To visually verify access events",
        "To disable alarms"
      ],
      "correct": 2
    }
  ],
  "references": [
    {
      "title": "Milestone Developer Documentation",
      "url": "https://developer.milestonesys.com"
    }
  ]
};
