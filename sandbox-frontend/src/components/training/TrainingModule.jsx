import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Home, Clock, Award } from 'lucide-react';
import Button from '../Button';
import CodeExample from './CodeExample';
import TryItSection from './TryItSection';
import ProgressTracker from './ProgressTracker';
import './TrainingModule.css';

export default function TrainingModule({ module }) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const navigate = useNavigate();

  const currentSection = module.sections[currentSectionIndex];
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === module.sections.length - 1;

  const handlePrevious = () => {
    if (!isFirstSection) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleNext = () => {
    if (!isLastSection) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSectionClick = (index) => {
    setCurrentSectionIndex(index);
    window.scrollTo(0, 0);
  };

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

  return (
    <div className="training-module">
      <div className="module-header">
        <button className="back-button" onClick={() => navigate('/training')}>
          <Home size={18} />
          Back to Training
        </button>
        <div className="module-header-content">
          <div className="module-meta">
            <span 
              className="difficulty-badge" 
              style={{ backgroundColor: getDifficultyColor(module.difficulty) }}
            >
              {module.difficulty}
            </span>
            <span className="time-estimate">
              <Clock size={16} />
              {module.estimatedTime}
            </span>
          </div>
          <h1 className="module-title">{module.title}</h1>
          <p className="module-description">{module.description}</p>
        </div>
      </div>

      <div className="module-content-wrapper">
        <aside className="module-sidebar">
          <ProgressTracker 
            moduleId={module.id}
            sections={module.sections}
            currentSectionIndex={currentSectionIndex}
          />
          
          <div className="section-nav">
            <h3 className="section-nav-title">Sections</h3>
            <div className="section-list">
              {module.sections.map((section, index) => (
                <button
                  key={section.id}
                  className={`section-nav-item ${currentSectionIndex === index ? 'active' : ''}`}
                  onClick={() => handleSectionClick(index)}
                >
                  <span className="section-number">{index + 1}</span>
                  <span className="section-nav-title-text">{section.title}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="module-main">
          <div className="section-content">
            <h2 className="section-title">{currentSection.title}</h2>
            
            <div className="section-text">
              {currentSection.content.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('#')) {
                  const level = paragraph.match(/^#+/)[0].length;
                  const text = paragraph.replace(/^#+\s*/, '');
                  const Tag = `h${level}`;
                  return <Tag key={idx} className="content-heading">{text}</Tag>;
                } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return <h4 key={idx} className="content-subheading">{paragraph.slice(2, -2)}</h4>;
                } else if (paragraph.startsWith('- ')) {
                  const items = paragraph.split('\n').filter(line => line.startsWith('- '));
                  return (
                    <ul key={idx} className="content-list">
                      {items.map((item, i) => (
                        <li key={i}>{item.substring(2)}</li>
                      ))}
                    </ul>
                  );
                } else if (paragraph.startsWith('```')) {
                  const lines = paragraph.split('\n');
                  const code = lines.slice(1, -1).join('\n');
                  return (
                    <pre key={idx} className="inline-code-block">
                      <code>{code}</code>
                    </pre>
                  );
                } else if (paragraph.trim()) {
                  return <p key={idx} className="content-paragraph">{paragraph}</p>;
                }
                return null;
              })}
            </div>

            {currentSection.codeExamples && currentSection.codeExamples.length > 0 && (
              <div className="code-examples-section">
                {currentSection.codeExamples.map((example, idx) => (
                  <CodeExample
                    key={idx}
                    language={example.language}
                    code={example.code}
                    description={example.description}
                  />
                ))}
              </div>
            )}

            {currentSection.tryItSection && (
              <TryItSection
                endpoint={currentSection.tryItSection.endpoint}
                method={currentSection.tryItSection.method}
                description={currentSection.tryItSection.description}
              />
            )}
          </div>

          <div className="section-navigation">
            <Button
              variant="secondary"
              onClick={handlePrevious}
              disabled={isFirstSection}
            >
              <ChevronLeft size={18} />
              Previous
            </Button>
            
            <span className="section-progress">
              Section {currentSectionIndex + 1} of {module.sections.length}
            </span>
            
            {!isLastSection ? (
              <Button
                variant="primary"
                onClick={handleNext}
              >
                Next
                <ChevronRight size={18} />
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => navigate('/training')}
              >
                Complete Module
                <Award size={18} />
              </Button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
