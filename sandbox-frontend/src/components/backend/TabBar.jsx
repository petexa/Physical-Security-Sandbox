import { Users, Shield, DoorOpen, Server, UserCog, Plug, Radio, Activity, Camera, Bookmark, AlertCircle, Database } from 'lucide-react';
import './TabBar.css';

// Icon mapping for dynamic lookup
const iconMap = {
  'cardholders': Users,
  'access-groups': Shield,
  'doors': DoorOpen,
  'controllers': Server,
  'operator-groups': UserCog,
  'inputs': Plug,
  'outputs': Radio,
  'events': Activity,
  'milestone-cameras': Camera,
  'cameras': Camera,
  'bookmarks': Bookmark,
  'vms-events': AlertCircle,
  'recording-servers': Database
};

export default function TabBar({ tabs, activeTab, onTabChange, counts }) {
  return (
    <div className="tab-bar">
      {tabs.map((tab) => {
        const Icon = tab.icon || iconMap[tab.id];
        const count = counts?.[tab.id] ?? tab.count;
        
        return (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {Icon && <Icon size={20} />}
            <span className="tab-label">{tab.label}</span>
            {count !== undefined && (
              <span className="tab-count">({count})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
