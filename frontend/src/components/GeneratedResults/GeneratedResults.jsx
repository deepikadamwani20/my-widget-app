import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CodeIcon from '@mui/icons-material/Code';
import { useChatbot } from '../../context/chatbotContext';
import CodeBlock from '../CodeBlock/CodeBlock';
import './GeneratedResults.css';

const GeneratedResults = () => {
  const { generatedData } = useChatbot();

  if (!generatedData) return null;

  return (
    <div className="results-container">
      <div className="success-banner">
        <CheckCircleIcon className="success-icon" />
        <div>
          <h2>Chatbot Generated Successfully!</h2>
          <p>Your unique SDN token: <strong>{generatedData.sdnToken}</strong></p>
        </div>
      </div>

      <div className="results-grid">
        <CodeBlock
          title="Embed Script (Add to your website)"
          code={generatedData.embedScript}
          icon={CodeIcon}
        />

        <CodeBlock
          title="embed.js Content (CDN file content)"
          code={generatedData.embedJsContent}
          icon={CodeIcon}
        />
      </div>

      <div className="info-card">
        <h3>How to Use:</h3>
        <ol>
          <li>Copy the <strong>Embed Script</strong> above</li>
          <li>Paste it before the closing <code>&lt;/body&gt;</code> tag in your HTML</li>
          <li>The chatbot widget will appear on the bottom-right corner</li>
          <li>Keep your SDN token safe for future reference</li>
        </ol>
      </div>
    </div>
  );
};

export default GeneratedResults;