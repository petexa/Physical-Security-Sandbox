export default {
  "id": "lab-2",
  "title": "Door Management",
  "difficulty": "beginner",
  "estimatedTime": "25 minutes",
  "skillsCovered": ["Doors API", "Filtering", "Events"],
  "prerequisites": ["module-2", "module-3"],
  "description": "Learn to query and manage doors in the PACS",
  "steps": [
    {
      "id": "step-1",
      "title": "List All Doors",
      "instructions": "Retrieve a list of all doors in the system.",
      "hint": "Use GET method on `/api/doors`",
      "expectedEndpoint": "/api/doors",
      "expectedMethod": "GET",
      "expectedResult": {
        "statusCode": 200,
        "bodyContains": ["id", "name", "location"]
      }
    },
    {
      "id": "step-2",
      "title": "Get Specific Door Status",
      "instructions": "Get the status and details of door ID 5.",
      "hint": "Append the door ID to the endpoint.",
      "expectedEndpoint": "/api/doors/5",
      "expectedMethod": "GET",
      "expectedResult": {
        "statusCode": 200,
        "bodyContains": ["id", "name", "status"]
      }
    },
    {
      "id": "step-3",
      "title": "Query Door Events",
      "instructions": "Query events for door ID 5 using `/api/events?door_id=5&limit=20`",
      "hint": "Use query parameters to filter events by door_id.",
      "expectedEndpoint": "/api/events?door_id=5&limit=20",
      "expectedMethod": "GET",
      "expectedResult": {
        "statusCode": 200,
        "bodyContains": ["door_id", "timestamp"]
      }
    },
    {
      "id": "step-4",
      "title": "Find Doors with Faults",
      "instructions": "Query for fault events: `/api/events?category=fault&limit=50`",
      "hint": "Use the category parameter to filter for faults.",
      "expectedEndpoint": "/api/events?category=fault&limit=50",
      "expectedMethod": "GET",
      "expectedResult": {
        "statusCode": 200,
        "bodyContains": ["category", "event_type"]
      }
    },
    {
      "id": "step-5",
      "title": "Export Door List",
      "instructions": "Successfully retrieve all doors - this data can be exported to CSV in a real application.",
      "hint": "Retrieve all doors as you did in step 1.",
      "expectedEndpoint": "/api/doors",
      "expectedMethod": "GET",
      "expectedResult": {
        "statusCode": 200,
        "bodyContains": ["id", "name"]
      }
    }
  ]
};
