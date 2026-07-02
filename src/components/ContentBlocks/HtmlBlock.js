import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import DOMPurify from 'dompurify';

export const HtmlBlock = ({ payload }) => {
  const rawHtml = payload?.html || payload?.content || '';

  if (!rawHtml) {
    return (
      <Text fontFamily="Space Mono" fontSize="sm" color="gray.400">
        HTML content unavailable.
      </Text>
    );
  }

  const sanitizedHtml = DOMPurify.sanitize(rawHtml, {
    USE_PROFILES: { html: true }
  });

  if (!sanitizedHtml.trim()) {
    return (
      <Text fontFamily="Space Mono" fontSize="sm" color="gray.400">
        HTML content unavailable.
      </Text>
    );
  }

  return (
    <Box
      className="html-block"
      fontFamily="Space Mono"
      fontSize={{ base: 'sm', md: 'md' }}
      sx={{
        '& h1, & h2, & h3, & h4': { marginTop: '1rem', marginBottom: '0.5rem' },
        '& p': { marginBottom: '0.75rem' },
        '& a': { color: 'teal.300', textDecoration: 'underline' }
      }}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};
