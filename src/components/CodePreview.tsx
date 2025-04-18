'use client';

import { useEffect, useState } from 'react';

interface CodePreviewProps {
  code: string;
  language: string;
}

export default function CodePreview({ code, language }: CodePreviewProps) {
  const [iframeContent, setIframeContent] = useState('');

  useEffect(() => {
    if (language === 'jsx' || language === 'tsx') {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/5.11.1/reset.min.css" />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/antd/5.11.1/antd.min.js"></script>
          <style>
            body { margin: 0; font-family: sans-serif; }
            #root { padding: 1rem; }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            ${code}
            
            try {
              const componentName = code.match(/function\\s+([A-Z][A-Za-z0-9_]*)\\s*\\(/)?.[1] || 
                                    code.match(/const\\s+([A-Z][A-Za-z0-9_]*)\\s*=\\s*\\(/)?.[1] || 
                                    'App';
              
              if (typeof window[componentName] === 'function') {
                ReactDOM.render(React.createElement(window[componentName]), document.getElementById('root'));
              }
            } catch (e) {
              console.error('Error rendering component:', e);
              document.getElementById('root').innerHTML = '<p>Error rendering component. See console for details.</p>';
            }
          </script>
        </body>
        </html>
      `;
      setIframeContent(htmlContent);
    } else if (language === 'html') {
      setIframeContent(code);
    } else {
      setIframeContent(`<div style="padding: 1rem;">Preview not available for ${language} code</div>`);
    }
  }, [code, language]);

  return (
    <div className="w-full h-full border border-gray-300 rounded-md overflow-hidden">
      {iframeContent ? (
        <iframe
          srcDoc={iframeContent}
          title="Code Preview"
          className="w-full h-full"
          sandbox="allow-scripts"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p>Loading preview...</p>
        </div>
      )}
    </div>
  );
}
