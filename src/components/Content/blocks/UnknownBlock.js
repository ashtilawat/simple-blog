import React from 'react';
import { Text } from '@chakra-ui/react';

export function UnknownBlock({ block }) {
  return (
    <Text fontFamily="Space Mono" color="gray.500" fontSize="sm">
      Unsupported content block type: {block.type}
    </Text>
  );
}
