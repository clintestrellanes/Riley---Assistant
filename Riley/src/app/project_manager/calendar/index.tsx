/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CalendarHeader from './components/CalendarHeader';
import CalendarGrid from './components/CalendarGrid';
import EventDrawer from './components/EventDrawer';
import type { CalendarEvent, ViewMode } from '../../../types/calendar';
import { AnimatePresence } from 'motion/react';

// types
import type { project } from '../../../types/project.types';

export default function CalendarView() {
  const { title } = useParams();
  
  // Fetch projects and current project once on mount
  const [projects, setProjects] = useState<project[]>(() => {
    const saved = localStorage.getItem("RileyProjects");
    return saved ? JSON.parse(saved) : [];
  });
  
  const currentProject = projects.find((project: project) => project.title === title);

  // --- STATES ENGINE ---

  // Default date representing current system timeline: June 14, 2026
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    return new Date(2026, 5, 14); // 0-indexed month: June = 5
  });

  // Active view: month, week, day, list modes
  const [viewMode, setViewMode] = useState<ViewMode>('month');

  // Query state for real-time text matching
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Load events directly from the current project's data
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    if (currentProject && currentProject.events) {
      return currentProject.events;
    }
    return []; // Fallback to empty if project has no events yet
  });

  // Current active event detail object for editing/viewing (null means New Event form)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Toggle state of side panel drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Dark/Light layout mode toggle state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('flowbite_calendar_theme');
    return savedTheme ? savedTheme === 'dark' : false;
  });

  // --- PERSISTENCE HOOKS ---

  // Sync index body classes list based on active dark theme state
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('flowbite_calendar_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('flowbite_calendar_theme', 'light');
    }
  }, [darkMode]);

  // 2. Helper function to sync events to the active project in localStorage
  const syncToProject = (updatedEvents: CalendarEvent[]) => {
    setEvents(updatedEvents); // Update the local calendar UI

    if (!currentProject) return;

    // Update the specific project with new events
    const updatedProject = { ...currentProject, events: updatedEvents };

    // Map through projects and replace the active one
    const updatedProjectsList = projects.map((p) => 
      p.title === title ? updatedProject : p
    );

    // Update states and LocalStorage
    setProjects(updatedProjectsList);
    localStorage.setItem("RileyProjects", JSON.stringify(updatedProjectsList));
  };


  // --- ACTIONS HANDLERS ---

  const handleNavigate = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      setCurrentDate(new Date(2026, 5, 14)); 
      return;
    }

    const modifier = direction === 'prev' ? -1 : 1;
    const nextDate = new Date(currentDate);

    if (viewMode === 'month') {
      nextDate.setMonth(currentDate.getMonth() + modifier);
    } else if (viewMode === 'week') {
      nextDate.setDate(currentDate.getDate() + modifier * 7);
    } else if (viewMode === 'day') {
      nextDate.setDate(currentDate.getDate() + modifier);
    } else if (viewMode === 'list') {
      nextDate.setMonth(currentDate.getMonth() + modifier);
    }

    setCurrentDate(nextDate);
  };

  const handleDateClick = (date: Date) => {
    setCurrentDate(date);
    setSelectedEvent(null);
    setIsDrawerOpen(true);
  };

  const handleEventClick = (eventItem: CalendarEvent) => {
    setSelectedEvent(eventItem);
    setIsDrawerOpen(true);
  };

  const handleNewEvent = () => {
    setSelectedEvent(null);
    setIsDrawerOpen(true);
  };

  // 3. Update Save handler to use syncToProject
  const handleSaveEvent = (savedEvent: CalendarEvent) => {
    let updatedEvents: CalendarEvent[];
    
    const exists = events.some((evt) => evt.id === savedEvent.id);
    if (exists) {
      updatedEvents = events.map((evt) => (evt.id === savedEvent.id ? savedEvent : evt));
    } else {
      updatedEvents = [...events, savedEvent];
    }
    
    syncToProject(updatedEvents);
    setIsDrawerOpen(false);
  };

  // 4. Update Delete handler to use syncToProject
  const handleDeleteEvent = (eventId: string) => {
    const updatedEvents = events.filter((evt) => evt.id !== eventId);
    
    syncToProject(updatedEvents);
    setIsDrawerOpen(false);
  };

  if (!currentProject) {
    return <div className="p-8 text-center">Project not found.</div>;
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-200" id="main-calendar-app">
      {/* 1. Header component */}
      <CalendarHeader
        currentDate={currentDate}
        onNavigate={handleNavigate}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewEvent={handleNewEvent}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* 2. Main content display grid */}
      <CalendarGrid
        currentDate={currentDate}
        events={events}
        searchQuery={searchQuery}
        viewMode={viewMode}
        onDateClick={handleDateClick}
        onEventClick={handleEventClick}
        onNewEvent={handleNewEvent}
      />

      {/* 3. Event Creation / Edition Slide-out Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <EventDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            event={selectedEvent}
            onSave={handleSaveEvent}
            onDelete={handleDeleteEvent}
            selectedDate={currentDate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}