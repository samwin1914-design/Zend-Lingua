export interface Language {
  code: string;
  name: string;
  nativeName: string;
  bcp47: string;
}

export type ConversationDirection = 'source-to-target' | 'target-to-source';

export interface ConversationEntry {
  id: string;
  direction: ConversationDirection;
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: number;
  audioPlayed: boolean;
}

export type AppPhase =
  | 'idle'
  | 'listening'
  | 'translating'
  | 'speaking'
  | 'error';
