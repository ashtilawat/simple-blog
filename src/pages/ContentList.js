import React from 'react';
import { Box, Button, Divider, Heading, Spinner, Text, VStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useContentItems } from '../hooks/useContentItems';

export const ContentList = () => {
  const { items, loading, error, reload } = useContentItems();

  return (
    <Box className="content">
      <Divider />
      <Heading as="h2" size="md" fontFamily="Space Mono" mb={4}>
        Articles
      </Heading>

      {loading && (
        <Box display="flex" alignItems="center" gap={3}>
          <Spinner size="sm" />
          <Text fontFamily="Space Mono" fontSize="sm">
            Loading content...
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

      {!loading && !error && items.length === 0 && (
        <Text fontFamily="Space Mono" fontSize="sm" color="gray.400">
          No published content yet.
        </Text>
      )}

      {!loading && !error && (
        <VStack align="stretch" spacing={3}>
          {items.map((item) => (
            <Button
              key={item.id}
              as={RouterLink}
              to={`/content/${item.id}`}
              variant="outline"
              justifyContent="flex-start"
              fontFamily="Space Mono"
              whiteSpace="normal"
              height="auto"
              py={3}
            >
              {item.title}
            </Button>
          ))}
        </VStack>
      )}
    </Box>
  );
};
