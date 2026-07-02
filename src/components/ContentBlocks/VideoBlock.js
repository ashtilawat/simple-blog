import React, { useMemo, useState } from 'react';
import { AspectRatio, Box, Text } from '@chakra-ui/react';
import { parseVideoUrl } from '../../utils/parseVideoUrl';

const FALLBACK_MESSAGE = 'Video unavailable';

const VideoFallback = () => (
  <Box
    w="100%"
    maxW="100%"
    borderWidth="1px"
    borderRadius="md"
    p={6}
    textAlign="center"
    bg="gray.800"
    data-testid="video-fallback"
  >
    <Text fontFamily="Space Mono" color="gray.400">
      {FALLBACK_MESSAGE}
    </Text>
  </Box>
);

const ResponsiveEmbed = ({ title, src }) => (
  <Box w="100%" maxW="100%" overflow="hidden">
    <AspectRatio ratio={16 / 9} w="100%" maxW="100%">
      <Box
        as="iframe"
        title={title}
        src={src}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        border="0"
        w="100%"
        h="100%"
      />
    </AspectRatio>
  </Box>
);

const ResponsiveNativeVideo = ({ src, onError }) => (
  <Box w="100%" maxW="100%" overflow="hidden">
    <Box
      as="video"
      controls
      w="100%"
      maxW="100%"
      onError={onError}
      data-testid="native-video"
    >
      <source src={src} type="video/mp4" />
    </Box>
  </Box>
);

/**
 * Resolves a video URL from direct props or a typed content block payload.
 */
function resolveVideoUrl({ url, block }) {
  if (url) {
    return url;
  }

  if (!block) {
    return '';
  }

  return block.url ?? block.payload?.url ?? '';
}

export const VideoBlock = ({ url, block }) => {
  const [playbackFailed, setPlaybackFailed] = useState(false);
  const videoUrl = resolveVideoUrl({ url, block });

  const parsedVideo = useMemo(() => parseVideoUrl(videoUrl), [videoUrl]);

  if (!parsedVideo || playbackFailed) {
    return <VideoFallback />;
  }

  if (parsedVideo.type === 'mp4') {
    return (
      <ResponsiveNativeVideo
        src={parsedVideo.src}
        onError={() => setPlaybackFailed(true)}
      />
    );
  }

  return (
    <ResponsiveEmbed
      title={`${parsedVideo.type} video player`}
      src={parsedVideo.embedUrl}
    />
  );
};
