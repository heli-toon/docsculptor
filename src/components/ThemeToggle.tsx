import React from 'react';
import { useTheme } from '../hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 ease-in-out group cursor-pointer"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-5 h-5">
        {theme === 'light' ? (
          <i className="bi bi-sun text-yellow-500 group-hover:rotate-12 transition-transform duration-200" />
        ) : (
          <i className="bi bi-moon-stars text-blue-400 group-hover:rotate-12 transition-transform duration-200" />
        )}
      </div>
    </button>
  );
};