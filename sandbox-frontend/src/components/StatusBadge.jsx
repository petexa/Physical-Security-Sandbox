import { CheckCircle, XCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import './StatusBadge.css';

const statusConfig = {
  online: { color: 'success', icon: CheckCircle },
  success: { color: 'success', icon: CheckCircle },
  offline: { color: 'error', icon: XCircle },
  error: { color: 'error', icon: XCircle },
  fault: { color: 'warning', icon: AlertTriangle },
  warning: { color: 'warning', icon: AlertCircle },
  info: { color: 'info', icon: Info }
};

export default function StatusBadge({ status, text, showIcon = true }) {
  const config = statusConfig[status] || statusConfig.info;
  const Icon = config.icon;
  
  return (
    <div className={`status-badge status-badge-${config.color}`}>
      {showIcon && <Icon size={16} />}
      <span>{text || status}</span>
    </div>
  );
}
