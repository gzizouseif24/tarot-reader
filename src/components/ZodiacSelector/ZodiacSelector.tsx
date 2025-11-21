// src/components/ZodiacSelector/ZodiacSelector.tsx
import type { ZodiacSign } from '../../data/types';
import { ZODIAC_SIGNS } from '../../data/types';
import './ZodiacSelector.css';

interface ZodiacSelectorProps {
  selectedSign: ZodiacSign | null;
  onSignChange: (sign: ZodiacSign | null) => void;
  disabled?: boolean;
}

export function ZodiacSelector({
  selectedSign,
  onSignChange,
  disabled = false
}: ZodiacSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onSignChange(value === '' ? null : value as ZodiacSign);
  };

  return (
    <div className="zodiac-selector">
      <select
        id="zodiac-select"
        className="zodiac-dropdown"
        value={selectedSign || ''}
        onChange={handleChange}
        disabled={disabled}
      >
        <option value="">No Sign</option>
        {Object.entries(ZODIAC_SIGNS).map(([key, data]) => (
          <option key={key} value={key}>
            {data.symbol} {data.name}
          </option>
        ))}
      </select>
    </div>
  );
}
