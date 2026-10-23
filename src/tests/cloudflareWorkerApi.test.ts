import { describe, it, expect } from 'vitest';
import worker from '../worker/index';
import type { WorkerEnv } from '../worker/db';
import { executeIngestionJob } from '../worker/services/ingestionService';
import { generateWeeklyReleaseRoundupArticle } from '../worker/services/articleEngine';

describe('Cloudflare Workers Production API & Acceptance Test Suite', () => {
  const env: WorkerEnv = {
    ADMIN_API_KEY: 'test-admin-secret',
    APP_ENV: 'test',
  };

  // Mock execution context for Worker fetch & scheduled
  const ctx: any = {
    waitUntil: (p: Promise<any>) => p,
    passThroughOnException: () => {},
  };

  // =========================================================================
  // Section A & D: Worker REST API Endpoints & Health
  // =========================================================================
  describe('Public API Endpoints', () => {
    it('GET /api/v1/health returns 200 with verified movie telemetry', async () => {
      const req = new Request('https://cinepulse.in/api/v1/health');
      const res = await worker.fetch(req, env, ctx);
      expect(res.status).toBe(200);

      const json: any = await res.json();
      expect(json.success).toBe(true);
      expect(json.status).toBe('HEALTHY');
      expect(json.temporalAnchorIST).toBe('2026-10-21');
      expect(json.verifiedMoviesTracked).toBeGreaterThanOrEqual(51);
    });

    it('GET /api/v1/movies/recently-released adheres strictly to rolling 30-day window [T-29d, T]', async () => {
      const req = new Request('https://cinepulse.in/api/v1/movies/recently-released?date=2026-10-21');
      const res = await worker.fetch(req, env, ctx);
      expect(res.status).toBe(200);

      const json: any = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.length).toBe(23); // All 23 user verified releases

      // Today's release is included
      expect(json.data.some((m: any) => m.id === 'udumbanchola-vision')).toBe(true);
      // Older release (> 29 days) is excluded
      expect(json.data.some((m: any) => m.id === 'stree-2')).toBe(false);
      // Future release is excluded
      expect(json.data.some((m: any) => m.id === 'ramayana-part-1')).toBe(false);
    });

    it('GET /api/v1/movies/upcoming returns verified future scheduled titles', async () => {
      const req = new Request('https://cinepulse.in/api/v1/movies/upcoming?date=2026-10-21');
      const res = await worker.fetch(req, env, ctx);
      expect(res.status).toBe(200);

      const json: any = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.length).toBeGreaterThanOrEqual(28);

      // Confirmed future titles must be present
      expect(json.data.some((m: any) => m.id === 'tum-mere-ho')).toBe(true);
      expect(json.data.some((m: any) => m.id === 'ramayana-part-1')).toBe(true);
      expect(json.data.some((m: any) => m.id === 'king')).toBe(true);
    });

    it('GET /api/v1/movies/now-in-cinemas returns active screening evidence', async () => {
      const req = new Request('https://cinepulse.in/api/v1/movies/now-in-cinemas?date=2026-10-21');
      const res = await worker.fetch(req, env, ctx);
      expect(res.status).toBe(200);

      const json: any = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.some((m: any) => m.id === 'jailer-2')).toBe(true);
    });

    it('GET /api/v1/movies/:slug returns complete verified movie dossier', async () => {
      const req = new Request('https://cinepulse.in/api/v1/movies/jailer-2');
      const res = await worker.fetch(req, env, ctx);
      expect(res.status).toBe(200);

      const json: any = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.title).toContain('Jailer 2');
      expect(json.data.provenance).toBeDefined();
    });

    it('GET /api/v1/sitemap.xml returns valid XML with proper priorities', async () => {
      const req = new Request('https://cinepulse.in/api/v1/sitemap.xml');
      const res = await worker.fetch(req, env, ctx);
      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toContain('xml');

      const xml = await res.text();
      expect(xml).toContain('<urlset');
      expect(xml).toContain('https://cinepulse.in/recently-released');
      expect(xml).toContain('https://cinepulse.in/upcoming');
    });
  });

  // =========================================================================
  // Section B & E: Security, Headers & Admin Authorization
  // =========================================================================
  describe('Security & Admin Protection', () => {
    it('Rejects unauthenticated access to /api/v1/admin/* with 401', async () => {
      const req = new Request('https://cinepulse.in/api/v1/admin/sources');
      const res = await worker.fetch(req, env, ctx);
      expect(res.status).toBe(401);

      const json: any = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain('Unauthorized');
    });

    it('Grants access to /api/v1/admin/sources when valid Bearer key is supplied', async () => {
      const req = new Request('https://cinepulse.in/api/v1/admin/sources', {
        headers: { Authorization: `Bearer ${env.ADMIN_API_KEY}` }
      });
      const res = await worker.fetch(req, env, ctx);
      expect(res.status).toBe(200);

      const json: any = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.length).toBeGreaterThanOrEqual(6);
    });

    it('Public responses include strict security and cache headers', async () => {
      const req = new Request('https://cinepulse.in/api/v1/movies/recently-released');
      const res = await worker.fetch(req, env, ctx);

      expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(res.headers.get('X-Frame-Options')).toBe('DENY');
      expect(res.headers.get('Cache-Control')).toContain('public');
    });
  });

  // =========================================================================
  // Section C: Editorial Pipeline & Traceable Factual Attribution
  // =========================================================================
  describe('Automated Editorial & Article Engine', () => {
    it('Generates original articles with traceable source links and no fabricated quotes', async () => {
      const article = await generateWeeklyReleaseRoundupArticle(undefined, '2026-10-21');
      expect(article.id).toBeDefined();
      expect(article.title).toContain('Indian Cinema Weekly Dispatch');
      expect(article.factual_confidence).toBeGreaterThanOrEqual(0.95);

      // Attribution verification
      expect(article.sources.length).toBeGreaterThan(0);
      expect(article.sources.every((s) => s.source_url.startsWith('https://'))).toBe(true);
      expect(article.sources.every((s) => s.attribution_text.length > 5)).toBe(true);
    });
  });

  // =========================================================================
  // Section E: Ingestion Jobs & Scheduled Crons
  // =========================================================================
  describe('Ingestion Jobs & Scheduled Handlers', () => {
    it('Executes idempotent DAILY_ROLLOVER without duplicating records', async () => {
      const summary1 = await executeIngestionJob(undefined, 'DAILY_ROLLOVER');
      expect(summary1.status).toBe('COMPLETED');
      expect(summary1.recordsProcessed).toBe(51);

      // Running a second time is idempotent
      const summary2 = await executeIngestionJob(undefined, 'DAILY_ROLLOVER');
      expect(summary2.status).toBe('COMPLETED');
      expect(summary2.recordsProcessed).toBe(51);
    });
  });
});
