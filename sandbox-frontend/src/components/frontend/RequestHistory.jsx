import { Clock, RotateCcw, Trash2 } from 'lucide-react';
import StatusBadge from '../StatusBadge';
import './RequestHistory.css';

export default function RequestHistory({ history, onReplay, onClear }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // Less than 1 minute
    if (diff < 60000) {
      return 'Just now';
    }
    
    // Less than 1 hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    }
    
    // Less than 24 hours
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }
    
    // More than 24 hours
    return date.toLocaleDateString();
  };

  const getStatusType = (status) => {
    if (status >= 200 && status < 300) return 'success';
    if (status >= 400 && status < 500) return 'warning';
    if (status >= 500) return 'error';
    return 'info';
  };

  const getMethodClass = (method) => {
    const classes = {
      'GET': 'method-get',
      'POST': 'method-post',
      'PATCH': 'method-patch',
      'DELETE': 'method-delete'
    };
    return classes[method] || 'method-get';
  };

  return (
    <div className="request-history">
      <div className="history-header">
        <div className="history-title">
          <Clock size={18} />
          <h3>History</h3>
        </div>
        {history.length > 0 && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={onClear}
            title="Clear history"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="history-list">
        {history.length === 0 ? (
          <div className="empty-state">
            <p>No requests yet</p>
            <span>Your request history will appear here</span>
          </div>
        ) : (
          history.map((item) => (
            <div key={item.id} className="history-item">
              <div className="history-item-header">
                <span className={`method-badge ${getMethodClass(item.method)}`}>
                  {item.method}
                </span>
                <StatusBadge 
                  status={getStatusType(item.status)}
                  text={String(item.status)}
                  showIcon={false}
                />
              </div>
              
              <div className="history-item-endpoint">
                {item.endpoint}
              </div>
              
              <div className="history-item-footer">
                <span className="history-time">{formatTime(item.timestamp)}</span>
                <span className="history-response-time">{item.responseTime}ms</span>
              </div>
              
              <button
                className="history-replay-btn"
                onClick={() => onReplay(item)}
                title="Replay request"
              >
                <RotateCcw size={14} />
                Replay
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
