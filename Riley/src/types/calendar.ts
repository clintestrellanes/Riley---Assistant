export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  allDay: boolean; // if true, no specific hours are highlighted
  startTime?: string; // HH:MM
  endTime?: string; // HH:MM
  location?: string;
  guests: string[]; // List of guest emails
  color: string; // Color key: e.g. 'purple', 'indigo', 'blue', 'pink', 'cyan', 'green', 'yellow', 'orange', 'red'
  permissions: {
    modify: boolean;
    inviteOthers: boolean;
    seeGuestList: boolean;
  };
}

export type ViewMode = 'month' | 'week' | 'day' | 'list';

export interface DateCell {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}
