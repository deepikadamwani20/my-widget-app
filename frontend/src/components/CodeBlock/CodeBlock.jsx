import React, { useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import './CodeBlock.css';

const CodeBlock = ({ title, code, icon: Icon }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block">
      <div className="code-header">
        <div className="code-title">
          <Icon className="code-icon" />
          <h3>{title}</h3>
        </div>
        <button 
          onClick={handleCopy} 
          className={`copy-btn ${copied ? 'copied' : ''}`}
        >
          {copied ? (
            <>
              <CheckCircleIcon className="icon-success" />
              Copied!
            </>
          ) : (
            <>
              <ContentCopyIcon />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="code-content">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;