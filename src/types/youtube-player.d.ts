declare namespace YT {
  export interface Player {
    destroy(): void;
    loadVideoById(videoId: string): void;
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    getCurrentTime(): number;
    getDuration(): number;
    getPlayerState(): PlayerState;
  }

  export enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
  }

  export interface PlayerOptions {
    videoId: string;
    width?: string | number;
    height?: string | number;
    playerVars?: PlayerVars;
    events?: Events;
  }

  export interface PlayerVars {
    autoplay?: 0 | 1;
    controls?: 0 | 1;
    modestbranding?: 0 | 1;
    rel?: 0 | 1;
    showinfo?: 0 | 1;
    iv_load_policy?: 1 | 3;
    start?: number;
    end?: number;
    loop?: 0 | 1;
    playlist?: string;
  }

  export interface Events {
    onReady?: (event: PlayerEvent) => void;
    onStateChange?: (event: OnStateChangeEvent) => void;
    onError?: (event: OnErrorEvent) => void;
    onPlaybackQualityChange?: (event: PlayerEvent) => void;
    onPlaybackRateChange?: (event: PlayerEvent) => void;
  }

  export interface PlayerEvent {
    target: Player;
    data: unknown;
  }

  export interface OnStateChangeEvent extends PlayerEvent {
    data: PlayerState;
  }

  export interface OnErrorEvent extends PlayerEvent {
    data: number;
  }

  export class Player {
    constructor(element: HTMLElement | string, options: PlayerOptions);
  }
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT: typeof YT;
  }
}

export {};
