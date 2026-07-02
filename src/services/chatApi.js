const CHAT_API_URL = '/api/chat';
const MAX_MESSAGE_LENGTH = 2000;

export function getMaxMessageLength() {
  return MAX_MESSAGE_LENGTH;
}

export async function sendChatMessage(messages) {
  const response = await fetch(CHAT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ messages })
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || 'Unable to get a response right now. Please try again.');
  }

  if (!data?.reply) {
    throw new Error('Received an empty response. Please try again.');
  }

  return data.reply;
}
