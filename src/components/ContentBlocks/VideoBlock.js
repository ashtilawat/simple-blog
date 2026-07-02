import React from 'react';
import { AspectRatio, Box, Text } from '@chakra-ui/react';

function parseVideoUrl(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const trimmedUrl = url.trim();

  const youtubeMatch = trimmedUrl.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
  );
  if (youtubeMatch) {
    return {
      kind: 'embed',
      src: `https://www.youtube.com/embed/${youtubeMatch[1]}`
    };
  }

  const vimeoMatch = trimmedUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return {
      kind: 'embed',
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}`
    };
  }

  if (/\.mp4($|\?)/i.test(trimmedUrl)) {
    return {
      kind: 'mp4',
      src: trimmedUrl
    };
  }

  return null;
}

export const VideoBlock = ({ payload }) => {
  const parsed = parseVideoUrl(payload?.url || payload?.src);

  if (!parsed) {
    return (
      <Text fontFamily="Space Mono" fontSize="sm" color="gray.400">
        Video unavailable.
      </Text>
    );
  }

  if (parsed.kind === 'mp4') {
    return (
      <Box width="100%">
        <video controls width="100%" src={parsed.src}>
          Your browser does not support the video tag.
        </video>
      </Box>
    );
  }

  return (
    <AspectRatio ratio={16 / 9} width="100%">
      <iframe
        src={parsed.src}
        title="Embedded video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </AspectRatio>
  );
};
