import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, Settings } from 'lucide-react';
import './NavBar.css';

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/frontend', label: 'Frontend' },
    { path: '/backend', label: 'Backend' },
    { path: '/training', label: 'Training' },
    { path: '/labs', label: 'Labs' },
    { path: '/ai', label: 'AI Tools' },
    { path: '/settings', label: 'Settings', icon: Settings }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Shield size={28} />
          <span>Physical Security Sandbox</span>
        </Link>

        <button 
          className="navbar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'navbar-menu-open' : ''}`}>
          {navLinks.map(link => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`navbar-link ${isActive(link.path) ? 'navbar-link-active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {Icon && <Icon size={18} />}
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
