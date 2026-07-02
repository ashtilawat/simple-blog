import DOMPurify from 'dompurify';

const SANITIZE_CONFIG = {
  USE_PROFILES: { html: true },
  ADD_ATTR: ['target', 'rel'],
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur']
};

let linkHookRegistered = false;

function registerLinkHook() {
  if (linkHookRegistered || typeof window === 'undefined') {
    return;
  }

  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });

  linkHookRegistered = true;
}

export function sanitizeHtml(html) {
  if (typeof html !== 'string') {
    return '';
  }

  registerLinkHook();
  return DOMPurify.sanitize(html, SANITIZE_CONFIG);
}

export function isSanitizedHtmlRenderable(sanitized) {
  if (typeof sanitized !== 'string' || !sanitized.trim()) {
    return false;
  }

  if (typeof document !== 'undefined') {
    const container = document.createElement('div');
    container.innerHTML = sanitized;
    const text = container.textContent || '';
    return text.trim().length > 0 || container.querySelector('img, video, audio, svg') !== null;
  }

  return sanitized.replace(/<[^>]*>/g, '').trim().length > 0;
}

export function prepareHtmlBlockContent(html) {
  if (typeof html !== 'string' || !html.trim()) {
    return { sanitized: '', renderable: false };
  }

  const sanitized = sanitizeHtml(html);
  return {
    sanitized,
    renderable: isSanitizedHtmlRenderable(sanitized)
  };
}
