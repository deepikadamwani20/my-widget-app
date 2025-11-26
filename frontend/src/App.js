import React from 'react';
import { ChatbotProvider } from './context/chatbotContext';
import GeneratorForm from './components/GeneratorForm/GenertorForm';
import GeneratedResults from './components/GeneratedResults/GeneratedResults';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import ErrorBanner from './components/ErrorBanner/ErrorBanner';
import Footer from './components/Footer/Footer';
import { useChatbot } from './context/chatbotContext';
import './App.css';


const AppContent = () => {
  const { loading, error, setError } = useChatbot();

  return (
    <div className="app-container">
      {loading && <LoadingSpinner />}
      {error && <ErrorBanner message={error} onClose={() => setError('')} />}
      
      <div className="content-wrapper">
        <GeneratorForm />
        <GeneratedResults />
      </div>

      <Footer />
    </div>
  );
};

function App() {
  return (
    <ChatbotProvider>
      <AppContent />
    </ChatbotProvider>
  );
}

export default App;