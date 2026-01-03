export default {
  "id": "module-5",
  "title": "Camera APIs (Axis & ONVIF)",
  "description": "Working with Axis VAPIX and ONVIF standards",
  "estimatedTime": "35 minutes",
  "difficulty": "intermediate",
  "prerequisites": ["module-1", "module-4"],
  "sections": [
    {
      "id": "section-1",
      "title": "Camera Device Types",
      "content": `# Camera Device Types

Modern IP cameras provide APIs for direct integration.

**Why Direct Camera APIs?**
- Independent of VMS
- Device configuration
- Real-time streaming
- Event subscriptions
- PTZ control

**Common Protocols:**
- **Axis VAPIX:** Axis-specific API
- **ONVIF:** Industry standard
- **RTSP:** Video streaming
- **HTTP:** Snapshots and control`,
      "codeExamples": []
    },
    {
      "id": "section-2",
      "title": "Axis VAPIX Overview",
      "content": `# Axis VAPIX

VAPIX is Axis Communications' HTTP-based API for camera integration.

**Capabilities:**
- Device parameters
- Image capture
- Video streaming
- Event management
- PTZ control
- Audio

**Authentication:**
Uses HTTP Digest or Basic authentication.`,
      "codeExamples": [
        {
          "language": "http",
          "code": "GET /axis-cgi/param.cgi?action=list&group=root.Properties HTTP/1.1\nHost: camera.example.com\nAuthorization: Basic base64credentials",
          "description": "Get Axis device parameters"
        },
        {
          "language": "http",
          "code": "GET /axis-cgi/jpg/image.cgi HTTP/1.1\nHost: camera.example.com\nAuthorization: Basic base64credentials",
          "description": "Capture snapshot from Axis camera"
        }
      ]
    },
    {
      "id": "section-3",
      "title": "ONVIF Standards",
      "content": `# ONVIF Standards

ONVIF (Open Network Video Interface Forum) provides standardized camera APIs.

**ONVIF Profiles:**
- **Profile S:** Streaming
- **Profile G:** Recording and storage
- **Profile T:** Advanced video streaming

**Key Services:**
- Device management
- Media profiles
- PTZ control
- Event handling
- Analytics

**SOAP-based Protocol:**
ONVIF uses SOAP/XML web services.`,
      "codeExamples": [
        {
          "language": "xml",
          "code": "<s:Envelope xmlns:s=\"http://www.w3.org/2003/05/soap-envelope\">\n  <s:Body>\n    <GetDeviceInformation xmlns=\"http://www.onvif.org/ver10/device/wsdl\"/>\n  </s:Body>\n</s:Envelope>",
          "description": "ONVIF GetDeviceInformation request"
        }
      ]
    },
    {
      "id": "section-4",
      "title": "Device Discovery",
      "content": `# Device Discovery

Discovering cameras on the network.

**Methods:**
- **ONVIF WS-Discovery:** Multicast discovery
- **Network scanning:** IP range scanning
- **mDNS/Bonjour:** Service discovery
- **Manual configuration:** Direct IP entry

**Discovery Process:**
1. Send discovery probe
2. Receive device responses
3. Query device capabilities
4. Configure connection`,
      "codeExamples": [
        {
          "language": "javascript",
          "code": "// Simulated ONVIF discovery\nfunction discoverONVIFDevices() {\n  // Send WS-Discovery probe\n  const probe = `\n    <s:Envelope xmlns:s=\"http://www.w3.org/2003/05/soap-envelope\">\n      <s:Body>\n        <Probe xmlns=\"http://schemas.xmlsoap.org/ws/2005/04/discovery\">\n          <d:Types>dn:NetworkVideoTransmitter</d:Types>\n        </Probe>\n      </s:Body>\n    </s:Envelope>\n  `;\n  \n  // Multicast to 239.255.255.250:3702\n  // Devices respond with their endpoint URLs\n}",
          "description": "ONVIF device discovery concept"
        }
      ]
    },
    {
      "id": "section-5",
      "title": "Streaming and Snapshots",
      "content": `# Streaming and Snapshots

Accessing live video and images.

**Snapshot (JPEG):**
- Single frame capture
- Low bandwidth
- Quick preview
- Motion detection validation

**RTSP Streaming:**
- Real-time video stream
- Continuous playback
- Higher bandwidth
- Full-motion video

**MJPEG Streaming:**
- Motion JPEG
- HTTP-based
- Browser-compatible
- Medium bandwidth`,
      "codeExamples": [
        {
          "language": "http",
          "code": "GET /snap.jpg HTTP/1.1\nHost: camera.example.com",
          "description": "Generic snapshot endpoint"
        },
        {
          "language": "text",
          "code": "rtsp://camera.example.com:554/stream1",
          "description": "RTSP stream URL example"
        }
      ]
    },
    {
      "id": "section-6",
      "title": "PTZ Control",
      "content": `# PTZ Control

**PTZ:** Pan, Tilt, Zoom

**Control Methods:**
- Absolute positioning
- Relative movement
- Continuous movement
- Preset positions

**Common Operations:**
- Move to preset
- Pan left/right
- Tilt up/down
- Zoom in/out
- Focus adjustment`,
      "codeExamples": [
        {
          "language": "http",
          "code": "GET /axis-cgi/com/ptz.cgi?camera=1&move=home HTTP/1.1",
          "description": "Axis: Move to home preset"
        },
        {
          "language": "http",
          "code": "GET /axis-cgi/com/ptz.cgi?pan=90&tilt=0&zoom=1000 HTTP/1.1",
          "description": "Axis: Absolute positioning"
        }
      ]
    },
    {
      "id": "section-7",
      "title": "Event Subscriptions",
      "content": `# Event Subscriptions

Cameras can generate events:
- Motion detection
- Tamper detection
- Audio detection
- Analytics events

**Subscription Methods:**
- HTTP notifications
- MQTT publishing
- ONVIF events
- Polling

**Integration Pattern:**
Camera event → Trigger action → Update VMS/PACS`,
      "codeExamples": [
        {
          "language": "javascript",
          "code": "// Handle camera motion event\nfunction onMotionDetected(cameraId, timestamp) {\n  console.log(`Motion detected on camera ${cameraId}`);\n  \n  // Create VMS bookmark\n  createBookmark({\n    camera_id: cameraId,\n    timestamp: timestamp,\n    description: 'Motion detected',\n    duration: 60\n  });\n}",
          "description": "Handling camera events"
        }
      ]
    }
  ],
  "quiz": [
    {
      "question": "What is ONVIF?",
      "options": [
        "A camera brand",
        "A standardized camera API",
        "A video codec",
        "A storage protocol"
      ],
      "correct": 1
    },
    {
      "question": "What does PTZ stand for?",
      "options": [
        "Power, Time, Zone",
        "Pan, Tilt, Zoom",
        "Protocol, Transfer, Zone",
        "Position, Track, Zoom"
      ],
      "correct": 1
    }
  ],
  "references": [
    {
      "title": "Axis Developer Community",
      "url": "https://www.axis.com/developer"
    },
    {
      "title": "ONVIF Official Website",
      "url": "https://www.onvif.org"
    }
  ]
};
