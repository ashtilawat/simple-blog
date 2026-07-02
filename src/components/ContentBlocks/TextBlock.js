import React from 'react';
import { Text } from '@chakra-ui/react';

export const TextBlock = ({ payload }) => {
  const content = payload?.text || payload?.content || '';

  if (!content) {
    return (
      <Text fontFamily="Space Mono" fontSize="sm" color="gray.400">
        Text content unavailable.
      </Text>
    );
  }

  return (
    <Text fontFamily="Space Mono" fontSize={{ base: 'sm', md: 'md' }} whiteSpace="pre-wrap">
      {content}
    </Text>
  );
};
