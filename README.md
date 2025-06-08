# Mock API Extension (React Version)

A Chrome extension built with React and TypeScript that allows you to mock API responses for development and testing purposes.

## Features

- **Mock API Responses**: Intercept HTTP requests and return custom responses
- **Multiple HTTP Methods**: Support for GET, POST, PUT, DELETE, and PATCH requests
- **Custom Status Codes**: Set any HTTP status code for your mock responses
- **JSON Response Data**: Define custom JSON response payloads
- **Enable/Disable Rules**: Toggle individual mock rules on/off
- **Persistent Storage**: Form state and rules are saved automatically
- **Modern UI**: Clean, responsive interface built with React

## Project Structure

```
src/
├── components/          # React components
│   ├── AddRuleForm.tsx  # Form for adding new mock rules
│   ├── RuleItem.tsx     # Individual rule display component
│   └── RulesList.tsx    # List of all mock rules
├── hooks/               # Custom React hooks
│   ├── useRules.ts      # Hook for managing mock rules
│   └── useFormPersistence.ts # Hook for form state persistence
├── services/            # Service layer
│   └── chrome.ts        # Chrome extension API wrapper
├── types/               # TypeScript type definitions
│   └── index.ts         # All interface definitions
├── background/          # Extension background script
│   └── background.ts    # Service worker for the extension
├── content/             # Extension content script
│   └── content.ts       # Content script (minimal implementation)
├── App.tsx              # Main React application
├── App.css              # Application styles
└── main.tsx             # React app entry point
```

## Development

### Prerequisites

- Node.js (v16 or higher)
- pnpm (or npm/yarn)

### Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Build the extension:
   ```bash
   pnpm build
   ```

3. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `build` folder

### Development Scripts

- `pnpm dev` - Start development server (for testing React components)
- `pnpm build` - Build the extension for production
- `pnpm lint` - Run ESLint

## Usage

1. Click the extension icon in Chrome to open the popup
2. Fill out the form to create a new mock rule:
   - **URL Pattern**: The URL to intercept (e.g., `https://api.example.com/users`)
   - **HTTP Method**: The request method to intercept
   - **Status Code**: The HTTP status code to return
   - **Description**: Optional description for the rule
   - **Response Data**: JSON data to return as the response
3. Click "Add Rule" to save the mock rule
4. Use the toggle switch to enable/disable rules
5. Delete rules using the "Delete" button

## Technical Details

### Architecture

- **React Frontend**: Modern React with TypeScript for the popup UI
- **Chrome Extension APIs**: Uses `chrome.storage` for persistence and `chrome.declarativeNetRequest` for network interception
- **Vite Build System**: Fast development and optimized production builds
- **Custom Hooks**: Separation of concerns with reusable React hooks

### Extension Permissions

- `storage`: For saving mock rules and form state
- `declarativeNetRequest`: For intercepting and modifying network requests
- `activeTab`: For accessing the current tab
- `<all_urls>`: For intercepting requests to any URL

### Build Output

The build process generates:
- `index.html` - Extension popup HTML
- `background.js` - Service worker script
- `content.js` - Content script
- `manifest.json` - Extension manifest
- `assets/` - React app bundles and CSS

## Differences from Vanilla Version

This React version provides:
- **Component-based architecture** for better maintainability
- **Custom hooks** for state management and side effects
- **TypeScript throughout** for better type safety
- **Modern React patterns** with functional components
- **Improved developer experience** with hot reloading during development
- **Better separation of concerns** between UI, business logic, and Chrome APIs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details
