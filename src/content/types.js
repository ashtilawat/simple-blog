/** Supported content block types from the CMS. */
export const BLOCK_TYPES = {
  TEXT: 'text',
  HTML: 'html',
  VIDEO: 'video'
};

/** @typedef {'text' | 'html' | 'video' | string} BlockType */

/**
 * @typedef {Object} TextBlockPayload
 * @property {string} text
 */

/**
 * @typedef {Object} HtmlBlockPayload
 * @property {string} html
 */

/**
 * @typedef {Object} VideoBlockPayload
 * @property {string} url
 */

/**
 * @typedef {TextBlockPayload | HtmlBlockPayload | VideoBlockPayload | Record<string, unknown>} BlockPayload
 */

/**
 * @typedef {Object} ContentBlock
 * @property {string} id - Stable Airtable record id
 * @property {BlockType} type - Block discriminator (text, html, video, ...)
 * @property {number} order - Sort order within the parent item
 * @property {BlockPayload} payload - Type-specific content data
 */

/**
 * @typedef {Object} ContentItem
 * @property {string} id - Stable Airtable record id
 * @property {string} title - Display title
 * @property {string} [slug] - Optional URL slug
 * @property {ContentBlock[]} blocks - Ordered typed content blocks
 */

export {};
