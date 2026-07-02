import React from 'react';
import { Box, Text } from '@chakra-ui/react';

/**
 * Placeholder video block renderer. ST-04 will add embed URL parsing and responsive sizing.
 */
export const VideoBlock = ({ block }) => {
  const url = block?.payload?.url ?? block?.payload?.videoUrl ?? '';

  if (!url) {
    return (
      <Text fontFamily="Space Mono" fontSize="sm" color="gray.400">
        Video unavailable
      </Text>
    );
  }

  return (
    <Box as="figure" width="100%">
      <Box
        as="iframe"
        src={url}
        title={block?.payload?.title ?? 'Embedded video'}
        width="100%"
        height="315px"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </Box>
  );
};
