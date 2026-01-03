import { useState, useEffect } from 'react';
import { THEMES, getTheme, setTheme } from '../../utils/theme';
import './AppearanceSettings.css';

export default function AppearanceSettings() {
  const [currentTheme, setCurrentTheme] = useState(getTheme());

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
    setTheme(theme);
  };

  return (
    <div className="appearance-settings">
      <div className="settings-section">
        <h2>Theme Settings</h2>
        
        <div className="setting-group">
          <label className="setting-label">Color Scheme</label>
          <div className="theme-options">
            <label className="theme-option">
              <input
                type="radio"
                name="theme"
                value={THEMES.LIGHT}
                checked={currentTheme === THEMES.LIGHT}
                onChange={(e) => handleThemeChange(e.target.value)}
              />
              <span>Light Mode</span>
            </label>
            
            <label className="theme-option">
              <input
                type="radio"
                name="theme"
                value={THEMES.DARK}
                checked={currentTheme === THEMES.DARK}
                onChange={(e) => handleThemeChange(e.target.value)}
              />
              <span>Dark Mode</span>
            </label>
            
            <label className="theme-option">
              <input
                type="radio"
                name="theme"
                value={THEMES.AUTO}
                checked={currentTheme === THEMES.AUTO}
                onChange={(e) => handleThemeChange(e.target.value)}
              />
              <span>Auto (Match System)</span>
            </label>
          </div>
        </div>

        <div className="setting-group">
          <label className="setting-label">Preview</label>
          <div className="theme-preview">
            <div className="preview-card">
              <h3>Sample Card Preview</h3>
              <p>This is how your interface will look with the selected theme.</p>
              <button className="btn btn-primary">Sample Button</button>
            </div>
          </div>
        </div>

        <div className="setting-group">
          <label className="setting-label">Accent Color</label>
          <div className="color-options">
            <button className="color-option color-blue active" title="Blue">
              <div className="color-swatch" style={{ background: '#3b82f6' }}></div>
            </button>
            <button className="color-option color-green" title="Green">
              <div className="color-swatch" style={{ background: '#10b981' }}></div>
            </button>
            <button className="color-option color-purple" title="Purple">
              <div className="color-swatch" style={{ background: '#8b5cf6' }}></div>
            </button>
            <button className="color-option color-red" title="Red">
              <div className="color-swatch" style={{ background: '#ef4444' }}></div>
            </button>
          </div>
          <p className="setting-help">Accent colors coming in a future update</p>
        </div>

        <div className="setting-group">
          <label className="setting-label">Font Size</label>
          <div className="font-size-options">
            <label className="font-size-option">
              <input type="radio" name="fontSize" value="small" />
              <span>Small (0.875rem)</span>
            </label>
            <label className="font-size-option">
              <input type="radio" name="fontSize" value="medium" defaultChecked />
              <span>Medium (1rem)</span>
            </label>
            <label className="font-size-option">
              <input type="radio" name="fontSize" value="large" />
              <span>Large (1.125rem)</span>
            </label>
          </div>
          <p className="setting-help">Font size customization coming in a future update</p>
        </div>

        <div className="setting-group">
          <label className="setting-label">Density</label>
          <div className="density-options">
            <label className="density-option">
              <input type="radio" name="density" value="compact" />
              <span>Compact</span>
            </label>
            <label className="density-option">
              <input type="radio" name="density" value="comfortable" defaultChecked />
              <span>Comfortable</span>
            </label>
            <label className="density-option">
              <input type="radio" name="density" value="spacious" />
              <span>Spacious</span>
            </label>
          </div>
          <p className="setting-help">Layout density customization coming in a future update</p>
        </div>
      </div>
    </div>
  );
}
