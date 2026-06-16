import React from 'react';
import { 
  isSameDay, 
  getDaysInMonthGrid, 
  getWeekDates, 
  WEEKDAYS, 
  EVENT_COLORS, 
  formatTime12h,
  formatDate,
  parseDateString,
  MONTHS
} from '../utils/calendarUtils';
import type { CalendarEvent, ViewMode } from '../../../../types/calendar';
import { Clock, MapPin, Users, Calendar, AlertCircle, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  searchQuery: string;
  viewMode: ViewMode;
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onNewEvent: () => void;
}

export default function CalendarGrid({
  currentDate,
  events,
  searchQuery,
  viewMode,
  onDateClick,
  onEventClick,
  onNewEvent,
}: CalendarGridProps) {
  
  // Filter events by search query matching title, description, location, or guests
  const filteredEvents = events.filter((evt) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const titleMatch = evt.title?.toLowerCase().includes(query);
    const descMatch = evt.description?.toLowerCase().includes(query);
    const locMatch = evt.location?.toLowerCase().includes(query);
    const guestMatch = evt.guests?.some((g) => g.toLowerCase().includes(query));
    return titleMatch || descMatch || locMatch || guestMatch;
  });

  // Get current year and month for grid processing
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Highlight color classes list
  const getEventBadgeClasses = (colorName: string) => {
    const config = EVENT_COLORS[colorName] || EVENT_COLORS.blue;
    return `${config.bg} ${config.bgHover} border-l-3 ${config.border}`;
  };

  const getDotClass = (colorName: string) => {
    const config = EVENT_COLORS[colorName] || EVENT_COLORS.blue;
    return config.labelBg;
  };

  // --- RENDER MONTH VIEW ---
  const renderMonthView = () => {
    const gridDates = getDaysInMonthGrid(year, month);
    const today = new Date();

    return (
      <div className="flex flex-col h-full select-none" id="month-view-container">
        {/* Weekday labels */}
        <div className="grid grid-cols-7 border-b border-gray-250 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
          {WEEKDAYS.map((day, idx) => (
            <div key={idx} className="py-2.5 outline-none">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day[0]}</span>
            </div>
          ))}
        </div>

        {/* 42-day Month Grid */}
        <div className="grid grid-cols-7 grid-rows-6 flex-1 bg-gray-200 dark:bg-slate-800 divide-x divide-y divide-gray-200 dark:divide-slate-800 border-b border-gray-200 dark:border-slate-800">
          {gridDates.map((date, index) => {
            const isCurrentMonth = date.getMonth() === month;
            const isTodayDate = isSameDay(date, today);
            const dateStr = formatDate(date);
            
            // Events occurring on this specific calendar date
            const dayEvents = filteredEvents.filter((evt) => {
              // Checks if the event covers this day (single-day or spanning across dates)
              return evt.startDate <= dateStr && dateStr <= evt.endDate;
            });

            return (
              <div
                key={index}
                onClick={() => onDateClick(date)}
                className={`flex flex-col min-h-[90px] p-1 sm:p-2 bg-white dark:bg-slate-900 cursor-pointer overflow-hidden group hover:bg-gray-50 dark:hover:bg-slate-850/30 transition-colors ${
                  !isCurrentMonth ? 'text-gray-400 dark:text-slate-600' : 'text-gray-900 dark:text-white'
                }`}
                id={`cell-${dateStr}`}
              >
                {/* Header of grid cell */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`inline-flex items-center justify-center text-xs font-semibold rounded-full min-w-[20px] h-[20px] px-1 transition-colors ${
                      isTodayDate
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-gray-800 dark:text-slate-200 hover:bg-gray-150 dark:hover:bg-slate-700'
                    } ${!isCurrentMonth ? 'opacity-50' : 'opacity-100'}`}
                  >
                    {date.getDate()}
                  </span>
                  
                  {/* Plus icon on hover for quick add */}
                  <span className="hidden sm:group-hover:inline-block text-[10px] text-gray-400 dark:text-slate-500 font-semibold px-1 rounded-sm bg-gray-100 dark:bg-slate-800">
                    + Add
                  </span>
                </div>

                {/* Event indicators - Full capsules on desktop/tablet, indicator dots on tiny mobile screens */}
                <div className="flex-1 flex flex-col gap-1 overflow-y-auto no-scrollbar">
                  {/* Desktop/Tablet capsules list */}
                  <div className="hidden min-[480px]:flex flex-col gap-1">
                    {dayEvents.map((evt) => (
                      <div
                        key={evt.id}
                        id={`event-pill-${evt.id}`}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents cell click trigger
                          onEventClick(evt);
                        }}
                        className={`flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[10px] sm:text-[11px] font-medium leading-tight transition-all truncate border-l-2 ${getEventBadgeClasses(
                          evt.color
                        )}`}
                        title={`${evt.title}${evt.startTime ? ` (${formatTime12h(evt.startTime)})` : ''}`}
                      >
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${getDotClass(evt.color)}`} />
                        <span className="truncate">{evt.title}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tiny mobile indicators */}
                  <div className="flex min-[480px]:hidden flex-wrap justify-center gap-1 mt-0.5">
                    {dayEvents.map((evt) => (
                      <div
                        key={evt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(evt);
                        }}
                        className={`h-2 w-2 rounded-full ring-1 ring-white dark:ring-slate-900 ${getDotClass(evt.color)}`}
                        title={evt.title}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // --- RENDER WEEK VIEW ---
  const renderWeekView = () => {
    const weekDates = getWeekDates(currentDate);
    const today = new Date();

    return (
      <div className="flex flex-col h-full bg-white dark:bg-slate-900" id="week-view-container">
        {/* On Mobile, layout wraps vertically to keep details clean. On desktop: 7 equal grid columns */}
        <div className="grid grid-cols-1 md:grid-cols-7 flex-1 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-slate-800 h-full overflow-y-auto">
          {weekDates.map((date, idx) => {
            const isTodayDate = isSameDay(date, today);
            const dateStr = formatDate(date);
            const weekdayName = WEEKDAYS[date.getDay()];

            // Events for this specific date
            const dayEvents = filteredEvents.filter((evt) => {
              return evt.startDate <= dateStr && dateStr <= evt.endDate;
            });

            return (
              <div 
                key={idx}
                className={`flex flex-col p-4 bg-white dark:bg-slate-900 md:min-h-[500px] hover:bg-gray-50/50 dark:hover:bg-slate-850/10 transition-colors ${
                  isTodayDate ? 'bg-blue-50/10 dark:bg-slate-850/20' : ''
                }`}
              >
                {/* Header */}
                <div onClick={() => onDateClick(date)} className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-2 mb-3 cursor-pointer group">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-gray-500 dark:text-slate-400 capitalize">
                      {weekdayName}
                    </span>
                    <span className={`text-xl font-bold flex items-center justify-center h-8 w-8 rounded-full ${
                      isTodayDate ? 'bg-blue-600 text-white' : 'text-gray-900 dark:text-white'
                    }`}>
                      {date.getDate()}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Add +
                  </span>
                </div>

                {/* Events listing */}
                <div className="flex-1 flex flex-col gap-2.5">
                  {dayEvents.length === 0 ? (
                    <div 
                      onClick={() => onDateClick(date)}
                      className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-lg p-4 cursor-pointer hover:border-gray-300 dark:hover:border-slate-700 group transition-all"
                    >
                      <span className="text-xs text-gray-400 group-hover:text-gray-600 dark:group-hover:text-slate-400">
                        No events
                      </span>
                    </div>
                  ) : (
                    dayEvents.map((evt) => (
                      <div
                        key={evt.id}
                        onClick={() => onEventClick(evt)}
                        className={`p-3 rounded-lg border border-l-4 cursor-pointer shadow-xs transition-transform hover:-translate-y-0.5 ${getEventBadgeClasses(
                          evt.color
                        )}`}
                      >
                        <h4 className="text-xs font-bold leading-snug line-clamp-2">{evt.title}</h4>
                        
                        {(evt.startTime || evt.location) && (
                          <div className="mt-2 space-y-1 text-[10px] opacity-90">
                            {evt.startTime && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 shrink-0" />
                                <span>{formatTime12h(evt.startTime)} {evt.endTime ? `- ${formatTime12h(evt.endTime)}` : ''}</span>
                              </div>
                            )}
                            {evt.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 shrink-0" />
                                <span className="truncate">{evt.location}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // --- RENDER SINGLE DAY VIEW ---
  const renderDayView = () => {
    const today = new Date();
    const isTodayDate = isSameDay(currentDate, today);
    const dateStr = formatDate(currentDate);

    // Filter events for active day
    const dayEvents = filteredEvents.filter((evt) => {
      return evt.startDate <= dateStr && dateStr <= evt.endDate;
    });

    return (
      <div className="flex flex-col h-full max-w-4xl mx-auto p-4 sm:p-6 bg-white dark:bg-slate-900" id="day-view-container">
        {/* Day Header display */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 dark:border-slate-800 pb-5 mb-5">
          <div className="flex items-center gap-4">
            <div className={`flex flex-col items-center justify-center h-16 w-16 rounded-2xl ${
              isTodayDate ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-slate-850 text-gray-800 dark:text-slate-200'
            }`}>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                {WEEKDAYS[currentDate.getDay()]}
              </span>
              <span className="text-2xl font-black leading-none">
                {currentDate.getDate()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''} scheduled for this day
              </p>
            </div>
          </div>

          <button
            onClick={() => onDateClick(currentDate)}
            className="inline-flex items-center justify-center gap-1 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            Create Event
          </button>
        </div>

        {/* Schedule Listing */}
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {dayEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl bg-gray-50/50 dark:bg-slate-900/10">
              <Calendar className="h-10 w-10 text-gray-300 dark:text-slate-700 mb-2" />
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-300">Nothing scheduled for today</p>
              <p className="text-xs text-gray-400 mt-1">Enjoy a completely free, unstructured schedule!</p>
            </div>
          ) : (
            dayEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => onEventClick(evt)}
                className={`flex flex-col md:flex-row md:items-start justify-between gap-4 p-5 rounded-2xl border border-l-4 cursor-pointer transition-shadow hover:shadow-md ${getEventBadgeClasses(
                  evt.color
                )}`}
              >
                <div className="space-y-3 flex-1">
                  <div>
                    <span className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-2 ${
                      evt.allDay ? 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700'
                    }`}>
                      {evt.allDay ? 'All Day' : 'Timed Event'}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold leading-snug">{evt.title}</h3>
                  </div>

                  {evt.description && (
                    <p className="text-xs sm:text-sm leading-relaxed opacity-90 block">
                      {evt.description}
                    </p>
                  )}

                  {/* Detail pills */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs opacity-95 pt-1">
                    {evt.startTime && (
                      <div className="flex items-center gap-1.5" title="Time">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        <span>{formatTime12h(evt.startTime)} {evt.endTime ? `- ${formatTime12h(evt.endTime)}` : ''}</span>
                      </div>
                    )}
                    {evt.location && (
                      <div className="flex items-center gap-1.5" title="Location">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span>{evt.location}</span>
                      </div>
                    )}
                    {evt.guests.length > 0 && (
                      <div className="flex items-center gap-1.5" title="Guests">
                        <Users className="h-3.5 w-3.5 shrink-0" />
                        <span>{evt.guests.length} guest{evt.guests.length > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Show thumbnail list of attendee emails */}
                {evt.guests.length > 0 && (
                  <div className="flex -space-x-2 overflow-hidden self-start md:self-center pr-2">
                    {evt.guests.slice(0, 4).map((email, gIdx) => (
                      <img
                        key={gIdx}
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`}
                        alt={email}
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-gray-100"
                        title={email}
                      />
                    ))}
                    {evt.guests.length > 4 && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-850 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                        +{evt.guests.length - 4}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // --- RENDER AGENDA LIST VIEW ---
  const renderListView = () => {
    // Sort all future/filtered events chronologically by date
    const sortedEvents = [...filteredEvents].sort((a, b) => a.startDate.localeCompare(b.startDate));

    return (
      <div className="p-4 sm:p-6 max-w-4xl mx-auto h-full overflow-y-auto" id="list-view-container">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-slate-800 pb-3">
          Upcoming Events Agenda
        </h2>

        {sortedEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl bg-gray-50/50 dark:bg-slate-900/10">
            <AlertCircle className="h-10 w-10 text-gray-300 dark:text-slate-700 mb-2" />
            <p className="text-sm font-semibold text-gray-700 dark:text-slate-300">No events matched your search</p>
            <p className="text-xs text-gray-400 mt-1">Try refining your query search or build a brand new scheduling.</p>
            <button
              onClick={onNewEvent}
              className="mt-6 inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="h-4 w-4" /> Add New Event
            </button>
          </div>
        ) : (
          <div className="relative border-l border-gray-200 dark:border-slate-800 ml-3 md:ml-4 pl-4 md:pl-6 space-y-8 pb-8">
            <AnimatePresence initial={false}>
              {sortedEvents.map((evt) => {
                const eventDate = parseDateString(evt.startDate);
                const dayStr = eventDate.getDate();
                const yearStr = eventDate.getFullYear();
                const monthStr = MONTHS[eventDate.getMonth()];
                
                return (
                  <motion.div
                    key={evt.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="relative group cursor-pointer"
                    onClick={() => onEventClick(evt)}
                  >
                    {/* Event bullet point node on timeline */}
                    <span className={`absolute -left-[25px] md:-left-[33px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white dark:bg-slate-900 ring-2 ring-gray-200 dark:ring-slate-800 transition-transform group-hover:scale-125`}>
                      <span className={`h-2 w-2 rounded-full ${getDotClass(evt.color)}`} />
                    </span>

                    {/* Date subtitle header badge */}
                    <div className="flex items-center gap-2 mb-1.5 text-xs text-gray-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                      <span>{monthStr} {dayStr}, {yearStr}</span>
                      {evt.startTime && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-gray-300" />
                          <span className="flex items-center gap-1 font-semibold lowercase">
                            <Clock className="h-3 w-3" /> {formatTime12h(evt.startTime)}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Content Detail Card */}
                    <div className={`p-4 sm:p-5 rounded-2xl border border-l-4 shadow-xs transition-shadow duration-200 hover:shadow-md ${getEventBadgeClasses(
                      evt.color
                    )}`}>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <h3 className="text-base font-bold leading-tight">{evt.title}</h3>
                          {evt.description && (
                            <p className="text-xs sm:text-sm opacity-90 leading-relaxed block pl-0.5">
                              {evt.description}
                            </p>
                          )}
                        </div>

                        {/* Location Badge */}
                        {evt.location && (
                          <div className="flex items-center gap-1 text-[11px] font-semibold bg-white/40 dark:bg-black/10 px-2 py-1 rounded-md self-start border border-black/5 dark:border-white/5 whitespace-nowrap">
                            <MapPin className="h-3 w-3" />
                            <span className="max-w-[150px] truncate">{evt.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Attendee Guest list indicator summary inside list view */}
                      {evt.guests.length > 0 && (
                        <div className="mt-4 flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-3">
                          <div className="flex -space-x-1.5 overflow-hidden">
                            {evt.guests.slice(0, 5).map((email, gIdx) => (
                              <img
                                key={gIdx}
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`}
                                alt={email}
                                className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-900 bg-gray-100"
                                title={email}
                              />
                            ))}
                            {evt.guests.length > 5 && (
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                                +{evt.guests.length - 5}
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] uppercase tracking-wider font-bold opacity-75">
                            {evt.guests.length} Joined Guest{evt.guests.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    );
  };

  // Main layout router based on user view option selection state 
  return (
    <div className="flex-1 overflow-auto bg-gray-50 dark:bg-slate-950 transition-colors duration-200">
      {viewMode === 'month' && renderMonthView()}
      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'day' && renderDayView()}
      {viewMode === 'list' && renderListView()}
    </div>
  );
}
