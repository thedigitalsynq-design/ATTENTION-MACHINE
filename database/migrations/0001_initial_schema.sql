-- =========================================================================
-- CinéPulse Bharat - Cloudflare D1 Production Relational Schema
-- Migration: 0001_initial_schema.sql
-- =========================================================================

PRAGMA foreign_keys = ON;

-- 1. Movies Table (Core canonical film entity)
CREATE TABLE IF NOT EXISTS movies (
  id TEXT PRIMARY KEY,
  canonical_title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  original_title TEXT,
  alternate_titles_json TEXT DEFAULT '[]',
  primary_language TEXT NOT NULL,
  languages_json TEXT NOT NULL DEFAULT '[]',
  genres_json TEXT NOT NULL DEFAULT '[]',
  synopsis TEXT NOT NULL,
  runtime_minutes INTEGER,
  certification TEXT DEFAULT 'Pending',
  director TEXT,
  cast_json TEXT DEFAULT '[]',
  production_companies_json TEXT DEFAULT '[]',
  official_website TEXT,
  poster_asset_id TEXT,
  backdrop_asset_id TEXT,
  lifecycle_status TEXT NOT NULL DEFAULT 'Upcoming' CHECK (lifecycle_status IN ('Upcoming', 'In Theatres', 'Released', 'Delayed', 'Archived', 'Cancelled')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_movies_slug ON movies(slug);
CREATE INDEX IF NOT EXISTS idx_movies_primary_language ON movies(primary_language);
CREATE INDEX IF NOT EXISTS idx_movies_lifecycle_status ON movies(lifecycle_status);

-- 2. Sources Registry (Authorized data sources, APIs, and official trades)
CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('API', 'RSS', 'Official Trade', 'Studio PR', 'Government Gazette', 'Ticketing Portal')),
  base_url TEXT NOT NULL,
  access_method TEXT NOT NULL CHECK (access_method IN ('REST_API', 'RSS_XML', 'SCRAPED_HTML', 'MANUAL_DEPOSIT', 'WEBHOOK')),
  reliability_level TEXT NOT NULL CHECK (reliability_level IN ('TIER_1_PRIMARY', 'TIER_2_SECONDARY', 'TIER_3_UNCONFIRMED')),
  supported_languages_json TEXT DEFAULT '[]',
  supported_fields_json TEXT DEFAULT '[]',
  attribution_requirements TEXT,
  permission_notes TEXT,
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  last_fetch_at TEXT,
  last_success_at TEXT,
  last_error TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Movie Releases (Territory & language specific release events)
CREATE TABLE IF NOT EXISTS movie_releases (
  id TEXT PRIMARY KEY,
  movie_id TEXT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  release_type TEXT NOT NULL CHECK (release_type IN ('Theatrical Wide', 'Theatrical Limited', 'Film Festival', 'Digital Premiere', 'Special Screening')),
  territory TEXT NOT NULL DEFAULT 'India',
  language TEXT NOT NULL,
  release_date TEXT NOT NULL, -- YYYY-MM-DD
  date_confidence TEXT NOT NULL DEFAULT 'Confirmed' CHECK (date_confidence IN ('Confirmed', 'Tentative', 'Provisional', 'Rumored')),
  release_status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (release_status IN ('Scheduled', 'Screening Now', 'Completed', 'Postponed', 'Cancelled')),
  theatrical_evidence_status TEXT NOT NULL DEFAULT 'Unverified' CHECK (theatrical_evidence_status IN ('Verified Screened', 'Ticketing Live', 'Trade Confirmed', 'Unverified', 'Disputed')),
  source_id TEXT REFERENCES sources(id),
  last_verified_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_movie_releases_date ON movie_releases(release_date);
CREATE INDEX IF NOT EXISTS idx_movie_releases_movie_id ON movie_releases(movie_id);
CREATE INDEX IF NOT EXISTS idx_movie_releases_territory_status ON movie_releases(territory, release_status);

-- 4. Source Records (Raw ingestion provenance store for idempotency and audit)
CREATE TABLE IF NOT EXISTS source_records (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES sources(id),
  external_id TEXT NOT NULL,
  external_url TEXT,
  content_hash TEXT NOT NULL,
  record_type TEXT NOT NULL,
  retrieved_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  published_at TEXT,
  raw_payload_json TEXT NOT NULL,
  processing_status TEXT NOT NULL DEFAULT 'Pending' CHECK (processing_status IN ('Pending', 'Processed', 'Rejected', 'Failed')),
  error_message TEXT,
  UNIQUE(source_id, external_id, content_hash)
);

CREATE INDEX IF NOT EXISTS idx_source_records_source_external ON source_records(source_id, external_id);

-- 5. Movie Claims (Individual claim points with confidence and contradiction resolution)
CREATE TABLE IF NOT EXISTS movie_claims (
  id TEXT PRIMARY KEY,
  movie_id TEXT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  claim_type TEXT NOT NULL CHECK (claim_type IN ('release_date', 'budget', 'cast', 'cbfc_rating', 'box_office', 'runtime', 'ott_platform')),
  claim_value_json TEXT NOT NULL,
  source_id TEXT NOT NULL REFERENCES sources(id),
  source_url TEXT,
  evidence_excerpt TEXT,
  source_published_at TEXT,
  retrieved_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  confidence_score REAL NOT NULL DEFAULT 1.0,
  verification_status TEXT NOT NULL DEFAULT 'Verified' CHECK (verification_status IN ('Verified', 'Contested', 'Pending', 'Superseded', 'Rejected')),
  valid_from TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  valid_until TEXT,
  supersedes_claim_id TEXT REFERENCES movie_claims(id)
);

CREATE INDEX IF NOT EXISTS idx_movie_claims_movie_type ON movie_claims(movie_id, claim_type);

-- 6. Articles (Factual self-written editorial articles)
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'English',
  category TEXT NOT NULL CHECK (category IN ('Trade Analysis', 'Box Office Report', 'Release Confirmation', 'Production Exclusive', 'Weekly Roundup', 'OTT Release')),
  article_status TEXT NOT NULL DEFAULT 'Published' CHECK (article_status IN ('Draft', 'Review Required', 'Published', 'Archived', 'Retracted')),
  author_type TEXT NOT NULL DEFAULT 'Algorithmic Editorial Desk',
  published_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_verified_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  featured_asset_id TEXT,
  factual_confidence REAL NOT NULL DEFAULT 0.98,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);

-- 7. Article Sources (Evidence linking every article to verifiable sources)
CREATE TABLE IF NOT EXISTS article_sources (
  article_id TEXT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  source_id TEXT NOT NULL REFERENCES sources(id),
  source_url TEXT NOT NULL,
  supporting_claim_ids_json TEXT DEFAULT '[]',
  attribution_text TEXT NOT NULL,
  PRIMARY KEY (article_id, source_id, source_url)
);

-- 8. Ratings (Strict segregation by provider and scale)
CREATE TABLE IF NOT EXISTS ratings (
  id TEXT PRIMARY KEY,
  movie_id TEXT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('IMDb', 'Rotten Tomatoes Critics', 'Rotten Tomatoes Audience', 'Metacritic', 'BookMyShow')),
  rating_value REAL NOT NULL,
  rating_scale REAL NOT NULL, -- 10 or 100
  vote_count INTEGER DEFAULT 0,
  source_url TEXT,
  retrieved_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(movie_id, provider)
);

