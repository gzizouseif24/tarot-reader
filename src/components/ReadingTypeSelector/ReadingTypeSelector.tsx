// src/components/ReadingTypeSelector/ReadingTypeSelector.tsx
import type { ReadingType } from '../../data/types';
import './ReadingTypeSelector.css';

interface ReadingTypeSelectorProps {
  selectedType: ReadingType;
  onTypeChange: (type: ReadingType) => void;
  disabled?: boolean;
}

export function ReadingTypeSelector({
  selectedType,
  onTypeChange,
  disabled = false
}: ReadingTypeSelectorProps) {
  return (
    <div className="reading-type-selector">
      <span className="selector-label">Choose your spread:</span>
      <div className="selector-buttons">
        <button
          className={`selector-btn ${selectedType === 'one' ? 'selected' : ''}`}
          onClick={() => onTypeChange('one')}
          disabled={disabled}
        >
          <span className="btn-title">One Card</span>
          <span className="btn-description">Quick insight</span>
        </button>
        <button
          className={`selector-btn ${selectedType === 'three' ? 'selected' : ''}`}
          onClick={() => onTypeChange('three')}
          disabled={disabled}
        >
          <span className="btn-title">Three Cards</span>
          <span className="btn-description">Past · Present · Future</span>
        </button>
      </div>
    </div>
  );
}
