import type { Language } from '../types';
import { LANGUAGES } from '../constants';

interface LanguageSelectorProps {
  label: string;
  value: Language;
  onChange: (lang: Language) => void;
  excludeCode?: string;
}

export function LanguageSelector({ label, value, onChange, excludeCode }: LanguageSelectorProps) {
  return (
    <div className="lang-selector">
      <label className="lang-selector-label">{label}</label>
      <div className="lang-selector-control">
        <select
          className="lang-dropdown"
          value={value.code}
          onChange={(e) => {
            const lang = LANGUAGES.find((l) => l.code === e.target.value);
            if (lang) onChange(lang);
          }}
          aria-label={label}
        >
          {LANGUAGES.map((lang) => {
            const disabled = lang.code === excludeCode;
            return (
              <option key={lang.code} value={lang.code} disabled={disabled}>
                {lang.nativeName} — {lang.name}
              </option>
            );
          })}
        </select>
        <svg className="lang-dropdown-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}
