import type { Language } from './types';

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English',    nativeName: 'English',    bcp47: 'en-US' },
  { code: 'fr', name: 'French',     nativeName: 'Français',   bcp47: 'fr-FR' },
  { code: 'ar', name: 'Arabic',     nativeName: 'العربية',     bcp47: 'ar-SA' },
  { code: 'zh', name: 'Chinese',    nativeName: '中文',        bcp47: 'zh-CN' },
  { code: 'ja', name: 'Japanese',   nativeName: '日本語',      bcp47: 'ja-JP' },
  { code: 'ru', name: 'Russian',    nativeName: 'Русский',     bcp47: 'ru-RU' },
  { code: 'es', name: 'Spanish',    nativeName: 'Español',     bcp47: 'es-ES' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português',   bcp47: 'pt-BR' },
  { code: 'de', name: 'German',     nativeName: 'Deutsch',     bcp47: 'de-DE' },
  { code: 'it', name: 'Italian',    nativeName: 'Italiano',    bcp47: 'it-IT' },
  { code: 'ko', name: 'Korean',     nativeName: '한국어',       bcp47: 'ko-KR' },
  { code: 'hi', name: 'Hindi',      nativeName: 'हिन्दी',       bcp47: 'hi-IN' },
  { code: 'tr', name: 'Turkish',    nativeName: 'Türkçe',      bcp47: 'tr-TR' },
];

export const DEFAULT_SOURCE_LANG = LANGUAGES[0];
export const DEFAULT_TARGET_LANG = LANGUAGES[1];
