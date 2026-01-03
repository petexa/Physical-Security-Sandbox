// Mock AI Implementation for Demo/Training
// Simulates AI responses for offline functionality

import { 
  filterEvents, 
  getEventStatistics, 
  getRecentEvents,
  getEventsByType,
  getTopDoorsByActivity,
  getEventPatterns
} from './eventQuery.js';
import { 
  extractDoorName, 
  extractCardholderName, 
  parseTimeRange, 
  parseEventType 
} from './aiPrompts.js';

// Simulate AI processing delay
async function simulateAIDelay(minMs = 1000, maxMs = 2500) {
  const delay = minMs + Math.random() * (maxMs - minMs);
  await new Promise(resolve => setTimeout(resolve, delay));
}

// Process natural language query about events
export async function processNaturalLanguageQuery(query, events, doors, cardholders) {
  await simulateAIDelay(1500, 2500);
  
  const lowerQuery = query.toLowerCase();
  let filtered = [...events];
  
  // Parse time range
  const timeRange = parseTimeRange(lowerQuery);
  if (timeRange) {
    filtered = getRecentEvents(filtered, timeRange.value, timeRange.unit);
  }
  
  // Parse event type
  const eventType = parseEventType(lowerQuery);
  if (eventType) {
    if (eventType === 'fault') {
      filtered = filtered.filter(e => e.category === 'fault');
    } else if (eventType === 'alarm') {
      filtered = filtered.filter(e => e.category === 'alarm');
    } else {
      filtered = filtered.filter(e => e.event_type === eventType);
    }
  }
  
  // Parse door/location
  const doorName = extractDoorName(lowerQuery, doors);
  if (doorName) {
    const door = doors.find(d => d.name.toLowerCase().includes(doorName.toLowerCase()));
    if (door) {
      filtered = filtered.filter(e => e.door_id === door.id);
    }
  }
  
  // Parse cardholder
  const cardholderName = extractCardholderName(lowerQuery, cardholders);
  if (cardholderName) {
    filtered = filtered.filter(e => {
      if (!e.cardholder_name) return false;
      return e.cardholder_name.toLowerCase().includes(cardholderName.toLowerCase());
    });
  }
  
  // Generate response based on query intent
  if (lowerQuery.includes('how many')) {
    const count = filtered.length;
    let answer = `Based on the available data, `;
    
    if (doorName) {
      answer += `the ${doorName} has `;
    } else {
      answer += `there have been `;
    }
    
    if (eventType === 'fault') {
      answer += `${count} fault event${count !== 1 ? 's' : ''}`;
    } else if (eventType === 'access_denied') {
      answer += `${count} access denial${count !== 1 ? 's' : ''}`;
    } else if (eventType === 'alarm') {
      answer += `${count} alarm${count !== 1 ? 's' : ''}`;
    } else {
      answer += `${count} event${count !== 1 ? 's' : ''}`;
    }
    
    if (timeRange) {
      answer += ` in the last ${timeRange.value} ${timeRange.unit}`;
    }
    
    answer += `.`;
    
    // Add context if significant
    if (count > 10 && eventType === 'fault') {
      answer += ` This is a relatively high number and may indicate maintenance is needed.`;
    } else if (count > 5 && eventType === 'alarm') {
      answer += ` Multiple alarms warrant investigation to ensure security.`;
    }
    
    return {
      answer,
      supportingData: filtered.slice(0, 10),
      totalCount: count,
      hasMore: count > 10
    };
  }
  
  // "Show" or "List" queries
  if (lowerQuery.includes('show') || lowerQuery.includes('list')) {
    let answer = `Found ${filtered.length} matching event${filtered.length !== 1 ? 's' : ''}`;
    
    if (eventType) {
      if (eventType === 'fault') answer += ` (faults)`;
      else if (eventType === 'access_denied') answer += ` (access denials)`;
      else if (eventType === 'alarm') answer += ` (alarms)`;
    }
    
    if (doorName) answer += ` at ${doorName}`;
    if (timeRange) answer += ` from the last ${timeRange.value} ${timeRange.unit}`;
    
    answer += `.`;
    
    return {
      answer,
      supportingData: filtered.slice(0, 50),
      totalCount: filtered.length,
      hasMore: filtered.length > 50
    };
  }
  
  // "Most active" queries
  if (lowerQuery.includes('most active') && lowerQuery.includes('door')) {
    const topDoors = getTopDoorsByActivity(filtered, 5);
    
    const doorList = topDoors.map((d, i) => 
      `${i + 1}. ${d.door_name} (${d.count} events)`
    ).join('\n');
    
    const answer = `The most active doors are:\n\n${doorList}\n\nThese doors show the highest traffic and may require additional monitoring or maintenance.`;
    
    return {
      answer,
      supportingData: topDoors,
      totalCount: topDoors.length
    };
  }
  
  // "Pattern" or "trend" queries
  if (lowerQuery.includes('pattern') || lowerQuery.includes('trend') || lowerQuery.includes('unusual')) {
    const patterns = getEventPatterns(filtered);
    
    let answer = 'Based on the event data, here are the key patterns:\n\n';
    
    if (patterns.repeatedFaults.length > 0) {
      answer += `**Repeated Faults:**\n`;
      patterns.repeatedFaults.slice(0, 3).forEach(f => {
        answer += `• ${f.door_name}: ${f.count} faults detected\n`;
      });
      answer += '\n';
    }
    
    if (patterns.repeatedDenials.length > 0) {
      answer += `**Repeated Access Denials:**\n`;
      patterns.repeatedDenials.slice(0, 3).forEach(d => {
        answer += `• ${d.cardholder_name}: ${d.count} denials\n`;
      });
      answer += '\n';
    }
    
    if (patterns.unusualActivity.length > 0) {
      answer += `**Unusual Activity Times:**\n`;
      answer += `• ${patterns.unusualActivity.length} events occurred outside normal hours (before 7 AM or after 7 PM)\n\n`;
    }
    
    if (patterns.peakTimes.length > 0) {
      answer += `**Peak Activity Times:**\n`;
      patterns.peakTimes.forEach(t => {
        answer += `• ${t.timeRange}: ${t.count} events\n`;
      });
    }
    
    return {
      answer,
      supportingData: patterns,
      totalCount: filtered.length
    };
  }
  
  // Generic fallback with helpful examples
  return {
    answer: `I can help you query access control events. Here are some things you can ask:\n\n• "How many times has the Server Room faulted in the last 6 months?"\n• "Show all access denials for Building A last month"\n• "What are the most active doors?"\n• "List alarms from the last week"\n• "Show patterns in the data"\n\nTry asking a specific question about the event data.`,
    supportingData: [],
    totalCount: 0
  };
}

