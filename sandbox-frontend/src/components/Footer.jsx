import './Footer.css';

export default function Footer() {
  const apiLinks = [
    { name: 'Gallagher', url: 'https://security.gallagher.com/en-NZ/Products/Command-Centre/API' },
    { name: 'Milestone', url: 'https://www.milestonesys.com/solutions/developer-network/' },
    { name: 'Axis', url: 'https://www.axis.com/vapix' },
    { name: 'ONVIF', url: 'https://www.onvif.org/' }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Physical Security Sandbox</h4>
          <p className="footer-version">Version 1.0.0</p>
          <p className="footer-disclaimer">Training Simulation Environment</p>
        </div>

        <div className="footer-section">
          <h4>API Documentation</h4>
          <ul className="footer-links">
            {apiLinks.map(link => (
              <li key={link.name}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h4>Important Notice</h4>
          <p className="footer-notice">
            This is a training simulation platform. All systems, data, and events 
            are synthetic and for educational purposes only. Not connected to real 
            physical security systems.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 Physical Security Sandbox. All rights reserved.</p>
      </div>
    </footer>
  );
}
