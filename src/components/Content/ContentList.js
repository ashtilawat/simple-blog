import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  AlertIcon,
  Box,
  Divider,
  Heading,
  Link,
  Spinner,
  Stack,
  Text
} from '@chakra-ui/react';
import { useContentItems } from '../../hooks/useContentItems';

export function ContentList() {
  const { items, loading, error } = useContentItems();

  return (
    <Box className="content">
      <Divider />
      <Heading as="h2" size="md" fontFamily="Space Mono" mb={4} mt={4}>
        Articles
      </Heading>

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

      {!loading && !error && items.length === 0 && (
        <Text fontFamily="Space Mono" color="gray.500">
          No published content available.
        </Text>
      )}

      {!loading && !error && items.length > 0 && (
        <Stack spacing={3} as="ul" listStyleType="none" m={0} p={0}>
          {items.map((item) => (
            <Box as="li" key={item.id}>
              <Link
                as={RouterLink}
                to={`/content/${item.id}`}
                fontFamily="Space Mono"
                fontSize="lg"
                data-testid={`content-list-item-${item.id}`}
              >
                {item.title}
              </Link>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}
