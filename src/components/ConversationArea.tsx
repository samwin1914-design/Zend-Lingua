import { useEffect, useRef } from 'react';
import type { ConversationEntry } from '../types';
import { LANGUAGES } from '../constants';

interface ConversationAreaProps {
  entries: ConversationEntry[];
  interimText: string;
  sourceLangCode: string;
  targetLangCode: string;
  onReplay: (entry: ConversationEntry) => void;
  onCopy: (entry: ConversationEntry) => void;
}

function langName(code: string): string {
  return LANGUAGES.find((l) => l.code === code)?.name ?? code;
}

function langNative(code: string): string {
  return LANGUAGES.find((l) => l.code === code)?.nativeName ?? code;
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function ConversationArea({
  entries,
  interimText,
  sourceLangCode,
  targetLangCode,
  onReplay,
  onCopy,
}: ConversationAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries, interimText]);

  if (entries.length === 0 && !interimText) {
    return (
      <div className="conversation-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <p>Start a conversation by tapping the microphone</p>
      </div>
    );
  }

  return (
    <div className="conversation-area" ref={scrollRef}>
      {entries.map((entry) => (
        <div key={entry.id} className="conv-entry">
          <div className={`conv-bubble conv-bubble--${entry.direction}`}>
            <div className="conv-bubble-header">
              <span className="conv-lang-tag">{langNative(entry.sourceLang)}</span>
              <span className="conv-time">{formatTime(entry.timestamp)}</span>
            </div>
            <p className="conv-original">{entry.originalText}</p>
            <div className="conv-arrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
            <div className="conv-bubble-header">
              <span className="conv-lang-tag conv-lang-tag--target">{langNative(entry.targetLang)}</span>
            </div>
            <p className="conv-translated">
              {entry.translatedText || (
                <span className="conv-no-translation">Translation pending</span>
              )}
            </p>
            {entry.translatedText && (
              <div className="conv-controls">
                <button className="conv-control-btn" onClick={() => onReplay(entry)} aria-label="Replay audio">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Play
                </button>
                <button className="conv-control-btn" onClick={() => onCopy(entry)} aria-label="Copy text">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
      {interimText && (
        <div className="conv-entry">
          <div className="conv-bubble conv-bubble--interim">
            <div className="conv-bubble-header">
              <span className="conv-lang-tag">{langNative(sourceLangCode)}</span>
              <span className="conv-listening-indicator">
                <span className="pulse-dot" /> listening
              </span>
            </div>
            <p className="conv-original conv-original--live">{interimText}</p>
            <span className="conv-translating-to">→ {langName(targetLangCode)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
