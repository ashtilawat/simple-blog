import React from 'react';
import { Box } from '@chakra-ui/react';

function stripScripts(html) {
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

export function HtmlBlock({ block }) {
  const html = block.content || block.html || '';

  if (!html.trim()) {
    return null;
  }

  return (
    <Box
      fontFamily="Space Mono"
      className="html-block"
      dangerouslySetInnerHTML={{ __html: stripScripts(html) }}
    />
  );
}
