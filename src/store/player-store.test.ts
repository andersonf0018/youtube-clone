import { describe, it, expect, beforeEach } from "vitest";
import { usePlayerStore } from "./player-store";

describe("usePlayerStore", () => {
  beforeEach(() => {
    usePlayerStore.getState().reset();
  });

  it("should have correct initial state", () => {
    const state = usePlayerStore.getState();

    expect(state.currentVideoId).toBe(null);
    expect(state.isPlaying).toBe(false);
    expect(state.volume).toBe(0.8);
    expect(state.isMuted).toBe(false);
    expect(state.playbackRate).toBe(1.0);
  });

  it("should set current video ID and auto-play", () => {
    const { setCurrentVideoId } = usePlayerStore.getState();

    setCurrentVideoId("test-video-123");

    const state = usePlayerStore.getState();
    expect(state.currentVideoId).toBe("test-video-123");
    expect(state.isPlaying).toBe(true);
  });

  it("should toggle play/pause", () => {
    const { togglePlayPause } = usePlayerStore.getState();

    togglePlayPause();
    expect(usePlayerStore.getState().isPlaying).toBe(true);

    togglePlayPause();
    expect(usePlayerStore.getState().isPlaying).toBe(false);
  });

  it("should set volume within valid range", () => {
    const { setVolume } = usePlayerStore.getState();

    setVolume(0.5);
    expect(usePlayerStore.getState().volume).toBe(0.5);

    setVolume(1.5);
    expect(usePlayerStore.getState().volume).toBe(1);

    setVolume(-0.5);
    expect(usePlayerStore.getState().volume).toBe(0);
  });

  it("should auto-mute when volume is set to 0", () => {
    const { setVolume } = usePlayerStore.getState();

    setVolume(0);

    const state = usePlayerStore.getState();
    expect(state.volume).toBe(0);
    expect(state.isMuted).toBe(true);
  });

  it("should toggle mute", () => {
    const { toggleMute } = usePlayerStore.getState();

    toggleMute();
    expect(usePlayerStore.getState().isMuted).toBe(true);

    toggleMute();
    expect(usePlayerStore.getState().isMuted).toBe(false);
  });

  it("should set playback rate", () => {
    const { setPlaybackRate } = usePlayerStore.getState();

    setPlaybackRate(1.5);
    expect(usePlayerStore.getState().playbackRate).toBe(1.5);

    setPlaybackRate(2.0);
    expect(usePlayerStore.getState().playbackRate).toBe(2.0);
  });

  it("should reset to default state", () => {
    const { setCurrentVideoId, setVolume, toggleMute, setPlaybackRate, reset } =
      usePlayerStore.getState();

    setCurrentVideoId("test-video");
    setVolume(0.3);
    toggleMute();
    setPlaybackRate(1.5);

    reset();

    const state = usePlayerStore.getState();
    expect(state.currentVideoId).toBe(null);
    expect(state.isPlaying).toBe(false);
    expect(state.volume).toBe(0.8);
    expect(state.isMuted).toBe(false);
    expect(state.playbackRate).toBe(1.0);
  });
});
