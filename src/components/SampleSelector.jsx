import React from 'react';
import { Eye, Stethoscope, HeartPulse, Baby } from 'lucide-react';

export default function SampleSelector({ samples, activeSampleId, onSelectSample }) {
  const getIcon = (category) => {
    switch (category) {
      case 'Ophthalmology':
        return <Eye size={14} />;
      case 'Cardiology':
        return <HeartPulse size={14} />;
      case 'Pediatrics':
        return <Baby size={14} />;
      default:
        return <Stethoscope size={14} />;
    }
  };

  return (
    <div className="preset-selector-bar">
      <div className="preset-inner">
        <div className="preset-label-group">
          <span>Clinical Presets:</span>
        </div>

        <div className="preset-pills-row">
          {samples.map((sample) => {
            const isActive = activeSampleId === sample.id;
            return (
              <button
                key={sample.id}
                className={`preset-chip ${isActive ? 'active' : ''}`}
                onClick={() => onSelectSample(sample)}
              >
                {getIcon(sample.category)}
                <span>{sample.title}</span>
                <span className="category-tag">{sample.category}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
