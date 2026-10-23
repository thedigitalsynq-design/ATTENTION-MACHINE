/**
 * Indian Standard Time (IST, UTC+05:30) Telemetry & Dynamic Windowing Engine
 *
 * Strict Compliance:
 * - Uses trusted Asia/Kolkata (IST, UTC+05:30) time zone exclusively.
 * - Rolling 30-day movie list interval:
 *   "current IST date minus 29 calendar days through current IST date, inclusive" (exactly 30 calendar dates including today).
 * - Preceding 30 complete days excluding today:
 *   "current IST date minus 30 calendar days through current IST date minus 1 calendar day, inclusive".
 * - Fully handles leap years, month boundaries, year rollovers, and zero hardcoded static date logic.
 */

// IST offset in milliseconds: +5 hours and 30 minutes
export const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/**
 * Returns a Javascript Date object representing the current moment in Indian Standard Time (IST).
 */
export function getCurrentISTDate(): Date {
  const now = new Date();
  const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utcMs + IST_OFFSET_MS);
}

/**
 * Returns YYYY-MM-DD formatted string in IST time zone.
 */
export function getISTDateString(date: Date = getCurrentISTDate()): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date);
}

/**
 * Formats a date into human-readable IST date string (e.g., "21 Oct 2026")
 */
export function formatISTDate(dateOrStr: Date | string = getCurrentISTDate()): string {
  const date = typeof dateOrStr === 'string' ? new Date(`${dateOrStr}T00:00:00+05:30`) : dateOrStr;
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * Formats a date into a full IST timestamp (e.g., "21 Oct 2026, 01:45:10 AM IST")
 */
export function formatISTDateTime(dateOrStr: Date | string = getCurrentISTDate()): string {
  const date = typeof dateOrStr === 'string' ? new Date(dateOrStr) : dateOrStr;
  const formatted = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date);
  return `${formatted} IST`;
}

/**
 * Calculates calendar difference in days between two YYYY-MM-DD date strings in IST.
 */
export function getDaysDifference(targetDateStr: string, baseDateStr: string = getISTDateString()): number {
  const [tY, tM, tD] = targetDateStr.split('-').map(Number);
  const [bY, bM, bD] = baseDateStr.split('-').map(Number);
  const targetUtc = Date.UTC(tY, tM - 1, tD);
  const baseUtc = Date.UTC(bY, bM - 1, bD);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((targetUtc - baseUtc) / msPerDay);
}

/**
 * Helper to add or subtract calendar days to a YYYY-MM-DD string cleanly in UTC calendar math.
 */
