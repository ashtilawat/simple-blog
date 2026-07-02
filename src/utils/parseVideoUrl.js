/**
 * Parses a video URL and returns embed metadata for supported providers.
 *
 * @param {string} url - Raw video URL from a content block.
 * @returns {{ type: 'youtube' | 'vimeo' | 'mp4', embedUrl?: string, src?: string } | null}
 */
export function parseVideoUrl(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return null;
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, '');

  const youtubeId = getYouTubeVideoId(host, parsed);
  if (youtubeId) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${youtubeId}`
    };
  }

  const vimeoId = getVimeoVideoId(host, parsed);
  if (vimeoId) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoId}`
    };
  }

  if (isDirectMp4Url(parsed)) {
    return {
      type: 'mp4',
      src: trimmed
    };
  }

  return null;
}

function getYouTubeVideoId(host, parsed) {
  const youtubeHosts = ['youtube.com', 'm.youtube.com', 'music.youtube.com'];

  if (youtubeHosts.includes(host)) {
    if (parsed.pathname === '/watch') {
      return normalizeYouTubeId(parsed.searchParams.get('v'));
    }

    if (parsed.pathname.startsWith('/embed/')) {
      return normalizeYouTubeId(parsed.pathname.split('/')[2]);
    }

    if (parsed.pathname.startsWith('/shorts/')) {
      return normalizeYouTubeId(parsed.pathname.split('/')[2]);
    }

    return null;
  }

  if (host === 'youtu.be') {
    return normalizeYouTubeId(parsed.pathname.slice(1).split('/')[0]);
  }

  return null;
}

function normalizeYouTubeId(videoId) {
  if (!videoId || !/^[\w-]{11}$/.test(videoId)) {
    return null;
  }

  return videoId;
}

function getVimeoVideoId(host, parsed) {
  if (host === 'vimeo.com') {
    const segments = parsed.pathname.split('/').filter(Boolean);
    const videoId = segments[0];
    return normalizeVimeoId(videoId);
  }

  if (host === 'player.vimeo.com') {
    const segments = parsed.pathname.split('/').filter(Boolean);
    if (segments[0] === 'video') {
      return normalizeVimeoId(segments[1]);
    }
  }

  return null;
}

function normalizeVimeoId(videoId) {
  if (!videoId || !/^\d+$/.test(videoId)) {
    return null;
  }

  return videoId;
}

function isDirectMp4Url(parsed) {
  return /\.mp4(\?.*)?$/i.test(`${parsed.pathname}${parsed.search}`);
}
