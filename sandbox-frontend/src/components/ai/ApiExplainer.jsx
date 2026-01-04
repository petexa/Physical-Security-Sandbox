import { useState } from 'react';
import { Code, Copy, BookOpen } from 'lucide-react';
import Button from '../Button.jsx';
import PromptInspector from './PromptInspector.jsx';
import './ApiExplainer.css';

export default function ApiExplainer({ events = [], doors = [], cardholders = [], cameras = [], onExplain }) {
  const [apiResponse, setApiResponse] = useState('');
  const [apiType, setApiType] = useState('Gallagher');
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [showInspector, setShowInspector] = useState(false);
  const [lastApiResponse, setLastApiResponse] = useState('');
  const [lastApiType, setLastApiType] = useState('');
  
  const apiTypes = ['Gallagher', 'Milestone', 'Axis', 'ONVIF', 'Generic'];
  
  const exampleResponse = {
    href: "https://api.example.com/api/cardholders/12345",
    id: "12345",
    name: "John Doe",
    division: { href: "https://api.example.com/api/divisions/1" },
    updates: { href: "https://api.example.com/api/cardholders/12345/updates" }
  };
  
  const handleExplain = async () => {
    if (!apiResponse.trim()) return;
    
    setLoading(true);
    setLastApiResponse(apiResponse);
    setLastApiType(apiType);
    
    try {
      if (onExplain) {
        const result = await onExplain(apiResponse, apiType);
        setExplanation(result);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };
  
  const handleLoadExample = () => {
    setApiResponse(JSON.stringify(exampleResponse, null, 2));
  };
  
  return (
    <div className="api-explainer">
      <div className="explainer-header">
        <BookOpen size={24} />
        <h3>API Response Explainer</h3>
      </div>
      
      <div className="explainer-content">
        <div className="input-section">
          <div className="control-row">
            <div className="control-group">
              <label htmlFor="api-type">API Type</label>
              <select
                id="api-type"
                value={apiType}
                onChange={(e) => setApiType(e.target.value)}
                disabled={loading}
              >
                {apiTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <Button onClick={handleLoadExample} variant="secondary" size="sm">
              Load Example
            </Button>
          </div>
          
          <div className="textarea-group">
            <label htmlFor="api-response">API Response (JSON)</label>
            <textarea
              id="api-response"
              value={apiResponse}
              onChange={(e) => setApiResponse(e.target.value)}
              placeholder="Paste API response here..."
              rows={12}
              disabled={loading}
            />
          </div>
          
          <Button
            onClick={handleExplain}
            disabled={!apiResponse.trim() || loading}
            variant="primary"
          >
            {loading ? 'Analyzing...' : 'Explain This Response'}
          </Button>
        </div>
        
        {explanation && (
          <div className="explanation-section">
            <div className="explanation-block">
              <h4>Overview</h4>
              <p>{explanation.overview}</p>
            </div>
            
            {explanation.keyFields.length > 0 && (
              <div className="explanation-block">
                <h4>Key Fields Explained</h4>
                <div className="fields-list">
                  {explanation.keyFields.map((field, index) => (
                    <div key={index} className="field-item">
                      <div className="field-name">
                        <Code size={16} />
                        {field.field}
                      </div>
                      <div className="field-description">{field.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {explanation.commonUseCases.length > 0 && (
              <div className="explanation-block">
                <h4>Common Use Cases</h4>
                <ul className="use-cases-list">
                  {explanation.commonUseCases.map((useCase, index) => (
                    <li key={index}>{useCase}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {explanation.relatedEndpoints.length > 0 && (
              <div className="explanation-block">
                <h4>Related Endpoints</h4>
                <div className="endpoints-list">
                  {explanation.relatedEndpoints.map((endpoint, index) => (
                    <div key={index} className="endpoint-item">
                      <Code size={14} />
                      {endpoint}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {explanation.exampleCode && (
              <div className="explanation-block">
                <h4>Example Code</h4>
                <div className="code-block">
                  <button
                    className="copy-button"
                    onClick={() => handleCopy(explanation.exampleCode)}
                  >
                    <Copy size={14} />
                    Copy
                  </button>
                  <pre><code>{explanation.exampleCode}</code></pre>
                </div>
              </div>
            )}
            
            <div className="explanation-footer">
              <Button onClick={() => setShowInspector(true)} variant="secondary" size="sm">
                <Code size={16} />
                Inspect Prompt
              </Button>
            </div>
          </div>
        )}
        
        {!explanation && !loading && (
          <div className="explanation-placeholder">
            <BookOpen size={48} />
            <p>Paste an API response above and click "Explain This Response" to get a detailed explanation.</p>
          </div>
        )}
      </div>
      
      <PromptInspector
        promptType="apiResponseExplainer"
        events={events}
        doors={doors}
        cardholders={cardholders}
        cameras={cameras}
        apiResponse={lastApiResponse || apiResponse}
        apiType={lastApiType || apiType}
        isOpen={showInspector}
        onClose={() => setShowInspector(false)}
      />
    </div>
  );
}
