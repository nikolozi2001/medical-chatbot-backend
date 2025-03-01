function getChatReply(message) {
  if (!message || typeof message !== 'string') {
    throw new Error('Invalid message input');
  }

  const lowerCaseMessage = message.toLowerCase();

  if (lowerCaseMessage.includes('consultation fees') || lowerCaseMessage.includes('fee')) {
    return 'The consultation fee is $100.';
  } else if (lowerCaseMessage.includes('opening hours') || lowerCaseMessage.includes('hours')) {
    return 'We are open from 9 AM to 5 PM, Monday to Friday.';
  } else if (lowerCaseMessage.includes('location') || lowerCaseMessage.includes('address')) {
    return 'We are located at 123 Medical Street, Health City.';
  } else {
    return `You asked: ${message}. This is a placeholder response.`;
  }
}

module.exports = { getChatReply };
