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

  const updateNestedSettings = (
    section: keyof PdfSettings,
    updates: Partial<PdfSettings[typeof section]>
  ) => {
    onSettingsChange({
      ...settings,
      [section]: { ...(settings[section] && typeof settings[section] === 'object' ? settings[section] as Record<string, unknown> : {}), ...updates }
    });
  };

  return (
    <div className={`
      fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 
      transform transition-transform duration-300 ease-in-out z-40
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}
    `}>
      <div className="p-6 h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Export Settings
          </h2>
          <button title='Close Settings'
            type='button'
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <i className="bi bi-x-lg text-gray-500" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Page Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Page Format
            </label>
            <select title='Page Format'
              value={settings.pageFormat}
              onChange={(e) => updateSettings({ pageFormat: e.target.value as PdfSettings['pageFormat'] })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="A4">A4</option>
              <option value="Letter">Letter</option>
              <option value="Legal">Legal</option>
            </select>
          </div>

          {/* Orientation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Orientation
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => updateSettings({ orientation: 'portrait' })}
                className={`flex-1 p-2 border rounded-lg transition-colors ${
                  settings.orientation === 'portrait'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                Portrait
              </button>
              <button
                onClick={() => updateSettings({ orientation: 'landscape' })}
                className={`flex-1 p-2 border rounded-lg transition-colors ${
                  settings.orientation === 'landscape'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                Landscape
              </button>
            </div>
          </div>

          {/* Margins */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Margins (mm)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Top</label>
                <input title='Top Margin'
                  type="number"
                  value={settings.margins.top}
                  onChange={(e) => updateNestedSettings('margins', { top: Number(e.target.value) })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  min="0"
                  max="50"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Right</label>
                <input title='Right Margin'
                  type="number"
                  value={settings.margins.right}
                  onChange={(e) => updateNestedSettings('margins', { right: Number(e.target.value) })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  min="0"
                  max="50"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Bottom</label>
                <input title='Bottom Margin'
                  type="number"
                  value={settings.margins.bottom}
                  onChange={(e) => updateNestedSettings('margins', { bottom: Number(e.target.value) })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  min="0"
                  max="50"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Left</label>
                <input title='Left Margin'
                  type="number"
                  value={settings.margins.left}
                  onChange={(e) => updateNestedSettings('margins', { left: Number(e.target.value) })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  min="0"
                  max="50"
                />
              </div>
            </div>
          </div>

          {/* Font Sizes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Font Sizes (px)
            </label>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Body Text</label>
                <input title='Body Font Size'
                  type="range"
                  min="10"
                  max="20"
                  value={settings.fontSize.body}
                  onChange={(e) => updateNestedSettings('fontSize', { body: Number(e.target.value) })}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{settings.fontSize.body}px</span>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Headings</label>
                <input title='Heading Font Size'
                  type="range"
                  min="16"
                  max="32"
                  value={settings.fontSize.headings}
                  onChange={(e) => updateNestedSettings('fontSize', { headings: Number(e.target.value) })}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{settings.fontSize.headings}px</span>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Code</label>
                <input title='Code Font Size'
                  type="range"
                  min="8"
                  max="16"
                  value={settings.fontSize.code}
                  onChange={(e) => updateNestedSettings('fontSize', { code: Number(e.target.value) })}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{settings.fontSize.code}px</span>
              </div>
            </div>
          </div>

          {/* Font Families */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Font Families
            </label>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Body Font</label>
                <select title='Body Font'
                  value={settings.fonts.body}
                  onChange={(e) => updateNestedSettings('fonts', { body: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="system-ui, sans-serif">System Sans</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="Times, serif">Times</option>
                  <option value="Arial, sans-serif">Arial</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Heading Font</label>
                <select title='Heading Font'
                  value={settings.fonts.headings}
                  onChange={(e) => updateNestedSettings('fonts', { headings: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="system-ui, sans-serif">System Sans</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="Times, serif">Times</option>
                  <option value="Arial, sans-serif">Arial</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Code Font</label>
                <select title='Code Font'
                  value={settings.fonts.code}
                  onChange={(e) => updateNestedSettings('fonts', { code: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="Monaco, monospace">Monaco</option>
                  <option value="Consolas, monospace">Consolas</option>
                  <option value="'Courier New', monospace">Courier New</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Additional Options
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.includeTableOfContents}
                  onChange={(e) => updateSettings({ includeTableOfContents: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Table of Contents</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.includeCoverPage}
                  onChange={(e) => updateSettings({ includeCoverPage: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Cover Page</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.includePageNumbers}
                  onChange={(e) => updateSettings({ includePageNumbers: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Page Numbers</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};