import React from 'react';
import { Stack } from '@chakra-ui/react';
import { BLOCK_TYPES, sortBlocksByOrder } from '../../types/content';
import { TextBlock } from './blocks/TextBlock';
import { HtmlBlock } from './blocks/HtmlBlock';
import { VideoBlock } from './blocks/VideoBlock';
import { UnknownBlock } from './UnknownBlock';

const BLOCK_COMPONENTS = {
  [BLOCK_TYPES.TEXT]: TextBlock,
  [BLOCK_TYPES.HTML]: HtmlBlock,
  [BLOCK_TYPES.VIDEO]: VideoBlock
};

function getBlockKey(block, index) {
  if (block?.id) {
    return block.id;
  }

  return `${block?.type ?? 'block'}-${index}`;
}

/**
 * Renders a single content block by dispatching on block.type.
 */
export const ContentBlockRenderer = ({ block }) => {
  if (!block || typeof block.type !== 'string') {
    return <UnknownBlock block={block} />;
  }

  const BlockComponent = BLOCK_COMPONENTS[block.type] ?? UnknownBlock;

  return <BlockComponent block={block} />;
};

/**
 * Renders an ordered list of content blocks for a CMS item.
 */
export const ContentBlocksRenderer = ({ blocks }) => {
  const orderedBlocks = sortBlocksByOrder(blocks);

  if (orderedBlocks.length === 0) {
    return null;
  }

  return (
    <Stack spacing={6} width="100%" data-testid="content-blocks-renderer">
      {orderedBlocks.map((block, index) => (
        <ContentBlockRenderer key={getBlockKey(block, index)} block={block} />
      ))}
    </Stack>
  );
};
