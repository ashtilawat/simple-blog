import Airtable from 'airtable';
import { getAirtableConfig } from './airtableConfig';

/**
 * @returns {import('airtable').Base}
 */
export function createAirtableBase() {
  const config = getAirtableConfig();
  return new Airtable({ apiKey: config.apiKey }).base(config.baseId);
}
