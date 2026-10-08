import { useState } from 'react';

type TranslateFn = (text: string, sourceLang: string, targetLang: string) => Promise<string>;

// [FUTURE API] Translation API integration point.
// No external translation API is connected yet. This hook provides the
// interface the app expects so that when a translation service is added,
// only this function needs to change — all UI components remain the same.
async function placeholderTranslate(text: string, _sourceLang: string, _targetLang: string): Promise<string> {
  // No fake translations — return empty to indicate no translation service yet.
  void text; void _sourceLang; void _targetLang;
  return '';
}

export function useTranslation() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate: TranslateFn = async (text, sourceLang, targetLang) => {
    if (!text.trim()) return '';
    setError(null);
    setIsTranslating(true);
    try {
      // [FUTURE API] Replace placeholderTranslate with a real translation API call.
      const result = await placeholderTranslate(text, sourceLang, targetLang);
      if (!result) {
        setError('Translation service not yet connected.');
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
      return '';
    } finally {
      setIsTranslating(false);
    }
  };

  return { translate, isTranslating, error, setError };
}
