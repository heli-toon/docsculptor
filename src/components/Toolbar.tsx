import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import type { MarkdownFile } from '../types';

interface ToolbarProps {
  currentFile: MarkdownFile | null;
  onExport: () => void;
  onSettingsToggle: () => void;
  isExporting: boolean;
  exportProgress: number;
  settingsOpen: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  currentFile,
  onExport,
  onSettingsToggle,
  isExporting,
  exportProgress,
  settingsOpen
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <i className="bi bi-file-earmark-pdf text-2xl text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            DocSculptor
          </h1>
        </div>
        {currentFile && (
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <span>•</span>
            <span>{currentFile.name}</span>
            <span>•</span>
            <span>{(currentFile.size / 1024).toFixed(1)} KB</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={onSettingsToggle}
          className={`p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
            settingsOpen
              ? 'bg-blue-500 text-white border-blue-500'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
          title="Export Settings"
        >
          <i className="bi bi-gear" />
        </button>

        <button
          onClick={onExport}
          disabled={!currentFile || isExporting}
          className={`
            px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 cursor-pointer
            ${currentFile && !isExporting
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }
          `}
          title={currentFile ? 'Export to PDF' : 'Upload a file first'}
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>{exportProgress}%</span>
            </>
          ) : (
            <>
              <i className="bi bi-download" />
              <span className="hidden sm:inline">Export PDF</span>
            </>
          )}
        </button>

        <ThemeToggle />
      </div>
    </div>
  );
};