export default {
  "id": "module-1",
  "title": "REST API Fundamentals",
  "description": "Learn the basics of REST APIs and HTTP",
  "estimatedTime": "30 minutes",
  "difficulty": "beginner",
  "prerequisites": [],
  "sections": [
    {
      "id": "section-1",
      "title": "What is a REST API?",
      "content": `# What is a REST API?

REST (Representational State Transfer) is an architectural style for designing networked applications. A REST API is a web service that follows REST principles, allowing different systems to communicate over HTTP.

**Key Concepts:**
- **Resources:** Everything is a resource (users, doors, events)
- **URIs:** Each resource has a unique identifier (URL)
- **HTTP Methods:** Actions are performed using standard HTTP methods
- **Stateless:** Each request is independent
- **JSON Format:** Data is typically exchanged in JSON format

**Why REST APIs?**
- Simple and intuitive
- Platform-independent
- Scalable and flexible
- Wide industry adoption`,
      "codeExamples": [
        {
          "language": "http",
          "code": "GET /api/cardholders HTTP/1.1\nHost: api.example.com\nAuthorization: Bearer YOUR_TOKEN",
          "description": "A simple GET request to retrieve cardholders"
        }
      ],
      "tryItSection": {
        "endpoint": "/api/cardholders",
        "method": "GET",
        "description": "Try fetching all cardholders from the system"
      }
    },
    {
      "id": "section-2",
      "title": "HTTP Methods",
      "content": `# HTTP Methods

REST APIs use standard HTTP methods to perform operations:

**GET** - Retrieve data
- Used to read resources
- Should not modify data
- Safe and idempotent
- Example: Get list of cardholders

**POST** - Create new resources
- Sends data to create new resources
- Not idempotent (multiple calls create multiple resources)
- Example: Create a new cardholder

**PUT** - Update entire resource
- Replaces the entire resource
- Idempotent (multiple calls have same effect)
- Example: Update all cardholder fields

**PATCH** - Partial update
- Updates specific fields only
- More efficient than PUT
- Example: Update cardholder's access group

**DELETE** - Remove resources
- Deletes the specified resource
- Idempotent
- Example: Delete a cardholder`,
      "codeExamples": [
        {
          "language": "http",
          "code": "GET /api/cardholders/123 HTTP/1.1",
          "description": "Retrieve a specific cardholder"
        },
        {
          "language": "http",
          "code": "POST /api/cardholders HTTP/1.1\nContent-Type: application/json\n\n{\n  \"first_name\": \"John\",\n  \"last_name\": \"Doe\",\n  \"email\": \"john.doe@example.com\"\n}",
          "description": "Create a new cardholder"
        },
        {
          "language": "http",
          "code": "PATCH /api/cardholders/123 HTTP/1.1\nContent-Type: application/json\n\n{\n  \"access_group\": \"Building A\"\n}",
          "description": "Update cardholder's access group"
        },
        {
          "language": "http",
          "code": "DELETE /api/cardholders/123 HTTP/1.1",
          "description": "Delete a cardholder"
        }
      ],
      "tryItSection": {
        "endpoint": "/api/cardholders",
        "method": "POST",
        "description": "Try creating a new cardholder"
      }
    },
    {
      "id": "section-3",
      "title": "HTTP Status Codes",
      "content": `# HTTP Status Codes

Status codes indicate the result of an HTTP request:

**2xx - Success**
- **200 OK:** Request succeeded
- **201 Created:** New resource created successfully
- **204 No Content:** Success with no response body

**4xx - Client Errors**
- **400 Bad Request:** Invalid request format
- **401 Unauthorized:** Authentication required
- **403 Forbidden:** Authenticated but not authorized
- **404 Not Found:** Resource doesn't exist
- **422 Unprocessable Entity:** Validation error

**5xx - Server Errors**
- **500 Internal Server Error:** Server encountered an error
- **503 Service Unavailable:** Server temporarily unavailable

**Best Practices:**
- Always check status codes in your code
- Handle errors gracefully
- Provide meaningful error messages`,
      "codeExamples": [
        {
          "language": "javascript",
          "code": "fetch('/api/cardholders')\n  .then(response => {\n    if (response.status === 200) {\n      return response.json();\n    } else if (response.status === 404) {\n      throw new Error('Resource not found');\n    } else if (response.status === 401) {\n      throw new Error('Authentication required');\n    }\n  })\n  .then(data => console.log(data))\n  .catch(error => console.error(error));",
          "description": "Handling different status codes in JavaScript"
        }
      ]
    },
    {
      "id": "section-4",
      "title": "Headers and Authentication",
      "content": `# Headers and Authentication

**HTTP Headers** provide metadata about requests and responses:

**Common Request Headers:**
- **Content-Type:** Format of request body (e.g., application/json)
- **Accept:** Expected response format
- **Authorization:** Authentication credentials
- **User-Agent:** Client application identifier

**Common Response Headers:**
- **Content-Type:** Format of response body
- **Content-Length:** Size of response
- **Date:** Timestamp of response

**Authentication Methods:**

1. **API Keys:** Simple token in header
2. **Bearer Tokens:** JWT or OAuth tokens
3. **Basic Auth:** Username/password (base64 encoded)

**Security Best Practices:**
- Always use HTTPS in production
- Never expose API keys in client-side code
- Rotate tokens regularly
- Use short-lived tokens when possible`,
      "codeExamples": [
        {
          "language": "http",
          "code": "GET /api/cardholders HTTP/1.1\nHost: api.example.com\nAuthorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\nContent-Type: application/json\nAccept: application/json",
          "description": "Request with authentication and content type headers"
        },
        {
          "language": "javascript",
          "code": "const headers = {\n  'Authorization': 'Bearer YOUR_TOKEN',\n  'Content-Type': 'application/json'\n};\n\nfetch('/api/cardholders', { headers })\n  .then(response => response.json())\n  .then(data => console.log(data));",
          "description": "Making authenticated requests in JavaScript"
        }
      ]
    },
    {
      "id": "section-5",
      "title": "Request and Response Structure",
      "content": `# Request and Response Structure

**Request Components:**
1. **Method:** GET, POST, PUT, PATCH, DELETE
2. **URL:** Endpoint path (e.g., /api/cardholders)
3. **Headers:** Metadata (authentication, content type)
4. **Body:** Data payload (for POST/PUT/PATCH)

**Response Components:**
1. **Status Code:** Result indicator (200, 404, etc.)
2. **Headers:** Response metadata
3. **Body:** Response data (usually JSON)

**URL Structure:**
\`\`\`
https://api.example.com/api/cardholders/123?include=access_groups
|_____|  |____________| |_| |_________||_| |___________________|
protocol    domain      path  resource  id  query parameters
\`\`\`

**Query Parameters:**
- Used for filtering, sorting, pagination
- Format: ?key=value&key2=value2
- Example: ?status=active&limit=10`,
      "codeExamples": [
        {
          "language": "http",
          "code": "GET /api/events?start_date=2024-01-01&door_id=5&limit=50 HTTP/1.1\nHost: api.example.com\nAuthorization: Bearer YOUR_TOKEN",
          "description": "Request with query parameters for filtering events"
        },
        {
          "language": "json",
          "code": "{\n  \"status\": 200,\n  \"data\": [\n    {\n      \"id\": 1,\n      \"first_name\": \"John\",\n      \"last_name\": \"Doe\",\n      \"email\": \"john.doe@example.com\",\n      \"status\": \"active\"\n    }\n  ],\n  \"meta\": {\n    \"total\": 150,\n    \"page\": 1,\n    \"per_page\": 50\n  }\n}",
          "description": "Typical API response with data and metadata"
        }
      ],
      "tryItSection": {
        "endpoint": "/api/events?limit=10",
        "method": "GET",
        "description": "Try fetching events with query parameters"
      }
    },
    {
      "id": "section-6",
      "title": "JSON Format",
      "content": `# JSON Format

JSON (JavaScript Object Notation) is the standard data format for REST APIs.

**Basic Types:**
- **String:** "text value"
- **Number:** 123, 45.67
- **Boolean:** true, false
- **Null:** null
- **Array:** [1, 2, 3]
- **Object:** {"key": "value"}

**Best Practices:**
- Use meaningful property names
- Be consistent with naming conventions (snake_case or camelCase)
- Keep structure flat when possible
- Include timestamps in ISO 8601 format
- Use null for missing/unknown values

**Common Patterns:**

**List Response:**
\`\`\`json
{
  "data": [...],
  "total": 100,
  "page": 1
}
\`\`\`

**Single Item:**
\`\`\`json
{
  "id": 123,
  "name": "John Doe",
  "created_at": "2024-01-15T10:30:00Z"
}
\`\`\`

**Error Response:**
\`\`\`json
{
  "error": "Invalid request",
  "message": "Email is required",
  "code": "VALIDATION_ERROR"
}
\`\`\``,
      "codeExamples": [
        {
          "language": "json",
          "code": "{\n  \"id\": 123,\n  \"first_name\": \"John\",\n  \"last_name\": \"Doe\",\n  \"email\": \"john.doe@example.com\",\n  \"access_groups\": [\n    \"Building A\",\n    \"Server Room\"\n  ],\n  \"status\": \"active\",\n  \"created_at\": \"2024-01-15T10:30:00Z\",\n  \"updated_at\": \"2024-01-20T14:45:00Z\"\n}",
          "description": "Complete cardholder object in JSON format"
        },
        {
          "language": "javascript",
          "code": "// Parsing JSON\nconst data = JSON.parse(jsonString);\nconsole.log(data.first_name); // \"John\"\n\n// Converting to JSON\nconst cardholder = {\n  first_name: \"Jane\",\n  last_name: \"Smith\"\n};\nconst jsonString = JSON.stringify(cardholder);",
          "description": "Working with JSON in JavaScript"
        }
      ],
      "tryItSection": {
        "endpoint": "/api/cardholders/1",
        "method": "GET",
        "description": "View a complete JSON response for a cardholder"
      }
    }
  ],
  "quiz": [
    {
      "question": "What HTTP method is used to retrieve data?",
      "options": ["GET", "POST", "PUT", "DELETE"],
      "correct": 0
    },
    {
      "question": "Which status code indicates successful resource creation?",
      "options": ["200 OK", "201 Created", "204 No Content", "404 Not Found"],
      "correct": 1
    },
    {
      "question": "What header is used for authentication?",
      "options": ["Content-Type", "Accept", "Authorization", "User-Agent"],
      "correct": 2
    },
    {
      "question": "Which HTTP method is idempotent?",
      "options": ["POST", "GET", "Both", "Neither"],
      "correct": 1
    },
    {
      "question": "What does REST stand for?",
      "options": [
        "Remote Execution Service Transfer",
        "Representational State Transfer",
        "Resource Execution State Transfer",
        "Remote State Execution Transfer"
      ],
      "correct": 1
    }
  ],
  "references": [
    {
      "title": "MDN Web Docs - HTTP",
      "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP"
    },
    {
      "title": "REST API Tutorial",
      "url": "https://restfulapi.net/"
    }
  ]
};
