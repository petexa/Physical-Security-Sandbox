# Gallagher API Compliance Documentation

## Overview
This platform implements Gallagher Command Centre REST API v8.30 compliance for training purposes.

## API Base URL
```
https://localhost:8904/api
```

## Compliance Checklist

### Entity Structure
- [x] All entities include `id` field
- [x] All entities include `href` field with full URL
- [x] All entities include `serverDisplayName` field
- [x] All entities include `created` timestamp (ISO 8601)
- [x] All entities include `modified` timestamp (ISO 8601)

### Cardholders (`/api/cardholders`)
- [x] firstName, lastName, name fields
- [x] credentials array with full structure
- [x] accessGroups array with href links
- [x] division object with href
- [x] authorised, deleted boolean fields
- [x] lastSuccessfulAccessTime, lastSuccessfulAccessZone
- [x] updates href link

### Access Groups (`/api/access_groups`)
- [x] name, description fields
- [x] parent object (if nested)
- [x] accessGroupType field

### Doors (`/api/items` with type=door)
- [x] name, description fields
- [x] mode object with current mode
- [x] alarm object with current state
- [x] readers array (in/out)
- [x] accessZone object
- [x] updates href link

### Controllers (`/api/items` with type=controller)
- [x] address, serialNumber, shortAddress
- [x] hardwareVersion, firmwareVersion, bootVersion
- [x] online boolean
- [x] lastStatusChange timestamp
- [x] mode and alarm objects

### Inputs (`/api/items` with type=input)
- [x] type object with input type
- [x] normal state configuration
- [x] current state object

### Outputs (`/api/items` with type=output)
- [x] type object with output type
- [x] pulse configuration
- [x] current state object

### Events (`/api/events`)
- [x] time field (ISO 8601)
- [x] type object (id, name)
- [x] source object (door/controller/etc)
- [x] cardholder object (if applicable)
- [x] cardNumber field
- [x] accessGroup object
- [x] division object
- [x] priority field (0-10000)
- [x] details field

### Operator Groups (`/api/operator_groups`)
- [x] members array with operator details
- [x] roles array with role details

### Pagination
- [x] Support for `top` parameter (page size)
- [x] Support for `skip` parameter (offset)
- [x] results array in response
- [x] next href for pagination
- [x] href field with current request URL

### Filtering & Sorting
- [x] Support for `fields` parameter
- [x] Support for `sort` parameter
- [x] Query parameters for event filtering

## API Endpoints

### Cardholders
```bash
# List all cardholders (paginated)
GET /api/cardholders?top=100&skip=0

# Get specific cardholder
GET /api/cardholders/{id}

# Create cardholder
POST /api/cardholders

# Update cardholder
PATCH /api/cardholders/{id}
```

### Access Groups
```bash
# List all access groups
GET /api/access_groups?top=100&skip=0

# Get specific access group
GET /api/access_groups/{id}
```

### Items (Doors, Controllers, Inputs, Outputs)
```bash
# List all items
GET /api/items

# List doors only
GET /api/items?type=door

# List controllers only
GET /api/items?type=controller

# List inputs only
GET /api/items?type=input

# List outputs only
GET /api/items?type=output

# Get specific item
GET /api/items/{id}
```

### Events
```bash
# List events
GET /api/events

# Filter by date range
GET /api/events?start_date=2024-11-01&end_date=2024-11-30

# Filter by type
GET /api/events?type=access_denied

# Filter by door
GET /api/events?door_id=DOOR-001

# Limit results
GET /api/events?limit=100
```

### Operator Groups
```bash
# List all operator groups
GET /api/operator_groups

# Get specific operator group
GET /api/operator_groups/{id}
```

## Response Structure

### Paginated Response
```json
{
  "results": [...],
  "href": "https://localhost:8904/api/cardholders?top=100&skip=0",
  "next": {
    "href": "https://localhost:8904/api/cardholders?top=100&skip=100"
  }
}
```

### Entity with href
```json
{
  "id": "CH-001",
  "href": "https://localhost:8904/api/cardholders/CH-001",
  "name": "John Doe",
  "serverDisplayName": "Training Server",
  "created": "2022-03-15T08:00:00Z",
  "modified": "2024-11-20T14:30:00Z",
  "updates": {
    "href": "https://localhost:8904/api/cardholders/CH-001/updates"
  }
}
```

## Validation

All API responses are validated against Gallagher schema using `gallagherValidator.js`.

To validate a response:
```javascript
import { validateCardholderResponse } from './utils/gallagherValidator';

const response = await get('/api/cardholders/CH-001');
const validation = validateCardholderResponse(response.data);

if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
}
```

## Examples

### List Cardholders with Pagination
```javascript
import { get } from './utils/apiClient';

const response = await get('/api/cardholders?top=10&skip=0');
console.log(response.data.results); // First 10 cardholders
console.log(response.data.next.href); // URL for next page
```

### Get Cardholder Details
```javascript
const response = await get('/api/cardholders/CH-001');
console.log(response.data.firstName); // "John"
console.log(response.data.credentials); // Array of credentials
console.log(response.data.accessGroups); // Array of access groups with hrefs
```

### List Doors
```javascript
const response = await get('/api/items?type=door');
console.log(response.data.results); // Array of doors
```

### Filter Events
```javascript
const response = await get('/api/events?start_date=2024-11-01&end_date=2024-11-30&type=access_denied');
console.log(response.data); // Filtered events
```

## Reference Documentation
- Official Gallagher Docs: https://gallaghersecurity.github.io/cc-rest-docs/
- Cardholders: https://gallaghersecurity.github.io/cc-rest-docs/ref/cardholders.html
- Items (Doors/Controllers): https://gallaghersecurity.github.io/cc-rest-docs/ref/items.html
- Events: https://gallaghersecurity.github.io/cc-rest-docs/ref/events.html
- Access Groups: https://gallaghersecurity.github.io/cc-rest-docs/ref/access_groups.html

## Testing

### Manual Testing
1. Navigate to the "API Testing Console" in the frontend
2. Select "Gallagher PACS" from the endpoint browser
3. Test various endpoints:
   - List Cardholders
   - Get Cardholder by ID
   - List Doors with pagination
   - Filter events

### Automated Validation
Run the validator on any response:
```javascript
import validator from './utils/gallagherValidator';

// Validate cardholder response
const cardholderValidation = validator.validateCardholderResponse(data);

// Validate paginated response
const paginationValidation = validator.validatePaginatedResponse(data);

// Validate door response
const doorValidation = validator.validateDoorResponse(data);
```

## Notes
- This is a training simulation - not connected to real Gallagher systems
- All responses match Gallagher API v8.30 structure
- Mock data follows realistic patterns and relationships
- All timestamps are in ISO 8601 format
- All entity references include proper href links
