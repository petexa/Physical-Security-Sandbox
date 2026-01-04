import './EmptyState.css';

function EmptyState({ 
  emoji = '📭', 
  title = 'No items', 
  message = 'Select an item from the list to view details',
  actionLabel = 'View All',
  onAction = null
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-emoji">{emoji}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {onAction && (
        <button className="empty-state-button" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
