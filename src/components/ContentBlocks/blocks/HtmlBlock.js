import React from 'react';
import { Box } from '@chakra-ui/react';

/**
 * Placeholder HTML block renderer. ST-03 will add DOMPurify sanitization.
 */
export const HtmlBlock = ({ block }) => {
  const html = block?.payload?.html ?? block?.payload?.content ?? '';

  if (!html) {
    return null;
  }

  return (
    <Box
      fontFamily="Space Mono"
      fontSize="md"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
