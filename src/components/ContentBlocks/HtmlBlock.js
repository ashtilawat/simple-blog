import React, { useMemo } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { prepareHtmlBlockContent } from '../../utils/sanitizeHtml';

const DEFAULT_FALLBACK = 'Content unavailable';

export const HtmlBlock = ({ html, fallbackMessage = DEFAULT_FALLBACK }) => {
  const { sanitized, isRenderable } = useMemo(() => {
    const { sanitized: cleaned, renderable } = prepareHtmlBlockContent(html);
    return {
      sanitized: cleaned,
      isRenderable: renderable
    };
  }, [html]);

  if (!isRenderable) {
    return (
      <Box
        className="html-block html-block--fallback"
        width="90%"
        my={4}
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        role="alert"
      >
        <Text fontFamily="Space Mono" fontSize="sm" color="gray.400">
          {fallbackMessage}
        </Text>
      </Box>
    );
  }

  return (
    <Box
      className="html-block"
      width="90%"
      my={4}
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
};
