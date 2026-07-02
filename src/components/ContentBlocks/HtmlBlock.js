import React, { useMemo } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { prepareHtmlBlockContent } from '../../utils/sanitizeHtml';

const DEFAULT_FALLBACK = 'Content unavailable';

function resolveHtmlContent(html, block) {
  if (typeof html === 'string') {
    return html;
  }

  return block?.payload?.html ?? block?.payload?.content ?? '';
}

export const HtmlBlock = ({ html, block, fallbackMessage = DEFAULT_FALLBACK }) => {
  const htmlContent = resolveHtmlContent(html, block);

  const { sanitized, isRenderable } = useMemo(() => {
    const { sanitized: cleaned, renderable } = prepareHtmlBlockContent(htmlContent);
    return {
      sanitized: cleaned,
      isRenderable: renderable
    };
  }, [htmlContent]);

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
