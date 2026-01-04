import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Frontend from './pages/Frontend';
import BackendVendor from './pages/BackendVendor';
import BackendDashboard from './pages/BackendDashboard';
import ApiDocs from './pages/ApiDocs';
import Training from './pages/Training';
import Labs from './pages/Labs';
import AI from './pages/AI';
import Settings from './pages/Settings';
import AuditLog from './pages/AuditLog';
import WorkflowsPage from './pages/WorkflowsPage';
import { initTheme } from './utils/theme';
import { initAPILogger } from './utils/apiLogger';

function App() {
  const [showHttpsWarning, setShowHttpsWarning] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  
  useEffect(() => {
    initTheme();
    initAPILogger();

    // Show warning for HTTP on production domains (not localhost)
    if (
      window.location.protocol !== 'https:' && 
      window.location.hostname !== 'localhost' && 
      window.location.hostname !== '127.0.0.1'
    ) {
      setShowHttpsWarning(true);
    }
  }, []);

  // Offline detection - check API health every 30 seconds
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        
        await fetch('/api/health', { 
          signal: controller.signal,
          headers: { 'X-API-Key': 'sandbox-gallagher-key-12345' }
        });
        
        clearTimeout(timeout);
        setIsOffline(false);
      } catch (error) {
        console.warn('[Offline] API unreachable:', error.message);
        setIsOffline(true);
      }
    };
    
    // Check immediately on mount
    checkConnection();
    
    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      {showHttpsWarning && (
        <div className="https-warning">
          <span>
            ⚠️ You are using an insecure connection. Please use HTTPS: 
            <a href={`https://${window.location.host}${window.location.pathname}`}>
              Switch to HTTPS
            </a>
          </span>
          <button 
            onClick={() => setShowHttpsWarning(false)}
            className="https-warning-close"
          >
            ✕
          </button>
        </div>
      )}
      {isOffline && (
        <div className="offline-banner">
          <span>
            ⚠️ Backend API offline. Using cached data. Retrying every 30 seconds...
          </span>
          <button 
            onClick={() => setIsOffline(false)}
            className="offline-banner-close"
          >
            ✕
          </button>
        </div>
      )}
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/frontend" element={<Frontend />} />
          <Route path="/backend" element={<BackendDashboard />} />
          <Route path="/backend/gallagher" element={<BackendVendor />} />
          <Route path="/backend/milestone" element={<BackendVendor />} />
          <Route path="/docs" element={<ApiDocs />} />
          <Route path="/workflows" element={<WorkflowsPage />} />
          <Route path="/training" element={<Training />} />
          <Route path="/training/:moduleId" element={<Training />} />
          <Route path="/labs" element={<Labs />} />
          <Route path="/ai" element={<AI />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/audit" element={<AuditLog />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
