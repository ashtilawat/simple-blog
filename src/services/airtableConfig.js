const REQUIRED_ENV_VARS = ['REACT_APP_AIRTABLE_API_KEY', 'REACT_APP_AIRTABLE_BASE_ID'];

/**
 * @returns {string[]}
 */
export function getMissingAirtableEnvVars() {
  return REQUIRED_ENV_VARS.filter((name) => !process.env[name]?.trim());
}

/**
 * @returns {boolean}
 */
export function isAirtableConfigured() {
  return getMissingAirtableEnvVars().length === 0;
}

/**
 * @returns {{
 *   apiKey: string,
 *   baseId: string,
 *   contentItemsTable: string,
 *   contentBlocksTable: string,
 *   fields: {
 *     itemTitle: string,
 *     itemSlug: string,
 *     itemPublished: string,
 *     blockContentItem: string,
 *     blockOrder: string,
 *     blockType: string,
 *     blockPayload: string
 *   }
 * }}
 */
export function getAirtableConfig() {
  const missing = getMissingAirtableEnvVars();
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return {
    apiKey: process.env.REACT_APP_AIRTABLE_API_KEY.trim(),
    baseId: process.env.REACT_APP_AIRTABLE_BASE_ID.trim(),
    contentItemsTable: process.env.REACT_APP_AIRTABLE_CONTENT_ITEMS_TABLE?.trim() || 'ContentItems',
    contentBlocksTable: process.env.REACT_APP_AIRTABLE_CONTENT_BLOCKS_TABLE?.trim() || 'ContentBlocks',
    fields: {
      itemTitle: process.env.REACT_APP_AIRTABLE_ITEM_TITLE_FIELD?.trim() || 'Title',
      itemSlug: process.env.REACT_APP_AIRTABLE_ITEM_SLUG_FIELD?.trim() || 'Slug',
      itemPublished: process.env.REACT_APP_AIRTABLE_ITEM_PUBLISHED_FIELD?.trim() || 'Published',
      blockContentItem: process.env.REACT_APP_AIRTABLE_BLOCK_ITEM_FIELD?.trim() || 'ContentItem',
      blockOrder: process.env.REACT_APP_AIRTABLE_BLOCK_ORDER_FIELD?.trim() || 'Order',
      blockType: process.env.REACT_APP_AIRTABLE_BLOCK_TYPE_FIELD?.trim() || 'Type',
      blockPayload: process.env.REACT_APP_AIRTABLE_BLOCK_PAYLOAD_FIELD?.trim() || 'Payload'
    }
  };
}
