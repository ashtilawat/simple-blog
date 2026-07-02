import { BLOCK_TYPES } from './types';

/**
 * Maps a CMS block type string to a normalized block type and payload shape.
 * @param {string | undefined} type
 * @param {string | undefined} payload
 * @returns {{ type: string, payload: import('./types').BlockPayload }}
 */
export function parseBlockTypeAndPayload(type, payload) {
  const normalizedType = (type || '').trim().toLowerCase();
  const rawPayload = payload ?? '';

  switch (normalizedType) {
    case BLOCK_TYPES.TEXT:
      return { type: BLOCK_TYPES.TEXT, payload: { text: rawPayload } };
    case BLOCK_TYPES.HTML:
      return { type: BLOCK_TYPES.HTML, payload: { html: rawPayload } };
    case BLOCK_TYPES.VIDEO:
      return { type: BLOCK_TYPES.VIDEO, payload: { url: rawPayload } };
    default:
      return { type: normalizedType || 'unknown', payload: { raw: rawPayload } };
  }
}

/**
 * @param {import('airtable').Record<FieldSet>} record
 * @param {{ typeField: string, orderField: string, payloadField: string }} fieldNames
 * @returns {import('./types').ContentBlock}
 */
export function transformContentBlockRecord(record, fieldNames) {
  const fields = record.fields;
  const { type, payload } = parseBlockTypeAndPayload(
    fields[fieldNames.typeField],
    fields[fieldNames.payloadField]
  );

  return {
    id: record.id,
    type,
    order: Number(fields[fieldNames.orderField] ?? 0),
    payload
  };
}

/**
 * @param {import('airtable').Record<FieldSet>} record
 * @param {import('./types').ContentBlock[]} blocks
 * @param {{ titleField: string, slugField: string }} fieldNames
 * @returns {import('./types').ContentItem}
 */
export function transformContentItemRecord(record, blocks, fieldNames) {
  const fields = record.fields;
  const title = fields[fieldNames.titleField];
  const slug = fields[fieldNames.slugField];

  return {
    id: record.id,
    title: typeof title === 'string' && title.trim() ? title.trim() : 'Untitled',
    slug: typeof slug === 'string' && slug.trim() ? slug.trim() : record.id,
    blocks: [...blocks].sort((a, b) => a.order - b.order)
  };
}

/** @typedef {Record<string, unknown>} FieldSet */
