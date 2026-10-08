interface ControlBarProps {
  onClear: () => void;
  hasEntries: boolean;
  isBusy: boolean;
}

export function ControlBar({ onClear, hasEntries, isBusy }: ControlBarProps) {
  if (!hasEntries && !isBusy) return null;

  return (
    <div className="control-bar">
      <button className="control-btn" onClick={onClear} disabled={isBusy}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
        Clear
      </button>
    </div>
  );
}
