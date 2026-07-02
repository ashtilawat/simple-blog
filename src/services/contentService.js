import Airtable from 'airtable';

const MOCK_CONTENT_ITEMS = [
  {
    id: 'mock-item-1',
    title: 'Getting Started with Dynamic Content',
    slug: 'getting-started',
    blocks: [
      { type: 'text', order: 0, content: 'Welcome to the content platform.' },
      {
        type: 'video',
        order: 1,
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      },
      {
        type: 'html',
        order: 2,
        content: '<p>Explore <strong>rich media</strong> blocks managed from the CMS.</p>'
      }
    ]
  },
  {
    id: 'mock-item-2',
    title: 'Responsive Video Embeds',
    slug: 'responsive-video',
    blocks: [
      {
        type: 'text',
        order: 0,
        content: 'Video blocks stay within the content area on narrow viewports.'
      }
    ]
  }
];

function parseBlocks(rawBlocks) {
  if (!rawBlocks) {
    return [];
  }

  let blocks = rawBlocks;
  if (typeof rawBlocks === 'string') {
    try {
      blocks = JSON.parse(rawBlocks);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(blocks)) {
    return [];
  }

  return blocks
    .map((block, index) => ({
      ...block,
      order: block.order ?? index
    }))
    .sort((a, b) => a.order - b.order);
}

function mapRecordToContentItem(record) {
  return {
    id: record.id,
    title: record.fields.title || 'Untitled',
    slug: record.fields.slug || record.id,
    blocks: parseBlocks(record.fields.blocks)
  };
}

function hasAirtableConfig() {
  return Boolean(
    process.env.REACT_APP_AIRTABLE_API_KEY && process.env.REACT_APP_AIRTABLE_BASE_ID
  );
}

export async function fetchContentItems() {
  if (!hasAirtableConfig()) {
    return MOCK_CONTENT_ITEMS;
  }

  const tableName =
    process.env.REACT_APP_AIRTABLE_CONTENT_TABLE || 'ContentItems';

  const base = new Airtable({ apiKey: process.env.REACT_APP_AIRTABLE_API_KEY }).base(
    process.env.REACT_APP_AIRTABLE_BASE_ID
  );

  const records = await base(tableName)
    .select({
      filterByFormula: '{published} = TRUE()',
      sort: [{ field: 'title', direction: 'asc' }]
    })
    .all();

  return records.map(mapRecordToContentItem);
}

export { MOCK_CONTENT_ITEMS, parseBlocks };
