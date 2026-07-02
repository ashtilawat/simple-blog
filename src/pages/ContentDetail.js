import React from 'react';
import {
  Box,
  Button,
  Divider,
  Heading,
  Spinner,
  Text,
  VStack
} from '@chakra-ui/react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { ContentBlocksRenderer } from '../components/ContentBlocks/ContentBlockRenderer';
import { useContentItem } from '../hooks/useContentItem';

export const ContentDetail = () => {
  const { id } = useParams();
  const { item, loading, error, reload } = useContentItem(id);

  return (
    <Box className="content">
      <Divider />
      <Button
        as={RouterLink}
        to="/content"
        variant="ghost"
        size="sm"
        fontFamily="Space Mono"
        mb={4}
        alignSelf="flex-start"
      >
        Back to Articles
      </Button>

      {loading && (
        <Box display="flex" alignItems="center" gap={3}>
          <Spinner size="sm" />
          <Text fontFamily="Space Mono" fontSize="sm">
            Loading article...
          </Text>
        </Box>
      )}

      {!loading && error && (
        <VStack align="stretch" spacing={3}>
          <Text fontFamily="Space Mono" fontSize="sm" color="red.300">
            {error}
          </Text>
          <Button fontFamily="Space Mono" size="sm" onClick={reload} alignSelf="flex-start">
            Retry
          </Button>
        </VStack>
      )}

      {!loading && !error && item && (
        <>
          <Heading as="h2" size="lg" fontFamily="Space Mono" mb={6}>
            {item.title}
          </Heading>
          <ContentBlocksRenderer blocks={item.blocks} />
        </>
      )}
    </Box>
  );
};
