import { assembleContentItems } from './contentService';

describe('assembleContentItems', () => {
  const config = {
    fields: {
      itemTitle: 'Title',
      itemSlug: 'Slug',
      blockContentItem: 'ContentItem',
      blockOrder: 'Order',
      blockType: 'Type',
      blockPayload: 'Payload'
    }
  };

  it('groups blocks by linked item and returns ordered content items', () => {
    const itemRecords = [
      {
        id: 'recA',
        fields: { Title: 'First Post', Slug: 'first-post' }
      },
      {
        id: 'recB',
        fields: { Title: 'Second Post', Slug: 'second-post' }
      }
    ];

    const blockRecords = [
      {
        id: 'blk1',
        fields: {
          ContentItem: ['recA'],
          Order: 1,
          Type: 'text',
          Payload: 'Opening paragraph'
        }
      },
      {
        id: 'blk2',
        fields: {
          ContentItem: ['recA'],
          Order: 2,
          Type: 'html',
          Payload: '<p>More details</p>'
        }
      },
      {
        id: 'blk3',
        fields: {
          ContentItem: ['recB'],
          Order: 1,
          Type: 'video',
          Payload: 'https://example.com/video.mp4'
        }
      }
    ];

    const items = assembleContentItems(itemRecords, blockRecords, config);

    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({
      id: 'recA',
      title: 'First Post',
      slug: 'first-post',
      blocks: [
        { id: 'blk1', type: 'text', order: 1, payload: { text: 'Opening paragraph' } },
        { id: 'blk2', type: 'html', order: 2, payload: { html: '<p>More details</p>' } }
      ]
    });
    expect(items[1]).toMatchObject({
      id: 'recB',
      title: 'Second Post',
      blocks: [{ id: 'blk3', type: 'video', order: 1, payload: { url: 'https://example.com/video.mp4' } }]
    });
  });
});
