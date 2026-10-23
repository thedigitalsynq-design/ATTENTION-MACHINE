// =========================================================================
// CinéPulse Bharat - Cloudflare D1 Database Client & Fallback Engine
// =========================================================================

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<D1ExecResult>;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  all<T = unknown>(): Promise<D1Result<T>>;
  run(): Promise<D1Result<unknown>>;
}

export interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  meta?: Record<string, unknown>;
  error?: string;
}

export interface D1ExecResult {
  count: number;
  duration: number;
}

export interface WorkerEnv {
  DB?: D1Database;
  ASSETS?: { fetch: typeof fetch };
  ADMIN_API_KEY?: string;
  APP_ENV?: string;
  TMDB_API_KEY?: string;
}

/**
 * Executes a query with parameters against D1 database.
 */
export async function queryAll<T = unknown>(
  db: D1Database | undefined,
  sql: string,
  ...params: unknown[]
): Promise<T[]> {
  if (!db) {
    return [];
  }
  try {
    const stmt = db.prepare(sql).bind(...params);
    const res = await stmt.all<T>();
    return res.results || [];
  } catch (err) {
    console.error('D1 query error:', err, 'SQL:', sql, 'Params:', params);
    return [];
  }
}

/**
 * Executes a query returning the first matching record.
 */
export async function queryFirst<T = unknown>(
  db: D1Database | undefined,
  sql: string,
  ...params: unknown[]
): Promise<T | null> {
  if (!db) {
    return null;
  }
  try {
    const stmt = db.prepare(sql).bind(...params);
    return await stmt.first<T>();
  } catch (err) {
    console.error('D1 queryFirst error:', err, 'SQL:', sql);
    return null;
  }
}

/**
 * Executes an INSERT, UPDATE, or DELETE command.
 */
export async function executeRun(
  db: D1Database | undefined,
  sql: string,
  ...params: unknown[]
): Promise<boolean> {
  if (!db) return false;
  try {
    const stmt = db.prepare(sql).bind(...params);
    const res = await stmt.run();
    return res.success;
  } catch (err) {
    console.error('D1 executeRun error:', err, 'SQL:', sql);
    return false;
  }
}
