import './Card.css';

export default function Card({ title, icon, children, onClick, className = '' }) {
  const cardClass = `card ${onClick ? 'card-clickable' : ''} ${className}`;
  
  return (
    <div className={cardClass} onClick={onClick}>
      {(title || icon) && (
        <div className="card-header">
          {icon && <span className="card-icon">{icon}</span>}
          {title && <h3 className="card-title">{title}</h3>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}
