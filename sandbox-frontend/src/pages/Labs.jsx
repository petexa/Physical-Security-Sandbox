import { Link } from 'react-router-dom';
import './PlaceholderPage.css';

export default function Labs() {
  return (
    <div className="placeholder-page">
      <div className="placeholder-content">
        <h1>Hands-On Labs</h1>
        <p className="placeholder-description">
          Practical exercises to build real-world integration skills:
        </p>
        <ul className="placeholder-list">
          <li>Configure access control rules</li>
          <li>Process entry/exit events</li>
          <li>Build custom dashboards</li>
          <li>Create alarm workflows</li>
          <li>Implement visitor management</li>
        </ul>
        <p className="placeholder-phase">Coming in Phase 3</p>
        <Link to="/" className="placeholder-link">← Back to Home</Link>
      </div>
    </div>
  );
}
