import Airtable from 'airtable';

const MOCK_CONTENT_ITEMS = [
  {
    id: 'mock-1',
    title: 'Welcome to Simple Blog',
    blocks: [
      {
        type: 'text',
        payload: {
          text: 'This article is loaded dynamically. Content updates appear without redeploying the application.'
        }
      },
      {
        type: 'html',
        payload: {
          html: '<h2>Rich HTML Content</h2><p>Safe markup renders inline with the rest of the page.</p>'
        }
      }
    ]
  },
  {
    id: 'mock-2',
    title: 'Embedded Media Example',
    blocks: [
      {
        type: 'text',
        payload: {
          text: 'Video blocks support YouTube, Vimeo, and direct MP4 URLs.'
        }
      },
      {
        type: 'video',
        payload: {
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      }
    ]
  }
];

function parseBlocks(rawBlocks) {
  if (!rawBlocks) {
    return [];
  }

  if (typeof rawBlocks === 'string') {
    try {
      const parsed = JSON.parse(rawBlocks);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return Array.isArray(rawBlocks) ? rawBlocks : [];
}

function mapRecord(record) {
  const fields = record.fields || record;

  return {
    id: record.id || fields.id || fields.slug,
    title: fields.title || 'Untitled',
    blocks: parseBlocks(fields.blocks)
  };
}

function getAirtableConfig() {
  const apiKey = process.env.REACT_APP_AIRTABLE_API_KEY;
  const baseId = process.env.REACT_APP_AIRTABLE_BASE_ID;
  const tableName = process.env.REACT_APP_AIRTABLE_TABLE_NAME || 'ContentItems';

  if (!apiKey || !baseId) {
    return null;
  }

  return { apiKey, baseId, tableName };
}

async function fetchFromAirtable() {
  const config = getAirtableConfig();
  if (!config) {
    return null;
  }

  const base = new Airtable({ apiKey: config.apiKey }).base(config.baseId);

  const records = await base(config.tableName)
    .select({
      filterByFormula: "OR({published} = TRUE(), {published} = 1, {published} = 'true')"
    })
    .all();

  return records.map(mapRecord);
}

export async function fetchContentItems() {
  try {
    const airtableItems = await fetchFromAirtable();
    if (airtableItems && airtableItems.length > 0) {
      return airtableItems;
    }

    return MOCK_CONTENT_ITEMS;
  } catch (error) {
    if (getAirtableConfig()) {
      throw error;
    }

    return MOCK_CONTENT_ITEMS;
  }
}

export async function fetchContentItemById(id) {
  const items = await fetchContentItems();
  const item = items.find((entry) => entry.id === id);

  if (!item) {
    throw new Error(`Content item "${id}" was not found.`);
  }

  return item;
}
