import React from 'react';
import { Key, Info, Sun, Moon, Stethoscope } from 'lucide-react';

export default function Header({
  hasApiKey,
  onOpenApiKeyModal,
  onOpenAboutModal,
  theme,
  onToggleTheme,
  onGoHome
}) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div 
          className="brand-section"
          onClick={onGoHome}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onGoHome?.()}
          style={{ cursor: 'pointer', userSelect: 'none' }}
          title="Return to Home Screen"
        >
          <div className="brand-logo-badge">
            <Stethoscope size={22} />
          </div>
          <div className="brand-titles">
            <div className="brand-title" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Emerg AI
            </div>
          </div>
        </div>


        <div className="header-actions">
          {/* About Emerg AI Button */}
          <button 
            className="header-btn"
            onClick={onOpenAboutModal}
            title="Learn about Emerg AI platform capabilities and architecture"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600 }}
          >
            <Info size={15} style={{ color: '#0d9488' }} />
            <span>About</span>
          </button>

          {/* API Key / Configuration Button */}
          <button 
            className="header-btn"
            onClick={onOpenApiKeyModal}
            title="Configure API Key"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600 }}
          >
            <span className={`api-status-dot ${hasApiKey ? '' : 'inactive'}`} />
            <Key size={15} />
            <span>API Settings</span>
          </button>

          {/* Theme Toggle */}
          <button 
            className="icon-btn" 
            onClick={onToggleTheme} 
            title="Toggle Dark/Light mode"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>
    </header>
  );
}
