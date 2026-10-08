import { useCallback, useRef, useState } from 'react';

const TTS_ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`;
const DEFAULT_VOICE_ID = 'pqHfZKP75CvOlQylNhV4';

interface TTSParams {
  text: string;
  voiceId?: string;
}

export function useElevenLabsTTS() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsLoading(false);
  }, []);

  const speak = useCallback(async (params: TTSParams): Promise<boolean> => {
    setError(null);

    if (!params.text.trim()) {
      return false;
    }

    stop();

    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);

    try {
      const response = await fetch(TTS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          text: params.text,
          voiceId: params.voiceId || DEFAULT_VOICE_ID,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        let message = `TTS request failed (${response.status})`;
        try {
          const body = await response.json();
          if (body?.error) message = body.error;
        } catch {
          // keep default message
        }
        setError(message);
        return false;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      if (controller.signal.aborted) {
        URL.revokeObjectURL(url);
        return false;
      }

      const audio = new Audio(url);
      audioRef.current = audio;

      await new Promise<void>((resolve, reject) => {
        audio.onended = () => resolve();
        audio.onerror = () => reject(new Error('Audio playback failed'));
        audio.play().catch(reject);
      });

      URL.revokeObjectURL(url);
      audioRef.current = null;
      return true;
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return false;
      }
      setError(err instanceof Error ? err.message : 'Unknown TTS error');
      return false;
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [stop]);

  const replay = useCallback((audioUrl: string) => {
    stop();
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.play().catch(() => {
      setError('Could not replay audio');
    });
  }, [stop]);

  return { speak, stop, replay, isLoading, error, setError };
}
