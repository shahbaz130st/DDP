export interface Channel {
    id: string;
    userId: string;
    channelName: string;
    streamKey: string;
    ingestEndpoint: string;
    playbackUrl: string;
    live: boolean;
}

export const VIDEO_CONFIG = {
    width: 1920,
    height: 1080,
    bitrate: 7500000,
    targetFrameRate: 60,
    keyframeInterval: 2,
    isBFrames: true,
    isAutoBitrate: true,
    maxBitrate: 8500000,
    minBitrate: 1500000,
} as const;
  
export const AUDIO_CONFIG = {
    bitrate: 128000,
} as const;
