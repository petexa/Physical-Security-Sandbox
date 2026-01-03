export default {
  "id": "module-2",
  "title": "Physical Access Control Systems (PACS)",
  "description": "Understanding PACS architecture and Gallagher Command Centre",
  "estimatedTime": "45 minutes",
  "difficulty": "beginner",
  "prerequisites": ["module-1"],
  "sections": [
    {
      "id": "section-1",
      "title": "What is PACS?",
      "content": `# What is Physical Access Control Systems (PACS)?

A Physical Access Control System (PACS) manages and monitors access to physical spaces using electronic credentials and readers.

**Key Functions:**
- **Access Control:** Grant or deny access based on credentials and rules
- **Monitoring:** Track who accessed which doors and when
- **Alarming:** Detect and respond to security events
- **Integration:** Connect with other security systems (VMS, intrusion detection)

**Why Use PACS?**
- Enhanced security over traditional keys
- Detailed audit trails and reporting
- Flexible access rules and schedules
- Remote management and monitoring
- Scalable for any facility size

**Use Cases:**
- Corporate offices and campuses
- Data centers and server rooms
- Healthcare facilities
- Educational institutions
- Government buildings
- Industrial facilities`,
      "codeExamples": []
    },
    {
      "id": "section-2",
      "title": "PACS Architecture",
      "content": `# PACS Architecture

A PACS consists of several interconnected components:

**1. Controllers**
- Hardware that controls doors
- Stores access rules locally
- Processes credentials in real-time
- Communicates with management server

**2. Readers**
- Devices that read credentials
- Card readers, biometric scanners, keypads
- Connected to controllers
- Installed at door entry points

**3. Credentials**
- Physical or digital identifiers
- Access cards, key fobs, mobile credentials
- Biometric data (fingerprint, facial recognition)
- Associated with cardholders

**4. Doors/Access Points**
- Physical barriers controlled by the system
- Include locks, strikes, magnetic locks
- Have sensors to detect door status
- Can be grouped for management

**5. Management Server**
- Central system managing the PACS
- Stores cardholder database
- Defines access rules and schedules
- Generates reports and events

**Data Flow:**
1. Cardholder presents credential at reader
2. Reader sends credential to controller
3. Controller checks access rules locally
4. Controller grants/denies access
5. Event is logged and sent to server`,
      "codeExamples": [
        {
          "language": "javascript",
          "code": "// Typical PACS architecture in data model\nconst pacsArchitecture = {\n  controllers: [\n    {\n      id: 1,\n      name: \"Building A - Floor 1\",\n      doors: [1, 2, 3, 4],\n      status: \"online\"\n    }\n  ],\n  doors: [\n    {\n      id: 1,\n      name: \"Main Entry\",\n      controller_id: 1,\n      readers: [\"Reader 1-IN\", \"Reader 1-OUT\"],\n      lock_type: \"magnetic\"\n    }\n  ],\n  cardholders: [\n    {\n      id: 123,\n      name: \"John Doe\",\n      credentials: [\"123456\"],\n      access_groups: [\"Building A Access\"]\n    }\n  ]\n};",
          "description": "Simplified PACS data model showing relationships"
        }
      ]
    },
    {
      "id": "section-3",
      "title": "Gallagher Command Centre Overview",
      "content": `# Gallagher Command Centre

Gallagher Command Centre is a leading PACS solution used worldwide.

**Key Features:**
- Unified security platform
- Scalable from single door to enterprise
- Advanced access control logic
- Real-time monitoring and alerts
- Comprehensive API for integration
- Mobile credentials support
- Video integration capabilities

**System Components:**
- **Command Centre Server:** Central management
- **Controllers:** T-Series controllers at doors
- **Readers:** Card and mobile readers
- **Mobile App:** Mobile credentials
- **Web Interface:** Remote management
- **REST API:** Integration interface

**API Capabilities:**
Through the REST API, you can:
- Manage cardholders and credentials
- Configure access groups
- Control doors remotely
- Query events and generate reports
- Monitor system status
- Receive real-time event updates`,
      "codeExamples": [
        {
          "language": "http",
          "code": "GET /api/cardholders HTTP/1.1\nHost: gallagher.example.com\nAuthorization: GGL-API-KEY api_key=YOUR_API_KEY",
          "description": "Gallagher API authentication format"
        }
      ],
      "tryItSection": {
        "endpoint": "/api/cardholders",
        "method": "GET",
        "description": "Retrieve all cardholders from the system"
      }
    },
    {
      "id": "section-4",
      "title": "Cardholders and Credentials",
      "content": `# Cardholders and Credentials

**Cardholders** are individuals who have access rights in the system.

**Cardholder Properties:**
- Personal information (name, email, phone)
- Employee/visitor status
- Department/division
- Access groups
- Credentials assigned
- Status (active/inactive/suspended)

**Credentials:**
- Physical cards with unique numbers
- Mobile credentials on smartphones
- PIN codes for keypads
- Biometric templates

**Managing Cardholders:**
- Create new cardholders
- Assign credentials
- Add to access groups
- Activate/deactivate as needed
- Track access history

**Best Practices:**
- Use unique identifiers for each cardholder
- Keep contact information current
- Review and audit access regularly
- Disable credentials for departed employees promptly
- Use expiry dates for temporary access`,
      "codeExamples": [
        {
          "language": "http",
          "code": "POST /api/cardholders HTTP/1.1\nContent-Type: application/json\n\n{\n  \"first_name\": \"Jane\",\n  \"last_name\": \"Smith\",\n  \"email\": \"jane.smith@company.com\",\n  \"department\": \"Engineering\",\n  \"status\": \"active\"\n}",
          "description": "Creating a new cardholder"
        },
        {
          "language": "http",
          "code": "GET /api/cardholders/123 HTTP/1.1",
          "description": "Retrieving cardholder details"
        },
        {
          "language": "http",
          "code": "PATCH /api/cardholders/123 HTTP/1.1\nContent-Type: application/json\n\n{\n  \"status\": \"inactive\"\n}",
          "description": "Deactivating a cardholder"
        }
      ],
      "tryItSection": {
        "endpoint": "/api/cardholders",
        "method": "POST",
        "description": "Create a new cardholder in the system"
      }
    },
    {
      "id": "section-5",
      "title": "Access Groups and Permissions",
      "content": `# Access Groups and Permissions

**Access Groups** define which doors a cardholder can access and when.

**How It Works:**
1. Create access groups (e.g., "Building A Access")
2. Add doors to the access group
3. Define access schedules
4. Assign cardholders to the group
5. System automatically grants appropriate access

**Access Group Components:**
- Name and description
- List of doors/access points
- Access schedule (24/7, business hours, etc.)
- Member cardholders

**Common Access Group Patterns:**

**By Location:**
- Building A Access
- Server Room Access
- Executive Floor Access

**By Role:**
- Employee Access
- Contractor Access
- Visitor Access
- Security Staff Access

**By Time:**
- Business Hours Access
- Extended Hours Access
- 24/7 Access

**Benefits:**
- Simplified management (change once, affects all members)
- Consistent access policies
- Easy auditing and reporting
- Flexible time-based access`,
      "codeExamples": [
        {
          "language": "http",
          "code": "GET /api/access-groups HTTP/1.1",
          "description": "List all access groups"
        },
        {
          "language": "http",
          "code": "GET /api/access-groups/5 HTTP/1.1",
          "description": "Get details of a specific access group"
        },
        {
          "language": "http",
          "code": "PATCH /api/cardholders/123 HTTP/1.1\nContent-Type: application/json\n\n{\n  \"access_groups\": [\"Building A\", \"Server Room\"]\n}",
          "description": "Assigning access groups to a cardholder"
        }
      ],
      "tryItSection": {
        "endpoint": "/api/access-groups",
        "method": "GET",
        "description": "View all access groups in the system"
      }
    },
    {
      "id": "section-6",
      "title": "Doors and Schedules",
      "content": `# Doors and Schedules

**Doors** are the physical access points controlled by the PACS.

**Door Properties:**
- Name and location
- Associated controller
- Readers (entry and exit)
- Lock type (magnetic, electric strike, etc.)
- Status (locked, unlocked, forced, held)
- Schedules

**Door States:**
- **Locked:** Normal secured state
- **Unlocked:** Temporarily unlocked (e.g., business hours)
- **Forced:** Opened without valid access
- **Held Open:** Remained open too long
- **Offline:** Communication lost with controller

**Schedules:**
Control when doors are automatically locked/unlocked:
- Business Hours: Unlocked 8 AM - 6 PM
- After Hours: Locked except for authorized personnel
- 24/7: Always locked, access by credential only
- Weekend Mode: Different rules for weekends

**Door Operations:**
- Lock/unlock remotely
- Grant temporary access
- Monitor real-time status
- Query access history
- Configure alarms`,
      "codeExamples": [
        {
          "language": "http",
          "code": "GET /api/doors HTTP/1.1",
          "description": "List all doors in the system"
        },
        {
          "language": "http",
          "code": "GET /api/doors/5 HTTP/1.1",
          "description": "Get status and details of a specific door"
        },
        {
          "language": "http",
          "code": "GET /api/events?door_id=5&limit=50 HTTP/1.1",
          "description": "Query recent events for a specific door"
        }
      ],
      "tryItSection": {
        "endpoint": "/api/doors",
        "method": "GET",
        "description": "View all doors and their current status"
      }
    },
    {
      "id": "section-7",
      "title": "Controllers and Hardware",
      "content": `# Controllers and Hardware

**Controllers** are the intelligent devices that manage doors and process access decisions.

**Controller Functions:**
- Store access rules locally
- Process credentials in real-time
- Control door locks
- Monitor door sensors and readers
- Log events
- Communicate with server
- Operate during network outages

**Controller Properties:**
- Name and location
- IP address and network settings
- Firmware version
- Number of doors managed
- Online/offline status
- Battery backup status

**Inputs and Outputs:**

**Inputs:**
- Door position sensors (open/closed)
- Request-to-exit (REX) buttons
- Tamper switches
- Emergency switches

**Outputs:**
- Door locks (magnetic, electric strike)
- Door strikes
- LED indicators on readers
- Alarm sirens

**Monitoring:**
- Controller online/offline status
- Communication errors
- Hardware faults
- Battery status
- Tamper alarms`,
      "codeExamples": [
        {
          "language": "http",
          "code": "GET /api/controllers HTTP/1.1",
          "description": "List all controllers"
        },
        {
          "language": "http",
          "code": "GET /api/controllers/1 HTTP/1.1",
          "description": "Get controller status and configuration"
        },
        {
          "language": "http",
          "code": "GET /api/inputs HTTP/1.1",
          "description": "List all inputs (sensors, buttons)"
        },
        {
          "language": "http",
          "code": "GET /api/outputs HTTP/1.1",
          "description": "List all outputs (locks, alarms)"
        }
      ],
      "tryItSection": {
        "endpoint": "/api/controllers",
        "method": "GET",
        "description": "View all controllers and their online status"
      }
    }
  ],
  "quiz": [
    {
      "question": "What is the primary function of a PACS controller?",
      "options": [
        "Display video feeds",
        "Process access credentials and control doors",
        "Store cardholder photos",
        "Generate reports"
      ],
      "correct": 1
    },
    {
      "question": "What determines which doors a cardholder can access?",
      "options": [
        "Their email address",
        "Access groups they belong to",
        "The door location",
        "The controller firmware"
      ],
      "correct": 1
    },
    {
      "question": "What does 'door forced' mean?",
      "options": [
        "Door is locked",
        "Door opened without valid access",
        "Door is held open too long",
        "Door controller is offline"
      ],
      "correct": 1
    },
    {
      "question": "What is the benefit of local storage on controllers?",
      "options": [
        "Faster reporting",
        "Better video quality",
        "System works during network outages",
        "Cheaper hardware"
      ],
      "correct": 2
    }
  ],
  "references": [
    {
      "title": "Gallagher Developer Resources",
      "url": "https://github.com/anomaly/gallagher"
    },
    {
      "title": "PACS Architecture Best Practices",
      "url": "https://www.gallaghersecurity.com"
    }
  ]
};
