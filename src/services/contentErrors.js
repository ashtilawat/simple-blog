export class ContentFetchError extends Error {
  /**
   * @param {string} message
   * @param {{ cause?: unknown }} [options]
   */
  constructor(message, options = {}) {
    super(message);
    this.name = 'ContentFetchError';
    this.cause = options.cause;
  }
}

/**
 * @param {unknown} error
 * @returns {string}
 */
export function getContentFetchErrorMessage(error) {
  if (error instanceof ContentFetchError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unable to load content. Please try again later.';
}
