export const mockDraftData = {
  comingFrom: 'draft',
  sessionDataDraft: {
    chatHistory: [
      { text: 'Hello', sender: 'user', isFile: false },
      { text: 'Hi', sender: 'bot', isFile: false }
    ],
    formFieldValue: Array.from({ length: 25 }, (_, i) => ({
      label: `Field ${i}`,
      value: i === 23 ? 'file.pdf' : '',
      valid: false,
      editing: false,
      image: '',
      completed: false
    }))
  },
  sessionDataId: 'mock-session-id',
  sessionDataUserName: 'mock-user'
};

export const mockRequestData = {
  comingFrom: 'request',
  chatData: {
    chatHistory: [
      { text: 'User message', sender: 'user', isFile: false },
      { text: 'Bot reply', sender: 'bot', isFile: false }
    ],
    formFieldValue: Array.from({ length: 25 }, (_, i) => ({
      label: `Field ${i}`,
      value: '',
      valid: false,
      editing: false,
      image: '',
      completed: false
    }))
  },
  session_id: 'mock-request-session-id',
  user_name: 'mock-request-user'
};

export const mockApiResponse = {
  BIC: { 'Your idea title': 'Test Title' },
  bot_message: 'Bot says hello',
  button: ['Yes', 'No'],
  drop_down: false
};

export const mockFile = new File(['dummy content'], 'file.pdf', { type: 'application/pdf' });