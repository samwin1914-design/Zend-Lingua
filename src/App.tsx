import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AppPhase, ConversationEntry, ConversationDirection, Language } from './types';
import { DEFAULT_SOURCE_LANG, DEFAULT_TARGET_LANG, LANGUAGES } from './constants';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useTranslation } from './hooks/useTranslation';
import { useElevenLabsTTS } from './hooks/useElevenLabsTTS';
import { Header } from './components/Header';
import { LanguageSelector } from './components/LanguageSelector';
import { SwapButton } from './components/SwapButton';
import { MicButton } from './components/MicButton';
import { ConversationArea } from './components/ConversationArea';
import { ControlBar } from './components/ControlBar';
import { SettingsModal } from './components/SettingsModal';
import { PrivacyModal } from './components/PrivacyModal';

let entryCounter = 0;
function makeId(): string {
  entryCounter += 1;
  return `entry-${Date.now()}-${entryCounter}`;
}

export default function App() {
  const [sourceLang, setSourceLang] = useState<Language>(DEFAULT_SOURCE_LANG);
  const [targetLang, setTargetLang] = useState<Language>(DEFAULT_TARGET_LANG);
  const [entries, setEntries] = useState<ConversationEntry[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const directionRef = useRef<ConversationDirection>('source-to-target');
  const processedRef = useRef(false);

  const tts = useElevenLabsTTS();
  const { translate, isTranslating } = useTranslation();
  const {
    isListening,
    interimText,
    finalText,
    error: speechError,
    isSupported,
    start,
    stop: stopListening,
    reset: resetRecognition,
    setError: setSpeechError,
  } = useSpeechRecognition(sourceLang.bcp47);

  const phase: AppPhase = useMemo(() => {
    if (errorMsg || speechError) return 'error';
    if (isTranslating) return 'translating';
    if (tts.isLoading || isListening === false && finalText && !processedRef.current) return 'translating';
    if (isListening) return 'listening';
    return 'idle';
  }, [errorMsg, speechError, isTranslating, tts.isLoading, isListening, finalText]);

  const activeSourceLang = directionRef.current === 'source-to-target' ? sourceLang : targetLang;
  const activeTargetLang = directionRef.current === 'source-to-target' ? targetLang : sourceLang;

  const clearError = useCallback(() => {
    setErrorMsg(null);
    setSpeechError(null);
    tts.setError(null);
  }, [tts, setSpeechError]);

  const handleSwap = useCallback(() => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  }, [sourceLang, targetLang]);

  const handleClear = useCallback(() => {
    stopListening();
    tts.stop();
    setEntries([]);
    resetRecognition();
    processedRef.current = false;
    clearError();
  }, [stopListening, tts, resetRecognition, clearError]);

  const processFinalText = useCallback(async (text: string) => {
    if (processedRef.current || !text.trim()) return;
    processedRef.current = true;

    const srcLang = directionRef.current === 'source-to-target' ? sourceLang.code : targetLang.code;
    const tgtLang = directionRef.current === 'source-to-target' ? targetLang.code : sourceLang.code;

    const translated = await translate(text, srcLang, tgtLang);

    const entry: ConversationEntry = {
      id: makeId(),
      direction: directionRef.current,
      originalText: text,
      translatedText: translated,
      sourceLang: srcLang,
      targetLang: tgtLang,
      timestamp: Date.now(),
      audioPlayed: false,
    };

    setEntries((prev) => [...prev, entry]);

    if (translated) {
      const success = await tts.speak({ text: translated });
      setEntries((prev) =>
        prev.map((e) => (e.id === entry.id ? { ...e, audioPlayed: success } : e))
      );
    }
  }, [sourceLang, targetLang, translate, tts]);

  useEffect(() => {
    if (finalText && !processedRef.current) {
      processFinalText(finalText);
    }
  }, [finalText, processFinalText]);

  useEffect(() => {
    if (speechError) setErrorMsg(speechError);
    if (tts.error) setErrorMsg(tts.error);
  }, [speechError, tts.error]);

  const handleMicClick = useCallback(() => {
    if (isListening) {
      stopListening();
      return;
    }

    if (tts.isLoading) {
      tts.stop();
      return;
    }

    clearError();
    resetRecognition();
    processedRef.current = false;

    if (!isSupported) {
      setErrorMsg('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    directionRef.current = 'source-to-target';
    start();
  }, [isListening, tts, clearError, resetRecognition, isSupported, start, stopListening]);

  const handleReplay = useCallback((entry: ConversationEntry) => {
    tts.speak({ text: entry.translatedText });
  }, [tts]);

  const handleCopy = useCallback((entry: ConversationEntry) => {
    navigator.clipboard.writeText(entry.translatedText).catch(() => {
      setErrorMsg('Could not copy to clipboard.');
    });
  }, []);

  const handleSourceChange = useCallback((lang: Language) => {
    if (lang.code === targetLang.code) {
      setTargetLang(sourceLang);
    }
    setSourceLang(lang);
    clearError();
  }, [targetLang, sourceLang, clearError]);

  const handleTargetChange = useCallback((lang: Language) => {
    if (lang.code === sourceLang.code) {
      setSourceLang(targetLang);
    }
    setTargetLang(lang);
    clearError();
  }, [sourceLang, targetLang, clearError]);

  const isBusy = isListening || isTranslating || tts.isLoading;

  return (
    <div className="app">
      <Header
        onOpenSettings={() => setShowSettings(true)}
        onOpenPrivacy={() => setShowPrivacy(true)}
      />

      <main className="app-main">
        <div className="lang-bar">
          <LanguageSelector
            label="From"
            value={sourceLang}
            onChange={handleSourceChange}
            excludeCode={targetLang.code}
          />
          <SwapButton onClick={handleSwap} disabled={isBusy} />
          <LanguageSelector
            label="To"
            value={targetLang}
            onChange={handleTargetChange}
            excludeCode={sourceLang.code}
          />
        </div>

        <ConversationArea
          entries={entries}
          interimText={interimText}
          sourceLangCode={activeSourceLang.code}
          targetLangCode={activeTargetLang.code}
          onReplay={handleReplay}
          onCopy={handleCopy}
        />

        {errorMsg && (
          <div className="error-banner">
            <span>{errorMsg}</span>
            <button className="error-dismiss" onClick={clearError}>Dismiss</button>
          </div>
        )}

        <ControlBar
          onClear={handleClear}
          hasEntries={entries.length > 0}
          isBusy={isBusy}
        />
      </main>

      <footer className="app-footer">
        <MicButton
          phase={phase}
          isListening={isListening}
          isTranslating={isTranslating}
          isSpeaking={tts.isLoading}
          onClick={handleMicClick}
          disabled={false}
        />
      </footer>

      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
      <PrivacyModal open={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </div>
  );
}
