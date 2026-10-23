import { z } from 'zod';
import {
  MovieSchema,
  MovieReleaseSchema,
  SourceSchema,
  ArticleSchema,
  RatingSchema,
  BoxOfficeReportSchema,
  CorrectionRequestSchema,
  PaginationQuerySchema,
} from './schemas';

export type MovieRecord = z.infer<typeof MovieSchema>;
export type MovieReleaseRecord = z.infer<typeof MovieReleaseSchema>;
export type SourceRecord = z.infer<typeof SourceSchema>;
export type ArticleRecord = z.infer<typeof ArticleSchema>;
export type RatingRecord = z.infer<typeof RatingSchema>;
export type BoxOfficeReportRecord = z.infer<typeof BoxOfficeReportSchema>;
export type CorrectionRequestInput = z.infer<typeof CorrectionRequestSchema>;
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    timestamp?: string;
    istDateAnchor?: string;
    windowDaysCount?: number;
  };
  error?: string;
}

export interface IngestionJobRecord {
  id: string;
  job_type: 'FULL_SYNC' | 'DAILY_ROLLOVER' | 'SOURCE_DISCOVERY' | 'DATE_RECONCILIATION' | 'ARTICLE_GENERATOR' | 'BOX_OFFICE_TRIANGULATION';
  source_id?: string | null;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'RETRYING';
  started_at: string;
  completed_at?: string | null;
  attempt_count: number;
  records_processed: number;
  records_created: number;
  records_updated: number;
  error_message?: string | null;
}

export interface AuditLogRecord {
  id: string;
  actor_type: 'SYSTEM_WORKER' | 'CRON_TRIGGER' | 'ADMIN_USER' | 'DATA_PIPELINE';
  actor_id: string;
  entity_type: 'movie' | 'movie_release' | 'article' | 'source' | 'claim' | 'rating' | 'box_office';
  entity_id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VERIFY' | 'CONTRADICT' | 'PUBLISH' | 'QUARANTINE' | 'EVICT';
  previous_value_json?: string | null;
  new_value_json?: string | null;
  reason: string;
  created_at: string;
}
