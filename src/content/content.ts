// Content script for Mock API Extension
// This script runs in the context of web pages

console.log('Mock API Extension content script loaded');

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'PING') {
    sendResponse({ status: 'alive' });
  }
});

// Optional: Inject additional functionality if needed
// This could be used for more advanced network interception
// or for displaying notifications on the page 