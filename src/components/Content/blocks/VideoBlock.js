import React from 'react';
import { AspectRatio, Box, Text } from '@chakra-ui/react';

function getEmbedUrl(url) {
  if (!url) {
    return null;
  }

  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
  );
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  if (/\.mp4(\?|$)/i.test(url)) {
    return url;
  }

  return null;
}

export function VideoBlock({ block }) {
  const sourceUrl = block.url || block.videoUrl || '';
  const embedUrl = getEmbedUrl(sourceUrl);

  if (!embedUrl) {
    return (
      <Text fontFamily="Space Mono" color="gray.400">
        Video unavailable
      </Text>
    );
  }

  if (/\.mp4(\?|$)/i.test(embedUrl)) {
    return (
      <Box maxW="100%" overflow="hidden">
        <video controls style={{ maxWidth: '100%' }} src={embedUrl}>
          <track kind="captions" />
        </video>
      </Box>
    );
  }

  return (
    <AspectRatio ratio={16 / 9} maxW="100%">
      <iframe
        title={block.title || 'Embedded video'}
        src={embedUrl}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </AspectRatio>
  );
}
