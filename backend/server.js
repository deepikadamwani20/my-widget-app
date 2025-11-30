const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage (replace with database in production)
const chatbots = new Map();

// Helper function to generate SDN token
const generateSDN = () => {
  const randomString = crypto.randomBytes(4).toString('hex');
  return `sdn_${randomString}`;
};

// API Routes

// Generate chatbot
app.post('/api/generate', (req, res) => {
  try {
    const { email, websiteUrl } = req.body;

    // Validation
    if (!email || !websiteUrl) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and website URL are required' 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email format' 
      });
    }

    // Generate SDN token
    const sdnToken = generateSDN();

    // Generate embed script
    const embedScript = `<script src="https://cdn.yourdomain.com/embed.js" data-sdn="${sdnToken}" async></script>`;

    // Generate embed.js content
    const embedJsContent = `(function () {
  const sdn = document.currentScript.getAttribute("data-sdn");
  const iframe = document.createElement("iframe");
   iframe.src = "http://localhost:5000/widget/chat.html?sdn=" + encodeURIComponent(sdn);
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

    // Store chatbot data
    const chatbotData = {
      sdnToken,
      email,
      websiteUrl,
      embedScript,
      embedJsContent,
      createdAt: new Date().toISOString()
    };

    chatbots.set(sdnToken, chatbotData);

    // Return response
    res.json({
      success: true,
      data: chatbotData
    });

  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate chatbot' 
    });
  }
});

// Get chatbot by SDN token
app.get('/api/chatbot/:sdn', (req, res) => {
  try {
    const { sdn } = req.params;
    const chatbot = chatbots.get(sdn);

    if (!chatbot) {
      return res.status(404).json({ 
        success: false, 
        error: 'Chatbot not found' 
      });
    }

    res.json({
      success: true,
      data: chatbot
    });

  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch chatbot' 
    });
  }
});

// Get all chatbots (for admin purposes)
app.get('/api/chatbots', (req, res) => {
  try {
    const allChatbots = Array.from(chatbots.values());
    res.json({
      success: true,
      count: allChatbots.length,
      data: allChatbots
    });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch chatbots' 
    });
  }
});

// Serve embed.js dynamically
app.get('/embed.js', (req, res) => {
  console.log("🔥 embed.js REQUESTED");

  // Use environment variable FRONTEND_URL or default to localhost for development
  const FRONTEND_URL = process.env.FRONTEND_URL || "https://profound-granita-99a220.netlify.app";
;

  const embedScript = `
(function () {
  const sdn = document.currentScript.getAttribute("data-sdn");

  if (!sdn) {
    console.error("Chatbot: SDN token missing");
    return;
  }

  // --- Create floating bot button ---
  const botButton = document.createElement("div");
  botButton.style.position = "fixed";
  botButton.style.bottom = "20px";
  botButton.style.right = "20px";
  botButton.style.width = "60px";
  botButton.style.height = "60px";
  botButton.style.borderRadius = "50%";
  botButton.style.background = "#4f46e5";
  botButton.style.display = "flex";
  botButton.style.justifyContent = "center";
  botButton.style.alignItems = "center";
  botButton.style.cursor = "pointer";
  botButton.style.boxShadow = "0px 4px 10px rgba(0,0,0,0.25)";
  botButton.style.zIndex = "999999";
  
  botButton.innerHTML = "🤖"; // You can replace with an image later

  document.body.appendChild(botButton);

  // --- Create iframe but keep hidden ---
  const iframe = document.createElement("iframe");
  iframe.src = window.location.origin + "/chat?sdn=" + encodeURIComponent(sdn);
  iframe.style.position = "fixed";
  iframe.style.bottom = "100px";
  iframe.style.right = "20px";
  iframe.style.width = "360px";
  iframe.style.height = "520px";
  iframe.style.border = "none";
  iframe.style.borderRadius = "12px";
  iframe.style.boxShadow = "0 4px 20px rgba(0,0,0,0.15)";
  iframe.style.zIndex = "999999";
  iframe.style.opacity = "0";
  iframe.style.transform = "scale(0.95)";
  iframe.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  iframe.style.display = "none"; // Hidden initially

  document.body.appendChild(iframe)`;

  let isOpen = false;

  // --- Toggle widget functionality ---
  botButton.addEventListener("click", () => {
    if (!isOpen) {
      iframe.style.display = "block";
      setTimeout(() => {
        iframe.style.opacity = "1";
        iframe.style.transform = "scale(1)";
      }, 10);
    } else {
      iframe.style.opacity = "0";
      iframe.style.transform = "scale(0.95)";
      setTimeout(() => (iframe.style.display = "none"), 300);
    }
    isOpen = !isOpen;
  });
})();




app.get('/chat', (req, res) => {
  res.setHeader("X-Frame-Options", "ALLOWALL");
  res.setHeader("Content-Security-Policy", "frame-ancestors *");

  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Chatbot Widget</title>
  <style>
    body { margin: 0; font-family: Arial; background: #fff; }
    #container { height: 100vh; display: flex; flex-direction: column; position: relative; }

    #header { 
      background: #4f46e5; 
      color: white; 
      padding: 12px; 
      text-align: center; 
      font-weight: 600;
      position: relative;
    }

    #closeBtn {
      position: absolute;
      right: 12px;
      top: 8px;
      background: transparent;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
    }

    #messages { flex: 1; overflow-y: auto; padding: 10px; }
    #inputBox { display: flex; padding: 10px; gap: 8px; background: #f3f3f3; }
    #userInput { flex: 1; padding: 8px; border-radius: 6px; border: 1px solid #ccc; }
    button { padding: 8px 16px; background: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer; }
  </style>
</head>

<body>
  <div id="container">
    <div id="header">
      Chatbot
      <button id="closeBtn">×</button>
    </div>

    <div id="messages"><p><b>Bot:</b> Hello! How can I help you today?</p></div>

    <div id="inputBox">
      <input id="userInput" placeholder="Type message..."/>
      <button onclick="sendMessage()">Send</button>
    </div>
  </div>

  <script>
    function sendMessage() {
      let inp = document.getElementById("userInput");
      if (!inp.value.trim()) return;

      let box = document.getElementById("messages");

      box.innerHTML += "<p><b>You:</b> " + inp.value + "</p>";

      setTimeout(() => {
        box.innerHTML += "<p><b>Bot:</b> I received: " + inp.value + "</p>";
        box.scrollTop = box.scrollHeight;
      }, 400);

      inp.value = "";
    }

    // ---> Close chatbot button handler
    document.getElementById("closeBtn").addEventListener("click", () => {
      window.parent.postMessage("toggleChat", "*");
    });
  </script>
</body>
</html>
  `);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoint: http://localhost:${PORT}/api/generate`);
  console.log(`📦 Embed script: http://localhost:${PORT}/embed.js`);
});

module.exports = app;