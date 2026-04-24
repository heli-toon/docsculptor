import React, { useEffect, useMemo } from 'react';
import type { PdfSettings } from '../types';

interface PreviewProps {
  content: string;
  isProcessing: boolean;
  onClear?: () => void;
  settings: PdfSettings;
}

export const Preview: React.FC<PreviewProps> = ({ content, isProcessing, onClear, settings }) => {
  useEffect(() => {
    // Add syntax highlighting styles
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
    link.id = 'highlight-theme-light';
    document.head.appendChild(link);

    const darkLink = document.createElement('link');
    darkLink.rel = 'stylesheet';
    darkLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css';
    darkLink.id = 'highlight-theme-dark';
    darkLink.media = '(prefers-color-scheme: dark)';
    document.head.appendChild(darkLink);

    // Add KaTeX styles for math rendering
    const katexLink = document.createElement('link');
    katexLink.rel = 'stylesheet';
    katexLink.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    katexLink.id = 'katex-styles';
    katexLink.crossOrigin = 'anonymous';
    document.head.appendChild(katexLink);

    return () => {
      document.getElementById('highlight-theme-light')?.remove();
      document.getElementById('highlight-theme-dark')?.remove();
      document.getElementById('katex-styles')?.remove();
    };
  }, []);

  const dynamicStyles = useMemo(() => {
    return `
      .preview-content {
        font-family: ${settings.fonts.body};
        font-size: ${settings.fontSize.body}px;
        line-height: 1.6;
      }
      .preview-content h1, 
      .preview-content h2, 
      .preview-content h3, 
      .preview-content h4, 
      .preview-content h5, 
      .preview-content h6 {
        font-family: ${settings.fonts.headings};
        font-weight: 700;
        letter-spacing: -0.025em;
        margin-top: 2em;
        margin-bottom: 0.8em;
      }
      .preview-content h1 { font-size: ${settings.fontSize.headings}px; border-bottom: 2px solid currentColor; padding-bottom: 0.3em; }
      .preview-content h2 { font-size: ${settings.fontSize.headings * 0.85}px; }
      .preview-content h3 { font-size: ${settings.fontSize.headings * 0.75}px; }
      
      .preview-content code, .preview-content pre {
        font-family: ${settings.fonts.code};
        font-size: ${settings.fontSize.code}px;
      }

      /* Enhanced Table Styling - "Pop Out" effect */
      .preview-content table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        margin: 2em 0;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .dark .preview-content table {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        border-color: rgba(255, 255, 255, 0.1);
      }
      .preview-content table:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
      }
      .dark .preview-content table:hover {
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
      }
      .preview-content th {
        background: #f8fafc;
        padding: 1rem;
        font-weight: 600;
        text-align: left;
        border-bottom: 2px solid #e2e8f0;
      }
      .dark .preview-content th {
        background: #1e293b;
        border-bottom-color: #334155;
      }
      .preview-content td {
        padding: 1rem;
        border-bottom: 1px solid #f1f5f9;
        background: white;
      }
      .dark .preview-content td {
        background: #0f172a;
        border-bottom-color: #1e293b;
      }
      .preview-content tr:last-child td {
        border-bottom: none;
      }
      
      /* KaTeX Fixes */
      .preview-content .katex-display {
        margin: 2em 0;
        padding: 1.5em;
        background: rgba(0, 0, 0, 0.02);
        border-radius: 8px;
      }
      .dark .preview-content .katex-display {
        background: rgba(255, 255, 255, 0.03);
      }
    `;
  }, [settings]);

  if (isProcessing) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="text-gray-600 dark:text-gray-400">Processing content...</span>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <i className="bi bi-eye text-4xl mb-3 opacity-50" />
        <p className="text-lg font-medium">Preview will appear here</p>
        <p className="text-sm">Upload a file to see the rendered content</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto relative scroll-smooth">
      <style>{dynamicStyles}</style>
      
      {/* Clear Preview button */}
      {onClear && (
        <button
          onClick={onClear}
          className="absolute top-4 right-4 z-10 p-2 bg-gray-100/80 dark:bg-gray-700/80 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all cursor-pointer backdrop-blur-sm shadow-sm"
          title="Clear Preview"
        >
          <i className="bi bi-trash3 text-red-500" />
        </button>
      )}
      
      <div 
        className="preview-content prose prose-lg dark:prose-invert max-w-none p-8 lg:p-12
                   prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                   prose-p:text-gray-700 dark:prose-p:text-gray-300
                   prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                   prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-blue-50 dark:prose-code:bg-blue-900/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                   prose-pre:bg-gray-50 dark:prose-pre:bg-gray-900/50 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-800 prose-pre:rounded-xl
                   prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-900/10 prose-blockquote:py-1 prose-blockquote:rounded-r-lg
                   prose-img:rounded-xl prose-img:shadow-lg
                   [&&_hr]:border-gray-200 dark:[&&_hr]:border-gray-800 [&&_hr]:my-12"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};