import type { AppPhase } from '../types';

interface MicButtonProps {
  phase: AppPhase;
  isListening: boolean;
  isTranslating: boolean;
  isSpeaking: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function MicButton({ phase, isListening, isTranslating, isSpeaking, onClick, disabled }: MicButtonProps) {
  const label = (() => {
    if (isListening) return 'Listening…';
    if (isTranslating) return 'Translating…';
    if (isSpeaking) return 'Speaking…';
    return 'Tap to speak';
  })();

  return (
    <div className="mic-container">
      <button
        className={`mic-btn ${isListening ? 'mic-btn--active' : ''} ${isTranslating ? 'mic-btn--translating' : ''} ${isSpeaking ? 'mic-btn--speaking' : ''}`}
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
      >
        <div className="mic-btn-pulse" />
        <div className="mic-btn-pulse mic-btn-pulse--delayed" />
        <div className="mic-btn-inner">
          {isListening ? (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M5 10v1a7 7 0 0 0 14 0v-1" />
              <line x1="12" y1="19" x2="12" y2="22" />
              <line x1="8" y1="22" x2="16" y2="22" />
            </svg>
          ) : isTranslating ? (
            <svg className="mic-btn-spinner" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : isSpeaking ? (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M5 10v1a7 7 0 0 0 14 0v-1" />
              <line x1="12" y1="19" x2="12" y2="22" />
              <line x1="8" y1="22" x2="16" y2="22" />
            </svg>
          )}
        </div>
      </button>
      <span className="mic-label">{label}</span>
      {phase === 'error' && <span className="mic-error-dot" />}
    </div>
  );
}
