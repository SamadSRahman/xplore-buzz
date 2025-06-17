// HLS utility functions for handling HTTP Live Streaming

export function isHLSSupported() {
  if (typeof window === 'undefined') return false;
  
  const video = document.createElement('video');
  return video.canPlayType('application/vnd.apple.mpegurl') !== '';
}

export function loadHLSPlayer(videoElement, src) {
  if (!videoElement) return null;
  
  // Check for native HLS support (Safari)
  if (isHLSSupported()) {
    videoElement.src = src;
    return null;
  }
  
  // For other browsers, we would use hls.js
  // This is a placeholder implementation
  if (typeof window !== 'undefined' && window.Hls) {
    if (window.Hls.isSupported()) {
      const hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      
      hls.loadSource(src);
      hls.attachMedia(videoElement);
      
      hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest loaded');
      });
      
      hls.on(window.Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
        if (data.fatal) {
          switch (data.type) {
            case window.Hls.ErrorTypes.NETWORK_ERROR:
              console.log('Network error, trying to recover...');
              hls.startLoad();
              break;
            case window.Hls.ErrorTypes.MEDIA_ERROR:
              console.log('Media error, trying to recover...');
              hls.recoverMediaError();
              break;
            default:
              console.log('Fatal error, destroying HLS instance');
              hls.destroy();
              break;
          }
        }
      });
      
      return hls;
    }
  }
  
  // Fallback to regular video
  videoElement.src = src;
  return null;
}

export function destroyHLSPlayer(hls) {
  if (hls && typeof hls.destroy === 'function') {
    hls.destroy();
  }
}

export function validateHLSManifest(manifestContent) {
  if (!manifestContent) return false;
  
  // Basic validation for HLS manifest
  const lines = manifestContent.split('\n');
  const hasHeader = lines[0].trim() === '#EXTM3U';
  const hasVersion = lines.some(line => line.startsWith('#EXT-X-VERSION'));
  
  return hasHeader && hasVersion;
}

export function parseHLSManifest(manifestContent) {
  const lines = manifestContent.split('\n').map(line => line.trim());
  const segments = [];
  let duration = 0;
  let currentSegmentDuration = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('#EXTINF:')) {
      // Extract segment duration
      const match = line.match(/#EXTINF:([\d.]+)/);
      if (match) {
        currentSegmentDuration = parseFloat(match[1]);
        duration += currentSegmentDuration;
      }
    } else if (line && !line.startsWith('#')) {
      // This is a segment file
      segments.push({
        url: line,
        duration: currentSegmentDuration
      });
    }
  }
  
  return {
    duration,
    segments,
    segmentCount: segments.length
  };
}

export function getHLSQualityLevels(hls) {
  if (!hls || !hls.levels) return [];
  
  return hls.levels.map((level, index) => ({
    index,
    width: level.width,
    height: level.height,
    bitrate: level.bitrate,
    name: `${level.height}p`
  }));
}

export function setHLSQuality(hls, qualityIndex) {
  if (!hls) return;
  
  if (qualityIndex === -1) {
    // Auto quality
    hls.currentLevel = -1;
  } else {
    hls.currentLevel = qualityIndex;
  }
}

// Utility to format HLS errors for user display
export function formatHLSError(error) {
  if (!error) return 'Unknown error';
  
  switch (error.type) {
    case 'networkError':
      return 'Network connection error. Please check your internet connection.';
    case 'mediaError':
      return 'Media playback error. The video format may not be supported.';
    case 'muxError':
      return 'Video encoding error. Please try a different video.';
    default:
      return error.details || 'Video playback error occurred.';
  }
}