// AI Prompt Templates and Context Building
// This utility manages AI prompt templates and context injection

// Prompt templates for each AI feature
export const prompts = {
  eventQuery: (query, context) => `
You are a physical security data analyst. Answer this question about access control events:

Question: ${query}

Context:
- Total events: ${context.totalEvents}
- Date range: ${context.dateRange}
- Available doors: ${context.doors.map(d => d.name).join(', ')}
- Available event types: ${context.eventTypes.join(', ')}

Event data sample:
${JSON.stringify(context.sampleEvents, null, 2)}

Provide a clear, concise answer with supporting data.
`,

  eventSummarization: (events, dateRange) => `
Analyze these physical security events and provide a professional summary:

Date Range: ${dateRange}
Total Events: ${events.length}

Events:
${JSON.stringify(events.slice(0, 100), null, 2)}
${events.length > 100 ? `[... ${events.length - 100} more events]` : ''}

Provide:
1. Overall summary (2-3 sentences)
2. Key findings (bullet points)
3. Security concerns (if any)
4. Recommendations
`,

  incidentReport: (events, context) => `
Generate a professional security incident report:

Incident Events:
${JSON.stringify(events, null, 2)}

Context:
- Doors involved: ${context.doors.map(d => d.name).join(', ')}
- Cardholders involved: ${context.cardholders.map(c => c.name).join(', ')}
- Cameras available: ${context.cameras.map(c => c.name).join(', ')}

Create a report with:
1. Incident Summary
2. Timeline of Events
3. Persons/Assets Involved
4. Evidence Available
5. Recommended Actions
6. Follow-up Items
`,

  logAnalysis: (logs) => `
Analyze these system logs for security issues:

${logs}

Identify:
1. Security concerns
2. Anomalies or unusual patterns
3. System faults or errors
4. Recommended actions
`,

  investigationBuilder: (initialEvent, relatedEvents) => `
Build an investigation workflow for this security event:

Initial Event:
${JSON.stringify(initialEvent, null, 2)}

Related Events:
${JSON.stringify(relatedEvents, null, 2)}

Provide:
1. Investigation steps (ordered list)
2. Key questions to answer
3. Evidence to gather
4. Timeline reconstruction
5. Next actions
`,

  apiResponseExplainer: (apiResponse, apiType) => `
Explain this ${apiType} API response in simple terms:

${JSON.stringify(apiResponse, null, 2)}

Provide:
1. What this response contains
2. Key fields explained
3. Common use cases
4. Related endpoints
`
};

// Build context object from application data
export function buildContext(events, doors, cardholders, cameras) {
  // Safely handle empty or undefined data
  const safeEvents = events || [];
  const safeDoors = doors || [];
  const safeCardholders = cardholders || [];
  const safeCameras = cameras || [];
  
  const firstEvent = safeEvents[0];
  const lastEvent = safeEvents[safeEvents.length - 1];
  
  return {
    totalEvents: safeEvents.length,
    dateRange: firstEvent && lastEvent 
      ? `${firstEvent.timestamp} to ${lastEvent.timestamp}`
      : 'No events available',
    doors: safeDoors,
    cardholders: safeCardholders,
    cameras: safeCameras,
    eventTypes: [...new Set(safeEvents.map(e => e.event_type))],
    sampleEvents: safeEvents.slice(0, 10)
  };
}

// Extract door name from query text
export function extractDoorName(query, doors) {
  const lowerQuery = query.toLowerCase();
  
  // Try to find door name in query
  for (const door of doors) {
    if (lowerQuery.includes(door.name.toLowerCase())) {
      return door.name;
    }
  }
  
  // Try common patterns
  const patterns = [
    /(?:door|room)\s+(?:named\s+)?["']?([^"']+)["']?/i,
    /the\s+([a-z0-9\s]+)\s+(?:door|room)/i
  ];
  
  for (const pattern of patterns) {
    const match = lowerQuery.match(pattern);
    if (match) {
      const extractedName = match[1].trim();
      // Find best matching door
      const door = doors.find(d => 
        d.name.toLowerCase().includes(extractedName) ||
        extractedName.includes(d.name.toLowerCase())
      );
      if (door) return door.name;
    }
  }
  
  return '';
}

// Extract cardholder name from query text
export function extractCardholderName(query, cardholders) {
  const lowerQuery = query.toLowerCase();
  
  for (const cardholder of cardholders) {
    const fullName = `${cardholder.first_name} ${cardholder.last_name}`.toLowerCase();
    if (lowerQuery.includes(fullName)) {
      return fullName;
    }
    if (lowerQuery.includes(cardholder.first_name.toLowerCase()) ||
        lowerQuery.includes(cardholder.last_name.toLowerCase())) {
      return fullName;
    }
  }
  
  return '';
}

// Parse time range from query
export function parseTimeRange(query) {
  const lowerQuery = query.toLowerCase();
  
  // Last N months
  const lastMonthsMatch = lowerQuery.match(/last\s+(\d+)\s+months?/);
  if (lastMonthsMatch) {
    return { value: parseInt(lastMonthsMatch[1]), unit: 'months' };
  }
  
  // Last N weeks
  const lastWeeksMatch = lowerQuery.match(/last\s+(\d+)\s+weeks?/);
  if (lastWeeksMatch) {
    return { value: parseInt(lastWeeksMatch[1]), unit: 'weeks' };
  }
  
  // Last N days
  const lastDaysMatch = lowerQuery.match(/last\s+(\d+)\s+days?/);
  if (lastDaysMatch) {
    return { value: parseInt(lastDaysMatch[1]), unit: 'days' };
  }
  
  // "Last month" (singular)
  if (lowerQuery.includes('last month')) {
    return { value: 1, unit: 'months' };
  }
  
  // "Last week" (singular)
  if (lowerQuery.includes('last week')) {
    return { value: 1, unit: 'weeks' };
  }
  
  // Today
  if (lowerQuery.includes('today')) {
    return { value: 1, unit: 'days' };
  }
  
  return null;
}

// Parse event type from query
export function parseEventType(query) {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('fault') || lowerQuery.includes('faulted')) {
    return 'fault';
  }
  
  if (lowerQuery.includes('denial') || lowerQuery.includes('denied')) {
    return 'access_denied';
  }
  
  if (lowerQuery.includes('alarm')) {
    return 'alarm';
  }
  
  if (lowerQuery.includes('granted') || lowerQuery.includes('successful access')) {
    return 'access_granted';
  }
  
  if (lowerQuery.includes('forced') || lowerQuery.includes('forced entry')) {
    return 'door_forced';
  }
  
  if (lowerQuery.includes('held') || lowerQuery.includes('door held')) {
    return 'door_held';
  }
  
  if (lowerQuery.includes('tamper')) {
    return 'tamper_alarm';
  }
  
  return null;
}
