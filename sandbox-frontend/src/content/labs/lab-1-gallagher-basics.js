export default {
  "id": "lab-1",
  "title": "Gallagher Basics",
  "difficulty": "beginner",
  "estimatedTime": "20 minutes",
  "skillsCovered": ["API requests", "Cardholders", "Access Groups"],
  "prerequisites": ["module-1", "module-2"],
  "description": "Learn to manage cardholders using the Gallagher API",
  "steps": [
    {
      "id": "step-1",
      "title": "Retrieve All Cardholders",
      "instructions": "Use a GET request to retrieve all cardholders from the system. The API endpoint is `/api/cardholders`.",
      "hint": "Make sure to use the GET method and include the proper endpoint.",
      "expectedEndpoint": "/api/cardholders",
      "expectedMethod": "GET",
      "expectedResult": {
        "statusCode": 200,
        "bodyContains": ["id", "first_name", "last_name"]
      }
    },
    {
      "id": "step-2",
      "title": "Get Specific Cardholder",
      "instructions": "Retrieve details for cardholder with ID 1. Use the endpoint `/api/cardholders/1`.",
      "hint": "Use GET method and append the ID to the cardholders endpoint.",
      "expectedEndpoint": "/api/cardholders/1",
      "expectedMethod": "GET",
      "expectedResult": {
        "statusCode": 200,
        "bodyContains": ["id", "first_name", "last_name", "email"]
      }
    },
    {
      "id": "step-3",
      "title": "Create New Cardholder",
      "instructions": "Create a new cardholder using POST with JSON body containing `first_name`, `last_name`, and `email`.",
      "hint": "Use POST method to `/api/cardholders` with a JSON body.",
      "expectedEndpoint": "/api/cardholders",
      "expectedMethod": "POST",
      "expectedResult": {
        "statusCode": 201,
        "bodyContains": ["id"]
      },
      "sampleBody": {
        "first_name": "Jane",
        "last_name": "Doe",
        "email": "jane.doe@example.com"
      }
    },
    {
      "id": "step-4",
      "title": "Update Cardholder Access Group",
      "instructions": "Update cardholder ID 1's access group using PATCH method.",
      "hint": "Use PATCH to `/api/cardholders/1` with `access_groups` in the body.",
      "expectedEndpoint": "/api/cardholders/1",
      "expectedMethod": "PATCH",
      "expectedResult": {
        "statusCode": 200,
        "bodyContains": ["access_groups"]
      },
      "sampleBody": {
        "access_groups": ["Building A"]
      }
    },
    {
      "id": "step-5",
      "title": "Verify Access Groups",
      "instructions": "Retrieve the cardholder again to verify their access groups were updated.",
      "hint": "Use GET to retrieve cardholder ID 1 and check the access_groups field.",
      "expectedEndpoint": "/api/cardholders/1",
      "expectedMethod": "GET",
      "expectedResult": {
        "statusCode": 200,
        "bodyContains": ["access_groups"]
      }
    }
  ]
};
