(function () {
  const currentScript = document.currentScript;
  const sdn = currentScript.getAttribute("data-sdn");

  if (!sdn) {
    console.error("Chatbot: SDN token missing in embed tag");
    return;
  }

  const iframe = document.createElement("iframe");
  iframe.src = "https://my-widget-app.onrender.com/chat?sdn=" + encodeURIComponent(sdn);

  iframe.style.position = "fixed";
  iframe.style.bottom = "20px";
  iframe.style.right = "20px";
  iframe.style.width = "360px";
  iframe.style.height = "520px";
  iframe.style.border = "none";
  iframe.style.zIndex = "999999";
  iframe.style.borderRadius = "12px";
  iframe.style.boxShadow = "0 4px 20px rgba(0,0,0,0.15)";

  document.body.appendChild(iframe);
})();
