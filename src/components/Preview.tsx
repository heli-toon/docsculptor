import React, { useEffect } from 'react';

interface PreviewProps {
  content: string;
  isProcessing: boolean;
}

export const Preview: React.FC<PreviewProps> = ({ content, isProcessing }) => {
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

    return () => {
      document.getElementById('highlight-theme-light')?.remove();
      document.getElementById('highlight-theme-dark')?.remove();
    };
  }, []);

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
    <div className="h-full overflow-auto">
      <div 
        className="prose prose-lg dark:prose-invert max-w-none p-6
                   prose-headings:font-semibold prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                   prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:mb-5
                   prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                   prose-code:text-sm prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                   prose-pre:bg-gray-50 dark:prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-700
                   prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20
                   prose-table:border-collapse prose-table:border prose-table:border-gray-200 dark:prose-table:border-gray-700
                   prose-th:border prose-th:border-gray-200 dark:prose-th:border-gray-700 prose-th:bg-gray-50 dark:prose-th:bg-gray-800
                   prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-700
                   [&&_hr]:mt-8 [&&_hr]:mb-8 [&&_hr]:border-t-2 [&&_hr]:border-gray-300 dark:[&&_hr]:border-gray-700
                   [&&_pre]:mt-8 [&&_pre]:mb-8"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};