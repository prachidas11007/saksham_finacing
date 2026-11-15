import * as Speech from "expo-speech";
import {
  hasVoiceForLanguage,
  mapSpeechLanguage,
  speakText,
  splitIntoChunks,
  stopSpeech,
} from "../speech";

jest.mock("expo-speech", () => ({
  maxSpeechInputLength: 200,
  getAvailableVoicesAsync: jest.fn(),
  speak: jest.fn(),
  stop: jest.fn(),
  isSpeakingAsync: jest.fn(),
}));

describe("speech utility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("mapSpeechLanguage", () => {
    it("maps en to en-IN", () => {
      expect(mapSpeechLanguage("en")).toBe("en-IN");
    });

    it("maps hi to hi-IN", () => {
      expect(mapSpeechLanguage("hi")).toBe("hi-IN");
    });

    it("maps mr to mr-IN", () => {
      expect(mapSpeechLanguage("mr")).toBe("mr-IN");
    });

    it("falls back to en-IN for unknown codes", () => {
      expect(mapSpeechLanguage("fr")).toBe("en-IN");
    });
  });

  describe("splitIntoChunks", () => {
    it("returns empty array for empty or whitespace text", () => {
      expect(splitIntoChunks("", 100)).toEqual([]);
      expect(splitIntoChunks("   ", 100)).toEqual([]);
    });

    it("returns single chunk when text fits within limit", () => {
      const text = "Short sentence.";
      expect(splitIntoChunks(text, 100)).toEqual([text]);
    });

    it("splits long text into multiple chunks under the limit", () => {
      const s1 = "This is the first sentence about banking in India.";
      const s2 = "This is the second sentence explaining savings clearly.";
      const s3 = "This is the third sentence warning about digital fraud.";
      const combined = `${s1} ${s2} ${s3}`;

      const chunks = splitIntoChunks(combined, 70);
      expect(chunks.length).toBeGreaterThan(1);
      for (const chunk of chunks) {
        expect(chunk.length).toBeLessThanOrEqual(70);
      }
    });
  });

  describe("hasVoiceForLanguage", () => {
    it("returns false if getAvailableVoicesAsync returns empty list", async () => {
      (Speech.getAvailableVoicesAsync as jest.Mock).mockResolvedValue([]);
      const result = await hasVoiceForLanguage("hi");
      expect(result).toBe(false);
    });

    it("returns true when matching language voice exists", async () => {
      (Speech.getAvailableVoicesAsync as jest.Mock).mockResolvedValue([
        { identifier: "hi-voice", language: "hi-IN", name: "Hindi Voice" },
      ]);
      const result = await hasVoiceForLanguage("hi");
      expect(result).toBe(true);
    });

    it("returns false when language is missing from available voices", async () => {
      (Speech.getAvailableVoicesAsync as jest.Mock).mockResolvedValue([
        { identifier: "en-voice", language: "en-US", name: "English Voice" },
      ]);
      const result = await hasVoiceForLanguage("mr");
      expect(result).toBe(false);
    });
  });

  describe("speakText", () => {
    it("returns noVoice when no voice is available", async () => {
      (Speech.getAvailableVoicesAsync as jest.Mock).mockResolvedValue([]);
      const result = await speakText("Hello", "hi");
      expect(result).toBe("noVoice");
      expect(Speech.speak).not.toHaveBeenCalled();
    });

    it("initiates speech when voice is available", async () => {
      (Speech.getAvailableVoicesAsync as jest.Mock).mockResolvedValue([
        { identifier: "en-voice", language: "en-IN", name: "English Voice" },
      ]);
      const onStart = jest.fn();

      const result = await speakText("Hello world.", "en", { onStart });
      expect(result).toBe("speaking");
      expect(onStart).toHaveBeenCalled();
      expect(Speech.speak).toHaveBeenCalledWith(
        "Hello world.",
        expect.objectContaining({
          language: "en-IN",
        }),
      );
    });

    it("stops speech via stopSpeech", async () => {
      (Speech.stop as jest.Mock).mockResolvedValue(undefined);
      await stopSpeech();
      expect(Speech.stop).toHaveBeenCalled();
    });
  });
});

