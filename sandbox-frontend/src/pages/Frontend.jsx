import { Link } from 'react-router-dom';
import './PlaceholderPage.css';

export default function Frontend() {
  return (
    <div className="placeholder-page">
      <div className="placeholder-content">
        <h1>API Testing Console</h1>
        <p className="placeholder-description">
          This page will contain the full API testing interface with support for:
        </p>
        <ul className="placeholder-list">
          <li>Gallagher Command Centre API endpoints</li>
          <li>Milestone XProtect VMS integration</li>
          <li>Axis VAPIX camera controls</li>
          <li>ONVIF device management</li>
          <li>Real-time event monitoring</li>
        </ul>
        <p className="placeholder-phase">Coming in Phase 2</p>
        <Link to="/" className="placeholder-link">← Back to Home</Link>
      </div>
    </div>
  );
}