-- 9. Box Office Reports (Multi-source financial collections with net/gross segregation)
CREATE TABLE IF NOT EXISTS box_office_reports (
  id TEXT PRIMARY KEY,
  movie_id TEXT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  territory TEXT NOT NULL DEFAULT 'India',
  collection_type TEXT NOT NULL CHECK (collection_type IN ('India Net', 'India Gross', 'Overseas Gross', 'Worldwide Gross')),
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  reporting_period TEXT NOT NULL, -- e.g. 'Opening Day', 'Opening Weekend', 'Week 1', 'Total Lifetime'
  figure_type TEXT NOT NULL CHECK (figure_type IN ('Machine Audited', 'Trade Consensus', 'Producer Claim', 'Estimated Forecast')),
  source_id TEXT REFERENCES sources(id),
  source_url TEXT,
  retrieved_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_box_office_movie_id ON box_office_reports(movie_id);

-- 10. Media Assets (Authentic posters and backdrops with licensing)
CREATE TABLE IF NOT EXISTS media_assets (
  id TEXT PRIMARY KEY,
  movie_id TEXT REFERENCES movies(id) ON DELETE SET NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('poster', 'backdrop', 'trailer_thumbnail', 'article_hero')),
  source_url TEXT NOT NULL,
  stored_url TEXT,
  source_page_url TEXT,
  license_status TEXT NOT NULL DEFAULT 'Promotional Editorial Use',
  attribution TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'Verified' CHECK (verification_status IN ('Verified', 'Pending', 'Flagged')),
  width INTEGER,
  height INTEGER,
  retrieved_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_checked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 11. Ingestion Jobs (Job tracking, retries, and execution monitoring)
CREATE TABLE IF NOT EXISTS ingestion_jobs (
  id TEXT PRIMARY KEY,
  job_type TEXT NOT NULL CHECK (job_type IN ('FULL_SYNC', 'DAILY_ROLLOVER', 'SOURCE_DISCOVERY', 'DATE_RECONCILIATION', 'ARTICLE_GENERATOR', 'BOX_OFFICE_TRIANGULATION')),
  source_id TEXT REFERENCES sources(id),
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'RETRYING')),
  started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT,
  attempt_count INTEGER NOT NULL DEFAULT 1,
  records_processed INTEGER DEFAULT 0,
  records_created INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_ingestion_jobs_status ON ingestion_jobs(status);

-- 12. Audit Logs (Immutable regulatory and trade reconciliation logs)
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('SYSTEM_WORKER', 'CRON_TRIGGER', 'ADMIN_USER', 'DATA_PIPELINE')),
  actor_id TEXT NOT NULL DEFAULT 'worker-primary',
  entity_type TEXT NOT NULL CHECK (entity_type IN ('movie', 'movie_release', 'article', 'source', 'claim', 'rating', 'box_office')),
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'VERIFY', 'CONTRADICT', 'PUBLISH', 'QUARANTINE', 'EVICT')),
  previous_value_json TEXT,
  new_value_json TEXT,
  reason TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- 13. Correction Requests (Public trade and viewer corrections queue)
CREATE TABLE IF NOT EXISTS correction_requests (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('movie', 'release_date', 'box_office', 'article', 'ratings')),
  entity_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  requested_correction TEXT NOT NULL,
  evidence_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending Review' CHECK (status IN ('Pending Review', 'Accepted', 'Rejected', 'Under Investigation')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at TEXT
);
