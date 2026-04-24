import { useState, useEffect, useCallback } from 'react';
import { useHotkey } from '@tanstack/react-hotkeys';
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
    footerText: '',
    pageNumberStyle: 'simple',
    pageNumberPosition: 'bottom-right'
  });

  useEffect(() => {
    const savedDraft = localStorage.getItem('docsculptor_draft');
    if (savedDraft) {
      try {
        setCurrentFile(JSON.parse(savedDraft));
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (currentFile && currentFile.name) {
      processMarkdown(currentFile.content, currentFile.type, settings);
    }
  }, [currentFile, processMarkdown, settings]);

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
    processMarkdown(content, type, settings);
  };

  const handleExport = useCallback(async () => {
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
  }, [processedHtml, currentFile, exportToPdf, settings]);

  const handleSettingsToggle = useCallback(() => {
    setSettingsOpen(prev => !prev);
  }, []);

  const handleClearPreview = () => {
    setCurrentFile(null);
    clearProcessedHtml();
    localStorage.removeItem('docsculptor_draft');
  };

  const handleSaveDraft = useCallback(() => {
    if (currentFile) {
      localStorage.setItem('docsculptor_draft', JSON.stringify(currentFile));
      alert('Draft saved to local storage!');
    } else {
      alert('Nothing to save. Please upload or paste content first.');
    }
  }, [currentFile]);

  const handleOpenFile = useCallback(() => {
    document.getElementById('file-upload')?.click();
  }, []);

  useHotkey('Mod+E', e => {
    e.preventDefault();
    handleExport();
  });

  useHotkey('Mod+O', e => {
    e.preventDefault();
    handleOpenFile();
  });

  useHotkey('Mod+S', e => {
    e.preventDefault();
    handleSaveDraft();
  });

  useHotkey('Mod+,', e => {
    e.preventDefault();
    handleSettingsToggle();
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        settingsOpen &&
        !target.closest('[data-settings-panel]') &&
        !target.closest('[data-settings-trigger]')
      ) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [settingsOpen]);

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
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
        <div className="fixed inset-0 bg-black/25 dark:bg-black/50 z-30 pointer-events-none" />
      )}

      <div className="flex-1 relative lg:overflow-hidden">
        <div className={`flex-1 ${settingsOpen ? 'lg:mr-80' : ''} lg:h-full`}>
          <div className="flex flex-col lg:flex-row lg:h-full">

            <div className="w-full lg:w-1/2 lg:h-full flex flex-col min-h-0 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-lg font-semibold mb-2">Upload Document</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upload your Markdown or HTML file to get started
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 min-h-0">
                <FileUpload
                  onFileSelect={handleFileSelect}
                  currentFile={currentFile}
                />
                <div className="mt-6">
                  <PasteInput
                    onPreview={handlePastePreview}
                    onClear={handleClearPreview}
                    isProcessing={isProcessing}
                  />
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 lg:h-full flex flex-col min-h-0 bg-white dark:bg-gray-900">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-lg font-semibold mb-2">Preview</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Live preview of your rendered document
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 min-h-0">
                <div className="h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-auto bg-white dark:bg-gray-800">
                  <Preview
                    content={processedHtml}
                    isProcessing={isProcessing}
                    onClear={processedHtml ? handleClearPreview : undefined}
                    settings={settings}
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