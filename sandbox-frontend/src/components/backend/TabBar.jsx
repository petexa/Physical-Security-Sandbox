import { Users, Shield, DoorOpen, Server, UserCog, Plug, Radio, Activity } from 'lucide-react';
import './TabBar.css';

const tabs = [
  { id: 'cardholders', label: 'Cardholders', icon: Users },
  { id: 'access-groups', label: 'Access Groups', icon: Shield },
  { id: 'doors', label: 'Doors', icon: DoorOpen },
  { id: 'controllers', label: 'Controllers', icon: Server },
  { id: 'operator-groups', label: 'Operator Groups', icon: UserCog },
  { id: 'inputs', label: 'Inputs', icon: Plug },
  { id: 'outputs', label: 'Outputs', icon: Radio },
  { id: 'events', label: 'Events', icon: Activity }
];

export default function TabBar({ activeTab, onTabChange, counts }) {
  return (
    <div className="tab-bar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const count = counts?.[tab.id];
        
        return (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <Icon size={20} />
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
