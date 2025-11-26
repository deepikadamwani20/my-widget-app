import React, { createContext, useContext, useState } from 'react';

const ChatbotContext = createContext();

export const ChatbotProvider = ({ children }) => {
  const [generatedData, setGeneratedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const value = {
    generatedData,
    setGeneratedData,
    loading,
    setLoading,
    error,
    setError
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within ChatbotProvider');
  }
  return context;
};