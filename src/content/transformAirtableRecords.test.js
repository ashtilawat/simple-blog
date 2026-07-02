import { BLOCK_TYPES } from './types';
import {
  parseBlockTypeAndPayload,
  transformContentBlockRecord,
  transformContentItemRecord
} from './transformAirtableRecords';

describe('parseBlockTypeAndPayload', () => {
  it('maps text blocks to a text payload', () => {
    expect(parseBlockTypeAndPayload('text', 'Hello world')).toEqual({
      type: BLOCK_TYPES.TEXT,
      payload: { text: 'Hello world' }
    });
  });

  it('maps html blocks to an html payload', () => {
    expect(parseBlockTypeAndPayload('HTML', '<p>Hi</p>')).toEqual({
      type: BLOCK_TYPES.HTML,
      payload: { html: '<p>Hi</p>' }
    });
  });

  it('maps video blocks to a url payload', () => {
    expect(parseBlockTypeAndPayload('video', 'https://youtu.be/demo')).toEqual({
      type: BLOCK_TYPES.VIDEO,
      payload: { url: 'https://youtu.be/demo' }
    });
  });

  it('preserves unknown block types with a raw payload', () => {
    expect(parseBlockTypeAndPayload('carousel', '{"slides":1}')).toEqual({
      type: 'carousel',
      payload: { raw: '{"slides":1}' }
    });
  });
});

describe('transformContentBlockRecord', () => {
  it('transforms an Airtable block record', () => {
    const record = {
      id: 'blk123',
      fields: {
        Type: 'text',
        Order: 2,
        Payload: 'Block body'
      }
    };

    expect(
      transformContentBlockRecord(record, {
        typeField: 'Type',
        orderField: 'Order',
        payloadField: 'Payload'
      })
    ).toEqual({
      id: 'blk123',
      type: BLOCK_TYPES.TEXT,
      order: 2,
      payload: { text: 'Block body' }
    });
  });
});

describe('transformContentItemRecord', () => {
  it('transforms an item and sorts blocks by order', () => {
    const record = {
      id: 'item123',
      fields: {
        Title: 'Sample Article',
        Slug: 'sample-article'
      }
    };

    const blocks = [
      { id: 'b2', type: BLOCK_TYPES.VIDEO, order: 2, payload: { url: 'https://example.com/v.mp4' } },
      { id: 'b1', type: BLOCK_TYPES.TEXT, order: 1, payload: { text: 'Intro' } }
    ];

    expect(
      transformContentItemRecord(record, blocks, {
        titleField: 'Title',
        slugField: 'Slug'
      })
    ).toEqual({
      id: 'item123',
      title: 'Sample Article',
      slug: 'sample-article',
      blocks: [
        { id: 'b1', type: BLOCK_TYPES.TEXT, order: 1, payload: { text: 'Intro' } },
        { id: 'b2', type: BLOCK_TYPES.VIDEO, order: 2, payload: { url: 'https://example.com/v.mp4' } }
      ]
    });
  });
});
