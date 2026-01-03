import { useState } from 'react';
import { FileText, AlertTriangle, AlertCircle, Upload } from 'lucide-react';
import Button from '../Button.jsx';
import './LogAnalyzer.css';

export default function LogAnalyzer({ onAnalyze }) {
  const [logs, setLogs] = useState('');
  const [logFormat, setLogFormat] = useState('generic');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  
  const logFormats = ['Generic', 'Gallagher', 'Milestone'];
  
  const exampleLog = `2026-01-03 14:23:15 [INFO] Access granted - Door: Main Entrance - Card: 1000011111
2026-01-03 14:25:42 [WARNING] Multiple failed attempts detected - Door: Server Room
2026-01-03 14:26:03 [ERROR] Door fault detected - Door: Server Room - Reason: Held open
2026-01-03 14:30:18 [INFO] Access denied - Door: Executive Office - Card: 1000033333 - Reason: Invalid timezone
2026-01-03 14:35:27 [CRITICAL] Tamper alarm triggered - Door: Data Center
2026-01-03 14:36:05 [INFO] Security personnel dispatched
2026-01-03 14:40:12 [INFO] Alarm cleared - Door: Data Center
2026-01-03 14:45:33 [ERROR] Reader offline - Door: Warehouse Entry
2026-01-03 14:50:45 [INFO] Reader online - Door: Warehouse Entry`;
  
  const handleAnalyze = async () => {
    if (!logs.trim()) return;
    
    setLoading(true);
    try {
      if (onAnalyze) {
        const result = await onAnalyze(logs, logFormat.toLowerCase());
        setAnalysis(result);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleLoadExample = () => {
    setLogs(exampleLog);
  };
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogs(event.target.result);
      };
      reader.readAsText(file);
    }
  };
  
  const getSeverityIcon = (severity) => {
    if (severity === 'High' || severity === 'Critical') {
      return <AlertTriangle size={16} className="severity-icon high" />;
    }
    return <AlertCircle size={16} className="severity-icon medium" />;
  };
  
  return (
    <div className="log-analyzer">
      <div className="analyzer-header">
        <FileText size={24} />
        <h3>System Log Analyzer</h3>
      </div>
      
      <div className="analyzer-content">
        <div className="input-section">
          <div className="control-row">
            <div className="control-group">
              <label htmlFor="log-format">Log Format</label>
              <select
                id="log-format"
                value={logFormat}
                onChange={(e) => setLogFormat(e.target.value)}
                disabled={loading}
              >
                {logFormats.map(format => (
                  <option key={format} value={format}>{format}</option>
                ))}
              </select>
            </div>
            
            <div className="button-group">
              <Button onClick={handleLoadExample} variant="secondary" size="sm">
                Load Example
              </Button>
              <label className="upload-button">
                <Upload size={16} />
                Upload File
                <input
                  type="file"
                  accept=".txt,.log"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>
          
          <div className="textarea-group">
            <label htmlFor="logs">System Logs</label>
            <textarea
              id="logs"
              value={logs}
              onChange={(e) => setLogs(e.target.value)}
              placeholder="Paste system logs here or upload a log file..."
              rows={15}
              disabled={loading}
            />
          </div>
          
          <Button
            onClick={handleAnalyze}
            disabled={!logs.trim() || loading}
            variant="primary"
          >
            {loading ? 'Analyzing...' : 'Analyze Logs'}
          </Button>
        </div>
        
        {analysis && (
          <div className="analysis-section">
            <div className="analysis-summary">
              <h4>Analysis Summary</h4>
              <p>{analysis.summary}</p>
            </div>
            
            {analysis.securityConcerns.length > 0 && (
              <div className="analysis-block security-concerns">
                <h4>
                  <AlertTriangle size={20} />
                  Security Concerns ({analysis.securityConcerns.length})
                </h4>
                <div className="concerns-list">
                  {analysis.securityConcerns.map((concern, index) => (
                    <div key={index} className="concern-item">
                      {getSeverityIcon(concern.severity)}
                      <div className="concern-content">
                        <div className="concern-type">{concern.type}</div>
                        <div className="concern-text">Line {concern.line}: {concern.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {analysis.systemFaults.length > 0 && (
              <div className="analysis-block system-faults">
                <h4>
                  <AlertCircle size={20} />
                  System Faults ({analysis.systemFaults.length})
                </h4>
                <div className="faults-list">
                  {analysis.systemFaults.map((fault, index) => (
                    <div key={index} className="fault-item">
                      {getSeverityIcon(fault.severity)}
                      <div className="fault-content">
                        <div className="fault-text">Line {fault.line}: {fault.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {analysis.anomalies.length > 0 && (
              <div className="analysis-block anomalies">
                <h4>Anomalies Detected ({analysis.anomalies.length})</h4>
                <div className="anomalies-list">
                  {analysis.anomalies.map((anomaly, index) => (
                    <div key={index} className="anomaly-item">
                      <div className="anomaly-type">{anomaly.type}</div>
                      <div className="anomaly-text">Line {anomaly.line}: {anomaly.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {analysis.performanceIssues.length > 0 && (
              <div className="analysis-block performance-issues">
                <h4>Performance Issues ({analysis.performanceIssues.length})</h4>
                <div className="issues-list">
                  {analysis.performanceIssues.map((issue, index) => (
                    <div key={index} className="issue-item">
                      <div className="issue-text">Line {issue.line}: {issue.text}</div>
                      <div className="issue-impact">{issue.impact}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {analysis.recommendations.length > 0 && (
              <div className="analysis-block recommendations">
                <h4>Recommendations</h4>
                <div className="recommendations-list">
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className="recommendation-item">
                      <div className="rec-priority priority-{rec.priority.toLowerCase()}">
                        {rec.priority}
                      </div>
                      <div className="rec-content">
                        <div className="rec-action">{rec.action}</div>
                        <div className="rec-description">{rec.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="analysis-footer">
              <Button onClick={() => setAnalysis(null)} variant="secondary">
                New Analysis
              </Button>
              <div className="analyzed-at">
                Analyzed: {new Date(analysis.analyzedAt).toLocaleString()}
              </div>
            </div>
          </div>
        )}
        
        {!analysis && !loading && (
          <div className="analysis-placeholder">
            <FileText size={48} />
            <p>Paste system logs or upload a log file, then click "Analyze Logs" to identify security issues and anomalies.</p>
          </div>
        )}
      </div>
    </div>
  );
}
