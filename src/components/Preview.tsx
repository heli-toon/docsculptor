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
    katexLink.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css';
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
      .preview-content h1 { 
        font-size: ${settings.fontSize.headings}px; 
        border-bottom: 1px solid #ccc;
        padding-bottom: 0.2em;
      }
      .preview-content h2 { font-size: ${settings.fontSize.headings * 0.85}px; }
      .preview-content h3 { font-size: ${settings.fontSize.headings * 0.75}px; }
      
      .preview-content code, .preview-content pre {
        font-family: ${settings.fonts.code};
        font-size: ${settings.fontSize.code}px;
      }

      /* Clean Table Styling - Matches PDF export better */
      .preview-content table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.5em 0;
        border: 1px solid #ddd;
      }
      .dark .preview-content table {
        border-color: #444;
      }
      .preview-content th {
        background: #f5f5f5;
        padding: 8px 12px;
        font-weight: 600;
        text-align: left;
        border: 1px solid #ddd;
      }
      .dark .preview-content th {
        background: #333;
        border-color: #444;
      }
      .preview-content td {
        padding: 8px 12px;
        border: 1px solid #ddd;
      }
      .dark .preview-content td {
        border-color: #444;
      }
      
      /* KaTeX Standard Styles */
      .preview-content .katex-display {
        margin: 1.5em 0;
        padding: 1em;
        text-align: center;
      }
      .preview-content .katex .frac-line {
        border-bottom-width: 0.04em !important;
        margin: 0.1em 0 !important;
      }
      .preview-content .katex .mfrac {
        vertical-align: middle !important;
      }
      .preview-content .katex .mfrac > span {
        text-align: center !important;
      }

      /* Image Padding */
      .preview-content img {
        margin-top: 1.5em;
        margin-bottom: 1.5em;
        max-width: 100%;
        height: auto;
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
          <i className="bi bi-x-lg text-red-500" />
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