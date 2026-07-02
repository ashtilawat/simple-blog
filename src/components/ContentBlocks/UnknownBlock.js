import React from 'react';
import { Text } from '@chakra-ui/react';

export const UnknownBlock = ({ block }) => {
  const blockType = block?.type ?? 'unknown';

  return (
    <Text
      fontFamily="Space Mono"
      fontSize="sm"
      color="gray.400"
      role="status"
      data-testid="unknown-block-fallback"
    >
      This content block type is not supported ({blockType}).
    </Text>
  );
};
