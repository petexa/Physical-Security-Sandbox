import { useEffect, useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import './ProgressTracker.css';

export default function ProgressTracker({ moduleId, sections, currentSectionIndex }) {
  const [completedSections, setCompletedSections] = useState(() => {
    const stored = localStorage.getItem(`module-${moduleId}-progress`);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(`module-${moduleId}-progress`, JSON.stringify(completedSections));
  }, [completedSections, moduleId]);

  const completedCount = completedSections.length;
  const totalSections = sections.length;
  const progressPercent = Math.round((completedCount / totalSections) * 100);

  const isSectionComplete = (sectionIndex) => {
    return completedSections.includes(sections[sectionIndex]?.id);
  };

  // Auto-mark current section as complete when viewed
  useEffect(() => {
    if (currentSectionIndex !== null && currentSectionIndex >= 0) {
      const timer = setTimeout(() => {
        const sectionId = sections[currentSectionIndex]?.id;
        if (sectionId && !completedSections.includes(sectionId)) {
          setCompletedSections([...completedSections, sectionId]);
        }
      }, 3000); // Mark complete after 3 seconds on section
      
      return () => clearTimeout(timer);
    }
  }, [currentSectionIndex, sections, completedSections]);

  return (
    <div className="progress-tracker">
      <div className="progress-header">
        <h3 className="progress-title">Your Progress</h3>
        <span className="progress-count">
          {completedCount} / {totalSections} sections
        </span>
      </div>
      
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="progress-percent">{progressPercent}%</span>
      </div>

      <div className="progress-sections">
        {sections.map((section, index) => (
          <div 
            key={section.id} 
            className={`progress-section-item ${isSectionComplete(index) ? 'completed' : ''} ${currentSectionIndex === index ? 'current' : ''}`}
          >
            {isSectionComplete(index) ? (
              <CheckCircle2 className="section-icon" size={18} />
            ) : (
              <Circle className="section-icon" size={18} />
            )}
            <span className="section-title">{section.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
