export default {
  "id": "lab-3",
  "title": "Event Analysis",
  "difficulty": "intermediate",
  "estimatedTime": "30 minutes",
  "skillsCovered": ["Event queries", "Filtering", "Analysis"],
  "prerequisites": ["module-3"],
  "description": "Master event querying and analysis techniques",
  "steps": [
    {
      "id": "step-1",
      "title": "Query Access Denied Events",
      "instructions": "Find all access denied events for the Server Room (door ID 5).",
      "hint": "Combine door_id and event_type filters.",
      "expectedEndpoint": "/api/events?door_id=5&event_type=access_denied",
      "expectedMethod": "GET",
      "expectedResult": {
        "statusCode": 200,
        "bodyContains": ["event_type", "door_id"]
      }
    },
    {
      "id": "step-2",
      "title": "Find Recent Door Faults",
      "instructions": "Query door fault events from the last 7 days. Use category=fault.",
      "hint": "Use the category parameter to filter for fault events.",
      "expectedEndpoint": "/api/events?category=fault&limit=100",
      "expectedMethod": "GET",
      "expectedResult": {
        "statusCode": 200,
        "bodyContains": ["category"]
      }
    },
    {
      "id": "step-3",
      "title": "Count Cardholder Access",
      "instructions": "Query events for cardholder ID 1 to see their access history.",
      "hint": "Use cardholder_id parameter to filter.",
      "expectedEndpoint": "/api/events?cardholder_id=1&limit=50",
      "expectedMethod": "GET",
      "expectedResult": {
        "statusCode": 200,
        "bodyContains": ["cardholder_id"]
      }
    },
    {
      "id": "step-4",
      "title": "Identify Alarm Patterns",
      "instructions": "Query all alarm category events to identify patterns.",
      "hint": "Filter by category=alarm.",
      "expectedEndpoint": "/api/events?category=alarm&limit=100",
      "expectedMethod": "GET",
      "expectedResult": {
        "statusCode": 200,
        "bodyContains": ["category"]
      }
    },
    {
      "id": "step-5",
      "title": "Generate Summary Report",
      "instructions": "Query all events with a reasonable limit to generate summary statistics.",
      "hint": "Request a broader set of events for analysis.",
      "expectedEndpoint": "/api/events?limit=200",
      "expectedMethod": "GET",
      "expectedResult": {
        "statusCode": 200,
        "bodyContains": ["id", "timestamp"]
      }
    }
  ]
};
