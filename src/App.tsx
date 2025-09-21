import { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { Preview } from './components/Preview';
import { Settings } from './components/Settings';
import { Toolbar } from './components/Toolbar';
import { PasteInput } from './components/PasteInput';
import { useTheme } from './hooks/useTheme';
import { useMarkdown } from './hooks/useMarkdown';
import { usePdfExport } from './hooks/usePdfExport';
import type { MarkdownFile, PdfSettings } from './types';

function App() {
  useTheme();
  const { processedHtml, isProcessing, processMarkdown, clearProcessedHtml } = useMarkdown();
  const { exportToPdf, isExporting, exportProgress } = usePdfExport();
  
  const [currentFile, setCurrentFile] = useState<MarkdownFile | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<PdfSettings>({
    pageFormat: 'A4',
    orientation: 'portrait',
    exportMode: 'image',
    margins: { top: 20, right: 20, bottom: 20, left: 20 },
    fontSize: { body: 14, headings: 24, code: 12 },
    fonts: {
      body: 'system-ui, sans-serif',
      headings: 'system-ui, sans-serif',
      code: 'Monaco, monospace'
    },
    includeTableOfContents: false,
    includeCoverPage: false,
    includePageNumbers: false,
    headerText: '',
    footerText: ''
  });

  useEffect(() => {
    if (currentFile && currentFile.name) {
      processMarkdown(currentFile.content, currentFile.type);
    }
  }, [currentFile, processMarkdown]);

  const handleFileSelect = (file: MarkdownFile) => {
    if (!file.name) {
      setCurrentFile(null);
      clearProcessedHtml();
      return;
    }
    setCurrentFile(file);
  };

  const handlePastePreview = (content: string, type: 'markdown' | 'html') => {
    setCurrentFile(null);
    processMarkdown(content, type);
  };

  const handleExport = async () => {
    if (!processedHtml) return;

    try {
      const fileName = currentFile
        ? currentFile.name.replace(/\.[^/.]+$/, '')
        : 'document';
      await exportToPdf(processedHtml, fileName, settings);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const handleSettingsToggle = () => {
    setSettingsOpen(!settingsOpen);
  };

  const handleClearPreview = () => {
    setCurrentFile(null);
    clearProcessedHtml();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (settingsOpen && !target.closest('[data-settings-panel]') && !target.closest('[data-settings-trigger]')) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [settingsOpen]);

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Toolbar
        currentFile={currentFile}
        onExport={handleExport}
        onSettingsToggle={handleSettingsToggle}
        isExporting={isExporting}
        exportProgress={exportProgress}
        settingsOpen={settingsOpen}
        canExport={!!processedHtml}
      />

      {settingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 z-30 transition-opacity duration-300 pointer-events-none" />
      )}

      <div className="flex h-[calc(100vh-73px)]">
        <div className={`flex-1 transition-all duration-300 ${settingsOpen ? 'mr-80' : ''}`}>
          <div className="grid lg:grid-cols-2 h-full">
            <div className="p-6 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="h-full flex flex-col">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Upload Document
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Upload your Markdown or HTML file to get started
                  </p>
                </div>
                <div className="flex-1">
                  <FileUpload
                    onFileSelect={handleFileSelect}
                    currentFile={currentFile}
                  />
                  <div className="mt-6">
                    <PasteInput
                      onPreview={handlePastePreview}
                      onClear={() => { setCurrentFile(null); clearProcessedHtml(); }}
                      isProcessing={isProcessing}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900">
              <div className="p-6 h-full flex flex-col">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Preview
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Live preview of your rendered document
                  </p>
                </div>
                <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                  <Preview 
                    content={processedHtml} 
                    isProcessing={isProcessing} 
                    onClear={processedHtml ? handleClearPreview : undefined}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Settings
          settings={settings}
          onSettingsChange={setSettings}
          isOpen={settingsOpen}
          onToggle={handleSettingsToggle}
        />
      </div>
    </div>
  );
}

export default App;