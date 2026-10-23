export type IndustryCode = 'all' | 'hindi' | 'telugu' | 'tamil' | 'malayalam' | 'kannada' | 'bengali' | 'marathi';

export type CensorRating = 'U' | 'U/A' | 'U/A 16+' | 'A' | 'Pending';

export type MovieTheatricalStatus =
  | 'upcoming'
  | 'released'
  | 'currently_screening'
  | 'completed_theatrical_run'
  | 'delayed_postponed'
  | 'archived_run'
  | 'unknown_unconfirmed';

export interface DayWiseCollection {
  day: number;
  date: string;
  collectionNetCr: number;
  collectionGrossCr: number;
  occupancyPct: number;
  screenCount: number;
  notableOccurrences?: string;
}

export interface TerritoryCollection {
  territory: string;
  amountCr: number;
  sharePct: number;
}

export interface CastMember {
  name: string;
  role: string;
  characterName: string;
  imageUrl?: string;
}

export interface CrewMember {
  name: string;
  role: string;
  notes?: string;
}

export interface BoxOfficeSourceBreakdown {
  sourceName: string;
  sourceCategory: 'Machine-Tracked' | 'Trade Consensus' | 'Studio / Producer' | 'Comscore Overseas';
  indiaNetCr?: number;
  indiaGrossCr?: number;
  overseasGrossCr?: number;
  worldwideGrossCr?: number;
  reportedTimestamp: string;
  auditStatus: 'Audited & Verified' | 'Trade Consensus' | 'Flagged Divergence' | 'Preliminary Track';
  varianceNote?: string;
  divergencePct?: number;
}

export interface BoxOfficeTriangulation {
  representativeIndiaNetCr: number;
  representativeIndiaGrossCr: number;
  representativeOverseasGrossCr: number;
  overseasUSDMillion: number;
  representativeWorldwideGrossCr: number;
  distributorShareCr: number;
  sources: BoxOfficeSourceBreakdown[];
  discrepancySpreadPct: number;
  consensusRating: 'High Consensus (±1.5%)' | 'Moderate Variance (±3-5%)' | 'Divergence Flagged (>5%)';
  triangulationMethodology: string;
  isRealtimeActive: boolean;
  lastISTSync: string;
}

export interface MovieBoxOffice {
  openingDayIndiaNetCr: number;
  openingWeekendIndiaNetCr: number;
  totalIndiaNetCr: number;
  totalIndiaGrossCr: number;
  overseasGrossCr: number;
  worldwideGrossCr: number;
  budgetCr: number;
  verdict: 'All-Time Blockbuster' | 'Blockbuster' | 'Super Hit' | 'Hit' | 'Awaiting Verdict' | 'Trending' | 'Historic Opener';
  confidenceScorePct: number;
  lastAuditedTimestamp: string;
  sourcesAttributed: string[];
  dayWise: DayWiseCollection[];
  territories: TerritoryCollection[];
  triangulation?: BoxOfficeTriangulation;
}

export interface RatingSource {
  provider: 'IMDb' | 'Rotten Tomatoes Critics' | 'Rotten Tomatoes Audience' | 'Metacritic' | 'BookMyShow';
  score: number;
  maxScore: number;
  scoreDisplay: string;
  reviewOrVoteCount?: number;
  verifiedAt: string;
  sourceUrl?: string;
}

export interface TerritoryReleaseInfo {
  territory: 'India' | 'North America' | 'United Kingdom' | 'Gulf / GCC' | 'Australia / NZ' | 'Worldwide';
  releaseDate: string;
  releaseType: 'Theatrical Wide' | 'Theatrical Limited' | 'Premiere / Festival' | 'Digital';
  status: MovieTheatricalStatus;
  screenCount?: number;
  certification?: string;
}

export interface MovieProvenance {
  externalIds: {
    tmdbId?: number;
    imdbId?: string;
    cbfcCertificateNumber?: string;
    bookMyShowCode?: string;
  };
  lastVerifiedTimestamp: string;
  provenanceSources: string[];
  fieldConfidenceScores: {
    releaseDate: number;
    boxOffice: number;
    ratings: number;
  };
}

export interface Movie {
  id: string;
  slug: string;
  title: string;
  nativeTitle: string;
  scriptClass: string;
  language: string;
  dubbedLanguages: string[];
  industry: IndustryCode;
  releaseDate: string;
  runtimeMinutes: number;
  censorRating: CensorRating;
  genres: string[];
  director: string;
  musicDirector: string;
  producers: string;
  banner: string;
  synopsis: string;
  posterUrl: string;
  backdropUrl: string;
  trailerYoutubeId: string;
  criticScore: number;
  criticReviewsCount: number;
  audienceScore: number;
  audienceVotesCount: number;
  boxOffice: MovieBoxOffice;
  isLeadFeature?: boolean;
  status: 'In Theatres' | 'Upcoming' | 'Ott Streamed' | 'Historic';
  theatricalStatus?: MovieTheatricalStatus;
  formats: string[];
  releaseStatus: 'Confirmed' | 'Tentative' | 'Screening Now' | 'Postponed' | 'Cancelled';
  tags: string[];
  cast?: CastMember[];
  crew?: CrewMember[];
  ratingsBreakdown?: RatingSource[];
  territoryReleases?: TerritoryReleaseInfo[];
  provenance?: MovieProvenance;
  hasVerifiedPoster?: boolean;
  posterAttribution?: string;
  sourceUrl?: string;
  verificationDate?: string;
  isProvisional?: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  fullContent?: string;
  author: string;
  publisher: string;
  publisherLogo?: string;
  publishedAt: string;
  readTime: string;
  category: 'Trade Analysis' | 'Box Office Report' | 'Production Exclusive' | 'Festival & Awards' | 'Review & Critique';
  relatedMovieId?: string;
  imageUrl: string;
  tags: string[];
  priority: 'lead' | 'secondary' | 'feed';
  rating?: number;
  originalArticleUrl?: string;
  isVerifiedReport?: boolean;
}

export interface LivePulseItem {
  id: string;
  type: 'boxoffice' | 'news' | 'trailer' | 'review' | 'milestone';
  headline: string;
  timeAgo: string;
  delta?: string;
  badge?: string;
  movieId?: string;
  isBreaking?: boolean;
  sourceAttribution?: string;
}

export interface DiscussionComment {
  id: string;
  author: string;
  avatar: string;
  badge?: string;
  text: string;
  timestamp: string;
  upvotes: number;
}

export interface DiscussionThread {
  id: string;
  movieId?: string;
  movieTitle?: string;
  title: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    badge: 'Verified Trade Analyst' | 'Film Critic' | 'Box Office Mod' | 'Cinephile Fellow' | 'Audience';
  };
  timestamp: string;
  content: string;
  upvotes: number;
  repliesCount: number;
  isSpoiler: boolean;
  tags: string[];
  comments: DiscussionComment[];
}

export interface IndustryMetadata {
  code: IndustryCode;
  name: string;
  nativeName: string;
  scriptClass: string;
  filmCity: string;
  boxOfficeShare2025: string;
  totalTrackedScreens: number;
  marqueeDirectors: string[];
  description: string;
}
