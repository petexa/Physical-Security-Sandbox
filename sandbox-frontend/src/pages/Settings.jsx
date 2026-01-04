import { useState } from 'react';
import { Database, Palette, Server, Info, Sparkles } from 'lucide-react';
import DataManagement from '../components/settings/DataManagement';
import AppearanceSettings from '../components/settings/AppearanceSettings';
import SystemInfo from '../components/settings/SystemInfo';
import AboutPanel from '../components/settings/AboutPanel';
import AIRoadmap from '../components/settings/AIRoadmap';
import './Settings.css';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('data');

  const tabs = [
    { id: 'data', label: 'Data Management', icon: Database },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'system', label: 'System', icon: Server },
    { id: 'ai', label: 'AI Features', icon: Sparkles },
    { id: 'about', label: 'About', icon: Info }
  ];

  return (
    <div className="settings">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Configure data, appearance, and system preferences</p>
      </div>

      <div className="settings-tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'settings-tab-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="settings-content">
        {activeTab === 'data' && <DataManagement />}
        {activeTab === 'appearance' && <AppearanceSettings />}
        {activeTab === 'system' && <SystemInfo />}
        {activeTab === 'ai' && <AIRoadmap />}
        {activeTab === 'about' && <AboutPanel />}
      </div>
    </div>
  );
}
