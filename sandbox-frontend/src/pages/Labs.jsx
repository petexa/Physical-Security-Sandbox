import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, Lock, Beaker, Award } from 'lucide-react';
import labs from '../content/labs';
import trainingModules from '../content/training';
import './Labs.css';

export default function Labs() {
  const navigate = useNavigate();

  // Load lab progress from localStorage
  const [labProgress] = useState(() => {
    const progress = {};
    labs.forEach(lab => {
      const stored = localStorage.getItem(`lab-${lab.id}-progress`);
      const completed = stored ? JSON.parse(stored) : [];
      progress[lab.id] = {
        completed: completed.length,
        total: lab.steps.length,
        percentage: Math.round((completed.length / lab.steps.length) * 100)
      };
    });
    return progress;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return '#10b981';
      case 'intermediate':
        return '#f59e0b';
      case 'advanced':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const isLabUnlocked = (lab) => {
    if (!lab.prerequisites || lab.prerequisites.length === 0) {
      return true;
    }
    
    // Check if all prerequisite modules are completed
    return lab.prerequisites.every(prereqId => {
      const stored = localStorage.getItem(`module-${prereqId}-progress`);
      if (!stored) return false;
      const completed = JSON.parse(stored);
      const module = trainingModules.find(m => m.id === prereqId);
      return module && completed.length === module.sections.length;
    });
  };

  const getLabStatus = (lab) => {
    const progress = labProgress[lab.id];
    if (!progress) return 'not-started';
    if (progress.percentage === 100) return 'completed';
    if (progress.percentage > 0) return 'in-progress';
    return 'not-started';
  };

  const handleLabClick = (lab) => {
    if (isLabUnlocked(lab)) {
      // In a full implementation, this would navigate to a lab executor
      // For now, navigate to Frontend (API Tester) as a placeholder
      navigate('/frontend');
    }
  };

  return (
    <div className="labs-page">
      <div className="labs-header">
        <div className="labs-header-content">
          <h1 className="labs-title">
            <Beaker size={36} />
            Interactive Labs
          </h1>
          <p className="labs-subtitle">
            Learn by doing with guided, hands-on exercises. Practice real-world API integration scenarios.
          </p>
        </div>
      </div>

      <div className="labs-content">
        <div className="labs-grid">
          {labs.map((lab) => {
            const unlocked = isLabUnlocked(lab);
            const status = getLabStatus(lab);
            const progress = labProgress[lab.id];

            return (
              <div
                key={lab.id}
                className={`lab-card ${!unlocked ? 'locked' : ''} ${status}`}
                onClick={() => handleLabClick(lab)}
              >
                <div className="lab-card-header">
                  <div className="lab-card-meta">
                    <span
                      className="lab-difficulty"
                      style={{ backgroundColor: getDifficultyColor(lab.difficulty) }}
                    >
                      {lab.difficulty}
                    </span>
                    <span className="lab-time">
                      <Clock size={14} />
                      {lab.estimatedTime}
                    </span>
                  </div>
                  {!unlocked && <Lock className="lock-icon" size={20} />}
                  {status === 'completed' && <CheckCircle className="complete-icon" size={20} />}
                </div>

                <h3 className="lab-card-title">{lab.title}</h3>
                <p className="lab-card-description">{lab.description}</p>

                <div className="lab-skills">
                  <span className="skills-label">Skills:</span>
                  <div className="skills-list">
                    {lab.skillsCovered.map((skill, idx) => (
                      <span key={idx} className="skill-badge">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {progress && progress.percentage > 0 && (
                  <div className="lab-progress-bar">
                    <div
                      className="lab-progress-fill"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                )}

                <div className="lab-card-footer">
                  <span className="lab-steps">
                    {lab.steps.length} steps
                  </span>
                  {unlocked ? (
                    <span className="lab-cta">
                      {status === 'completed' ? 'Review' : status === 'in-progress' ? 'Continue' : 'Start Lab'}
                    </span>
                  ) : (
                    <span className="lab-locked-text">
                      Complete prerequisites
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="labs-info">
          <div className="info-card">
            <Award size={24} className="info-icon" />
            <h3>Hands-On Practice</h3>
            <p>
              Complete labs to reinforce your learning and build practical skills. Each lab includes
              step-by-step instructions, hints, and validation to ensure you're on the right track.
            </p>
          </div>
          
          <div className="info-card">
            <Beaker size={24} className="info-icon" />
            <h3>Safe Learning Environment</h3>
            <p>
              Practice with mock data in a safe sandbox environment. Make mistakes, learn, and experiment
              without worrying about breaking anything.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
