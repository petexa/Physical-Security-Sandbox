import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import Button from '../Button';
import './TryItSection.css';

export default function TryItSection({ endpoint, method, description, prefillData = {} }) {
  const navigate = useNavigate();

  const handleTryIt = () => {
    // Store the prefill data in sessionStorage
    const tryItData = {
      endpoint,
      method,
      body: prefillData.body || '',
      headers: prefillData.headers || {}
    };
    
    sessionStorage.setItem('apiTesterPrefill', JSON.stringify(tryItData));
    
    // Navigate to Frontend page (API Tester)
    navigate('/frontend');
  };

  return (
    <div className="try-it-section">
      <div className="try-it-header">
        <Play className="try-it-icon" size={20} />
        <h4 className="try-it-title">Try It Yourself</h4>
      </div>
      <p className="try-it-description">{description}</p>
      <div className="try-it-details">
        <span className="try-it-method">{method}</span>
        <span className="try-it-endpoint">{endpoint}</span>
      </div>
      <Button variant="primary" onClick={handleTryIt}>
        Launch API Tester
      </Button>
    </div>
  );
}
