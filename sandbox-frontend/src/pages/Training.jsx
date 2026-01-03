import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Clock, Award, CheckCircle, Lock, BookOpen } from 'lucide-react';
import trainingModules from '../content/training';
import TrainingModule from '../components/training/TrainingModule';
import './Training.css';

export default function Training() {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  // Load progress for all modules (only on mount)
  const [moduleProgress] = useState(() => {
    const progress = {};
    trainingModules.forEach(module => {
      const stored = localStorage.getItem(`module-${module.id}-progress`);
      const completed = stored ? JSON.parse(stored) : [];
      progress[module.id] = {
        completed: completed.length,
        total: module.sections.length,
        percentage: Math.round((completed.length / module.sections.length) * 100)
      };
    });
    return progress;
  });

  // If a moduleId is in the URL, show that module
  if (moduleId) {
    const module = trainingModules.find(m => m.id === moduleId);
    if (module) {
      return <TrainingModule module={module} />;
    }
    // If module not found, redirect to training list
    navigate('/training');
    return null;
  }

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

  const isModuleUnlocked = (module) => {
    if (!module.prerequisites || module.prerequisites.length === 0) {
      return true;
    }
    
    // Check if all prerequisites are completed
    return module.prerequisites.every(prereqId => {
      const progress = moduleProgress[prereqId];
      return progress && progress.percentage === 100;
    });
  };

  const getModuleStatus = (module) => {
    const progress = moduleProgress[module.id];
    if (!progress) return 'not-started';
    if (progress.percentage === 100) return 'completed';
    if (progress.percentage > 0) return 'in-progress';
    return 'not-started';
  };

  return (
    <div className="training-page">
      <div className="training-header">
        <div className="training-header-content">
          <h1 className="training-title">
            <BookOpen size={36} />
            Physical Security API Training
          </h1>
          <p className="training-subtitle">
            Master physical security system integration with comprehensive, hands-on training modules
          </p>
        </div>
      </div>

      <div className="training-content">
        <div className="modules-grid">
          {trainingModules.map((module) => {
            const unlocked = isModuleUnlocked(module);
            const status = getModuleStatus(module);
            const progress = moduleProgress[module.id];

            return (
              <div 
                key={module.id}
                className={`module-card ${!unlocked ? 'locked' : ''} ${status}`}
                onClick={() => unlocked && navigate(`/training/${module.id}`)}
              >
                <div className="module-card-header">
                  <div className="module-card-meta">
                    <span 
                      className="module-difficulty" 
                      style={{ backgroundColor: getDifficultyColor(module.difficulty) }}
                    >
                      {module.difficulty}
                    </span>
                    <span className="module-time">
                      <Clock size={14} />
                      {module.estimatedTime}
                    </span>
                  </div>
                  {!unlocked && <Lock className="lock-icon" size={20} />}
                  {status === 'completed' && <CheckCircle className="complete-icon" size={20} />}
                </div>

                <h3 className="module-card-title">{module.title}</h3>
                <p className="module-card-description">{module.description}</p>

                {progress && progress.percentage > 0 && (
                  <div className="module-progress-bar">
                    <div 
                      className="module-progress-fill" 
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                )}

                <div className="module-card-footer">
                  <span className="module-sections">
                    {module.sections.length} sections
                  </span>
                  {unlocked ? (
                    <span className="module-cta">
                      {status === 'completed' ? 'Review' : status === 'in-progress' ? 'Continue' : 'Start'}
                    </span>
                  ) : (
                    <span className="module-locked-text">
                      Complete prerequisites
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="training-info">
          <div className="info-card">
            <Award size={24} className="info-icon" />
            <h3>Complete All Modules</h3>
            <p>Finish all 6 training modules to earn your certificate of completion and unlock advanced labs.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
