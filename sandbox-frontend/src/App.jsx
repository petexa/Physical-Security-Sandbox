import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Frontend from './pages/Frontend';
import Backend from './pages/Backend';
import Training from './pages/Training';
import Labs from './pages/Labs';
import AI from './pages/AI';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/frontend" element={<Frontend />} />
          <Route path="/backend" element={<Backend />} />
          <Route path="/training" element={<Training />} />
          <Route path="/labs" element={<Labs />} />
          <Route path="/ai" element={<AI />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
