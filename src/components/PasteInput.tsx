import React, { useState } from 'react';

interface PasteInputProps {
  onPreview: (content: string, type: 'markdown' | 'html') => void;
  onClear: () => void;
  isProcessing?: boolean;
}

export const PasteInput: React.FC<PasteInputProps> = ({ onPreview, onClear, isProcessing }) => {
  const [content, setContent] = useState('');
  const [type, setType] = useState<'markdown' | 'html'>('markdown');

  const handlePreview = () => {
    if (!content.trim()) return;
    onPreview(content, type);
  };

  const handleClear = () => {
    setContent('');
    onClear();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Paste Content</h3>
        <div className="flex items-center space-x-2 text-sm">
          <label className="inline-flex items-center space-x-1 cursor-pointer">
            <input
              type="radio"
              name="pasteType"
              value="markdown"
              checked={type === 'markdown'}
              onChange={() => setType('markdown')}
            />
            <span className="text-gray-600 dark:text-gray-300">Markdown</span>
          </label>
          <label className="inline-flex items-center space-x-1 cursor-pointer">
            <input
              type="radio"
              name="pasteType"
              value="html"
              checked={type === 'html'}
              onChange={() => setType('html')}
            />
            <span className="text-gray-600 dark:text-gray-300">HTML</span>
          </label>
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={type === 'markdown'
          ? '# Paste your README Markdown here...'
          : '<!-- Paste your README HTML here... -->'}
        className="w-full h-40 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex items-center justify-end space-x-2">
        <button
          type="button"
          onClick={handleClear}
          className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={handlePreview}
          disabled={!content.trim() || !!isProcessing}
          className={`px-3 py-2 text-sm rounded-lg font-medium cursor-pointer
            ${!content.trim() || isProcessing
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'}`}
        >
          {isProcessing ? 'Processing…' : 'Preview'}
        </button>
      </div>
    </div>
  );
};