export function offsetCalendarDays(baseDateStr: string, offsetDays: number): string {
  const [year, month, day] = baseDateStr.split('-').map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day + offsetDays));
  const y = utcDate.getUTCFullYear();
  const m = String(utcDate.getUTCMonth() + 1).padStart(2, '0');
  const d = String(utcDate.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export interface Dynamic30DayWindow {
  currentISTDateStr: string;
  startDateStr: string;
  endDateStr: string;
  formattedStartDate: string;
  formattedEndDate: string;
  windowLabel: string;
  windowDaysCount: number;
  filterMode: 'inclusive_today' | 'preceding_excluding_today';
}

/**
 * Calculates the canonical rolling 30-day window:
 * "current IST date minus 29 calendar days through current IST date, inclusive" (30 calendar dates including today).
 */
export function getDynamic30DayWindow(baseDate: Date = getCurrentISTDate()): Dynamic30DayWindow {
  const currentISTDateStr = getISTDateString(baseDate);
  const startDateStr = offsetCalendarDays(currentISTDateStr, -29);

  const formattedStartDate = formatISTDate(startDateStr);
  const formattedEndDate = formatISTDate(currentISTDateStr);

  return {
    currentISTDateStr,
    startDateStr,
    endDateStr: currentISTDateStr,
    formattedStartDate,
    formattedEndDate,
    windowLabel: `Active Window: 30 Days (${formattedStartDate} – ${formattedEndDate}, Incl. Today)`,
    windowDaysCount: 30,
    filterMode: 'inclusive_today',
  };
}

/**
 * Calculates the preceding 30 complete days excluding today:
 * "current IST date minus 30 calendar days through current IST date minus 1 calendar day".
 */
export function getPreceding30DaysExcludingToday(baseDate: Date = getCurrentISTDate()): Dynamic30DayWindow {
  const currentISTDateStr = getISTDateString(baseDate);
  const startDateStr = offsetCalendarDays(currentISTDateStr, -30);
  const endDateStr = offsetCalendarDays(currentISTDateStr, -1);

  const formattedStartDate = formatISTDate(startDateStr);
  const formattedEndDate = formatISTDate(endDateStr);

  return {
    currentISTDateStr,
    startDateStr,
    endDateStr,
    formattedStartDate,
    formattedEndDate,
    windowLabel: `Preceding 30 Days (${formattedStartDate} – ${formattedEndDate}, Excl. Today)`,
    windowDaysCount: 30,
    filterMode: 'preceding_excluding_today',
  };
}

export interface MovieReleaseClassification {
  status: 'In Theatres' | 'Upcoming' | 'Archive';
  theatricalStatus: 'upcoming' | 'released' | 'currently_screening' | 'completed_theatrical_run' | 'delayed_postponed' | 'unknown_unconfirmed';
  dayOfRun?: number; // 1-indexed, e.g. Day 1, Day 7, Day 14, Day 20
  daysUntilRelease?: number; // e.g. 8 days away
  badgeText: string;
  isWithin30Days: boolean;
  isToday: boolean;
  isUpcoming: boolean;
  isTodayOrFuture: boolean;
}

/**
 * Dynamically classifies a movie's theatrical status against the live IST calendar.
 * Guarantees that future-dated movies NEVER appear in released/screening lists.
 */
export function classifyMovieRelease(
  releaseDateStr: string,
  currentISTDateStr: string = getISTDateString()
): MovieReleaseClassification {
  const diffDays = getDaysDifference(releaseDateStr, currentISTDateStr);

  // Future release (strictly upcoming)
  if (diffDays > 0) {
    return {
      status: 'Upcoming',
      theatricalStatus: 'upcoming',
      daysUntilRelease: diffDays,
      badgeText: diffDays === 1 ? 'Releases Tomorrow' : `Releases in ${diffDays} Days`,
      isWithin30Days: false,
      isToday: false,
      isUpcoming: true,
      isTodayOrFuture: true,
    };
  }

  // Released today (Opening Day)
  if (diffDays === 0) {
    return {
      status: 'In Theatres',
      theatricalStatus: 'currently_screening',
      dayOfRun: 1,
      badgeText: 'Day 1 (Opening Today)',
      isWithin30Days: true,
      isToday: true,
      isUpcoming: false,
      isTodayOrFuture: true,
    };
  }

  // Released in the past (diffDays < 0)
  // Rolling 30 days inclusive (current date minus 29 calendar days through current date, diffDays from -29 to 0)
  const elapsedDays = Math.abs(diffDays);
  const dayOfRun = elapsedDays + 1; // Released yesterday = Day 2

  if (elapsedDays <= 29) {
    return {
      status: 'In Theatres',
      theatricalStatus: 'currently_screening',
      dayOfRun,
      badgeText: `Day ${dayOfRun} of Theatrical Run`,
      isWithin30Days: true,
      isToday: false,
      isUpcoming: false,
      isTodayOrFuture: false,
    };
  }

  // Older than 30 days
  return {
    status: 'Archive',
    theatricalStatus: 'completed_theatrical_run',
    dayOfRun,
    badgeText: `Day ${dayOfRun} (Theatrical Extended)`,
    isWithin30Days: false,
    isToday: false,
    isUpcoming: false,
    isTodayOrFuture: false,
  };
}
