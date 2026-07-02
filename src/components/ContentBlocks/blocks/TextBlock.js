import React from 'react';
import { Text } from '@chakra-ui/react';

/**
 * Placeholder text block renderer. ST-05 will expand typography and markdown support.
 */
export const TextBlock = ({ block }) => {
  const content =
    block?.payload?.text ?? block?.payload?.content ?? block?.payload?.body ?? '';

  if (!content) {
    return null;
  }

  return (
    <Text fontFamily="Space Mono" fontSize="md" whiteSpace="pre-wrap">
      {content}
    </Text>
  );
};
