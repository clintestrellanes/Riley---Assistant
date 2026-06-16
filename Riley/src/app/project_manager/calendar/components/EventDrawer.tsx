import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Plus, 
  Trash2, 
  Check,
  Mail
} from 'lucide-react';
import type { CalendarEvent } from '../../../../types/calendar';
import { EVENT_COLORS, formatDate } from '../utils/calendarUtils';
import { motion } from 'motion/react';

interface EventDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null; // Null means "New Event" creation
  onSave: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
  selectedDate: Date; // Pre-fills starting date if we clicked a blank grid cell
}

// Map the color keys available in tag selector 
const COLORS_LIST = ['purple', 'indigo', 'blue', 'pink', 'cyan', 'green', 'yellow', 'orange', 'red'];

export default function EventDrawer({
  isOpen,
  onClose,
  event,
  onSave,
  onDelete,
  selectedDate,
}: EventDrawerProps) {
  // --- STATE BOUNDS ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [allDay, setAllDay] = useState(true);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [location, setLocation] = useState('');
  
  // Guests collection states
  const [guestEmail, setGuestEmail] = useState('');
  const [guests, setGuests] = useState<string[]>([]);
  
  // Custom Tag Color
  const [selectedColor, setSelectedColor] = useState('blue');
  
  // Permissions States
  const [modifyPerm, setModifyPerm] = useState(false);
  const [inviteOthersPerm, setInviteOthersPerm] = useState(true);
  const [seeGuestListPerm, setSeeGuestListPerm] = useState(true);

  // Sync state with active event or defaults when drawer is mounted/changed
  useEffect(() => {
    if (event) {
      // Editing Mode
      setTitle(event.title || '');
      setDescription(event.description || '');
      setStartDate(event.startDate || '');
      setEndDate(event.endDate || '');
      setAllDay(event.allDay);
      setStartTime(event.startTime || '09:00');
      setEndTime(event.endTime || '10:00');
      setLocation(event.location || '');
      setGuests(event.guests || []);
      setSelectedColor(event.color || 'blue');
      setModifyPerm(event.permissions?.modify ?? false);
      setInviteOthersPerm(event.permissions?.inviteOthers ?? true);
      setSeeGuestListPerm(event.permissions?.seeGuestList ?? true);
    } else {
      // Creating New Mode
      setTitle('');
      setDescription('');
      
      const formattedDefault = formatDate(selectedDate);
      setStartDate(formattedDefault);
      setEndDate(formattedDefault);
      setAllDay(true);
      setStartTime('09:00');
      setEndTime('10:00');
      setLocation('');
      setGuests([]);
      setSelectedColor('blue');
      setModifyPerm(false);
      setInviteOthersPerm(true);
      setSeeGuestListPerm(true);
    }
    setGuestEmail('');
  }, [event, selectedDate, isOpen]);

  if (!isOpen) return null;

  // Add guest email to stack with regex test
  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = guestEmail.trim().toLowerCase();
    if (!cleanEmail) return;
    
    // Quick simple check for typical email pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      alert('Please enter a valid guest email address.');
      return;
    }
    
    if (guests.includes(cleanEmail)) {
      alert('This guest is already added.');
      return;
    }

    setGuests([...guests, cleanEmail]);
    setGuestEmail('');
  };

  // Remove guest email from index
  const handleRemoveGuest = (emailToRemove: string) => {
    setGuests(guests.filter(email => email !== emailToRemove));
  };

  // Submit complete event payload
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please specify an event title.');
      return;
    }

    if (!startDate) {
      alert('Please specify a valid start date.');
      return;
    }

    // Verify dates alignment
    if (endDate && startDate > endDate) {
      alert('End date cannot precede the start date.');
      return;
    }

    const updatedEvent: CalendarEvent = {
      id: event?.id || crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      startDate,
      endDate: endDate || startDate,
      allDay,
      startTime: !allDay ? startTime : undefined,
      endTime: !allDay ? endTime : undefined,
      location: location.trim() || undefined,
      guests,
      color: selectedColor,
      permissions: {
        modify: modifyPerm,
        inviteOthers: inviteOthersPerm,
        seeGuestList: seeGuestListPerm
      }
    };

    onSave(updatedEvent);
    onClose();
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slideout Form Panel */}
      <motion.div
        id="new-event-drawer"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-800 shadow-2xl overflow-hidden font-sans transition-colors duration-200"
      >
        {/* Header toolbar */}
        <div className="flex items-center justify-between border-b border-gray-150 dark:border-slate-800 px-5 py-4">
          <h2 className="text-sm font-bold tracking-wider text-gray-700 dark:text-slate-350 uppercase select-none">
            {event ? 'Edit Event' : 'New Event'}
          </h2>
          
          <div className="flex items-center gap-2">
            {/* If editing, show quick Trash button */}
            {event && (
              <button
                id="delete-event-header-btn"
                type="button"
                onClick={() => {
                  if (confirm('Are you absolutely sure you want to delete this event?')) {
                    onDelete(event.id);
                    onClose();
                  }
                }}
                className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/20 dark:hover:text-red-500 transition-colors cursor-pointer"
                title="Delete Event"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
            )}

            <button
              id="close-drawer-btn"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable inputs form container */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar">
          
          {/* 1. Title Input */}
          <div className="space-y-1.5 animate-fade-in">
            <label htmlFor="event-title" className="block text-xs font-bold text-gray-700 dark:text-slate-355 uppercase tracking-wide">
              Title
            </label>
            <input
              id="event-title"
              type="text"
              required
              placeholder="Add title here"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm font-medium text-gray-950 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* 2. Description Text Area */}
          <div className="space-y-1.5">
            <label htmlFor="event-description" className="block text-xs font-bold text-gray-700 dark:text-slate-355 uppercase tracking-wide">
              Description
            </label>
            <textarea
              id="event-description"
              rows={3}
              placeholder="Enter event description here"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm font-medium text-gray-955 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all resize-y"
            />
          </div>

          {/* 3. Dates Range selectors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="event-start-date" className="block text-xs font-bold text-gray-700 dark:text-slate-355 uppercase tracking-wide">
                Start date
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="event-start-date"
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (!endDate || endDate < e.target.value) {
                      setEndDate(e.target.value);
                    }
                  }}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 py-2.5 pl-9 pr-2.5 text-xs sm:text-sm font-medium text-gray-955 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="event-end-date" className="block text-xs font-bold text-gray-700 dark:text-slate-355 uppercase tracking-wide">
                End date
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="event-end-date"
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 py-2.5 pl-9 pr-2.5 text-xs sm:text-sm font-medium text-gray-955 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* 4. Time Checkbox and Selectors */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2 select-none">
              <input
                id="add-time-checkbox"
                type="checkbox"
                checked={!allDay}
                onChange={(e) => setAllDay(!e.target.checked)}
                className="h-4.5 w-4.5 rounded border-gray-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="add-time-checkbox" className="text-xs sm:text-sm font-bold text-gray-700 dark:text-slate-300 cursor-pointer">
                Add time
              </label>
            </div>

            {/* Time input selectors (Visible only if NOT all day) */}
            {!allDay && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="space-y-1">
                  <label htmlFor="event-start-time" className="block text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Start time
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Clock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="event-start-time"
                      type="time"
                      required={!allDay}
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 py-2 pl-9 pr-2 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:border-blue-500 target:focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="event-end-time" className="block text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    End time
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Clock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="event-end-time"
                      type="time"
                      required={!allDay}
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 py-2 pl-9 pr-2 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:border-blue-500 target:focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* 5. Location Input */}
          <div className="space-y-1.5">
            <label htmlFor="event-location" className="block text-xs font-bold text-gray-700 dark:text-slate-355 uppercase tracking-wide">
              Location
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MapPin className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="event-location"
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 py-2.5 pl-9 pr-3.5 text-sm font-medium text-gray-955 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* 6. Guests management */}
          <div className="space-y-2.5">
            <label htmlFor="guest-input" className="block text-xs font-bold text-gray-700 dark:text-slate-355 uppercase tracking-wide">
              Add guests
            </label>
            
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="guest-input"
                  type="text"
                  placeholder="Add guest email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 py-2 pl-9 pr-2.5 text-sm text-gray-955 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-sans"
                />
              </div>
              <button
                id="add-guest-btn"
                type="button"
                onClick={handleAddGuest}
                className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 transition shadow-xs text-xs inline-flex items-center gap-1 shrink-0"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>

            {/* List of active guests with avatar remove bubbles */}
            {guests.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-55 dark:bg-slate-850/60 border border-gray-200 dark:border-slate-800 rounded-xl max-h-[140px] overflow-y-auto">
                {guests.map((email) => (
                  <div 
                    key={email}
                    className="relative shrink-0 group"
                    title={email}
                  >
                    <img 
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`} 
                      alt="Guest avatar" 
                      className="h-9 w-9 rounded-full ring-2 ring-blue-500 bg-white"
                    />
                    
                    {/* Delete overlay */}
                    <button
                      type="button"
                      onClick={() => handleRemoveGuest(email)}
                      className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-800 dark:bg-slate-750 text-white font-semibold text-[10px] shadow-sm hover:bg-red-500 dark:hover:bg-red-600 focus:outline-none transition-colors"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* More count text */}
                {guests.length > 4 && (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-white shadow-md select-none shrink-0 border border-white">
                    +{guests.length - 4}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 7. Tag Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-355 uppercase tracking-wide">
              Tag Color
            </label>
            <div className="flex flex-wrap gap-2.5 pt-1.5" id="tag-color-picker-grid">
              {COLORS_LIST.map((colorName) => {
                const config = EVENT_COLORS[colorName];
                const isSelected = selectedColor === colorName;
                
                return (
                  <button
                    key={colorName}
                    id={`tag-color-btn-${colorName}`}
                    type="button"
                    onClick={() => setSelectedColor(colorName)}
                    className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-100 hover:scale-110 active:scale-95 focus:outline-none border border-black/10 dark:border-white/5 ${config.labelBg}`}
                    title={colorName}
                  >
                    {isSelected && (
                      <Check className="h-4.5 w-4.5 text-white stroke-[3.5px] drop-shadow-xs" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 8. Guest permissions checkboxes */}
          <div className="space-y-3 pt-3 border-t border-gray-150 dark:border-slate-800">
            <h4 className="text-xs font-bold text-gray-750 dark:text-slate-300 uppercase tracking-widest leading-none">
              Guest Permissions
            </h4>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 select-none">
                <input
                  id="modify-checkbox"
                  type="checkbox"
                  checked={modifyPerm}
                  onChange={(e) => setModifyPerm(e.target.checked)}
                  className="h-4.5 w-4.5 rounded border-gray-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="modify-checkbox" className="text-xs sm:text-sm font-semibold text-gray-650 dark:text-slate-400 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors">
                  Modify event
                </label>
              </div>

              <div className="flex items-center gap-2.5 select-none">
                <input
                  id="invite-checkbox"
                  type="checkbox"
                  checked={inviteOthersPerm}
                  onChange={(e) => setInviteOthersPerm(e.target.checked)}
                  className="h-4.5 w-4.5 rounded border-gray-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="invite-checkbox" className="text-xs sm:text-sm font-semibold text-gray-655 dark:text-slate-400 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors">
                  Invite others
                </label>
              </div>

              <div className="flex items-center gap-2.5 select-none font-sans">
                <input
                  id="see-guest-list-checkbox"
                  type="checkbox"
                  checked={seeGuestListPerm}
                  onChange={(e) => setSeeGuestListPerm(e.target.checked)}
                  className="h-4.5 w-4.5 rounded border-gray-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="see-guest-list-checkbox" className="text-xs sm:text-sm font-semibold text-gray-655 dark:text-slate-400 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors">
                  See guest list
                </label>
              </div>
            </div>
          </div>
        </form>

        {/* Action Button Footer bar */}
        <div className="border-t border-gray-150 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-4 flex flex-col gap-2">
          <button
            id="save-event-form"
            type="button"
            onClick={handleSubmit}
            className="w-full text-center rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-850 transition-colors shadow-xs cursor-pointer"
          >
            {event ? 'Update Event' : 'Save Event'}
          </button>
          
          {event && (
            <button
              id="delete-event-footer-btn"
              type="button"
              onClick={() => {
                if (confirm('Are you absolutely sure you want to delete this event?')) {
                  onDelete(event.id);
                  onClose();
                }
              }}
              className="w-full text-center rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 py-2.5 text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
            >
              Delete Event
            </button>
          )}

          <button
            id="cancel-event-form"
            type="button"
            onClick={onClose}
            className="w-full text-center rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 text-sm font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-750 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </>
  );
}
