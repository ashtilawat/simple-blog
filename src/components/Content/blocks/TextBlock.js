import React from 'react';
import { Text } from '@chakra-ui/react';

export function TextBlock({ block }) {
  return (
    <Text fontFamily="Space Mono" whiteSpace="pre-wrap">
      {block.content || block.text || ''}
    </Text>
  );
}
