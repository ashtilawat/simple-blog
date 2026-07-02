import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { TextBlock } from './blocks/TextBlock';
import { HtmlBlock } from './blocks/HtmlBlock';
import { VideoBlock } from './blocks/VideoBlock';
import { UnknownBlock } from './blocks/UnknownBlock';

const BLOCK_COMPONENTS = {
  text: TextBlock,
  html: HtmlBlock,
  video: VideoBlock
};

export function ContentBlockRenderer({ blocks }) {
  if (!blocks?.length) {
    return (
      <Text fontFamily="Space Mono" color="gray.500">
        No displayable content for this item.
      </Text>
    );
  }

  const sortedBlocks = [...blocks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <Box>
      {sortedBlocks.map((block, index) => {
        const BlockComponent = BLOCK_COMPONENTS[block.type] || UnknownBlock;

        return (
          <Box
            key={`${block.type}-${block.order ?? index}`}
            mb={6}
            data-testid={`content-block-${block.type}`}
          >
            <BlockComponent block={block} />
          </Box>
        );
      })}
    </Box>
  );
}
