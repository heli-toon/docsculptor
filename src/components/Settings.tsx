import React from 'react';
import type { PdfSettings } from '../types';

interface SettingsProps {
  settings: PdfSettings;
  onSettingsChange: (settings: PdfSettings) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  settings,
  onSettingsChange,
  isOpen,
  onToggle
}) => {
  const updateSettings = (updates: Partial<PdfSettings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  const updateNestedSettings = <K extends keyof PdfSettings>(
    section: K,
    updates: Partial<PdfSettings[K]>
  ) => {
    onSettingsChange({
      ...settings,
      [section]: {
        ...(settings[section] as object),
        ...updates
      }
    });
  };

  return (
    <div
      data-settings-panel
      className={`
      fixed right-0 top-0 h-full w-full sm:w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 
      transform transition-transform duration-300 ease-in-out z-40 shadow-2xl
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}
    `}>
      <div className="p-6 h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Export Settings
            </h2>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Customize your output</p>
          </div>
          <button title='Close Settings'
            type='button'
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
          >
            <i className="bi bi-x-lg text-gray-500" />
          </button>
        </div>

        <div className="space-y-8">
          {/* Document Features Section */}
          <section className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Document Features</h3>
            
            <div className="space-y-3">
              {/* Table of Contents */}
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Table of Contents</span>
                  <input
                    type="checkbox"
                    checked={settings.includeTableOfContents}
                    onChange={(e) => updateSettings({ includeTableOfContents: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </label>
                {settings.includeTableOfContents && (
                  <input
                    type="text"
                    placeholder="TOC Title (e.g. Table of Contents)"
                    value={settings.tocTitle || ''}
                    onChange={(e) => updateSettings({ tocTitle: e.target.value })}
                    className="w-full p-2 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                )}
              </div>

              {/* Page Numbers */}
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Page Numbers</span>
                  <input
                    type="checkbox"
                    checked={settings.includePageNumbers}
                    onChange={(e) => updateSettings({ includePageNumbers: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </label>
                {settings.includePageNumbers && (
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={settings.pageNumberStyle}
                      onChange={(e) => updateSettings({ pageNumberStyle: e.target.value as any })}
                      className="w-full p-2 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                    >
                      <option value="simple">Style: 1</option>
                      <option value="total">Style: 1 / 10</option>
                      <option value="accent">Style: — 1 —</option>
                    </select>
                    <select
                      value={settings.pageNumberPosition}
                      onChange={(e) => updateSettings({ pageNumberPosition: e.target.value as any })}
                      className="w-full p-2 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                    >
                      <option value="bottom-right">Bottom Right</option>
                      <option value="bottom-center">Bottom Center</option>
                      <option value="top-right">Top Right</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Export Settings Section */}
          <section className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Export Config</h3>
            
            <div className="space-y-4">
              {/* Export Mode */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateSettings({ exportMode: 'image' })}
                  className={`p-2 text-xs border rounded-lg transition-all ${
                    settings.exportMode === 'image'
                      ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Image Mode
                </button>
                <button
                  onClick={() => updateSettings({ exportMode: 'text' })}
                  className={`p-2 text-xs border rounded-lg transition-all ${
                    settings.exportMode === 'text'
                      ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Text Mode
                </button>
              </div>

              {/* Page Format & Orientation */}
              <div className="grid grid-cols-2 gap-2">
                <select title='Page Format'
                  value={settings.pageFormat}
                  onChange={(e) => updateSettings({ pageFormat: e.target.value as any })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                >
                  <option value="A4">A4</option>
                  <option value="Letter">Letter</option>
                  <option value="Legal">Legal</option>
                </select>
                <select title='Orientation'
                  value={settings.orientation}
                  onChange={(e) => updateSettings({ orientation: e.target.value as any })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
            </div>
          </section>

          {/* Typography Section */}
          <section className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Typography</h3>
            
            <div className="space-y-4">
              {/* Font Families */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <i className="bi bi-fonts text-gray-400" />
                  <select title='Body Font'
                    value={settings.fonts.body}
                    onChange={(e) => updateNestedSettings('fonts', { body: e.target.value })}
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded text-xs bg-white dark:bg-gray-800"
                  >
                    <option value="system-ui, sans-serif">Body: System Sans</option>
                    <option value="Georgia, serif">Body: Georgia</option>
                    <option value="Times, serif">Body: Times</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="bi bi-type-h1 text-gray-400" />
                  <select title='Heading Font'
                    value={settings.fonts.headings}
                    onChange={(e) => updateNestedSettings('fonts', { headings: e.target.value })}
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded text-xs bg-white dark:bg-gray-800"
                  >
                    <option value="system-ui, sans-serif">Heading: System Sans</option>
                    <option value="Georgia, serif">Heading: Georgia</option>
                    <option value="Arial, sans-serif">Heading: Arial</option>
                  </select>
                </div>
              </div>

              {/* Font Sizes */}
              <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] text-gray-500 uppercase">Body Size</span>
                    <span className="text-[10px] font-bold text-blue-500">{settings.fontSize.body}px</span>
                  </div>
                  <input type="range" min="10" max="24" value={settings.fontSize.body}
                    onChange={(e) => updateNestedSettings('fontSize', { body: Number(e.target.value) })}
                    className="w-full accent-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] text-gray-500 uppercase">Heading Size</span>
                    <span className="text-[10px] font-bold text-blue-500">{settings.fontSize.headings}px</span>
                  </div>
                  <input type="range" min="16" max="48" value={settings.fontSize.headings}
                    onChange={(e) => updateNestedSettings('fontSize', { headings: Number(e.target.value) })}
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Margins Section */}
          <section className="space-y-4 pb-10">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Layout Margins</h3>
            <div className="grid grid-cols-2 gap-3">
              {['top', 'right', 'bottom', 'left'].map((dir) => (
                <div key={dir} className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase">{dir}</label>
                  <input
                    type="number"
                    value={settings.margins[dir as keyof PdfSettings['margins']]}
                    onChange={(e) => updateNestedSettings('margins', { [dir]: Number(e.target.value) })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-xs bg-white dark:bg-gray-800"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};