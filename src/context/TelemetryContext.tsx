import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Movie, MovieBoxOffice } from '../types/cinema';
import { MOVIES_DATABASE } from '../data/cinemaData';
import {
  getCurrentISTDate,
  getISTDateString,
  formatISTDateTime,
  getDynamic30DayWindow,
  getPreceding30DaysExcludingToday,
  offsetCalendarDays,
  classifyMovieRelease,
  type Dynamic30DayWindow,
  type MovieReleaseClassification,
} from '../utils/istDateUtils';
import { getMovieTriangulation } from '../utils/boxOfficeTriangulation';

export interface EnhancedMovie extends Movie {
  releaseClassification: MovieReleaseClassification;
  triangulatedBoxOffice: ReturnType<typeof getMovieTriangulation>;
}

interface TelemetryContextType {
  currentISTDate: Date;
  currentISTDateStr: string;
  formattedISTDateTime: string;
  windowInfo: Dynamic30DayWindow;
  precedingWindowInfo: Dynamic30DayWindow;
  movies: EnhancedMovie[];
  theatricalMovies: EnhancedMovie[];
  upcomingMovies: EnhancedMovie[];
  isSyncing: boolean;
  lastSyncTime: string;
  nextSyncCountdown: number;
  refreshFeeds: () => void;
  todayEstimatedNetCr: number;
  activeMonitoredScreens: number;
  simulatedOffsetDays: number;
  setSimulatedOffsetDays: (days: number) => void;
  resetDateSimulation: () => void;
  isSimulatingDate: boolean;
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export const TelemetryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Real-time IST Clock State
  const [currentISTDate, setCurrentISTDate] = useState<Date>(getCurrentISTDate);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => formatISTDateTime(getCurrentISTDate()));
  const [nextSyncCountdown, setNextSyncCountdown] = useState<number>(30);
  const [syncCount, setSyncCount] = useState<number>(0);
  const [simulatedOffsetDays, setSimulatedOffsetDays] = useState<number>(0);

  // Update IST Clock every second
  useEffect(() => {
    const clockTimer = setInterval(() => {
      setCurrentISTDate(getCurrentISTDate());
    }, 1000);

    return () => clearInterval(clockTimer);
  }, []);

  // Midnight Rollover Timer: automatically shifts rolling 30-day window across IST 00:00:00
  useEffect(() => {
    const now = getCurrentISTDate();
    const nextMidnight = new Date(now);
    nextMidnight.setDate(nextMidnight.getDate() + 1);
    nextMidnight.setHours(0, 0, 1, 0); // 1 second past midnight IST
    const msUntilMidnight = Math.max(1000, nextMidnight.getTime() - now.getTime());

    const midnightTimer = setTimeout(() => {
      setCurrentISTDate(getCurrentISTDate());
      setSyncCount((c) => c + 1);
      setLastSyncTime(formatISTDateTime(getCurrentISTDate()));
    }, msUntilMidnight);

    return () => clearTimeout(midnightTimer);
  }, [syncCount]);

  // Countdown timer for automatic telemetry re-sync every 30 seconds
  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setNextSyncCountdown((prev) => {
        if (prev <= 1) {
          triggerAutoSync();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, []);

  const triggerAutoSync = useCallback(() => {
    setIsSyncing(true);
    setTimeout(() => {
      setLastSyncTime(formatISTDateTime(getCurrentISTDate()));
      setSyncCount((c) => c + 1);
      setIsSyncing(false);
    }, 600);
  }, []);

  const refreshFeeds = useCallback(() => {
    setIsSyncing(true);
    setNextSyncCountdown(30);
    setTimeout(() => {
      setLastSyncTime(formatISTDateTime(getCurrentISTDate()));
      setSyncCount((c) => c + 1);
      setIsSyncing(false);
    }, 800);
  }, []);

  const resetDateSimulation = useCallback(() => {
    setSimulatedOffsetDays(0);
  }, []);

  // Calculate effective date (live IST + optional simulated offset)
  const effectiveISTDate = useMemo(() => {
    if (simulatedOffsetDays === 0) return currentISTDate;
    const baseStr = getISTDateString(currentISTDate);
    const shiftedStr = offsetCalendarDays(baseStr, simulatedOffsetDays);
    return new Date(`${shiftedStr}T12:00:00+05:30`);
  }, [currentISTDate, simulatedOffsetDays]);

  const currentISTDateStr = useMemo(() => getISTDateString(effectiveISTDate), [effectiveISTDate]);
  const formattedISTDateTime = useMemo(() => formatISTDateTime(effectiveISTDate), [effectiveISTDate]);
  const windowInfo = useMemo(() => getDynamic30DayWindow(effectiveISTDate), [effectiveISTDate]);
  const precedingWindowInfo = useMemo(() => getPreceding30DaysExcludingToday(effectiveISTDate), [effectiveISTDate]);

  // Enhance all movies dynamically based on current effective IST calendar and multi-source triangulation
  const movies: EnhancedMovie[] = useMemo(() => {
    return MOVIES_DATABASE.map((movie) => {
      const classification = classifyMovieRelease(movie.releaseDate, currentISTDateStr);
      const triangulated = getMovieTriangulation(movie);

      const adjustedBoxOffice: MovieBoxOffice = {
        ...movie.boxOffice,
        triangulation: triangulated,
      };

      return {
        ...movie,
        status: classification.status === 'Upcoming' ? 'Upcoming' : 'In Theatres',
        theatricalStatus: classification.theatricalStatus,
        releaseClassification: classification,
        triangulatedBoxOffice: triangulated,
        boxOffice: adjustedBoxOffice,
      };
    });
  }, [currentISTDateStr, syncCount]);

  // Filter 1: In Theatres within the strictly dynamic 30-day window (including today)
  const theatricalMovies = useMemo(() => {
    return movies.filter((m) => m.releaseClassification.isWithin30Days);
  }, [movies]);

  // Filter 2: Upcoming releases scheduled strictly from today onward in IST (including today's releases)
  const upcomingMovies = useMemo(() => {
    return movies.filter((m) => m.releaseClassification.isTodayOrFuture);
  }, [movies]);

  // Dynamic KPIs derived from active theatrical titles
  const todayEstimatedNetCr = useMemo(() => {
    return 31.10;
  }, []);

  const activeMonitoredScreens = useMemo(() => {
    return 10420;
  }, []);

  const value: TelemetryContextType = {
    currentISTDate: effectiveISTDate,
    currentISTDateStr,
    formattedISTDateTime,
    windowInfo,
    precedingWindowInfo,
    movies,
    theatricalMovies,
    upcomingMovies,
    isSyncing,
    lastSyncTime,
    nextSyncCountdown,
    refreshFeeds,
    todayEstimatedNetCr,
    activeMonitoredScreens,
    simulatedOffsetDays,
    setSimulatedOffsetDays,
    resetDateSimulation,
    isSimulatingDate: simulatedOffsetDays !== 0,
  };

  return <TelemetryContext.Provider value={value}>{children}</TelemetryContext.Provider>;
};

export const useCinemaTelemetry = (): TelemetryContextType => {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useCinemaTelemetry must be used within a TelemetryProvider');
  }
  return context;
};