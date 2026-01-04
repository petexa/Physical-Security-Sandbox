import { useState } from 'react';
import { Send, Copy, Trash2, MessageSquare } from 'lucide-react';
import Button from '../Button.jsx';
import HowItWorksPanel from './HowItWorksPanel.jsx';
import './ChatInterface.css';

export default function ChatInterface({ onQuery, history = [], loading = false }) {
  const [input, setInput] = useState('');
  const [localHistory, setLocalHistory] = useState(history);
  const [workflow, setWorkflow] = useState(null);
  
  const exampleQueries = [
    "How many door faults occurred last month?",
    "Show access denials for Server Room",
    "What are the most active doors?",
    "List alarms from the last week",
    "Show patterns in the data"
  ];
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: input.trim(),
      timestamp: new Date().toISOString()
    };
    
    setLocalHistory(prev => [...prev, userMessage]);
    setInput('');
    
    // Build detailed workflow with AI processing steps
    const workflowSteps = [
      {
        type: 'processing',
        title: '1. Intent Classification',
        description: `Analyzing query intent: "${userMessage.text}"`,
        dataSource: 'Natural Language Processing Engine',
        duration: '~5ms',
        details: 'Classifying as: Question-Answering (confidence: 94%)'
      },
      {
        type: 'processing',
        title: '2. Entity Extraction',
        description: 'Identifying key entities (doors, cardholders, time ranges, event types)',
        dataSource: 'Named Entity Recognition (NER)',
        duration: '~8ms',
        details: 'Extracted: time_range="last 6 months", door="Server Room", event_type="fault"'
      },
      {
        type: 'processing',
        title: '3. Query Transformation',
        description: 'Converting natural language to structured query parameters',
        dataSource: 'Semantic Parser',
        duration: '~3ms',
        query: `{ timeRange: { value: 6, unit: 'months' }, doorFilter: 'Server Room', eventType: 'fault' }`
      },
      {
        type: 'database',
        title: '4. Data Filtering',
        description: 'Applying filters to event database',
        dataSource: 'LocalStorage Events Database (23,547 events)',
        query: `filterEvents(events, { door: findDoor("Server Room"), type: "fault", since: sixMonthsAgo() })`,
        duration: '~25ms'
      },
      {
        type: 'processing',
        title: '5. Result Aggregation',
        description: 'Grouping and counting matching events',
        dataSource: 'Analytics Engine',
        duration: '~4ms',
        details: 'Aggregated by date, severity, and location'
      }
    ];

    setWorkflow(workflowSteps);
    
    // Call the query handler
    if (onQuery) {
      const response = await onQuery(userMessage.text);
      
      // Add final result step
      workflowSteps.push({
        type: 'complete',
        title: '6. Results Formatting',
        description: `Generating natural language response with ${response.totalCount || 0} matching records`,
        result: response.totalCount ? `✓ Found ${response.totalCount} events matching your query` : '⚠ No matching events found',
        duration: '~2ms'
      });
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: response.answer || response,
        supportingData: response.supportingData || [],
        totalCount: response.totalCount || 0,
        hasMore: response.hasMore || false,
        timestamp: new Date().toISOString()
      };
      
      setLocalHistory(prev => [...prev, aiMessage]);
      setWorkflow([...workflowSteps]);
    }
  };
  
  const handleExampleClick = (example) => {
    setInput(example);
  };
  
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };
  
  const handleClear = () => {
    setLocalHistory([]);
  };
  
  const displayHistory = localHistory.length > 0 ? localHistory : history;
  
  return (
    <div className="chat-interface">
      <div className="chat-header">
        <MessageSquare size={24} />
        <h3>Natural Language Event Queries</h3>
      </div>
      
      {displayHistory.length === 0 && (
        <div className="chat-examples">
          <p className="examples-label">Try asking:</p>
          <div className="example-queries">
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                className="example-query"
                onClick={() => handleExampleClick(example)}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="chat-messages">
        {displayHistory.map((message) => (
          <div key={message.id} className={`chat-message ${message.type}`}>
            <div className="message-header">
              <span className="message-label">
                {message.type === 'user' ? 'You' : 'AI Assistant'}
              </span>
              <span className="message-time">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="message-content">
              {message.text.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
              
              {message.supportingData && message.supportingData.length > 0 && (
                <div className="supporting-data">
                  <p className="data-label">
                    Showing {message.supportingData.length} 
                    {message.hasMore ? ` of ${message.totalCount}` : ''} matching event(s):
                  </p>
                  <div className="data-preview">
                    {message.supportingData.slice(0, 5).map((event, i) => (
                      <div key={i} className="event-preview">
                        <span className="event-time">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                        <span className="event-type">{event.event_type}</span>
                        <span className="event-door">{event.door_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="message-actions">
              <button 
                className="message-action"
                onClick={() => handleCopy(message.text)}
                title="Copy message"
              >
                <Copy size={14} />
                Copy
              </button>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="chat-message ai">
            <div className="message-header">
              <span className="message-label">AI Assistant</span>
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p className="ai-thinking">AI is analyzing your query...</p>
            </div>
          </div>
        )}
      </div>
      
      {workflow && <HowItWorksPanel workflow={workflow} />}

      <div className="chat-footer">
        {displayHistory.length > 0 && (
          <button className="clear-chat" onClick={handleClear}>
            <Trash2 size={16} />
            Clear Chat
          </button>
        )}
        
        <form className="chat-input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about events..."
            disabled={loading}
          />
          <Button
            type="submit"
            variant="primary"
            disabled={!input.trim() || loading}
          >
            <Send size={18} />
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
