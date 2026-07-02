export const BLOCK_TYPES = {
  TEXT: 'text',
  HTML: 'html',
  VIDEO: 'video'
};

/**
 * @typedef {Object} ContentBlock
 * @property {string} [id]
 * @property {string} type
 * @property {number} [order]
 * @property {Record<string, unknown>} payload
 */

/**
 * Sort blocks by CMS-defined order, preserving array order as a tiebreaker.
 * @param {ContentBlock[]} blocks
 * @returns {ContentBlock[]}
 */
export function sortBlocksByOrder(blocks) {
  if (!Array.isArray(blocks)) {
    return [];
  }

  return [...blocks]
    .map((block, index) => ({ block, index }))
    .sort((a, b) => {
      const orderA = typeof a.block.order === 'number' ? a.block.order : a.index;
      const orderB = typeof b.block.order === 'number' ? b.block.order : b.index;
      return orderA - orderB || a.index - b.index;
    })
    .map(({ block }) => block);
}
