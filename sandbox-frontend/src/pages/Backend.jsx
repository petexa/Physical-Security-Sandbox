import { Link } from 'react-router-dom';
import './PlaceholderPage.css';

export default function Backend() {
  return (
    <div className="placeholder-page">
      <div className="placeholder-content">
        <h1>PACS Backend Browser</h1>
        <p className="placeholder-description">
          This page will allow you to browse and explore the simulated PACS backend data:
        </p>
        <ul className="placeholder-list">
          <li>Access control zones and doors</li>
          <li>User credentials and permissions</li>
          <li>Card reader configurations</li>
          <li>Event history and logs</li>
          <li>System health and diagnostics</li>
        </ul>
        <p className="placeholder-phase">Coming in Phase 2</p>
        <Link to="/" className="placeholder-link">← Back to Home</Link>
      </div>
    </div>
  );
}
