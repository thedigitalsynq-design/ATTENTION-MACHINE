import { Tv } from 'lucide-react';

export const OttReleasesPage: React.FC = () => {
  const ottReleases = [
    {
      id: 'ott-1',
      title: 'Stree 2: Sarkate Ka Aatank',
      platform: 'Prime Video',
      language: 'Hindi / Dubbed',
      digitalPremiereDate: 'Available Now',
      theatricalReleaseDate: '15 August 2024',
      holdbackPeriod: '8 Weeks Holdback',
      status: 'Streaming Now',
      notes: 'All-time blockbuster streaming globally in 4K UHD.'
    },
    {
      id: 'ott-2',
      title: 'The Paradise',
      platform: 'Aha Video & JioCinema',
      language: 'Telugu',
      digitalPremiereDate: '20 November 2026 (Scheduled)',
      theatricalReleaseDate: '24 September 2026',
      holdbackPeriod: '8 Weeks Theatrical Window',
      status: 'Officially Announced',
      notes: 'Digital rights secured by Aha Video for Telugu streaming.'
    },
    {
      id: 'ott-3',
      title: 'Jailer 2 (Hukum)',
      platform: 'Netflix India',
      language: 'Tamil, Telugu, Hindi, Malayalam, Kannada',
      digitalPremiereDate: '04 December 2026 (Contractual Window)',
      theatricalReleaseDate: '15 October 2026',
      holdbackPeriod: 'Mandatory 50-Day Multiplex Holdback',
      status: 'Theatrical Holdback',
      notes: 'Sun Pictures digital partnership with Netflix India for post-theatrical window.'
    },
    {
      id: 'ott-4',
      title: 'The Vvaan: Force of the Forrest',
      platform: 'ZEE5 Global',
      language: 'Hindi',
      digitalPremiereDate: '13 November 2026 (Scheduled)',
      theatricalReleaseDate: '25 September 2026',
      holdbackPeriod: '7 Weeks Theatrical Window',
      status: 'Officially Announced',
      notes: 'Co-produced by Zee Studios, locking exclusive home digital premiere on ZEE5.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-4">
          <Tv className="w-4 h-4" />
          Theatrical Holdback & Streaming Rights Protocol
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          Verified OTT & Digital Premieres
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
          Confirmed post-theatrical streaming windows. Theatrical releases are strictly held back per national multiplex association agreements (typically 50–56 days) before digital premiere.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ottReleases.map((item) => (
          <div key={item.id} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                  {item.platform}
                </span>
                <h3 className="text-lg font-bold text-white mt-2">{item.title}</h3>
                <p className="text-xs text-slate-500 font-mono">{item.language}</p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
                {item.status}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">{item.notes}</p>

            <div className="space-y-2 pt-3 border-t border-slate-800/80 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Theatrical Release:</span>
                <span className="text-white">{item.theatricalReleaseDate}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Digital Premiere:</span>
                <span className="text-cyan-400 font-bold">{item.digitalPremiereDate}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Holdback Agreement:</span>
                <span className="text-slate-300">{item.holdbackPeriod}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
