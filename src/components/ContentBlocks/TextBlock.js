import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const resolveContent = (content, text, block) => {
  if (typeof content === 'string') {
    return content;
  }
  if (typeof text === 'string') {
    return text;
  }
  if (block?.content) {
    return block.content;
  }
  if (block?.payload?.content) {
    return block.payload.content;
  }
  if (block?.payload?.text) {
    return block.payload.text;
  }
  return '';
};

export const TextBlock = ({ content, text, block }) => {
  const displayText = resolveContent(content, text, block);

  if (!displayText) {
    return null;
  }

  return (
    <Box
      className="text-block"
      width="100%"
      maxW={{ base: '100%', md: '90%' }}
      mx="auto"
      py={{ base: 3, md: 4 }}
      px={{ base: 4, md: 6 }}
    >
      <Text
        fontFamily="Space Mono"
        lineHeight="tall"
        whiteSpace="pre-wrap"
        wordBreak="break-word"
        overflowWrap="break-word"
        sx={{
          fontSize: 'sm',
          '@media screen and (min-width: 1300px)': {
            fontSize: 'md'
          }
        }}
      >
        {displayText}
      </Text>
    </Box>
  );
};
