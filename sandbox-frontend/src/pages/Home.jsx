import { useNavigate } from 'react-router-dom';
import { 
  Terminal, 
  Database, 
  GraduationCap, 
  FlaskConical, 
  Sparkles, 
  Activity,
  CheckCircle,
  Shield,
  Video,
  Monitor,
  ArrowRight
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  const platformCards = [
    {
      icon: <Terminal size={32} />,
      title: 'API Testing Console',
      description: 'Test and explore Gallagher, Milestone, Axis, and ONVIF APIs in real-time',
      link: '/frontend'
    },
    {
      icon: <Database size={32} />,
      title: 'PACS Backend Browser',
      description: 'Browse simulated access control data, zones, users, and events',
      link: '/backend'
    },
    {
      icon: <GraduationCap size={32} />,
      title: 'Training Modules',
      description: 'Learn PACS and VMS integration from beginner to advanced',
      link: '/training'
    },
    {
      icon: <FlaskConical size={32} />,
      title: 'Hands-On Labs',
      description: 'Practice real-world scenarios in a safe, simulated environment',
      link: '/labs'
    },
    {
      icon: <Sparkles size={32} />,
      title: 'AI-Powered Tools',
      description: 'Leverage AI for intelligent event analysis and security operations',
      link: '/ai'
    },
    {
      icon: <Activity size={32} />,
      title: 'Event Analysis',
      description: 'Explore 6 months of realistic security event data and patterns',
      link: '/frontend'
    }
  ];

  const features = [
    { icon: <Shield size={20} />, text: 'Gallagher-style PACS simulation' },
    { icon: <Video size={20} />, text: 'Milestone XProtect VMS integration' },
    { icon: <Monitor size={20} />, text: 'Axis VAPIX and ONVIF support' },
    { icon: <Database size={20} />, text: '6 months of realistic event data' },
    { icon: <Sparkles size={20} />, text: 'AI-powered security operations' },
    { icon: <CheckCircle size={20} />, text: 'iPad-optimized interface' }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Learn, Test, and Master Physical Security API Integration
          </h1>
          <p className="hero-subtitle">
            A professional training platform for PACS and VMS integration
          </p>
          <div className="hero-buttons">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => navigate('/training')}
            >
              Start Learning
            </Button>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => navigate('/frontend')}
            >
              Explore APIs
            </Button>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Platform Overview</h2>
          <div className="platform-grid">
            {platformCards.map((card, index) => (
              <Card
                key={index}
                icon={card.icon}
                title={card.title}
                onClick={() => navigate(card.link)}
              >
                <p>{card.description}</p>
                <div className="card-link">
                  Explore <ArrowRight size={16} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-item">
                <div className="feature-icon">{feature.icon}</div>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Quick Start Guide</h2>
          <div className="quick-start-grid">
            <div className="quick-start-step">
              <div className="step-number">1</div>
              <h3>Learn the Basics</h3>
              <p>Start with Training modules to understand PACS and VMS fundamentals</p>
              <Button variant="ghost" onClick={() => navigate('/training')}>
                Go to Training
              </Button>
            </div>
            <div className="quick-start-step">
              <div className="step-number">2</div>
              <h3>Test APIs</h3>
              <p>Use the Frontend console to experiment with API calls and responses</p>
              <Button variant="ghost" onClick={() => navigate('/frontend')}>
                Open Console
              </Button>
            </div>
            <div className="quick-start-step">
              <div className="step-number">3</div>
              <h3>Practice</h3>
              <p>Complete hands-on Labs to build real-world integration skills</p>
              <Button variant="ghost" onClick={() => navigate('/labs')}>
                Start Labs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="section">
        <div className="container">
          <div className="disclaimer">
            <h3>
              <Shield size={24} />
              Training Simulation Environment
            </h3>
            <p>
              This is a safe, simulated environment designed for training and education. 
              All systems, data, and events are synthetic and for educational purposes only. 
              This platform is not connected to real physical security systems.
            </p>
            <p className="disclaimer-note">
              Perfect for learning, testing, and demonstrating integration capabilities 
              without the risks associated with production systems.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
