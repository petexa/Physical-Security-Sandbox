import { ExternalLink, Shield } from 'lucide-react';
import './AboutPanel.css';

export default function AboutPanel() {
  const apiDocs = [
    {
      name: 'Gallagher Command Centre REST API',
      url: 'https://gallaghersecurity.github.io/cc-rest-docs/',
      description: 'Complete API documentation for Gallagher PACS'
    },
    {
      name: 'Milestone XProtect API',
      url: 'https://doc.developer.milestonesys.com/',
      description: 'Video management system API reference'
    },
    {
      name: 'Axis VAPIX',
      url: 'https://www.axis.com/vapix-library/',
      description: 'Axis camera API and developer resources'
    },
    {
      name: 'ONVIF Specifications',
      url: 'https://www.onvif.org/profiles/',
      description: 'Open standard for IP-based physical security products'
    }
  ];

  return (
    <div className="about-panel">
      <div className="about-header">
        <Shield size={64} className="about-icon" />
        <h2>Physical Security Sandbox</h2>
        <p className="version">Version 1.0.0</p>
        <p className="release-date">Released: January 2025</p>
      </div>

      <div className="about-section">
        <h3>About This Platform</h3>
        <p>
          A professional training platform designed for learning physical access control system (PACS) 
          and video management system (VMS) API integration. This sandbox provides realistic data and 
          scenarios to practice API development skills without requiring access to production systems.
        </p>
      </div>

      <div className="about-section">
        <h3>Supported APIs</h3>
        <ul className="api-list">
          <li>Gallagher Command Centre REST API</li>
          <li>Milestone XProtect</li>
          <li>Axis VAPIX</li>
          <li>ONVIF</li>
        </ul>
      </div>

      <div className="about-section">
        <h3>Documentation</h3>
        <div className="doc-links">
          {apiDocs.map((doc, index) => (
            <a 
              key={index} 
              href={doc.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="doc-link"
            >
              <div className="doc-link-content">
                <div className="doc-link-header">
                  <span className="doc-link-name">{doc.name}</span>
                  <ExternalLink size={16} />
                </div>
                <p className="doc-link-description">{doc.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="about-section">
        <h3>Features</h3>
        <ul className="feature-list">
          <li>✓ Realistic PACS data with 87 cardholders, 34 doors, and 8 controllers</li>
          <li>✓ 25,000+ simulated events across 6 months</li>
          <li>✓ Interactive data exploration and filtering</li>
          <li>✓ AI-powered tools for event analysis and reporting</li>
          <li>✓ Training modules for API integration</li>
          <li>✓ Lab environment for hands-on practice</li>
          <li>✓ Dark mode support</li>
        </ul>
      </div>

      <div className="about-section">
        <h3>License & Usage</h3>
        <p className="license-text">
          <strong>License:</strong> MIT
        </p>
        <p className="disclaimer">
          This platform is created for training and educational purposes only. 
          It is not intended for production security operations. The data and 
          scenarios are simulated and should not be used in real-world security systems.
        </p>
      </div>

      <div className="about-section">
        <div className="action-buttons">
          <a 
            href="https://github.com/petexa/Physical-Security-Sandbox/blob/main/CHANGELOG.md" 
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            View Changelog
          </a>
          <a 
            href="https://github.com/petexa/Physical-Security-Sandbox/issues" 
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            Report Issue
          </a>
        </div>
      </div>

      <div className="about-footer">
        <p>Built with React • Vite • Lucide Icons</p>
        <p>© 2025 Physical Security Sandbox</p>
      </div>
    </div>
  );
}
