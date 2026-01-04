import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  FileText, 
  ClipboardList, 
  Search, 
  BookOpen, 
  Activity 
} from 'lucide-react';
import ChatInterface from '../components/ai/ChatInterface';
import SummaryGenerator from '../components/ai/SummaryGenerator';
import IncidentReportGenerator from '../components/ai/IncidentReportGenerator';
import InvestigationBuilder from '../components/ai/InvestigationBuilder';
import ApiExplainer from '../components/ai/ApiExplainer';
import LogAnalyzer from '../components/ai/LogAnalyzer';
import { 
  processNaturalLanguageQuery,
  generateEventSummary,
  generateIncidentReport,
  buildInvestigation,
  explainApiResponse,
  analyzeSystemLogs
} from '../utils/mockAI';
import { getRecentEvents } from '../utils/eventQuery';
import { initializeData } from '../utils/initData';
import './AI.css';

export default function AI() {
  const [activeTab, setActiveTab] = useState('chat');
  const [events, setEvents] = useState([]);
  const [doors, setDoors] = useState([]);
  const [cardholders, setCardholders] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Initialize and load data
    const data = initializeData();
    
    // Load events from localStorage (use correct key with hyphen)
    const storedEvents = localStorage.getItem('pacs-events');
    if (storedEvents) {
      const allEvents = JSON.parse(storedEvents);
      setEvents(allEvents);
      console.log(`[AI] Loaded ${allEvents.length} events from localStorage`);
    } else {
      console.log('[AI] No events found in localStorage');
    }
    
    // Load other data
    const storedDoors = localStorage.getItem('pacs-doors');
    if (storedDoors) {
      const doorsData = JSON.parse(storedDoors);
      setDoors(doorsData);
      console.log(`[AI] Loaded ${doorsData.length} doors`);
    }
    
    const storedCardholders = localStorage.getItem('pacs-cardholders');
    if (storedCardholders) {
      const cardholdersData = JSON.parse(storedCardholders);
      setCardholders(cardholdersData);
      console.log(`[AI] Loaded ${cardholdersData.length} cardholders`);
    }
    
    const storedCameras = localStorage.getItem('pacs-cameras');
    if (storedCameras) {
      const camerasData = JSON.parse(storedCameras);
      setCameras(camerasData);
      console.log(`[AI] Loaded ${camerasData.length} cameras`);
    }
  }, []);
  
  const tabs = [
    { id: 'chat', label: 'Natural Language Queries', icon: MessageSquare },
    { id: 'summary', label: 'Event Summarization', icon: FileText },
    { id: 'incident', label: 'Incident Reports', icon: ClipboardList },
    { id: 'investigation', label: 'Investigation Builder', icon: Search },
    { id: 'api', label: 'API Explainer', icon: BookOpen },
    { id: 'logs', label: 'Log Analysis', icon: Activity }
  ];
  
  // Handler for natural language queries
  const handleQuery = async (query) => {
    setLoading(true);
    try {
      const result = await processNaturalLanguageQuery(query, events, doors, cardholders);
      return result;
    } finally {
      setLoading(false);
    }
  };
  
  // Handler for event summary generation
  const handleGenerateSummary = async (dateRange, eventTypeFilter) => {
    setLoading(true);
    try {
      // Filter events based on date range
      let filteredEvents = [...events];
      
      if (dateRange === 'last7days') {
        filteredEvents = getRecentEvents(filteredEvents, 7, 'days');
      } else if (dateRange === 'last30days') {
        filteredEvents = getRecentEvents(filteredEvents, 30, 'days');
      } else if (dateRange === 'last90days') {
        filteredEvents = getRecentEvents(filteredEvents, 90, 'days');
      } else if (dateRange === 'last6months') {
        filteredEvents = getRecentEvents(filteredEvents, 6, 'months');
      }
      
      // Filter by event type
      if (eventTypeFilter !== 'all') {
        filteredEvents = filteredEvents.filter(e => e.category === eventTypeFilter);
      }
      
      const dateRangeText = dateRange.replace(/last/, 'Last ').replace(/days/, ' Days').replace(/months/, ' Months');
      const result = await generateEventSummary(filteredEvents, dateRangeText);
      return result;
    } finally {
      setLoading(false);
    }
  };
  
  // Handler for incident report generation
  const handleGenerateIncidentReport = async (selectedEvents, context) => {
    setLoading(true);
    try {
      const result = await generateIncidentReport(selectedEvents, context);
      return result;
    } finally {
      setLoading(false);
    }
  };
  
  // Handler for investigation building
  const handleBuildInvestigation = async (initialEvent, allEvents) => {
    setLoading(true);
    try {
      const result = await buildInvestigation(initialEvent, [], allEvents || events);
      return result;
    } finally {
      setLoading(false);
    }
  };
  
  // Handler for API explanation
  const handleExplainApi = async (apiResponse, apiType) => {
    setLoading(true);
    try {
      const result = await explainApiResponse(apiResponse, apiType);
      return result;
    } finally {
      setLoading(false);
    }
  };
  
  // Handler for log analysis
  const handleAnalyzeLogs = async (logs, logFormat) => {
    setLoading(true);
    try {
      const result = await analyzeSystemLogs(logs, logFormat);
      return result;
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="ai-page">
      <div className="ai-header">
        <h1>AI-Powered Security Operations</h1>
        <p className="ai-subtitle">
          Leverage artificial intelligence to enhance security workflows, analyze events, and automate operations
        </p>
      </div>
      
      <div className="ai-tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`ai-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={20} />
              <span className="tab-label">{tab.label}</span>
            </button>
          );
        })}
      </div>
      
      <div className="ai-content">
        {activeTab === 'chat' && (
          <ChatInterface
            onQuery={handleQuery}
            events={events}
            doors={doors}
            cardholders={cardholders}
            cameras={cameras}
            loading={loading}
          />
        )}
        
        {activeTab === 'summary' && (
          <SummaryGenerator
            doors={doors}
            cardholders={cardholders}
            cameras={cameras}
            events={events}
            onGenerate={handleGenerateSummary}
          />
        )}
        
        {activeTab === 'incident' && (
          <IncidentReportGenerator
            events={events}
            doors={doors}
            cardholders={cardholders}
            cameras={cameras}
            onGenerate={handleGenerateIncidentReport}
          />
        )}
        
        {activeTab === 'investigation' && (
          <InvestigationBuilder
            events={events}
            doors={doors}
            cardholders={cardholders}
            cameras={cameras}
            onBuild={handleBuildInvestigation}
          />
        )}
        
        {activeTab === 'api' && (
          <ApiExplainer
            events={events}
            doors={doors}
            cardholders={cardholders}
            cameras={cameras}
            onExplain={handleExplainApi}
          />
        )}
        
        {activeTab === 'logs' && (
          <LogAnalyzer
            events={events}
            doors={doors}
            cardholders={cardholders}
            cameras={cameras}
            onAnalyze={handleAnalyzeLogs}
          />
        )}
      </div>
    </div>
  );
}
