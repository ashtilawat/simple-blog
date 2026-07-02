import { transformContentBlockRecord, transformContentItemRecord } from '../content/transformAirtableRecords';
import { createAirtableBase } from './airtableClient';
import { getAirtableConfig, isAirtableConfigured } from './airtableConfig';
import { ContentFetchError } from './contentErrors';

/**
 * @param {import('airtable').Records<import('airtable').FieldSet>} itemRecords
 * @param {import('airtable').Records<import('airtable').FieldSet>} blockRecords
 * @param {ReturnType<typeof getAirtableConfig>} config
 * @returns {import('../content/types').ContentItem[]}
 */
export function assembleContentItems(itemRecords, blockRecords, config) {
  const { fields } = config;
  const blocksByItemId = new Map();

  blockRecords.forEach((blockRecord) => {
    const linkedItemIds = blockRecord.fields[fields.blockContentItem];
    if (!Array.isArray(linkedItemIds) || linkedItemIds.length === 0) {
      return;
    }

    const block = transformContentBlockRecord(blockRecord, {
      typeField: fields.blockType,
      orderField: fields.blockOrder,
      payloadField: fields.blockPayload
    });

    linkedItemIds.forEach((itemId) => {
      const existing = blocksByItemId.get(itemId) || [];
      existing.push(block);
      blocksByItemId.set(itemId, existing);
    });
  });

  return itemRecords.map((itemRecord) =>
    transformContentItemRecord(itemRecord, blocksByItemId.get(itemRecord.id) || [], {
      titleField: fields.itemTitle,
      slugField: fields.itemSlug
    })
  );
}

/**
 * Loads published content items and their ordered blocks from Airtable.
 * @returns {Promise<import('../content/types').ContentItem[]>}
 */
export async function fetchPublishedContentItems() {
  if (!isAirtableConfigured()) {
    throw new ContentFetchError(
      'Content source is not configured. Set REACT_APP_AIRTABLE_API_KEY and REACT_APP_AIRTABLE_BASE_ID.'
    );
  }

  const config = getAirtableConfig();
  const base = createAirtableBase();

  try {
    const [itemRecords, blockRecords] = await Promise.all([
      base(config.contentItemsTable)
        .select({
          filterByFormula: `{${config.fields.itemPublished}} = TRUE()`,
          sort: [{ field: config.fields.itemTitle, direction: 'asc' }]
        })
        .all(),
      base(config.contentBlocksTable)
        .select({
          sort: [{ field: config.fields.blockOrder, direction: 'asc' }]
        })
        .all()
    ]);

    return assembleContentItems(itemRecords, blockRecords, config);
  } catch (error) {
    throw new ContentFetchError('Failed to fetch content from Airtable.', { cause: error });
  }
}

/**
 * Loads a single published content item by id or slug.
 * @param {string} id
 * @returns {Promise<import('../content/types').ContentItem>}
 */
export async function fetchContentItemById(id) {
  const items = await fetchPublishedContentItems();
  const item = items.find(
    (entry) => entry.id === id || (entry.slug && entry.slug === id)
  );

  if (!item) {
    throw new ContentFetchError(`Content item "${id}" was not found.`);
  }

  return item;
}
