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
