import { z } from 'zod';

// =========================================================================
// CinéPulse Bharat - Shared Zod Contracts & Schemas
// =========================================================================

export const MovieLifecycleStatusSchema = z.enum([
  'Upcoming',
  'In Theatres',
  'Released',
  'Delayed',
  'Archived',
  'Cancelled'
]);

export const DateConfidenceSchema = z.enum([
  'Confirmed',
  'Tentative',
  'Provisional',
  'Rumored'
]);

export const TheatricalEvidenceStatusSchema = z.enum([
  'Verified Screened',
  'Ticketing Live',
  'Trade Confirmed',
  'Unverified',
  'Disputed'
]);

export const MovieSchema = z.object({
  id: z.string().min(1),
  canonical_title: z.string().min(1),
  slug: z.string().min(1),
  original_title: z.string().optional().nullable(),
  alternate_titles_json: z.string().default('[]'),
  primary_language: z.string().min(1),
  languages_json: z.string().default('[]'),
  genres_json: z.string().default('[]'),
  synopsis: z.string().default(''),
  runtime_minutes: z.number().int().positive().optional().nullable(),
  certification: z.string().default('U/A'),
  director: z.string().optional().nullable(),
  cast_json: z.string().default('[]'),
  production_companies_json: z.string().default('[]'),
  official_website: z.string().url().optional().nullable(),
  poster_asset_id: z.string().optional().nullable(),
  backdrop_asset_id: z.string().optional().nullable(),
  lifecycle_status: MovieLifecycleStatusSchema.default('Upcoming'),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const MovieReleaseSchema = z.object({
  id: z.string().min(1),
  movie_id: z.string().min(1),
  release_type: z.enum(['Theatrical Wide', 'Theatrical Limited', 'Film Festival', 'Digital Premiere', 'Special Screening']).default('Theatrical Wide'),
  territory: z.string().default('India'),
  language: z.string().min(1),
  release_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  date_confidence: DateConfidenceSchema.default('Confirmed'),
  release_status: z.enum(['Scheduled', 'Screening Now', 'Completed', 'Postponed', 'Cancelled']).default('Scheduled'),
  theatrical_evidence_status: TheatricalEvidenceStatusSchema.default('Unverified'),
  source_id: z.string().optional().nullable(),
  last_verified_at: z.string().optional(),
});

export const SourceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  source_type: z.enum(['API', 'RSS', 'Official Trade', 'Studio PR', 'Government Gazette', 'Ticketing Portal']),
  base_url: z.string().url(),
  access_method: z.enum(['REST_API', 'RSS_XML', 'SCRAPED_HTML', 'MANUAL_DEPOSIT', 'WEBHOOK']),
  reliability_level: z.enum(['TIER_1_PRIMARY', 'TIER_2_SECONDARY', 'TIER_3_UNCONFIRMED']),
  supported_languages_json: z.string().default('[]'),
  supported_fields_json: z.string().default('[]'),
  attribution_requirements: z.string().optional().nullable(),
  permission_notes: z.string().optional().nullable(),
  active: z.number().int().min(0).max(1).default(1),
  last_fetch_at: z.string().optional().nullable(),
  last_success_at: z.string().optional().nullable(),
  last_error: z.string().optional().nullable(),
});

export const ArticleCategorySchema = z.enum([
  'Trade Analysis',
  'Box Office Report',
  'Release Confirmation',
  'Production Exclusive',
  'Weekly Roundup',
  'OTT Release'
]);

export const ArticleSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(5),
  summary: z.string().min(10),
  body_markdown: z.string().min(20),
  language: z.string().default('English'),
  category: ArticleCategorySchema,
  article_status: z.enum(['Draft', 'Review Required', 'Published', 'Archived', 'Retracted']).default('Published'),
  author_type: z.string().default('Algorithmic Editorial Desk'),
  published_at: z.string().optional(),
  updated_at: z.string().optional(),
  last_verified_at: z.string().optional(),
  featured_asset_id: z.string().optional().nullable(),
  factual_confidence: z.number().min(0).max(1).default(0.98),
});

export const RatingSchema = z.object({
  id: z.string().min(1),
  movie_id: z.string().min(1),
  provider: z.enum(['IMDb', 'Rotten Tomatoes Critics', 'Rotten Tomatoes Audience', 'Metacritic', 'BookMyShow']),
  rating_value: z.number().nonnegative(),
  rating_scale: z.number().positive(),
  vote_count: z.number().int().nonnegative().default(0),
  source_url: z.string().url().optional().nullable(),
  retrieved_at: z.string().optional(),
});

export const BoxOfficeReportSchema = z.object({
  id: z.string().min(1),
  movie_id: z.string().min(1),
  territory: z.string().default('India'),
  collection_type: z.enum(['India Net', 'India Gross', 'Overseas Gross', 'Worldwide Gross']),
  amount: z.number().nonnegative(),
  currency: z.string().default('INR'),
  reporting_period: z.string(),
  figure_type: z.enum(['Machine Audited', 'Trade Consensus', 'Producer Claim', 'Estimated Forecast']),
  source_id: z.string().optional().nullable(),
  source_url: z.string().optional().nullable(),
  retrieved_at: z.string().optional(),
});

export const CorrectionRequestSchema = z.object({
  entity_type: z.enum(['movie', 'release_date', 'box_office', 'article', 'ratings']),
  entity_id: z.string().min(1),
  user_email: z.string().email(),
  requested_correction: z.string().min(10),
  evidence_url: z.string().url(),
});

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  language: z.string().optional(),
  search: z.string().optional(),
  status: z.string().optional(),
});
