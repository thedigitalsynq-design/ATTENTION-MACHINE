import React from 'react';
import { Star, Award } from 'lucide-react';
import { useCinemaTelemetry } from '../context/TelemetryContext';

export const RatingsPage: React.FC = () => {
  const { theatricalMovies } = useCinemaTelemetry();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-4">
          <Award className="w-4 h-4" />
          Provider Segregation & Score Scale Integrity
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          Audited Ratings & Audience Verification
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
          Ratings from different providers (IMDb 10-point scale, BookMyShow verified ticket-buyer score, Rotten Tomatoes percentage) are strictly segregated and never combined into misleading synthetic averages.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {theatricalMovies.map((movie) => (
          <div key={movie.id} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-semibold">
                  {movie.language}
                </span>
                <h3 className="text-lg font-bold text-white mt-2">{movie.title}</h3>
                <p className="text-xs text-slate-500 font-mono">Directed by {movie.director}</p>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  Critic Consensus
                </span>
                <span className="font-bold text-white">{movie.criticScore}% (100-pt scale)</span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  BookMyShow Verified Ticket Buyers
                </span>
                <span className="font-bold text-white">{movie.audienceScore}/10</span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Day of Theatrical Run</span>
                <span className="font-bold text-indigo-400">Day {movie.releaseClassification?.dayOfRun || 1}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
