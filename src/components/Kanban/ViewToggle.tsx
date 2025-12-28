import React, { useEffect, useState } from 'react';

interface ViewToggleProps {
  currentView: 'list' | 'kanban';
  onViewChange: (view: 'list' | 'kanban') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  const [view, setView] = useState<'list' | 'kanban'>(currentView);

  // Load preference from localStorage on mount
  useEffect(() => {
    const savedView = localStorage.getItem('insideJobs_viewMode') as 'list' | 'kanban' | null;
    if (savedView) {
      setView(savedView);
      onViewChange(savedView);
    }
  }, []);

  const handleViewChange = (newView: 'list' | 'kanban') => {
    setView(newView);
    onViewChange(newView);
    localStorage.setItem('insideJobs_viewMode', newView);
  };

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700 w-fit">
      {/* List View Button */}
      <button
        onClick={() => handleViewChange('list')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
          view === 'list'
            ? 'bg-primary text-white shadow-sm'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        aria-label="Switch to list view"
        title="List View"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <span className="text-sm font-medium hidden sm:inline">List</span>
      </button>

      {/* Kanban View Button */}
      <button
        onClick={() => handleViewChange('kanban')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
          view === 'kanban'
            ? 'bg-primary text-white shadow-sm'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        aria-label="Switch to kanban view"
        title="Kanban Board"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 3H3v6h6V3zm0 12H3v6h6v-6zm12 0h-6v6h6v-6zm0-12h-6v6h6V3z"
          />
        </svg>
        <span className="text-sm font-medium hidden sm:inline">Kanban</span>
      </button>
    </div>
  );
};

export default ViewToggle;
