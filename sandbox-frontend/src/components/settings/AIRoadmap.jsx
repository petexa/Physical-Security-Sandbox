import { useState } from 'react';
import { CheckCircle2, Circle, AlertCircle, TrendingUp, Shield, Zap } from 'lucide-react';
import './AIRoadmap.css';

export default function AIRoadmap() {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedFeature, setExpandedFeature] = useState(null);

  const features = [
    {
      category: 'Threat Detection & Prevention',
      icon: Shield,
      items: [
        {
          id: 'geo-impossible',
          title: 'Geographic Impossibility Detection',
          description: 'Detect credential theft by identifying impossible travel patterns. If a card is used in London, then New York 3 minutes later, immediately disable the card and send security alerts.',
          status: 'proposed',
          priority: 'critical',
          examples: ['Card used in London at 2:00 PM', 'Same card in New York at 2:03 PM → DISABLED + ALERTS'],
          implementation: {
            database: 'Store access events with timestamp, location (lat/lon), and cardholder ID. Query event history to check last access location.',
            api: 'Create endpoint to disable cardholder credentials: PATCH /api/cardholders/{id}/disable. Trigger via AI detection logic.',
            ai: 'Calculate haversine distance between locations and required travel time. Flag if impossible to travel between locations in elapsed time.',
            servicenow: 'Create CRITICAL incident with credential theft details. Auto-assign to security team. Link to cardholder record for investigation.'
          }
        },
        {
          id: 'anomaly-detection',
          title: 'Anomaly Detection & Threat Scoring',
          description: 'Identify unusual access patterns and flag potential credential theft or unauthorized use based on behavioral analysis.',
          status: 'proposed',
          priority: 'high',
          examples: ['User accessing wrong area at wrong time', 'Unusual location sequence', 'Rapid location changes'],
          implementation: {
            database: 'Query cardholder access history (last 30/60/90 days). Store baseline patterns: typical times, locations, access sequences.',
            api: 'Endpoint to query cardholder historical access: GET /api/cardholders/{id}/access-history. Flag anomalies via API response.',
            ai: 'ML model trained on baseline behavior. Score new events against baseline. Flag standard deviation > 2σ. Time-series analysis for patterns.',
            servicenow: 'Create HIGH incident when anomaly score exceeds threshold. Include baseline vs anomaly comparison. Add to audit trail.'
          }
        },
        {
          id: 'credential-fraud',
          title: 'Credential Fraud Detection',
          description: 'Automatically detect stolen/misused credentials using geographic, temporal, and behavioral analysis.',
          status: 'proposed',
          priority: 'high',
          examples: ['Card cloning detection', 'Credential sharing detection', 'Unauthorized delegation'],
          implementation: {
            database: 'Track multi-location simultaneous access attempts. Store credential issue/revocation history. Log all modifications.',
            api: 'Create POST /api/cardholders/{id}/revoke to immediately revoke credentials. Query endpoint for fraud analysis: GET /api/fraud-analysis/{id}.',
            ai: 'Detect simultaneous access at multiple locations. Identify cloned cards (multiple users, same pattern). Statistical analysis of access velocity.',
            servicenow: 'Create URGENT incident with fraud evidence. Auto-suspend cardholder access pending investigation. Create change ticket to revoke credentials.'
          }
        },
        {
          id: 'policy-violation',
          title: 'Policy Violation Detection',
          description: 'Automatically identify when access violates defined policies and segregation of duties.',
          status: 'proposed',
          priority: 'high',
          examples: ['Supervisor not present during restricted access', 'Account manager accessing finance systems'],
          implementation: {
            database: 'Store access policies, segregation of duties rules, and required approvals. Query cardholder roles and clearance levels.',
            api: 'Create GET /api/policies/{cardholder-id} to check policy violations. POST /api/violations to log detected violations.',
            ai: 'Parse policy rules as constraints. Cross-reference cardholder roles and access groups against policies. Flag violations in real-time.',
            servicenow: 'Create HIGH/CRITICAL incident based on policy severity. Auto-assign to compliance officer. Link to access event evidence.'
          }
        }
      ]
    },
    {
      category: 'Risk Analysis & Scoring',
      icon: TrendingUp,
      items: [
        {
          id: 'cardholder-risk',
          title: 'Cardholder Risk Scoring',
          description: 'Automatic risk assessment based on access patterns, violations, and behavioral indicators.',
          status: 'proposed',
          priority: 'high',
          examples: ['Access denial frequency analysis', 'Badge cloning indicators', 'Behavior deviation tracking'],
          implementation: {
            database: 'Store access denials, violations, and behavioral metrics per cardholder. Calculate rolling score (7/30/90 day windows).',
            api: 'Create GET /api/cardholders/{id}/risk-score endpoint. Return score breakdown: behavioral, violations, anomalies, fraud indicators.',
            ai: 'ML model combining multiple signals: violation frequency, anomaly score, denial patterns, temporal behavior. Output 0-100 risk score.',
            servicenow: 'Display risk score in cardholder asset. Auto-create change request if score exceeds threshold. Review access group assignments.'
          }
        },
        {
          id: 'access-optimization',
          title: 'Access Group Optimization',
          description: 'Analyze actual access patterns and suggest improvements to access group assignments.',
          status: 'proposed',
          priority: 'medium',
          examples: ['Identify redundant group assignments', 'Suggest least-privilege adjustments'],
          implementation: {
            database: 'Query access group assignments and actual access history. Compare assigned vs actual accessed areas for each user.',
            api: 'Create GET /api/access-groups/{id}/optimization to analyze efficiency. Return suggestions for consolidation or splitting.',
            ai: 'Analyze access patterns to identify: over-privileged users (assigned but never use), under-privileged (denied but need), redundant groups.',
            servicenow: 'Create RFC for suggested changes. Include impact analysis (affected users, areas). Add approval workflow for security review.'
          }
        },
        {
          id: 'incident-classification',
          title: 'Incident Auto-Classification & Prioritization',
          description: 'Automatically categorize and prioritize security incidents based on severity and impact.',
          status: 'proposed',
          priority: 'medium',
          examples: ['Unauthorized access after hours', 'High-risk area violations', 'Repeated access denials'],
          implementation: {
            database: 'Store event metadata: cardholder clearance, area sensitivity, time context, event frequency. Build incident classification rules.',
            api: 'Create POST /api/incidents/auto-classify endpoint. Analyze event and return priority (CRITICAL/HIGH/MEDIUM/LOW) with reasoning.',
            ai: 'NLP/rules engine to classify incident type. ML to prioritize based on: access level, area sensitivity, user history, frequency patterns.',
            servicenow: 'Auto-create incident with classified priority. Auto-assign based on severity (CRITICAL → VP, HIGH → Manager, etc.). Set SLA timers.'
          }
        }
      ]
    },
    {
      category: 'Pattern & Compliance',
      icon: Zap,
      items: [
        {
          id: 'trend-analysis',
          title: 'Trend & Pattern Analysis',
          description: 'Multi-dimensional trend detection across time, location, user, and event types.',
          status: 'proposed',
          priority: 'medium',
          examples: ['Time-based patterns (Friday spikes)', 'Location-based analysis', 'Department-wide trends'],
          implementation: {
            database: 'Store aggregated metrics by time bucket, location, user group, event type. Calculate rolling averages and deviations.',
            api: 'Create GET /api/trends/{dimension}?period=30d endpoint. Return trend data: baseline, current, delta, anomalies.',
            ai: 'Time-series analysis (ARIMA, Prophet) to detect seasonality, trends, anomalies. Correlation analysis between dimensions.',
            servicenow: 'Create operational dashboard with trend visualizations. Create change advisory notifications for significant deviations.'
          }
        },
        {
          id: 'compliance-reporting',
          title: 'Automated Compliance Reporting',
          description: 'Generate compliance reports for SOC2, ISO 27001, and other regulatory requirements.',
          status: 'proposed',
          priority: 'medium',
          examples: ['Access audit trails', 'Violation reports', 'Security metrics'],
          implementation: {
            database: 'Query event logs with audit trail (who, what, when, where, why). Store compliance rules and mapping (SOC2 controls → access events).',
            api: 'Create GET /api/compliance/reports/{standard}?period=Q1 endpoint. Return audit-ready report with evidence.',
            ai: 'Map access events to compliance controls. Aggregate evidence for audit requirements. Generate executive summary.',
            servicenow: 'Create compliance module linking changes to audit requirements. Auto-generate evidence for auditors. Track remediation status.'
          }
        },
        {
          id: 'crowding-detection',
          title: 'Crowding & Congestion Detection',
          description: 'Identify unusual concentrations of people and potential tailgating scenarios.',
          status: 'proposed',
          priority: 'low',
          examples: ['Fire evacuation detection', 'Tailgating identification', 'Unusual group access'],
          implementation: {
            database: 'Store access event timestamps per door. Calculate access rate (people/minute per door). Track group access patterns.',
            api: 'Create GET /api/doors/{id}/crowding endpoint. Return real-time access rate, baseline, anomaly flags.',
            ai: 'Detect rate spikes (> 2σ from baseline = unusual). Identify tailgating (sequential same-direction accesses without physical separation). Fire evacuation signatures.',
            servicenow: 'Create operational alert for unusual crowding. Auto-escalate tailgating to security team. Incident for evacuation detection.'
          }
        }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'implemented': return 'status-implemented';
      case 'in-progress': return 'status-in-progress';
      case 'proposed': return 'status-proposed';
      default: return 'status-proposed';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'critical': return 'priority-critical';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'implemented': return <CheckCircle2 size={16} />;
      case 'in-progress': return <AlertCircle size={16} />;
      case 'proposed': return <Circle size={16} />;
      default: return <Circle size={16} />;
    }
  };

  return (
    <div className="ai-roadmap">
      <div className="roadmap-intro">
        <h2>AI-Powered Security Features Roadmap</h2>
        <p>Upcoming AI capabilities to enhance access control and threat detection</p>
      </div>

      <div className="roadmap-legend">
        <div className="legend-item">
          <span className={`status-badge ${getStatusColor('implemented')}`}>
            {getStatusIcon('implemented')}
            Implemented
          </span>
        </div>
        <div className="legend-item">
          <span className={`status-badge ${getStatusColor('in-progress')}`}>
            {getStatusIcon('in-progress')}
            In Progress
          </span>
        </div>
        <div className="legend-item">
          <span className={`status-badge ${getStatusColor('proposed')}`}>
            {getStatusIcon('proposed')}
            Proposed
          </span>
        </div>
      </div>

      <div className="roadmap-categories">
        {features.map((category) => {
          const Icon = category.icon;
          const isExpanded = expandedCategory === category.category;
          
          return (
            <div key={category.category} className="category-section">
              <button
                className="category-header"
                onClick={() => setExpandedCategory(isExpanded ? null : category.category)}
              >
                <Icon size={20} />
                <h3>{category.category}</h3>
                <span className="category-count">{category.items.length} features</span>
                <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
              </button>

              {isExpanded && (
                <div className="category-items">
                  {category.items.map((item) => (
                    <div key={item.id} className="feature-item">
                      <div className="feature-header">
                        <h4>{item.title}</h4>
                        <div className="feature-badges">
                          <span className={`status-badge ${getStatusColor(item.status)}`}>
                            {getStatusIcon(item.status)}
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                          <span className={`priority-badge ${getPriorityColor(item.priority)}`}>
                            {item.priority.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      <p className="feature-description">{item.description}</p>
                      
                      {item.examples && item.examples.length > 0 && (
                        <div className="feature-examples">
                          <strong>Examples:</strong>
                          <ul>
                            {item.examples.map((example, idx) => (
                              <li key={idx}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {item.implementation && (
                        <div className="feature-implementation">
                          <button 
                            className={`implementation-toggle ${expandedFeature === item.id ? 'expanded' : ''}`}
                            onClick={() => setExpandedFeature(expandedFeature === item.id ? null : item.id)}
                          >
                            <span className="toggle-icon">▶</span>
                            Implementation Details
                          </button>
                          
                          {expandedFeature === item.id && (
                            <div className="implementation-details">
                              <div className="impl-section">
                                <h5>🗄️ Database</h5>
                                <p>{item.implementation.database}</p>
                              </div>
                              <div className="impl-section">
                                <h5>🔌 API</h5>
                                <p>{item.implementation.api}</p>
                              </div>
                              <div className="impl-section">
                                <h5>🤖 AI/ML</h5>
                                <p>{item.implementation.ai}</p>
                              </div>
                              <div className="impl-section">
                                <h5>🎫 ServiceNow</h5>
                                <p>{item.implementation.servicenow}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="roadmap-info">
        <h3>Feature Request</h3>
        <p>Have a feature idea? The above roadmap can be customized based on your security requirements and use cases.</p>
      </div>
    </div>
  );
}
