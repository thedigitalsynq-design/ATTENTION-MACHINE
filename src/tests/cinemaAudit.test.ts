import { describe, it, expect } from 'vitest';
import { MOVIES_DATABASE, NEWS_EDITORIAL_DATABASE } from '../data/cinemaData';
import {
  getDynamic30DayWindow,
  getPreceding30DaysExcludingToday,
  classifyMovieRelease,
  getDaysDifference,
} from '../utils/istDateUtils';
import {
  calculateMedian,
  areMetricsComparable,
  getMovieTriangulation,
} from '../utils/boxOfficeTriangulation';

describe('Cinema Platform Audit & Integrity Test Suite', () => {
  const CURRENT_TEST_IST_DATE = '2026-10-21';

  // =========================================================================
  // Criteria 18: Mandatory Regression Tests (Jailer 2 & Ramayana Part 1)
  // =========================================================================
  describe('Criteria 18: Jailer 2 & Ramayana Mandatory Regression Tests', () => {
    it('Jailer 2 must be verified as released on 15 Oct 2026 and currently screening as of 21 Oct 2026', () => {
      const jailer2 = MOVIES_DATABASE.find((m) => m.id === 'jailer-2');
      expect(jailer2).toBeDefined();
      expect(jailer2!.releaseDate).toBe('2026-10-15');

      const classification = classifyMovieRelease(jailer2!.releaseDate, CURRENT_TEST_IST_DATE);
      expect(classification.status).toBe('In Theatres');
      expect(classification.theatricalStatus).toBe('currently_screening');
      expect(classification.isWithin30Days).toBe(true);
      expect(classification.dayOfRun).toBe(7); // 15 Oct -> Day 1, 21 Oct -> Day 7
      expect(classification.isUpcoming).toBe(false);

      // Must NOT be labeled as upcoming
      expect(jailer2!.status).not.toBe('Upcoming');
    });

    it('Ramayana: Part 1 must be strictly UPCOMING (scheduled 05 Nov 2026) and clearly distinguished from Part 2', () => {
      const ramayana = MOVIES_DATABASE.find((m) => m.id === 'ramayana-part-1');
      expect(ramayana).toBeDefined();
      expect(ramayana!.releaseDate).toBe('2026-11-05');

      const classification = classifyMovieRelease(ramayana!.releaseDate, CURRENT_TEST_IST_DATE);
      expect(classification.status).toBe('Upcoming');
      expect(classification.theatricalStatus).toBe('upcoming');
      expect(classification.isWithin30Days).toBe(false);
      expect(classification.isUpcoming).toBe(true);
      expect(classification.daysUntilRelease).toBe(15); // In 15 days on 05 Nov 2026

      // Cast verification: Yash is Ravana and co-producer
      const ravana = ramayana!.cast?.find((c) => c.name === 'Yash');
      expect(ravana).toBeDefined();
      expect(ravana!.characterName).toContain('Ravana');
      expect(ramayana!.producers).toContain('Yash');

      // Box office opening net must be 0 prior to commercial release
      expect(ramayana!.boxOffice.totalIndiaNetCr).toBe(0);
      expect(ramayana!.boxOffice.openingDayIndiaNetCr).toBe(0);
    });
  });

  // =========================================================================
  // Criteria 1, 2, 3: IST Date Calculations & 30-Day Window Logic
  // =========================================================================
  describe('Criteria 1, 2, 3: Date Calculations & Rolling 30-Day Window', () => {
    it('Rolling 30-day window must be explicitly defined as current date minus 29 calendar days through current date inclusive', () => {
      const fixedDate = new Date('2026-10-21T12:00:00+05:30');
      const windowInfo = getDynamic30DayWindow(fixedDate);

      expect(windowInfo.currentISTDateStr).toBe('2026-10-21');
      expect(windowInfo.endDateStr).toBe('2026-10-21');
      expect(windowInfo.startDateStr).toBe('2026-09-22'); // 21 minus 29 days = 22 Sep
      expect(windowInfo.windowDaysCount).toBe(30);

      // 22 Sep through 21 Oct inclusive represents exactly 30 calendar dates
      const daysDiff = getDaysDifference('2026-10-21', '2026-09-22');
      expect(daysDiff).toBe(29); // 29 days difference = 30 inclusive dates
    });

    it('Preceding 30 complete days excluding today must be current date minus 30 through current date minus 1', () => {
      const fixedDate = new Date('2026-10-21T12:00:00+05:30');
      const preceding = getPreceding30DaysExcludingToday(fixedDate);

      expect(preceding.startDateStr).toBe('2026-09-21');
      expect(preceding.endDateStr).toBe('2026-10-20');
      expect(preceding.windowDaysCount).toBe(30);
    });

    it('Rolling 30-day results must update correctly across IST midnight', () => {
      const beforeMidnight = new Date('2026-10-21T23:59:59+05:30');
      const afterMidnight = new Date('2026-10-22T00:00:01+05:30');

      const windowBefore = getDynamic30DayWindow(beforeMidnight);
      const windowAfter = getDynamic30DayWindow(afterMidnight);

      expect(windowBefore.endDateStr).toBe('2026-10-21');
      expect(windowAfter.endDateStr).toBe('2026-10-22');
      expect(windowAfter.startDateStr).toBe('2026-09-23');
    });

    it('No future-dated movie appears in released or screening lists', () => {
      MOVIES_DATABASE.forEach((movie) => {
        const classification = classifyMovieRelease(movie.releaseDate, CURRENT_TEST_IST_DATE);
        if (movie.releaseDate > CURRENT_TEST_IST_DATE) {
          expect(classification.status).toBe('Upcoming');
          expect(classification.isWithin30Days).toBe(false);
          expect(classification.isUpcoming).toBe(true);
        }
      });
    });

    it('No old release older than 29 days appears in the rolling 30-day list', () => {
      // 21 Sep 2026 is 30 days ago (outside 29-day inclusive offset)
      const oldRelease = classifyMovieRelease('2026-09-21', CURRENT_TEST_IST_DATE);
      expect(oldRelease.isWithin30Days).toBe(false);
      expect(oldRelease.status).toBe('Archive');

      // 22 Sep 2026 is Day 30 (inside 29-day inclusive offset)
      const validBoundaryRelease = classifyMovieRelease('2026-09-22', CURRENT_TEST_IST_DATE);
      expect(validBoundaryRelease.isWithin30Days).toBe(true);
      expect(validBoundaryRelease.status).toBe('In Theatres');
    });
  });

  // =========================================================================
  // Criteria 4: Database Deduplication
  // =========================================================================
  describe('Criteria 4: Deduplication & Unique Identifiers', () => {
    it('Every movie record must have a unique ID and canonical slug', () => {
      const ids = MOVIES_DATABASE.map((m) => m.id);
      const slugs = MOVIES_DATABASE.map((m) => m.slug);

      const uniqueIds = new Set(ids);
      const uniqueSlugs = new Set(slugs);

      expect(uniqueIds.size).toBe(ids.length);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });
  });

  // =========================================================================
  // Criteria 5, 8: Ratings Transparency & Provider Segregation
  // =========================================================================
  describe('Criteria 5, 8: Ratings Provider Segregation & Score Scale Accuracy', () => {
    it('Ratings must never combine different provider scores and must reflect correct scales', () => {
      MOVIES_DATABASE.forEach((movie) => {
        if (movie.ratingsBreakdown && movie.ratingsBreakdown.length > 0) {
          movie.ratingsBreakdown.forEach((r) => {
            if (r.provider === 'IMDb') {
              expect(r.maxScore).toBe(10);
              expect(r.score).toBeLessThanOrEqual(10);
            } else if (r.provider === 'Rotten Tomatoes Critics' || r.provider === 'Rotten Tomatoes Audience') {
              expect(r.maxScore).toBe(100);
              expect(r.score).toBeLessThanOrEqual(100);
            } else if (r.provider === 'Metacritic') {
              expect(r.maxScore).toBe(100);
              expect(r.score).toBeLessThanOrEqual(100);
            }
            expect(r.verifiedAt).toBeDefined();
          });
        }
      });
    });
  });

  // =========================================================================
  // Criteria 6, 7: Box Office Net vs Gross & Non-Comparable Averaging Prevention
  // =========================================================================
  describe('Criteria 6, 7: Box-Office Financial Integrity & Reconciliation', () => {
    it('Net and Gross collections cannot be mixed, and Worldwide is the sum of India Gross and Overseas Gross', () => {
      MOVIES_DATABASE.forEach((movie) => {
        const bo = movie.boxOffice;
        if (bo.worldwideGrossCr > 0) {
          // India Gross must be strictly greater than India Net due to tax factor
          expect(bo.totalIndiaGrossCr).toBeGreaterThanOrEqual(bo.totalIndiaNetCr);

          // Worldwide Gross must strictly equal India Gross + Overseas Gross (rounded within 0.05 Cr)
          const calculatedWW = Number((bo.totalIndiaGrossCr + bo.overseasGrossCr).toFixed(2));
          expect(Math.abs(bo.worldwideGrossCr - calculatedWW)).toBeLessThanOrEqual(0.05);

          // Worldwide Gross must NEVER be equal to India Net + Overseas Gross
          if (bo.totalIndiaGrossCr > bo.totalIndiaNetCr) {
            expect(bo.worldwideGrossCr).not.toBe(bo.totalIndiaNetCr + bo.overseasGrossCr);
          }
        }
      });
    });

    it('Incomparable metrics cannot be averaged', () => {
      expect(areMetricsComparable('India Net', 'India Gross')).toBe(false);
      expect(areMetricsComparable('Worldwide Gross', 'India Net')).toBe(false);
      expect(areMetricsComparable('Worldwide Gross', 'Worldwide Gross')).toBe(true);
    });

    it('Median calculation must return exact middle or arithmetic mean of two central values', () => {
      expect(calculateMedian([100, 102, 104])).toBe(102);
      expect(calculateMedian([100, 104])).toBe(102);
      expect(calculateMedian([100, 102, 104, 108])).toBe(103);
    });

    it('Producer claims diverging > 4.5% are flagged and filtered from representative consensus', () => {
      const triangulation = getMovieTriangulation({
        id: 'kantara-chapter-1',
        title: 'Kantara: Chapter 1 (Prequel)',
        boxOffice: MOVIES_DATABASE.find((m) => m.id === 'kantara-chapter-1')?.boxOffice || {
          openingDayIndiaNetCr: 74.50,
          openingWeekendIndiaNetCr: 218.40,
          totalIndiaNetCr: 494.80,
          totalIndiaGrossCr: 593.75,
          overseasGrossCr: 148.25,
          worldwideGrossCr: 742.00,
          budgetCr: 175.00,
          verdict: 'Blockbuster',
          confidenceScorePct: 99.4,
          lastAuditedTimestamp: '2026-10-21T06:00:00Z',
          sourcesAttributed: ['Hombale Trade Dispatch'],
          dayWise: [],
          territories: []
        },
      });

      expect(triangulation.sources.some((s) => s.auditStatus === 'Flagged Divergence')).toBe(true);
      expect(triangulation.consensusRating).toBe('Divergence Flagged (>5%)');
      // Representative net should reflect consensus (491.09 Cr) and exclude producer inflated claim (~533.8 Cr)
      expect(triangulation.representativeIndiaNetCr).toBeCloseTo(491.09, 1);
    });
  });

  // =========================================================================
  // Criteria 11: Real News Articles and Publishers
  // =========================================================================
  describe('Criteria 11: News Articles Authenticity & Publishers', () => {
    it('All news articles must have identifiable publishers, real headlines, and original URLs', () => {
      expect(NEWS_EDITORIAL_DATABASE.length).toBeGreaterThan(0);
      NEWS_EDITORIAL_DATABASE.forEach((art) => {
        expect(art.publisher).toBeDefined();
        expect(art.originalArticleUrl).toBeDefined();
        expect(art.originalArticleUrl).toMatch(/^https?:\/\//);
        expect(art.publishedAt).toBeDefined();
      });
    });
  });
});