// Generate event summary
export async function generateEventSummary(events, dateRange) {
  await simulateAIDelay(2000, 3000);
  
  const stats = getEventStatistics(events);
  const patterns = getEventPatterns(events);
  
  // Generate overview
  const overview = `During the period ${dateRange}, the system recorded ${events.length.toLocaleString()} access control events across ${Object.keys(stats.byDoor).length} monitored doors. The data shows ${stats.byType['access_granted'] || 0} successful access grants, indicating normal operational flow, while ${stats.byType['access_denied'] || 0} access denials and ${(stats.byCategory['fault'] || 0) + (stats.byCategory['alarm'] || 0)} security events required attention.`;
  
  // Generate key findings
  const keyFindings = [
    `${(stats.byType['access_granted'] || 0).toLocaleString()} successful access grants`,
    `${(stats.byType['access_denied'] || 0).toLocaleString()} access denials requiring review`,
    `${(stats.byCategory['fault'] || 0).toLocaleString()} door/system faults detected`,
    `${(stats.byCategory['alarm'] || 0).toLocaleString()} alarm events requiring immediate attention`,
    `${patterns.unusualActivity.length.toLocaleString()} events occurred outside normal business hours`
  ];
  
  // Generate statistics breakdown
  const statistics = {
    totalEvents: events.length,
    byCategory: stats.byCategory,
    byType: stats.byType,
    topDoors: getTopDoorsByActivity(events, 5),
    peakTimes: patterns.peakTimes
  };
  
  // Identify security concerns
  const concerns = [];
  
  if (patterns.repeatedFaults.length > 0) {
    concerns.push({
      type: 'Repeated Door Faults',
      description: `${patterns.repeatedFaults.length} door(s) show repeated fault conditions, suggesting maintenance requirements.`,
      doors: patterns.repeatedFaults.slice(0, 3).map(f => f.door_name)
    });
  }
  
  if (patterns.repeatedDenials.length > 0) {
    concerns.push({
      type: 'Repeated Access Denials',
      description: `${patterns.repeatedDenials.length} cardholder(s) experienced multiple access denials, which may indicate access rights issues.`,
      cardholders: patterns.repeatedDenials.slice(0, 3).map(d => d.cardholder_name)
    });
  }
  
  if (patterns.unusualActivity.length > 100) {
    concerns.push({
      type: 'High Off-Hours Activity',
      description: `${patterns.unusualActivity.length} events occurred outside normal business hours, warranting security review.`,
      count: patterns.unusualActivity.length
    });
  }
  
  if ((stats.byCategory['alarm'] || 0) > 20) {
    concerns.push({
      type: 'Elevated Alarm Rate',
      description: `${stats.byCategory['alarm']} alarm events detected, which is above normal thresholds.`,
      count: stats.byCategory['alarm']
    });
  }
  
  // Generate recommendations
  const recommendations = [
    {
      priority: 'High',
      action: 'Review Access Denial Patterns',
      description: 'Analyze repeated access denials to identify access rights misconfigurations or potential security issues.'
    },
    {
      priority: 'High',
      action: 'Schedule Preventive Maintenance',
      description: 'Address doors with repeated faults to prevent security gaps and operational disruptions.'
    },
    {
      priority: 'Medium',
      action: 'Investigate Off-Hours Activity',
      description: 'Review unusual time activity to verify legitimate access and identify potential security concerns.'
    },
    {
      priority: 'Medium',
      action: 'Optimize Camera Coverage',
      description: 'Consider adding cameras at high-denial locations for enhanced forensic capabilities.'
    },
    {
      priority: 'Low',
      action: 'Update Access Schedules',
      description: 'Review and update time zone restrictions based on actual usage patterns.'
    }
  ];
  
  return {
    overview,
    keyFindings,
    statistics,
    concerns,
    recommendations,
    dateRange,
    generatedAt: new Date().toISOString()
  };
}

