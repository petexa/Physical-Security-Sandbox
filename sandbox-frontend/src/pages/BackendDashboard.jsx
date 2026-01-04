import { useState, useEffect } from 'react';
import { Activity, Server, AlertCircle, CheckCircle, TrendingUp, Database, Zap, Clock } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import './BackendDashboard.css';
import * as apiClient from '../utils/apiClient';

export default function BackendDashboard() {
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTime, setRefreshTime] = useState(new Date());

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Fetch health data
        const healthData = await apiClient.get('/api/health');
        setHealth(healthData.data);

        // Fetch entity counts
        try {
          const cardholdersData = await apiClient.get('/api/cardholders');
          const doorsData = await apiClient.get('/api/doors');
          const accessGroupsData = await apiClient.get('/api/access_groups');
          
          setStats({
            cardholders: cardholdersData.data?.results?.length || 0,
            doors: doorsData.data?.results?.length || 0,
            accessGroups: accessGroupsData.data?.results?.length || 0,
            cameras: 12 // Milestone placeholder
          });

          // Fetch recent events
          const eventsData = await apiClient.get('/api/events?top=10');
          const eventsList = (eventsData.data?.results || eventsData.data || []).slice(0, 10).map(event => ({
            ...event,
            system: 'Gallagher',
            icon: 'acl'
          }));
          setActivities(eventsList);
        } catch (e) {
          console.error('Failed to fetch stats:', e);
        }
      } catch (error) {
        console.error('Failed to fetch health:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      setRefreshTime(new Date());
      loadDashboard();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading || !health) {
    return (
      <div className="backend-dashboard-loading">
        <div className="spinner"></div>
        <p>Loading system dashboard...</p>
      </div>
    );
  }

  const gallagherHealthy = health.gallagher?.status === 'online';
  const milestoneHealthy = health.milestone?.status === 'online';

  return (
    <div className="backend-dashboard">
      <div className="dashboard-header">
        <h1>Backend Systems Dashboard</h1>
        <div className="dashboard-refresh">
          <Clock size={16} />
          <span>Last updated: {refreshTime.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* System Health Cards */}
      <div className="health-cards">
        {/* Gallagher Card */}
        <div className={`health-card ${gallagherHealthy ? 'online' : 'offline'}`}>
          <div className="card-header">
            <h3>Gallagher</h3>
            <div className="status-indicator">
              {gallagherHealthy ? (
                <>
                  <CheckCircle size={20} className="status-online" />
                  <span>Online</span>
                </>
              ) : (
                <>
                  <AlertCircle size={20} className="status-offline" />
                  <span>Offline</span>
                </>
              )}
            </div>
          </div>
          <div className="card-stats">
            <div className="stat-row">
              <span>Version:</span>
              <code>{health.gallagher?.version || 'N/A'}</code>
            </div>
            <div className="stat-row">
              <span>Uptime:</span>
              <span>{health.gallagher?.uptime || 'N/A'}</span>
            </div>
            <div className="stat-row">
              <span>Last Sync:</span>
              <span>{health.gallagher?.lastSync ? new Date(health.gallagher.lastSync).toLocaleString() : 'N/A'}</span>
            </div>
            <div className="stat-row">
              <span>API Status:</span>
              <code>{health.gallagher?.apiStatus || 'operational'}</code>
            </div>
          </div>
          <a href="/backend/gallagher" className="card-link">
            View Details →
          </a>
        </div>

        {/* Milestone Card */}
        <div className={`health-card ${milestoneHealthy ? 'online' : 'offline'}`}>
          <div className="card-header">
            <h3>Milestone</h3>
            <div className="status-indicator">
              {milestoneHealthy ? (
                <>
                  <CheckCircle size={20} className="status-online" />
                  <span>Online</span>
                </>
              ) : (
                <>
                  <AlertCircle size={20} className="status-offline" />
                  <span>Offline</span>
                </>
              )}
            </div>
          </div>
          <div className="card-stats">
            <div className="stat-row">
              <span>Version:</span>
              <code>{health.milestone?.version || 'N/A'}</code>
            </div>
            <div className="stat-row">
              <span>Servers:</span>
              <span>{health.milestone?.serverCount || '1'}</span>
            </div>
            <div className="stat-row">
              <span>Last Sync:</span>
              <span>{health.milestone?.lastSync ? new Date(health.milestone.lastSync).toLocaleString() : 'N/A'}</span>
            </div>
            <div className="stat-row">
              <span>API Status:</span>
              <code>{health.milestone?.apiStatus || 'operational'}</code>
            </div>
          </div>
          <a href="/backend/milestone" className="card-link">
            View Details →
          </a>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="quick-stats-grid">
        <div className="stat-card" onClick={() => window.location.href = '/backend/gallagher?tab=cardholders'}>
          <div className="stat-icon gallagher">
            <Zap size={28} />
          </div>
          <div className="stat-content">
            <h4>Cardholders</h4>
            <p className="stat-number">{stats?.cardholders || 0}</p>
          </div>
        </div>

        <div className="stat-card" onClick={() => window.location.href = '/backend/gallagher?tab=doors'}>
          <div className="stat-icon gallagher">
            <Database size={28} />
          </div>
          <div className="stat-content">
            <h4>Doors</h4>
            <p className="stat-number">{stats?.doors || 0}</p>
          </div>
        </div>

        <div className="stat-card" onClick={() => window.location.href = '/backend/milestone?tab=cameras'}>
          <div className="stat-icon milestone">
            <Activity size={28} />
          </div>
          <div className="stat-content">
            <h4>Cameras</h4>
            <p className="stat-number">{stats?.cameras || 0}</p>
          </div>
        </div>

        <div className="stat-card" onClick={() => window.location.href = '/backend/gallagher?tab=access-groups'}>
          <div className="stat-icon gallagher">
            <TrendingUp size={28} />
          </div>
          <div className="stat-content">
            <h4>Access Groups</h4>
            <p className="stat-number">{stats?.accessGroups || 0}</p>
          </div>
        </div>
      </div>

      {/* Server Stats Panel */}
      <div className="server-stats-panel">
        <h2>System Performance</h2>
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-label">Gallagher CPU</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '45%', background: 'linear-gradient(90deg, #3b82f6, #2563eb)' }}></div>
            </div>
            <span className="stat-value">45%</span>
          </div>

          <div className="stat-box">
            <div className="stat-label">Gallagher RAM</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '62%', background: 'linear-gradient(90deg, #10b981, #059669)' }}></div>
            </div>
            <span className="stat-value">62%</span>
          </div>

          <div className="stat-box">
            <div className="stat-label">DB Connections</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '28%', background: 'linear-gradient(90deg, #f59e0b, #d97706)' }}></div>
            </div>
            <span className="stat-value">28/100</span>
          </div>

          <div className="stat-box">
            <div className="stat-label">API Requests/min</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '38%', background: 'linear-gradient(90deg, #8b5cf6, #7c3aed)' }}></div>
            </div>
            <span className="stat-value">380 req/min</span>
          </div>

          <div className="stat-box">
            <div className="stat-label">Milestone Storage</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '76%', background: 'linear-gradient(90deg, #ef4444, #dc2626)' }}></div>
            </div>
            <span className="stat-value">76%</span>
          </div>

          <div className="stat-box">
            <div className="stat-label">Recording Rate</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '82%', background: 'linear-gradient(90deg, #ef4444, #dc2626)' }}></div>
            </div>
            <span className="stat-value">82%</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="activity-feed">
        <h2>Recent Activity</h2>
        {activities.length === 0 ? (
          <p className="activity-empty">No recent activities</p>
        ) : (
          <div className="activity-list">
            {activities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-time">
                  {activity.timestamp ? new Date(activity.timestamp).toLocaleTimeString() : 'N/A'}
                </div>
                <div className="activity-system">
                  <span className="system-badge gallagher">{activity.system}</span>
                </div>
                <div className="activity-type">
                  <span className={`type-badge ${activity.event_type?.toLowerCase() || 'default'}`}>
                    {activity.event_type || 'Event'}
                  </span>
                </div>
                <div className="activity-summary">
                  {activity.summary || activity.description || 'System activity'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
