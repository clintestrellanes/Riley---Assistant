import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Bell, 
  Grid as GridIcon, 
  Moon, 
  Sun, 
  Plus,
  Calendar as CalendarIcon
} from 'lucide-react';
import type { ViewMode } from '../../../../types/calendar';
import { MONTHS } from '../utils/calendarUtils';

interface CalendarHeaderProps {
  currentDate: Date;
  onNavigate: (direction: 'prev' | 'next' | 'today') => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewEvent: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function CalendarHeader({
  currentDate,
  onNavigate,
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  onNewEvent,
  darkMode,
  onToggleDarkMode,
}: CalendarHeaderProps) {
  const monthName = MONTHS[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  // Handle formatted date title based on the active view
  const getHeaderTitle = () => {
    if (viewMode === 'day') {
      return `${monthName} ${currentDate.getDate()}, ${year}`;
    }
    return `${monthName} ${year}`;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 transition-colors duration-200">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Left Section: Logo & Nav Controls */}
        <div className="flex flex-wrap items-center gap-3 md:gap-5">
          {/* Logo Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <span className="font-sans text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Riley
            </span>
          </div>

          {/* Nav Controls */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800">
              <button
                id="prev-btn"
                onClick={() => onNavigate('prev')}
                className="flex h-8 w-8 items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-l-md transition-colors"
                title="Previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                id="next-btn"
                onClick={() => onNavigate('next')}
                className="flex h-8 w-8 items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-r-md transition-colors border-l border-gray-300 dark:border-slate-700"
                title="Next"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <button
              id="today-btn"
              onClick={() => onNavigate('today')}
              className="rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              today
            </button>
          </div>

          {/* Header Title (Current Month/Year) */}
          <h1 className="text-lg font-bold text-gray-900 dark:text-white min-w-[120px]">
            {getHeaderTitle()}
          </h1>
        </div>

        {/* Center Section: Search Input */}
        <div className="relative flex-1 max-w-md sm:mx-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400 dark:text-slate-500" />
          </div>
          <input
            id="search-input"
            type="text"
            placeholder="Search events, locations, guests..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 py-2 pl-9 pr-4 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:focus:bg-slate-900 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
          />
        </div>

        {/* Right Section: View Selector, Actions, Preferences */}
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
          {/* View Segmented Controls */}
          <div className="flex rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-850 p-1">
            {(['month', 'week', 'day', 'list'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                id={`view-btn-${mode}`}
                onClick={() => onViewModeChange(mode)}
                className={`rounded-md px-3 py-1 text-xs font-semibold capitalize transition-all ${
                  viewMode === mode
                    ? 'bg-white dark:bg-slate-700 text-gray-950 dark:text-white shadow-xs'
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* New Event Button */}
          <button
            id="new-event-btn"
            onClick={onNewEvent}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New event</span>
            <span className="sm:hidden">New</span>
          </button>

          {/* Icon Utilities Panel */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Notifications */}
            <button
              id="notifications-btn"
              className="relative rounded-lg p-1.5 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-colors"
              title="Notifications"
            >
              <Bell className="h-4 sm:h-5 w-4 sm:w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
            </button>

            {/* Grid Icon */}
            <button
              id="apps-btn"
              className="rounded-lg p-1.5 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-colors"
              title="Apps"
            >
              <GridIcon className="h-4 sm:h-5 w-4 sm:w-5" />
            </button>

            {/* Dark Mode toggle */}
            <button
              id="dark-mode-toggle"
              onClick={onToggleDarkMode}
              className="rounded-lg p-1.5 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-colors"
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? (
                <Sun className="h-4 sm:h-5 w-4 sm:w-5 text-amber-500" />
              ) : (
                <Moon className="h-4 sm:h-5 w-4 sm:w-5" />
              )}
            </button>

            {/* User Profile */}
            <div className="h-8 w-8 overflow-hidden rounded-full border border-gray-300 dark:border-slate-700 bg-gray-100 dark:bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80"
                alt="Profile"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=Clint`;
                }}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