// Generate incident report
export async function generateIncidentReport(events, context) {
  await simulateAIDelay(2000, 3000);
  
  // Sort events chronologically
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.timestamp) - new Date(b.timestamp)
  );
  
  const firstEvent = sortedEvents[0];
  const lastEvent = sortedEvents[sortedEvents.length - 1];
  
  // Generate incident ID
  const incidentDate = new Date(firstEvent.timestamp);
  const incidentId = `INC-${incidentDate.getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
  
  // Executive summary
  const summary = `On ${incidentDate.toLocaleDateString()} at ${incidentDate.toLocaleTimeString()}, a security incident was detected involving ${events.length} related event(s) at ${context.doors.length} location(s). The incident began with a ${firstEvent.event_type.replace(/_/g, ' ')} at ${firstEvent.door_name} and escalated over ${Math.round((new Date(lastEvent.timestamp) - new Date(firstEvent.timestamp)) / 60000)} minutes. ${context.cardholders.length > 0 ? `${context.cardholders.length} cardholder(s) were involved.` : 'No cardholders were directly involved.'} This report provides a detailed timeline and recommended actions.`;
  
  // Timeline
  const timeline = sortedEvents.map((event, index) => ({
    sequence: index + 1,
    timestamp: new Date(event.timestamp).toLocaleString(),
    eventType: event.event_type.replace(/_/g, ' '),
    location: event.door_name,
    cardholder: event.cardholder_name || 'N/A',
    details: event.details || 'No additional details',
    severity: event.category === 'alarm' ? 'High' : event.category === 'fault' ? 'Medium' : 'Low'
  }));
  
  // Persons/Assets involved
  const involved = {
    doors: context.doors.map(d => ({
      name: d.name,
      location: d.location,
      status: d.status
    })),
    cardholders: context.cardholders.map(ch => ({
      name: `${ch.first_name} ${ch.last_name}`,
      department: ch.department,
      role: ch.job_title
    })),
    cameras: context.cameras.map(c => ({
      name: c.name,
      location: c.location
    }))
  };
  
  // Evidence available
  const evidence = [];
  
  if (context.cameras.length > 0) {
    evidence.push({
      type: 'Video Footage',
      description: `${context.cameras.length} camera(s) cover the incident location`,
      locations: context.cameras.map(c => c.name),
      priority: 'High'
    });
  }
  
  evidence.push({
    type: 'Access Control Logs',
    description: `${events.length} event log entries captured`,
    priority: 'High'
  });
  
  if (context.cardholders.length > 0) {
    evidence.push({
      type: 'Cardholder Records',
      description: `Access rights and history for ${context.cardholders.length} involved person(s)`,
      priority: 'Medium'
    });
  }
  
  // Recommended actions
  const actions = [];
  
  const hasAlarm = events.some(e => e.category === 'alarm');
  const hasFault = events.some(e => e.category === 'fault');
  const hasDenial = events.some(e => e.event_type === 'access_denied');
  
  if (hasAlarm) {
    actions.push({
      priority: 'Immediate',
      action: 'Security Response',
      description: 'Dispatch security personnel to verify physical security at affected location(s).',
      assignedTo: 'Security Operations'
    });
  }
  
  if (context.cameras.length > 0) {
    actions.push({
      priority: 'Immediate',
      action: 'Review Video Footage',
      description: 'Review recorded footage from all cameras covering the incident timeframe.',
      assignedTo: 'Security Analyst'
    });
  }
  
  if (context.cardholders.length > 0) {
    actions.push({
      priority: 'High',
      action: 'Interview Cardholders',
      description: 'Contact involved cardholders to gather additional information about the incident.',
      assignedTo: 'Security Manager'
    });
  }
  
  if (hasFault) {
    actions.push({
      priority: 'High',
      action: 'Physical Inspection',
      description: 'Conduct physical inspection of door hardware and access control equipment.',
      assignedTo: 'Maintenance Team'
    });
  }
  
  if (hasDenial) {
    actions.push({
      priority: 'Medium',
      action: 'Access Rights Review',
      description: 'Verify access rights configuration for affected cardholders and locations.',
      assignedTo: 'Access Control Administrator'
    });
  }
  
  actions.push({
    priority: 'Medium',
    action: 'Incident Documentation',
    description: 'Complete formal incident report and file in security incident database.',
    assignedTo: 'Security Administrator'
  });
  
  // Follow-up items
  const followUp = [
    {
      item: 'Verify all physical security measures are restored to normal operation',
      deadline: '24 hours',
      owner: 'Security Operations'
    },
    {
      item: 'Review and update security procedures if gaps were identified',
      deadline: '7 days',
      owner: 'Security Manager'
    },
    {
      item: 'Conduct preventive maintenance on affected hardware',
      deadline: '14 days',
      owner: 'Maintenance Team'
    },
    {
      item: 'Follow up with involved cardholders on security awareness',
      deadline: '7 days',
      owner: 'Security Administrator'
    }
  ];
  
  return {
    incidentId,
    dateTime: firstEvent.timestamp,
    duration: `${Math.round((new Date(lastEvent.timestamp) - new Date(firstEvent.timestamp)) / 60000)} minutes`,
    summary,
    timeline,
    involved,
    evidence,
    actions,
    followUp,
    generatedAt: new Date().toISOString(),
    generatedBy: 'AI Security Assistant'
  };
}

// Analyze system logs
export async function analyzeSystemLogs(logs, logFormat = 'generic') {
  await simulateAIDelay(1500, 2500);
  
  const analysis = {
    securityConcerns: [],
    anomalies: [],
    systemFaults: [],
    performanceIssues: [],
    recommendations: []
  };
  
  const logLines = logs.split('\n').filter(line => line.trim());
  
  // Simple pattern matching for demo purposes
  logLines.forEach((line, index) => {
    const lowerLine = line.toLowerCase();
    
    // Security concerns
    if (lowerLine.includes('unauthorized') || 
        lowerLine.includes('intrusion') || 
        lowerLine.includes('breach') ||
        lowerLine.includes('tamper')) {
      analysis.securityConcerns.push({
        line: index + 1,
        text: line.substring(0, 100),
        severity: 'High',
        type: 'Security Threat'
      });
    }
    
    // Anomalies
    if (lowerLine.includes('unusual') || 
        lowerLine.includes('unexpected') || 
        lowerLine.includes('anomaly')) {
      analysis.anomalies.push({
        line: index + 1,
        text: line.substring(0, 100),
        type: 'Unusual Pattern'
      });
    }
    
    // System faults
    if (lowerLine.includes('error') || 
        lowerLine.includes('fault') || 
        lowerLine.includes('failed') ||
        lowerLine.includes('offline')) {
      analysis.systemFaults.push({
        line: index + 1,
        text: line.substring(0, 100),
        severity: lowerLine.includes('critical') ? 'Critical' : 'Medium'
      });
    }
    
    // Performance issues
    if (lowerLine.includes('slow') || 
        lowerLine.includes('timeout') || 
        lowerLine.includes('latency') ||
        lowerLine.includes('performance')) {
      analysis.performanceIssues.push({
        line: index + 1,
        text: line.substring(0, 100),
        impact: 'Performance degradation detected'
      });
    }
  });
  
  // Generate recommendations
  if (analysis.securityConcerns.length > 0) {
    analysis.recommendations.push({
      priority: 'Critical',
      action: 'Immediate Security Review',
      description: `${analysis.securityConcerns.length} security concern(s) detected in logs. Immediate investigation required.`
    });
  }
  
  if (analysis.systemFaults.length > 5) {
    analysis.recommendations.push({
      priority: 'High',
      action: 'System Health Check',
      description: `${analysis.systemFaults.length} system faults detected. Schedule comprehensive system diagnostics.`
    });
  }
  
  if (analysis.performanceIssues.length > 0) {
    analysis.recommendations.push({
      priority: 'Medium',
      action: 'Performance Optimization',
      description: 'Performance issues detected. Consider system tuning or resource allocation review.'
    });
  }
  
  if (analysis.anomalies.length > 0) {
    analysis.recommendations.push({
      priority: 'Medium',
      action: 'Pattern Analysis',
      description: `${analysis.anomalies.length} anomaly/anomalies detected. Review for potential issues or configuration problems.`
    });
  }
  
  if (analysis.securityConcerns.length === 0 && 
      analysis.systemFaults.length < 3 && 
      analysis.performanceIssues.length === 0) {
    analysis.recommendations.push({
      priority: 'Low',
      action: 'Continue Monitoring',
      description: 'No critical issues detected. Maintain regular log monitoring schedule.'
    });
  }
  
  return {
    summary: `Analyzed ${logLines.length} log entries. Found ${analysis.securityConcerns.length} security concern(s), ${analysis.systemFaults.length} system fault(s), ${analysis.performanceIssues.length} performance issue(s), and ${analysis.anomalies.length} anomaly/anomalies.`,
    ...analysis,
    analyzedAt: new Date().toISOString()
  };
}

// Build investigation workflow
export async function buildInvestigation(initialEvent, relatedEvents, allEvents) {
  await simulateAIDelay(1500, 2500);
  
  // Find truly related events (within time window and location)
  const eventTime = new Date(initialEvent.timestamp);
  const timeWindowMinutes = 30;
  
  const nearbyEvents = allEvents.filter(e => {
    const eTime = new Date(e.timestamp);
    const diffMinutes = Math.abs(eTime - eventTime) / 60000;
    return diffMinutes <= timeWindowMinutes && 
           (e.door_id === initialEvent.door_id || 
            e.location === initialEvent.location);
  });
  
  // Build investigation steps
  const steps = [
    {
      step: 1,
      title: 'Verify Initial Event',
      description: `Confirm the ${initialEvent.event_type.replace(/_/g, ' ')} at ${initialEvent.door_name} on ${new Date(initialEvent.timestamp).toLocaleString()}.`,
      action: 'Review event details and verify system timestamp accuracy.',
      completed: false
    },
    {
      step: 2,
      title: 'Review Video Evidence',
      description: 'Locate and review video footage from cameras covering the location.',
      action: 'Check for visual confirmation of the reported event.',
      completed: false
    },
    {
      step: 3,
      title: 'Analyze Event Timeline',
      description: `Review ${nearbyEvents.length} events in the surrounding ${timeWindowMinutes}-minute window.`,
      action: 'Identify patterns or sequences that led to or followed the initial event.',
      completed: false
    },
    {
      step: 4,
      title: 'Identify Involved Parties',
      description: initialEvent.cardholder_name 
        ? `Contact ${initialEvent.cardholder_name} for their account of events.`
        : 'Determine if any cardholders were present at the time.',
      action: 'Gather witness statements and verify access rights.',
      completed: false
    },
    {
      step: 5,
      title: 'Inspect Physical Location',
      description: `Conduct physical inspection of ${initialEvent.door_name} and surrounding area.`,
      action: 'Check for damage, tampering, or hardware issues.',
      completed: false
    },
    {
      step: 6,
      title: 'Document Findings',
      description: 'Compile all evidence and observations into formal incident report.',
      action: 'Create comprehensive documentation for security records.',
      completed: false
    }
  ];
  
  // Key questions
  const questions = [
    {
      question: 'Was this event expected or authorized?',
      relevance: 'Determines if this is a legitimate access or security incident'
    },
    {
      question: 'Were there any preceding events that could have triggered this?',
      relevance: 'Helps identify root cause and patterns'
    },
    {
      question: 'Who had access rights to this location at this time?',
      relevance: 'Verifies access control configuration'
    },
    {
      question: 'Is video footage available and clear?',
      relevance: 'Determines strength of forensic evidence'
    },
    {
      question: 'Have similar events occurred at this location before?',
      relevance: 'Identifies potential recurring issues'
    }
  ];
  
  // Evidence to gather
  const evidenceChecklist = [
    { item: 'Video footage from all nearby cameras', collected: false, priority: 'High' },
    { item: 'Access control system logs for 1-hour window', collected: false, priority: 'High' },
    { item: 'Cardholder access rights and history', collected: false, priority: 'Medium' },
    { item: 'Physical inspection photographs', collected: false, priority: 'Medium' },
    { item: 'Witness statements (if applicable)', collected: false, priority: 'Medium' },
    { item: 'Related maintenance or service records', collected: false, priority: 'Low' }
  ];
  
  // Timeline reconstruction
  const timelineEvents = nearbyEvents.slice(0, 10).map(e => ({
    timestamp: new Date(e.timestamp).toLocaleString(),
    event: e.event_type.replace(/_/g, ' '),
    location: e.door_name,
    cardholder: e.cardholder_name || 'N/A',
    isInitial: e.id === initialEvent.id
  }));
  
  // Next actions
  const nextActions = [
    {
      priority: 'Immediate',
      action: 'Secure the location',
      description: 'Ensure physical security is maintained at the affected location.',
      assignee: 'Security Operations'
    },
    {
      priority: 'Within 1 hour',
      action: 'Gather video evidence',
      description: 'Retrieve and secure video footage before it may be overwritten.',
      assignee: 'Security Analyst'
    },
    {
      priority: 'Within 4 hours',
      action: 'Interview involved parties',
      description: 'Contact cardholders and witnesses while memory is fresh.',
      assignee: 'Security Manager'
    },
    {
      priority: 'Within 24 hours',
      action: 'Complete investigation report',
      description: 'Document all findings in formal incident report.',
      assignee: 'Security Administrator'
    }
  ];
  
  return {
    initialEvent: {
      timestamp: initialEvent.timestamp,
      type: initialEvent.event_type,
      location: initialEvent.door_name,
      cardholder: initialEvent.cardholder_name || 'Unknown'
    },
    relatedEventsCount: nearbyEvents.length,
    investigationSteps: steps,
    keyQuestions: questions,
    evidenceChecklist,
    timelineReconstruction: timelineEvents,
    nextActions,
    estimatedDuration: '4-24 hours',
    complexity: nearbyEvents.length > 10 ? 'High' : nearbyEvents.length > 5 ? 'Medium' : 'Low',
    createdAt: new Date().toISOString()
  };
}

// Explain API response
export async function explainApiResponse(apiResponse, apiType) {
  await simulateAIDelay(1000, 2000);
  
  const explanation = {
    apiType,
    overview: '',
    keyFields: [],
    commonUseCases: [],
    relatedEndpoints: [],
    exampleCode: ''
  };
  
  // Parse response and generate explanation based on API type
  if (apiType === 'Gallagher') {
    explanation.overview = 'This is a Gallagher Command Centre API response. It contains access control data in JSON format following Gallagher\'s REST API specifications.';
    explanation.keyFields = [
      { field: 'href', description: 'Resource URL for direct access to this entity' },
      { field: 'id', description: 'Unique identifier for the resource' },
      { field: 'name', description: 'Human-readable name of the resource' },
      { field: 'updates', description: 'Object containing update-related URLs and information' }
    ];
    explanation.commonUseCases = [
      'Retrieving cardholder or door information',
      'Monitoring access control events',
      'Managing access groups and schedules',
      'Integrating with third-party systems'
    ];
    explanation.relatedEndpoints = [
      '/api/cardholders - Manage cardholders',
      '/api/access_groups - Manage access groups',
      '/api/doors - Manage doors',
      '/api/events - Retrieve events'
    ];
  } else if (apiType === 'Milestone') {
    explanation.overview = 'This is a Milestone XProtect API response. It provides video management system data for camera operations and video retrieval.';
    explanation.keyFields = [
      { field: 'CameraId', description: 'Unique identifier for the camera' },
      { field: 'Name', description: 'Camera name as configured in XProtect' },
      { field: 'State', description: 'Current operational state (Recording, Stopped, etc.)' },
      { field: 'Streams', description: 'Available video streams and their properties' }
    ];
    explanation.commonUseCases = [
      'Retrieving live video streams',
      'Accessing recorded video footage',
      'Managing PTZ camera controls',
      'Monitoring camera health and status'
    ];
    explanation.relatedEndpoints = [
      '/cameras - List all cameras',
      '/recordings - Access recorded video',
      '/live - Get live video streams',
      '/events - Retrieve VMS events'
    ];
  } else {
    explanation.overview = 'This API response contains structured data from a physical security system. The response follows standard REST API conventions with JSON formatting.';
    explanation.keyFields = [
      { field: 'Common fields', description: 'Look for id, name, timestamp, status, and type fields' }
    ];
    explanation.commonUseCases = [
      'System integration',
      'Data retrieval and monitoring',
      'Event processing',
      'Report generation'
    ];
  }
  
  // Generate example code
  explanation.exampleCode = `// Example: Fetching data from ${apiType} API
fetch('https://api.example.com/endpoint', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  console.log('API Response:', data);
  // Process the data here
})
.catch(error => {
  console.error('API Error:', error);
});`;
  
  return explanation;
}
