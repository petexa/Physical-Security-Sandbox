import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Frontend from './pages/Frontend';
import Backend from './pages/Backend';
import Training from './pages/Training';
import Labs from './pages/Labs';
import AI from './pages/AI';
import Settings from './pages/Settings';
import AuditLog from './pages/AuditLog';
import WorkflowsPage from './pages/WorkflowsPage';
import { initTheme } from './utils/theme';
import { initAPILogger } from './utils/apiLogger';

function App() {
  useEffect(() => {
    initTheme();
    initAPILogger();
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/frontend" element={<Frontend />} />
          <Route path="/backend" element={<Backend />} />
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
