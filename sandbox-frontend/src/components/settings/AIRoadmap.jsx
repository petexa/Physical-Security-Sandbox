import { useState } from 'react';
import { CheckCircle2, Circle, AlertCircle, TrendingUp, Shield, Zap } from 'lucide-react';
import './AIRoadmap.css';

export default function AIRoadmap() {
  const [expandedCategory, setExpandedCategory] = useState(null);

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
          examples: ['Card used in London at 2:00 PM', 'Same card in New York at 2:03 PM → DISABLED + ALERTS']
        },
        {
          id: 'anomaly-detection',
          title: 'Anomaly Detection & Threat Scoring',
          description: 'Identify unusual access patterns and flag potential credential theft or unauthorized use based on behavioral analysis.',
          status: 'proposed',
          priority: 'high',
          examples: ['User accessing wrong area at wrong time', 'Unusual location sequence', 'Rapid location changes']
        },
        {
          id: 'credential-fraud',
          title: 'Credential Fraud Detection',
          description: 'Automatically detect stolen/misused credentials using geographic, temporal, and behavioral analysis.',
          status: 'proposed',
          priority: 'high',
          examples: ['Card cloning detection', 'Credential sharing detection', 'Unauthorized delegation']
        },
        {
          id: 'policy-violation',
          title: 'Policy Violation Detection',
          description: 'Automatically identify when access violates defined policies and segregation of duties.',
          status: 'proposed',
          priority: 'high',
          examples: ['Supervisor not present during restricted access', 'Account manager accessing finance systems']
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
          examples: ['Access denial frequency analysis', 'Badge cloning indicators', 'Behavior deviation tracking']
        },
        {
          id: 'access-optimization',
          title: 'Access Group Optimization',
          description: 'Analyze actual access patterns and suggest improvements to access group assignments.',
          status: 'proposed',
          priority: 'medium',
          examples: ['Identify redundant group assignments', 'Suggest least-privilege adjustments']
        },
        {
          id: 'incident-classification',
          title: 'Incident Auto-Classification & Prioritization',
          description: 'Automatically categorize and prioritize security incidents based on severity and impact.',
          status: 'proposed',
          priority: 'medium',
          examples: ['Unauthorized access after hours', 'High-risk area violations', 'Repeated access denials']
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
          examples: ['Time-based patterns (Friday spikes)', 'Location-based analysis', 'Department-wide trends']
        },
        {
          id: 'compliance-reporting',
          title: 'Automated Compliance Reporting',
          description: 'Generate compliance reports for SOC2, ISO 27001, and other regulatory requirements.',
          status: 'proposed',
          priority: 'medium',
          examples: ['Access audit trails', 'Violation reports', 'Security metrics']
        },
        {
          id: 'crowding-detection',
          title: 'Crowding & Congestion Detection',
          description: 'Identify unusual concentrations of people and potential tailgating scenarios.',
          status: 'proposed',
          priority: 'low',
          examples: ['Fire evacuation detection', 'Tailgating identification', 'Unusual group access']
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
