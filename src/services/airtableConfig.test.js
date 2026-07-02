import { getMissingAirtableEnvVars, isAirtableConfigured } from './airtableConfig';

describe('airtableConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('reports missing required env vars', () => {
    delete process.env.REACT_APP_AIRTABLE_API_KEY;
    delete process.env.REACT_APP_AIRTABLE_BASE_ID;

    expect(getMissingAirtableEnvVars()).toEqual([
      'REACT_APP_AIRTABLE_API_KEY',
      'REACT_APP_AIRTABLE_BASE_ID'
    ]);
    expect(isAirtableConfigured()).toBe(false);
  });

  it('returns configured when required env vars are present', () => {
    process.env.REACT_APP_AIRTABLE_API_KEY = 'key123';
    process.env.REACT_APP_AIRTABLE_BASE_ID = 'app123';

    expect(getMissingAirtableEnvVars()).toEqual([]);
    expect(isAirtableConfigured()).toBe(true);
  });
});
