import * as Speech from "expo-speech";

export interface SpeechCallbacks {
  onStart?: () => void;
  onDone?: () => void;
  onStopped?: () => void;
  onError?: (error: unknown) => void;
}

export type SpeakResult = "speaking" | "noVoice";

export const SPEECH_LANGUAGE_MAP: Record<string, string> = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
};

export function mapSpeechLanguage(lang: string): string {
  return SPEECH_LANGUAGE_MAP[lang] ?? "en-IN";
}

export async function hasVoiceForLanguage(languageCode: string): Promise<boolean> {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    if (!voices || voices.length === 0) {
      return false;
    }
    const targetTag = mapSpeechLanguage(languageCode).toLowerCase();
    const prefix = targetTag.split("-")[0];

    return voices.some((v) => {
      if (!v || !v.language) return false;
      const voiceLang = v.language.toLowerCase().replace(/_/g, "-");
      return (
        voiceLang === targetTag ||
        voiceLang === prefix ||
        voiceLang.startsWith(`${prefix}-`)
      );
    });
  } catch (error) {
    if (__DEV__) {
      console.warn("hasVoiceForLanguage check error", error);
    }
    return false;
  }
}

export function splitIntoChunks(text: string, maxLength: number): string[] {
  if (!text || text.trim().length === 0) {
    return [];
  }
  const limit = Math.max(50, maxLength);
  if (text.length <= limit) {
    return [text.trim()];
  }

  const sentences = text
    .split(/(?<=[.।?!;\n])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if (sentence.length > limit) {
      if (current.length > 0) {
        chunks.push(current.trim());
        current = "";
      }
      const words = sentence.split(/\s+/);
      let wordChunk = "";
      for (const word of words) {
        if ((wordChunk + " " + word).trim().length <= limit) {
          wordChunk = (wordChunk + " " + word).trim();
        } else {
          if (wordChunk.length > 0) {
            chunks.push(wordChunk);
          }
          wordChunk = word;
        }
      }
      if (wordChunk.length > 0) {
        current = wordChunk;
      }
    } else if ((current + " " + sentence).trim().length <= limit) {
      current = (current + " " + sentence).trim();
    } else {
      if (current.length > 0) {
        chunks.push(current.trim());
      }
      current = sentence;
    }
  }

  if (current.trim().length > 0) {
    chunks.push(current.trim());
  }

  return chunks;
}

let currentSessionId = 0;
let isCurrentlySpeaking = false;
let activeCallbacks: SpeechCallbacks | null = null;

export function isSpeaking(): boolean {
  return isCurrentlySpeaking;
}

export async function stopSpeech(): Promise<void> {
  currentSessionId++;
  if (isCurrentlySpeaking) {
    isCurrentlySpeaking = false;
    const callbacks = activeCallbacks;
    activeCallbacks = null;
    try {
      await Speech.stop();
    } catch (error) {
      if (__DEV__) {
        console.warn("Speech.stop error", error);
      }
    }
    callbacks?.onStopped?.();
  }
}

export async function speakText(
  text: string,
  languageCode: string,
  callbacks?: SpeechCallbacks,
): Promise<SpeakResult> {
  await stopSpeech();

  const voiceAvailable = await hasVoiceForLanguage(languageCode);
  if (!voiceAvailable) {
    return "noVoice";
  }

  const mappedLanguage = mapSpeechLanguage(languageCode);
  const maxLength =
    typeof Speech.maxSpeechInputLength === "number" &&
    Speech.maxSpeechInputLength > 0
      ? Speech.maxSpeechInputLength
      : 500;

  const chunks = splitIntoChunks(text, maxLength);
  if (chunks.length === 0) {
    return "speaking";
  }

  const sessionId = ++currentSessionId;
  isCurrentlySpeaking = true;
  activeCallbacks = callbacks ?? null;
  callbacks?.onStart?.();

  let chunkIndex = 0;

  function speakNextChunk(): void {
    if (sessionId !== currentSessionId) {
      return;
    }
    if (chunkIndex >= chunks.length) {
      isCurrentlySpeaking = false;
      const cb = activeCallbacks;
      activeCallbacks = null;
      cb?.onDone?.();
      return;
    }

    const chunk = chunks[chunkIndex++];
    try {
      Speech.speak(chunk, {
        language: mappedLanguage,
        onDone: () => {
          if (sessionId === currentSessionId) {
            speakNextChunk();
          }
        },
        onStopped: () => {
          if (sessionId === currentSessionId) {
            isCurrentlySpeaking = false;
            const cb = activeCallbacks;
            activeCallbacks = null;
            cb?.onStopped?.();
          }
        },
        onError: (err: unknown) => {
          if (sessionId === currentSessionId) {
            isCurrentlySpeaking = false;
            const cb = activeCallbacks;
            activeCallbacks = null;
            cb?.onError?.(err);
          }
        },
      });
    } catch (err: unknown) {
      if (sessionId === currentSessionId) {
        isCurrentlySpeaking = false;
        const cb = activeCallbacks;
        activeCallbacks = null;
        cb?.onError?.(err);
      }
    }
  }

  speakNextChunk();
  return "speaking";
}

