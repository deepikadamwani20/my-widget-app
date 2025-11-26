import React, { useState } from 'react';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useChatbot } from '../../context/chatbotContext';
import { validateEmail } from '../../utils/validator';
import { generateSDN } from '../../utils/validator';
import './GeneratorForm.css';

const GeneratorForm = () => {
  const [email, setEmail] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const { setGeneratedData, setLoading, setError } = useChatbot();

  const handleGenerate = async () => {
    setError('');

    if (!email || !websiteUrl) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const sdnToken = generateSDN();
      const embedScript = `<script src="https://cdn.yourdomain.com/embed.js" data-sdn="${sdnToken}" async></script>`;
      
      const embedJsContent = `(function () {
  const sdn = document.currentScript.getAttribute("data-sdn");
  const iframe = document.createElement("iframe");
  iframe.src = "https://widget.yourdomain.com/chat?sdn=" + encodeURIComponent(sdn);
  iframe.style.position = "fixed";
  iframe.style.bottom = "20px";
  iframe.style.right = "20px";
  iframe.style.width = "360px";
  iframe.style.height = "520px";
  iframe.style.border = "none";
  iframe.style.zIndex = "999999";
  iframe.style.borderRadius = "12px";
  document.body.appendChild(iframe);
})();`;

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setGeneratedData({
        email,
        websiteUrl,
        sdnToken,
        embedScript,
        embedJsContent,
        timestamp: new Date().toISOString()
      });

      setEmail('');
      setWebsiteUrl('');
    } catch (err) {
      setError('Failed to generate chatbot. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <RocketLaunchIcon className="header-icon" />
        <h1>Chatbot Generator</h1>
        <p className="subtitle">Create your embeddable chatbot in seconds</p>
      </div>

      <div className="generator-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="website">Website URL</label>
          <input
            id="website"
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://yourwebsite.com"
            className="form-input"
          />
        </div>

        <button onClick={handleGenerate} className="generate-btn">
          <RocketLaunchIcon className="btn-icon" />
          Generate Chatbot
        </button>
      </div>
    </div>
  );
};

export default GeneratorForm;