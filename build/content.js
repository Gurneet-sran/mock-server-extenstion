console.log("Mock API Extension content script loaded");
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "PING") {
    sendResponse({ status: "alive" });
  }
});
