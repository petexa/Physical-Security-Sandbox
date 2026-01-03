import { Link } from 'react-router-dom';
import './PlaceholderPage.css';

export default function Training() {
  return (
    <div className="placeholder-page">
      <div className="placeholder-content">
        <h1>Training Modules</h1>
        <p className="placeholder-description">
          Comprehensive training modules covering physical security system integration:
        </p>
        <ul className="placeholder-list">
          <li>Introduction to PACS and VMS systems</li>
          <li>API authentication and security</li>
          <li>Event handling and webhooks</li>
          <li>Integration best practices</li>
          <li>Troubleshooting common issues</li>
        </ul>
        <p className="placeholder-phase">Coming in Phase 3</p>
        <Link to="/" className="placeholder-link">← Back to Home</Link>
      </div>
    </div>
  );
}
