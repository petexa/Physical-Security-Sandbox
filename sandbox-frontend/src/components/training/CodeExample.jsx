import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import './CodeExample.css';

export default function CodeExample({ language, code, description, copyable = true }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="code-example">
      {description && <p className="code-description">{description}</p>}
      <div className="code-container">
        <div className="code-header">
          <span className="code-language">{language}</span>
          {copyable && (
            <button 
              className="code-copy-btn"
              onClick={handleCopy}
              title={copied ? "Copied!" : "Copy to clipboard"}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          )}
        </div>
        <pre className="code-block">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </div>
  );
}
