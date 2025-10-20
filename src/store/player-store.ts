import { create } from "zustand";

interface PlayerState {
  currentVideoId: string | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  playbackRate: number;

  setCurrentVideoId: (videoId: string | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  setIsMuted: (isMuted: boolean) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  reset: () => void;
}

const DEFAULT_VOLUME = 0.8;
const DEFAULT_PLAYBACK_RATE = 1.0;

export const usePlayerStore = create<PlayerState>((set) => ({
  currentVideoId: null,
  isPlaying: false,
  volume: DEFAULT_VOLUME,
  isMuted: false,
  playbackRate: DEFAULT_PLAYBACK_RATE,

  setCurrentVideoId: (videoId) =>
    set(() => ({
      currentVideoId: videoId,
      isPlaying: videoId !== null,
    })),

  setIsPlaying: (isPlaying) =>
    set(() => ({
      isPlaying,
    })),

  togglePlayPause: () =>
    set((state) => ({
      isPlaying: !state.isPlaying,
    })),

  setVolume: (volume) =>
    set(() => ({
      volume: Math.max(0, Math.min(1, volume)),
      isMuted: volume === 0,
    })),

  setIsMuted: (isMuted) =>
    set(() => ({
      isMuted,
    })),

  toggleMute: () =>
    set((state) => ({
      isMuted: !state.isMuted,
    })),

  setPlaybackRate: (rate) =>
    set(() => ({
      playbackRate: rate,
    })),

  reset: () =>
    set(() => ({
      currentVideoId: null,
      isPlaying: false,
      volume: DEFAULT_VOLUME,
      isMuted: false,
      playbackRate: DEFAULT_PLAYBACK_RATE,
    })),
}));
