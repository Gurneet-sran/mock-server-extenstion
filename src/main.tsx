import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Check if we're in fullscreen mode
const urlParams = new URLSearchParams(window.location.search);
const isFullscreen = urlParams.get('mode') === 'fullscreen';

// Apply fullscreen class to body if in fullscreen mode
if (isFullscreen) {
  document.body.classList.add('fullscreen-mode');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
