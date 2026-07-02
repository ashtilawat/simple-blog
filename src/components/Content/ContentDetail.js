import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Alert,
  AlertIcon,
  Box,
  Divider,
  Heading,
  Link,
  Spinner,
  Text
} from '@chakra-ui/react';
import { ContentBlocksRenderer } from '../../components/ContentBlocks/ContentBlockRenderer';
import { useContentItems } from '../../hooks/useContentItems';

export function ContentDetail() {
  const { id } = useParams();
  const { items, loading, error } = useContentItems();

  const item = items.find((contentItem) => contentItem.id === id || contentItem.slug === id);

  return (
    <Box className="content">
      <Divider />
      <Link
        as={RouterLink}
        to="/content"
        fontFamily="Space Mono"
        fontSize="sm"
        display="inline-block"
        mt={4}
        mb={4}
      >
        Back to articles
      </Link>

      {loading && (
        <Box py={8} textAlign="center">
          <Spinner size="lg" />
          <Text fontFamily="Space Mono" mt={4}>
            Loading content...
          </Text>
        </Box>
      )}

      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {!loading && !error && !item && (
        <Text fontFamily="Space Mono" color="gray.500">
          Content item not found.
        </Text>
      )}

      {!loading && !error && item && (
        <Box data-testid="content-detail">
          <Heading as="h2" size="lg" fontFamily="Space Mono" mb={6}>
            {item.title}
          </Heading>
          <ContentBlocksRenderer blocks={item.blocks} />
        </Box>
      )}
    </Box>
  );
}
