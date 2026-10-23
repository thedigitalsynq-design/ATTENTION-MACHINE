import React from 'react';
import { Database, ShieldCheck, ExternalLink } from 'lucide-react';

export const SourcesPage: React.FC = () => {
  const sources = [
    {
      id: 'src-wikipedia',
      name: 'Wikipedia Infobox Registry',
      type: 'Knowledge Base API',
      url: 'https://en.wikipedia.org/w/api.php',
      reliability: 'Tier 1 Primary',
      attribution: 'CC BY-SA 4.0 Attribution required',
      purpose: 'Verification of canonical film titles, official directors, core production houses, and announced release dates.',
      fields: ['Canonical Title', 'Director', 'Producers', 'Primary Language', 'Infobox Release Date']
    },
    {
      id: 'src-bookmyshow',
      name: 'BookMyShow Live Ticketing & Schedule Registry',
      type: 'Ticketing Portal',
      url: 'https://in.bookmyshow.com',
      reliability: 'Tier 1 Primary',
      attribution: 'Direct ticketing partner attribution',
      purpose: 'Verification of actual commercial cinema screenings, live ticketing status, screen counts, and advance booking.',
      fields: ['Event Code', 'Ticketing Status', 'Live Theatres', 'Censor Certification']
    },
    {
      id: 'src-newindianmovies',
      name: 'New Indian Movies Directory',
      type: 'Official Trade Aggregate',
      url: 'https://newindianmovies.com/releases',
      reliability: 'Tier 1 Primary',
      attribution: 'Trade release calendar attribution',
      purpose: 'Comprehensive multi-lingual tracking across regional South Indian and East Indian cinema distributions.',
      fields: ['Regional Release Calendars', 'Language Specifications', 'Distribution Circuits']
    },
    {
      id: 'src-varietyindia',
      name: 'Variety India Film Intelligence',
      type: 'Editorial Trade Desk',
      url: 'https://varietyindia.com',
      reliability: 'Tier 1 Primary',
      attribution: 'Variety Trade Desk attribution',
      purpose: 'Commercial screen allocation intelligence, holiday tentpole scheduling, and trade circular verification.',
      fields: ['Trade Circulars', 'Multiplex Commitments', 'Territory Screen Allocations']
    },
    {
      id: 'src-district',
      name: 'District Entertainment Guide',
      type: 'Industry Directory',
      url: 'https://www.district.in/movies/upcoming-hindi-movies',
      reliability: 'Tier 1 Primary',
      attribution: 'District Media credit',
      purpose: 'Northern and western distribution circuit releases, provisional release windows, and production announcements.',
      fields: ['Upcoming Slates', 'Genre Classifications', 'Studio Banners']
    },
    {
      id: 'src-sacnilk',
      name: 'Sacnilk Machine-Audited Tracking',
      type: 'Machine-Tracked Ledger',
      url: 'https://sacnilk.com',
      reliability: 'Tier 1 Primary',
      attribution: 'Sacnilk Verified Ledger attribution',
      purpose: 'Screen-level machine-audited occupancy data, admissions counts, India Net, India Gross, and Overseas Gross.',
      fields: ['India Net', 'India Gross', 'Overseas Gross', 'Occupancy Ratios', 'Day-Wise Ledger']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-wider mb-4">
          <ShieldCheck className="w-4 h-4" />
          Institutional Transparency & Verification Protocol
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
          Data Sources & Verification Methodology
        </h1>
        <p className="text-slate-400 text-base max-w-3xl leading-relaxed">
          CinéPulse Bharat operates under strict empirical data-provenance rules. Every release date, box-office figure, and editorial claim is cross-checked across independent registries before publication.
        </p>
      </div>

      {/* 5-Way Cross-Check Protocol Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-12 shadow-xl backdrop-blur-md">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-400" />
          The 5-Point Cross-Checking Engine
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          Before any movie is published or categorized as Screening Now or Confirmed Upcoming, it must pass five independent verification gates:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { step: 'Check 1', title: 'Wikipedia Infobox', desc: 'Verifies canonical title, director, and official infobox release date match.' },
            { step: 'Check 2', title: 'BookMyShow Event', desc: 'Confirms valid BookMyShow event code and active ticketing or interest status.' },
            { step: 'Check 3', title: 'Studio Trade Lock', desc: 'Cross-verifies official press release from the lead production house.' },
            { step: 'Check 4', title: 'CBFC Gazette', desc: 'Checks Central Board of Film Certification clearance and certificate serial.' },
            { step: 'Check 5', title: 'Exhibitor Screen Lock', desc: 'Validates Multiplex Association of India (MAI) screen allocation commitment.' },
          ].map((c, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-xs font-mono text-indigo-400 font-bold mb-1">{c.step}</div>
              <div className="text-sm font-semibold text-white mb-2">{c.title}</div>
              <div className="text-xs text-slate-400 leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Authorized Sources Directory */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white mb-6">Authorized Ingestion Sources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sources.map((s) => (
            <div key={s.id} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
                    {s.reliability}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2">{s.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">{s.type}</p>
                </div>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed mb-4">{s.purpose}</p>
              <div className="border-t border-slate-800/80 pt-3">
                <div className="text-xs text-slate-400 font-mono mb-2">
                  <span className="text-slate-500">Attribution:</span> {s.attribution}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {s.fields.map((f, fi) => (
                    <span key={fi} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
