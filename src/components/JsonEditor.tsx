import React from 'react';
import { loader } from '@monaco-editor/react';
import { useTheme } from '../hooks/useTheme';

// Configure Monaco Editor to use bundled version
loader.config({
  paths: {
    vs: './assets/vs'
  }
});

// Dynamic import for Monaco Editor to avoid CDN loading
const Editor = React.lazy(() => import('@monaco-editor/react'));

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  showTip?: boolean;
}

export const JsonEditor: React.FC<JsonEditorProps> = ({
  value,
  onChange,
  height = "200px",
  placeholder = '{\n\n}',
  className = '',
  style = {},
  showTip = true
}) => {
  const { resolvedTheme } = useTheme();

  // Map resolved theme to Monaco Editor theme
  const monacoTheme = resolvedTheme === 'dark' ? 'vs-dark' : 'vs-light';

  const handleChange = (newValue: string | undefined) => {
    onChange(newValue || '');
  };

  return (
    <div 
      className={`json-editor ${className}`}
      style={{ 
        ...style 
      }}
    >
      <React.Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}>Loading JSON editor...</div>}>
        <Editor
          key={`monaco-editor-${resolvedTheme}`}
          height={height}
          language="json"
          value={value || placeholder}
          onChange={handleChange}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            formatOnPaste: true,
            formatOnType: true,
            automaticLayout: true,
            bracketPairColorization: { enabled: true },
            suggest: {
              insertMode: 'replace',
              filterGraceful: true,
              showWords: false,
              showKeywords: false,
              showSnippets: true
            },
            quickSuggestions: {
              other: true,
              comments: false,
              strings: true
            },
            wordWrap: 'on',
            lineNumbers: 'on',
            folding: true,
            tabSize: 2,
            lineNumbersMinChars: 2,
            // lineDecorationsWidth: 0,
            // glyphMargin: false,
            // padding: { top: 8, bottom: 8 },
            // lineHeight: 18,
            // renderLineHighlight: 'none',
            // overviewRulerBorder: false,
            // hideCursorInOverviewRuler: true,
          }}
          beforeMount={(monaco) => {
            // Configure JSON language settings for better autocompletion
            monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
              validate: true,
              allowComments: false,
              schemas: [{
                uri: "http://myserver/response-schema.json",
                fileMatch: ['*'],
                schema: {
                  type: "object",
                  description: "API Response Data",
                  properties: {
                    message: {
                      type: "string",
                      description: "Response message"
                    },
                    data: {
                      type: "array",
                      description: "Response data array",
                      items: {
                        type: "object"
                      }
                    },
                    success: {
                      type: "boolean",
                      description: "Operation success status"
                    },
                    error: {
                      type: "string",
                      description: "Error message if any"
                    },
                    count: {
                      type: "number",
                      description: "Number of items"
                    },
                    id: {
                      type: ["string", "number"],
                      description: "Unique identifier"
                    },
                    timestamp: {
                      type: "string",
                      description: "ISO timestamp"
                    },
                    status: {
                      type: "string",
                      enum: ["success", "error", "pending"],
                      description: "Status of the operation"
                    }
                  }
                }
              }]
            });
          }}
          theme={monacoTheme}
        />
      </React.Suspense>
      {showTip && (
        <small style={{ 
          color: resolvedTheme === 'dark' ? '#999' : '#666', 
          fontSize: '12px', 
          marginTop: '4px', 
          display: 'block' 
        }}>
          💡 Tip: Use Ctrl+Space for autocompletion, and the editor will validate your JSON syntax automatically
        </small>
      )}
    </div>
  );
}; 