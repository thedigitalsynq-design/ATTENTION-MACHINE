import React from 'react';
import { Film, Play } from 'lucide-react';

export const TrailersPage: React.FC = () => {
  const trailers = [
    {
      id: 'tr-ramayana',
      title: 'Ramayana: Part 1 - First Official Glimpse (IMAX 3D)',
      language: 'Hindi / Multi-Language',
      director: 'Nitesh Tiwari',
      producers: 'Namit Malhotra & Yash',
      releaseDate: '05 November 2026',
      badge: 'Diwali 2026',
      youtubeId: 'RamayanaPart1TeaserDiwali2026',
      synopsis: 'Ranbir Kapoor as Lord Rama, Sai Pallavi as Mata Sita, and Yash as Lankesh Ravana in India’s grandest visual epic.'
    },
    {
      id: 'tr-jailer-2',
      title: 'Jailer 2 (Hukum) - Official Theatrical Trailer',
      language: 'Tamil / Pan-India',
      director: 'Nelson Dilipkumar',
      producers: 'Sun Pictures',
      releaseDate: '15 October 2026 (Screening Now)',
      badge: 'Blockbuster',
      youtubeId: 'Jailer2OfficialTeaser2026',
      synopsis: 'Superstar Rajinikanth returns as Tiger Muthuvel Pandian battling an international syndicate.'
    },
    {
      id: 'tr-the-vvaan',
      title: 'The Vvaan: Force of the Forrest - Official Trailer',
      language: 'Hindi',
      director: 'Nikkhil Advani',
      producers: 'Emmay Entertainment & Zee Studios',
      releaseDate: '25 September 2026',
      badge: 'Action Thriller',
      youtubeId: 'TheVvaanTrailer2026',
      synopsis: 'Eco-defense special forces operative deployed to the dense central Indian reserves.'
    },
    {
      id: 'tr-king',
      title: 'King - Official Announcement Teaser',
      language: 'Hindi',
      director: 'Sujoy Ghosh',
      producers: 'Red Chillies Entertainment',
      releaseDate: '24 December 2026',
      badge: 'Christmas 2026',
      youtubeId: 'KingOfficialTeaserSRK',
      synopsis: 'Shah Rukh Khan commands a high-octane international underworld espionage thriller.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono uppercase tracking-wider mb-4">
          <Film className="w-4 h-4" />
          Official Studio Teasers & IMAX Deliverables
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          Official Trailers & Glimpses
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
          Verified original teasers, theatrical trailers, and visual deliverables direct from studio distribution servers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {trailers.map((tr) => (
          <div key={tr.id} className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden hover:border-slate-700 transition-all flex flex-col">
            <div className="relative aspect-video bg-slate-950 flex items-center justify-center group cursor-pointer">
              <div className="w-14 h-14 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 fill-white ml-0.5" />
              </div>
              <span className="absolute top-3 left-3 text-xs font-mono px-2 py-0.5 rounded bg-black/80 text-rose-400 border border-rose-500/20">
                {tr.badge}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-indigo-400 font-semibold">{tr.language}</span>
                <h3 className="text-lg font-bold text-white mt-1 mb-2">{tr.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{tr.synopsis}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>Release: {tr.releaseDate}</span>
                <span>Directed by {tr.director}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
