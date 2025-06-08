import './FullscreenButton.css';

interface FullscreenButtonProps {
  className?: string;
}

export const FullscreenButton: React.FC<FullscreenButtonProps> = ({ className }) => {
  const openFullscreen = () => {
    // Open the same index.html in a new tab with fullscreen mode parameter
    chrome.tabs.create({
      url: chrome.runtime.getURL('index.html?mode=fullscreen')
    });
  };

  return (
    <button 
      className={`fullscreen-btn ${className || ''}`}
      onClick={openFullscreen}
      title="Open in full screen"
    >
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
      >
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
      </svg>
      Full Screen
    </button>
  );
}; 