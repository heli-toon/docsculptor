import React, { useCallback, useState } from 'react';
import type { MarkdownFile } from '../types';

interface FileUploadProps {
  onFileSelect: (file: MarkdownFile) => void;
  currentFile: MarkdownFile | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, currentFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');

  const validateFile = (file: File): boolean => {
    const validExtensions = ['.md', '.markdown', '.html', '.htm'];
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validExtensions.includes(extension)) {
      setError('Please select a Markdown (.md) or HTML (.html) file');
      return false;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB');
      return false;
    }
    
    setError('');
    return true;
  };

  const processFile = useCallback((file: File) => {
    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      const type = extension === '.html' || extension === '.htm' ? 'html' : 'markdown';
      
      const markdownFile: MarkdownFile = {
        name: file.name,
        content,
        type,
        size: file.size,
        lastModified: file.lastModified
      };
      
      onFileSelect(markdownFile);
    };
    
    reader.onerror = () => {
      setError('Error reading file');
    };
    
    reader.readAsText(file);
  }, [onFileSelect]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  return (
    <div className="space-y-4">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ease-in-out
          ${isDragging 
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${currentFile ? 'bg-green-50 dark:bg-green-900/20 border-green-400' : 'bg-gray-50 dark:bg-gray-800/50'}
        `}
        onDrag={handleDrag}
        onDragStart={handleDrag}
        onDragEnd={handleDragOut}
        onDragOver={handleDragIn}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDrop={handleDrop}
      >
        <input title='File Upload'
          type="file"
          id="file-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".md,.markdown,.html,.htm"
          onChange={handleFileSelect}
        />
        
        <div className="space-y-4">
          {currentFile ? (
            <div className="flex items-center justify-center space-x-3">
              <i className="bi bi-file-earmark-text text-3xl text-green-500" />
              <div className="text-left">
                <p className="font-semibold text-gray-900 dark:text-gray-100">{currentFile.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(currentFile.size / 1024).toFixed(1)} KB • {currentFile.type}
                </p>
              </div>
            </div>
          ) : (
            <>
              <i className={`bi bi-cloud-upload text-4xl transition-colors duration-200 ${
                isDragging ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'
              }`} />
              <div>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Drop your file here
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  or click to browse
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">.md</span>
                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">.markdown</span>
                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">.html</span>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
          <i className="bi bi-exclamation-triangle" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {currentFile && (
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-3">
            <i className="bi bi-check-circle text-green-500" />
            <span className="text-sm text-green-700 dark:text-green-300">
              File loaded successfully
            </span>
          </div>
          <button
            onClick={() => onFileSelect({} as MarkdownFile)}
            className="text-green-600 hover:text-green-700 text-sm underline cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};