const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const chatbotAPI = {
  generate: async (email, websiteUrl) => {
    const response = await fetch(`${API_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, websiteUrl }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate chatbot');
    }

    return response.json();
  },

  getChatbot: async (sdnToken) => {
    const response = await fetch(`${API_URL}/api/chatbot/${sdnToken}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch chatbot');
    }

    return response.json();
  },

  getAllChatbots: async () => {
    const response = await fetch(`${API_URL}/api/chatbots`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch chatbots');
    }

    return response.json();
  }
};