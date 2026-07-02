import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { HtmlBlock } from './HtmlBlock';
import { TextBlock } from './TextBlock';
import { VideoBlock } from './VideoBlock';

const BLOCK_COMPONENTS = {
  text: TextBlock,
  html: HtmlBlock,
  video: VideoBlock
};

export const ContentBlockRenderer = ({ block }) => {
  if (!block || !block.type) {
    return null;
  }

  const BlockComponent = BLOCK_COMPONENTS[block.type];

  if (!BlockComponent) {
    return (
      <Text fontFamily="Space Mono" fontSize="sm" color="gray.500">
        Unsupported content block type: {block.type}
      </Text>
    );
  }

  return (
    <Box mb={6}>
      <BlockComponent payload={block.payload || {}} />
    </Box>
  );
};

export const ContentBlocks = ({ blocks }) => {
  if (!blocks || blocks.length === 0) {
    return (
      <Text fontFamily="Space Mono" fontSize="sm" color="gray.400">
        No displayable content for this item.
      </Text>
    );
  }

  const displayableBlocks = blocks.filter((block) => BLOCK_COMPONENTS[block.type]);

  if (displayableBlocks.length === 0) {
    return (
      <Text fontFamily="Space Mono" fontSize="sm" color="gray.400">
        No displayable content for this item.
      </Text>
    );
  }

  return (
    <>
      {blocks.map((block, index) => (
        <ContentBlockRenderer key={`${block.type}-${index}`} block={block} />
      ))}
    </>
  );
};
