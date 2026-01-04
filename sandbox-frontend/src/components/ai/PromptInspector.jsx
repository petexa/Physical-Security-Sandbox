import { useState } from 'react';
import { Code, Copy, X, ChevronDown, ChevronUp } from 'lucide-react';
import { buildContext, prompts } from '../../utils/aiPrompts';
import './PromptInspector.css';

// Prompt type configurations
const PROMPT_CONFIGS = {
  eventQuery: {
    title: 'Natural Language Query',
    icon: '💬',
    description: 'Query events using natural language'
  },
  eventSummarization: {
    title: 'Event Summarization',
    icon: '📊',
    description: 'Summarize security events over a time period'
  },
  incidentReport: {
    title: 'Incident Report',
    icon: '📋',
    description: 'Generate professional incident reports'
  },
  investigationBuilder: {
    title: 'Investigation Builder',
    icon: '🔍',
    description: 'Build investigation workflows from events'
  },
  apiResponseExplainer: {
    title: 'API Explainer',
    icon: '📖',
    description: 'Explain API responses in plain language'
  },
  logAnalysis: {
    title: 'Log Analysis',
    icon: '📝',
    description: 'Analyze system logs for security issues'
  }
};

export default function PromptInspector({ 
  promptType = 'eventQuery',
  query = '',
  events = [], 
  doors = [], 
  cardholders = [], 
  cameras = [],
  selectedEvents = [],
  logs = '',
  apiResponse = '',
  apiType = 'Gallagher',
  dateRange = '',
  isOpen = false,
  onClose 
}) {
  const [expandedSections, setExpandedSections] = useState({
    prompt: true,
    context: false,
    implementation: false,
    apiIntegration: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (!isOpen) return null;

  const context = buildContext(events, doors, cardholders, cameras);
  const config = PROMPT_CONFIGS[promptType] || PROMPT_CONFIGS.eventQuery;
  
  // Build the appropriate prompt based on type
  const buildPrompt = () => {
    try {
      switch (promptType) {
        case 'eventQuery':
          return prompts.eventQuery(query, context);
        case 'eventSummarization':
          return prompts.eventSummarization(selectedEvents.length > 0 ? selectedEvents : events.slice(0, 50), dateRange || 'Last 30 Days');
        case 'incidentReport':
          return prompts.incidentReport(selectedEvents, { doors, cardholders, cameras });
        case 'investigationBuilder':
          return prompts.investigationBuilder(selectedEvents[0] || events[0], selectedEvents.slice(1) || []);
        case 'apiResponseExplainer':
          return prompts.apiResponseExplainer(apiResponse, apiType);
        case 'logAnalysis':
          return prompts.logAnalysis(logs);
        default:
          return prompts.eventQuery(query, context);
      }
    } catch (e) {
      return `Error building prompt: ${e.message}`;
    }
  };

  const actualPrompt = buildPrompt();

  // Build description of what's being analyzed
  const getInputDescription = () => {
    switch (promptType) {
      case 'eventQuery':
        return `Query: "${query}"`;
      case 'eventSummarization':
        return `${selectedEvents.length || events.length} events, Date Range: ${dateRange || 'Last 30 Days'}`;
      case 'incidentReport':
        return `${selectedEvents.length} selected events for incident report`;
      case 'investigationBuilder':
        return `Initial event: ${selectedEvents[0]?.event_type || 'N/A'} at ${selectedEvents[0]?.door_name || 'N/A'}`;
      case 'apiResponseExplainer':
        return `${apiType} API response (${apiResponse.length} chars)`;
      case 'logAnalysis':
        return `${logs.split('\n').filter(l => l.trim()).length} log lines`;
      default:
        return query;
    }
  };

  const pythonImplementation = `# Python example using Anthropic Claude API
import anthropic
import json

def analyze_with_claude(input_data: dict, prompt_type: str):
    """
    Generic function to analyze security data with Claude AI
    Supports: event queries, summarization, incident reports, 
              investigation building, API explanation, log analysis
    """
    client = anthropic.Anthropic(api_key="your-api-key")
    
    # The prompt is constructed based on your input data
    # This is the exact prompt that would be sent:
    prompt = """${actualPrompt.replace(/`/g, "\\`").slice(0, 500)}...
    
    [Full prompt shown above in the inspector]"""
    
    # Call Claude API
    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=2048,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    
    return message.content[0].text

# For ${config.title}:
# 1. Gather your input data (events, logs, API response, etc.)
# 2. Build the prompt using the template shown above
# 3. Call the Claude API with the constructed prompt
# 4. Parse and display the response

# Example usage:
# result = analyze_with_claude(
#     {"events": events_from_db, "dateRange": "Last 30 Days"},
#     "${promptType}"
# )
# print(result)`;

  const nodeImplementation = `// Node.js example using Anthropic SDK
import Anthropic from "@anthropic-ai/sdk";

async function analyzeWithClaude(inputData, promptType) {
  /**
   * Generic function to analyze security data with Claude AI
   * Supports: event queries, summarization, incident reports,
   *           investigation building, API explanation, log analysis
   */
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  // The prompt is constructed based on your input data
  // This is the exact prompt that would be sent:
  const prompt = \`${actualPrompt.replace(/`/g, "\\`").slice(0, 500)}...
  
  [Full prompt shown above in the inspector]\`;

  // Call Claude API
  const message = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return message.content[0].text;
}

// For ${config.title}:
// 1. Gather your input data (events, logs, API response, etc.)
// 2. Build the prompt using the template shown above
// 3. Call the Claude API with the constructed prompt
// 4. Parse and display the response

// Example usage:
// const result = await analyzeWithClaude(
//   { events: eventsFromDb, dateRange: "Last 30 Days" },
//   "${promptType}"
// );
// console.log(result);`;

  return (
    <div className="prompt-inspector-overlay" onClick={onClose}>
      <div className="prompt-inspector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="inspector-header">
          <div className="header-content">
            <Code size={24} />
            <h2>Behind the Curtain: AI Prompt Inspector</h2>
            <p className="inspector-subtitle">See exactly how this would work with a real AI API</p>
          </div>
          <button className="close-button" onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
        </div>

        <div className="inspector-content">
          {/* Prompt Type & Input */}
          <div className="inspector-section">
            <div className="section-header">
              <h3>{config.icon} {config.title}</h3>
              <p className="section-hint">{config.description}</p>
            </div>
            <div className="query-display">
              <code>{getInputDescription()}</code>
            </div>
          </div>

          {/* The Prompt Section */}
          <div className="inspector-section expandable">
            <div 
              className="section-header expandable-header"
              onClick={() => toggleSection('prompt')}
            >
              <h3>
                {expandedSections.prompt ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                🤖 The Actual Prompt Sent to AI
              </h3>
              <p className="section-hint">This is what Claude/GPT would receive</p>
            </div>
            {expandedSections.prompt && (
              <div className="section-content">
                <div className="prompt-box">
                  <pre>{actualPrompt}</pre>
                  <button 
                    className="copy-button"
                    onClick={() => copyToClipboard(actualPrompt)}
                    title="Copy prompt"
                  >
                    <Copy size={16} /> Copy Prompt
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Context Data */}
          <div className="inspector-section expandable">
            <div 
              className="section-header expandable-header"
              onClick={() => toggleSection('context')}
            >
              <h3>
                {expandedSections.context ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                📊 Structured Data Context
              </h3>
              <p className="section-hint">{context.totalEvents} events, {doors.length} doors</p>
            </div>
            {expandedSections.context && (
              <div className="section-content">
                <div className="context-grid">
                  <div className="context-item">
                    <strong>Prompt Type:</strong>
                    <span>{promptType}</span>
                  </div>
                  <div className="context-item">
                    <strong>Total Events:</strong>
                    <span>{context.totalEvents}</span>
                  </div>
                  <div className="context-item">
                    <strong>Selected Events:</strong>
                    <span>{selectedEvents.length}</span>
                  </div>
                  <div className="context-item">
                    <strong>Available Doors:</strong>
                    <span>{doors.length}</span>
                  </div>
                </div>
                
                {selectedEvents.length > 0 && (
                  <div className="data-sample">
                    <h4>Selected Events (first 3):</h4>
                    <pre>{JSON.stringify(selectedEvents.slice(0, 3), null, 2)}</pre>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Python Implementation */}
          <div className="inspector-section expandable">
            <div 
              className="section-header expandable-header"
              onClick={() => toggleSection('implementation')}
            >
              <h3>
                {expandedSections.implementation ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                🐍 Python Implementation
              </h3>
              <p className="section-hint">How to implement this with Claude API</p>
            </div>
            {expandedSections.implementation && (
              <div className="section-content">
                <div className="code-block">
                  <pre>{pythonImplementation}</pre>
                  <button 
                    className="copy-button"
                    onClick={() => copyToClipboard(pythonImplementation)}
                  >
                    <Copy size={16} /> Copy Code
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Node.js Implementation */}
          <div className="inspector-section expandable">
            <div 
              className="section-header expandable-header"
              onClick={() => toggleSection('apiIntegration')}
            >
              <h3>
                {expandedSections.apiIntegration ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                📦 Node.js Implementation
              </h3>
              <p className="section-hint">How to integrate with Anthropic API</p>
            </div>
            {expandedSections.apiIntegration && (
              <div className="section-content">
                <div className="code-block">
                  <pre>{nodeImplementation}</pre>
                  <button 
                    className="copy-button"
                    onClick={() => copyToClipboard(nodeImplementation)}
                  >
                    <Copy size={16} /> Copy Code
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Learning Resources */}
          <div className="inspector-section learning-resources">
            <h3>📚 Learning Resources</h3>
            <div className="resources-grid">
              <a href="https://docs.anthropic.com" target="_blank" rel="noopener noreferrer" className="resource-card">
                <h4>Claude API Docs</h4>
                <p>Official API documentation</p>
              </a>
              <a href="https://docs.anthropic.com/claude/reference/getting-started-with-the-api" target="_blank" rel="noopener noreferrer" className="resource-card">
                <h4>Getting Started</h4>
                <p>Quick start guide</p>
              </a>
              <a href="https://docs.anthropic.com/claude/reference/prompt-engineering" target="_blank" rel="noopener noreferrer" className="resource-card">
                <h4>Prompt Engineering</h4>
                <p>Best practices for prompts</p>
              </a>
              <a href="https://docs.anthropic.com/claude/reference/models-overview" target="_blank" rel="noopener noreferrer" className="resource-card">
                <h4>Model Selection</h4>
                <p>Choose the right model</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
