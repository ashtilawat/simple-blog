import React from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Heading,
  Spinner,
  Text,
  VStack
} from '@chakra-ui/react';
import { useContentItems } from '../../hooks/useContentItems';

export const DynamicContentList = () => {
  const { items, loading, error, retry } = useContentItems();

  if (loading) {
    return (
      <Box className="dynamic-content" py={6} textAlign="center">
        <Spinner size="lg" thickness="3px" speed="0.65s" color="yellow.400" />
        <Text fontFamily="Space Mono" mt={4} fontSize="sm">
          Loading content...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="dynamic-content" py={4}>
        <Alert status="error" borderRadius="md" flexDirection="column" alignItems="flex-start">
          <Box display="flex" alignItems="center" mb={2}>
            <AlertIcon />
            <AlertTitle fontFamily="Space Mono" fontSize="sm">
              Unable to load content
            </AlertTitle>
          </Box>
          <AlertDescription fontFamily="Space Mono" fontSize="sm" mb={3}>
            {error}
          </AlertDescription>
          <Button size="sm" fontFamily="Space Mono" onClick={retry}>
            Retry
          </Button>
        </Alert>
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box className="dynamic-content" py={4}>
        <Text fontFamily="Space Mono" fontSize="sm" color="gray.400">
          No published content available.
        </Text>
      </Box>
    );
  }

  return (
    <Box className="dynamic-content" py={4}>
      <Heading as="h2" size="md" fontFamily="Space Mono" mb={4}>
        Articles
      </Heading>
      <VStack align="stretch" spacing={3}>
        {items.map((item) => (
          <Box
            key={item.id}
            borderWidth="1px"
            borderRadius="lg"
            p={3}
            data-content-id={item.id}
            data-block-count={item.blocks.length}
          >
            <Text fontFamily="Space Mono" fontWeight="bold">
              {item.title}
            </Text>
            <Text fontFamily="Space Mono" fontSize="xs" color="gray.400" mt={1}>
              {item.blocks.length} block{item.blocks.length === 1 ? '' : 's'}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};
