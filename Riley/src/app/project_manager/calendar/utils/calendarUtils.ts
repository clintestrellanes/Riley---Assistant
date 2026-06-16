// Calendar utility functions for date calculations

/**
 * Checks if two Date objects represent the exact same calendar day.
 */
export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * Formats a Date object into a YYYY-MM-DD string, avoiding timezone shifts.
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parsers a YYYY-MM-DD string into a local Date object.
 */
export function parseDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Returns a list of Month names.
 */
export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Returns a list of short weekday names starting from Sunday.
 */
export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Generates an array of exactly 42 dates (6 weeks) to represent the calendar grid
 * for a given year and month (0-indexed). It starts from the nearest preceding Sunday.
 */
export function getDaysInMonthGrid(year: number, month: number): Date[] {
  // First day of the targeted month
  const firstDayOfMonth = new Date(year, month, 1);
  // Day of the week for the first day (0 = Sunday, 1 = Monday, ...)
  const startDayOfWeek = firstDayOfMonth.getDay();
  
  // Calculate the starting date of the grid (previous Sunday)
  const gridStartDate = new Date(firstDayOfMonth);
  gridStartDate.setDate(firstDayOfMonth.getDate() - startDayOfWeek);

  const dates: Date[] = [];
  const currentDate = new Date(gridStartDate);

  // Always generate exactly 42 days (6 rows * 7 columns) for a consistent layout
  for (let i = 0; i < 42; i++) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

/**
 * Returns the 7 days of the week (Sunday - Saturday) containing the reference date.
 */
export function getWeekDates(refDate: Date): Date[] {
  const dates: Date[] = [];
  const dayOfWeek = refDate.getDay();
  
  const startOfWeek = new Date(refDate);
  startOfWeek.setDate(refDate.getDate() - dayOfWeek);

  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    dates.push(d);
  }

  return dates;
}

/**
 * Formats time from 24h format "HH:MM" to 12h format with am/pm
 */
export function formatTime12h(timeStr: string | undefined): string {
  if (!timeStr) return '';
  const [hoursStr, minutesStr] = timeStr.split(':');
  const hours = parseInt(hoursStr, 10);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutesStr} ${ampm}`;
}

/**
 * Colors mapping from color keys to tailwind badge / label color combinations
 */
export const EVENT_COLORS: Record<string, { bg: string; bgHover: string; border: string; labelBg: string }> = {
  purple: {
    bg: 'bg-purple-100 text-purple-700',
    bgHover: 'hover:bg-purple-200',
    border: 'border-purple-300',
    labelBg: 'bg-purple-500',
  },
  indigo: {
    bg: 'bg-indigo-100 text-indigo-700',
    bgHover: 'hover:bg-indigo-200',
    border: 'border-indigo-300',
    labelBg: 'bg-indigo-500',
  },
  blue: {
    bg: 'bg-blue-100 text-blue-700',
    bgHover: 'hover:bg-blue-200',
    border: 'border-blue-300',
    labelBg: 'bg-blue-500',
  },
  pink: {
    bg: 'bg-pink-100 text-pink-700',
    bgHover: 'hover:bg-pink-200',
    border: 'border-pink-300',
    labelBg: 'bg-pink-500',
  },
  cyan: {
    bg: 'bg-cyan-100 text-cyan-700',
    bgHover: 'hover:bg-cyan-200',
    border: 'border-cyan-300',
    labelBg: 'bg-cyan-500',
  },
  green: {
    bg: 'bg-emerald-100 text-emerald-700',
    bgHover: 'hover:bg-emerald-200',
    border: 'border-emerald-300',
    labelBg: 'bg-emerald-500',
  },
  yellow: {
    bg: 'bg-amber-100 text-amber-700',
    bgHover: 'hover:bg-amber-200',
    border: 'border-amber-300',
    labelBg: 'bg-amber-500',
  },
  orange: {
    bg: 'bg-orange-100 text-orange-700',
    bgHover: 'hover:bg-orange-200',
    border: 'border-orange-300',
    labelBg: 'bg-orange-500',
  },
  red: {
    bg: 'bg-red-100 text-red-700',
    bgHover: 'hover:bg-red-200',
    border: 'border-red-300',
    labelBg: 'bg-red-500',
  },
};

/**
 * Returns mock initial calendar events matching the user's screenshot.
 * Date is in June 2026.
 */
export function getInitialEvents(): import('../../../../types/calendar').CalendarEvent[] {
  return [
    // {
    //   id: '10',
    //   title: 'Photography Masterclass',
    //   description: 'Post-production and editing presets in Lightroom and Photoshop.',
    //   startDate: '2026-06-29',
    //   endDate: '2026-06-29',
    //   allDay: true,
    //   location: 'Studio A, Computer Lab',
    //   guests: ['photogs@groups.com'],
    //   color: 'yellow',
    //   permissions: { modify: false, inviteOthers: true, seeGuestList: true }
    // }
  ];
}
