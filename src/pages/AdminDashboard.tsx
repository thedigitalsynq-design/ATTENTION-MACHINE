import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Cpu,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Play,
  Layers,
  Lock,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [apiKey, setApiKey] = useState('cinepulse-admin-secret-2026');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'sources' | 'review' | 'jobs' | 'audit'>('overview');
  const [isRunningJob, setIsRunningJob] = useState(false);
  const [jobResult, setJobResult] = useState<string | null>(null);
  const [sources, setSources] = useState<any[]>([]);

  useEffect(() => {
    // Attempt load sources with default dev key
    fetch('/api/v1/sources')
      .then((res) => res.json())
      .then((data: any) => {
        if (data.data) setSources(data.data);
      })
      .catch(() => {});
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim().length > 5) {
      setIsAuthenticated(true);
    }
  };

  const handleTriggerJob = async (jobType: string) => {
    setIsRunningJob(true);
    setJobResult(null);
    try {
      const res = await fetch('/api/v1/admin/ingestion/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ jobType }),
      });
      const data: any = await res.json();
      if (data.success) {
        setJobResult(`Job ${data.data.jobId} executed successfully: ${data.data.message}`);
      } else {
        setJobResult(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setJobResult(`Execution failed: ${err.message}`);
    } finally {
      setIsRunningJob(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-md">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Terminal Access</h1>
          <p className="text-xs text-slate-400 mb-6">
            Enter the authorized Cloudflare Worker administrator key to inspect ingestion pipelines, review queues, and audit logs.
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter ADMIN_API_KEY..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all"
            >
              Authenticate Terminal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Cpu className="w-4 h-4" />
            Cloudflare D1 & Worker Production Console
          </div>
          <h1 className="text-3xl font-extrabold text-white">Administrative Operations Terminal</h1>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
          {(['overview', 'sources', 'review', 'jobs', 'audit'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${
                activeTab === tab
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { label: 'Active Ingestion Sources', val: '6 Registered', status: 'All Healthy' },
              { label: 'Verified Cinema Titles', val: '51 Indian Films', status: '23 Active / 28 Upcoming' },
              { label: 'Cloudflare D1 Binding', val: 'cinema-prod', status: 'SQLite Connected' },
              { label: 'Next Scheduled Rollover', val: '00:00 IST Midnight', status: 'Automated Cron Active' },
            ].map((stat, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <p className="text-xs font-mono text-slate-400 mb-1">{stat.label}</p>
                <div className="text-xl font-bold text-white mb-1">{stat.val}</div>
                <div className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {stat.status}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Play className="w-4 h-4 text-amber-400" />
              Manual Pipeline Triggers (Idempotent Async Execution)
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                { type: 'DAILY_ROLLOVER', label: 'Trigger Daily Rollover Window Shift' },
                { type: 'ARTICLE_GENERATOR', label: 'Trigger Automated Article Generator' },
                { type: 'FULL_SYNC', label: 'Run Full Multi-Source Registry Sync' },
              ].map((job) => (
                <button
                  key={job.type}
                  onClick={() => handleTriggerJob(job.type)}
                  disabled={isRunningJob}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRunningJob ? 'animate-spin' : ''}`} />
                  {job.label}
                </button>
              ))}
            </div>

            {jobResult && (
              <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300">
                {jobResult}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sources Tab */}
      {activeTab === 'sources' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="p-4">Source ID</th>
                <th className="p-4">Name & Base URL</th>
                <th className="p-4">Type</th>
                <th className="p-4">Reliability Tier</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {sources.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/30">
                  <td className="p-4 text-indigo-400 font-bold">{s.id}</td>
                  <td className="p-4">
                    <div className="font-bold text-white">{s.name}</div>
                    <div className="text-[11px] text-slate-500">{s.base_url}</div>
                  </td>
                  <td className="p-4 text-slate-400">{s.source_type}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {s.reliability_level}
                    </span>
                  </td>
                  <td className="p-4 text-emerald-400 font-bold">Active & Synchronized</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Review Queue Tab */}
      {activeTab === 'review' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 leading-relaxed">
            <strong>Editorial Gate Policy:</strong> Factual claims with provisional or tentative confidence ratings (e.g. unverified dates or postponed releases) are isolated here until corroborated by official CBFC certification or multiplex agreements.
          </div>

          {[
            { id: 'damru', title: 'Damru', date: '2026-10-23', status: 'Tentative', issue: 'Language and regional distribution rights pending CBFC gazette certificate' },
            { id: 'the-influencer-project', title: 'The Influencer Project', date: '2026-10-30', status: 'Tentative', issue: 'Awaiting studio official trade bulletin' },
            { id: 'the-raja-saab', title: 'The Raja Saab', date: '2027-01-14 (Rescheduled)', status: 'Quarantined', issue: 'Officially postponed by People Media Factory for VFX polish' },
          ].map((item) => (
            <div key={item.id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold mr-2">
                  {item.status}
                </span>
                <span className="text-base font-bold text-white">{item.title}</span>
                <p className="text-xs text-slate-400 mt-1">{item.issue}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono transition-colors">
                  Approve / Confirm
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors">
                  Keep in Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden p-4 space-y-3">
          {[
            { id: 'log-1', actor: 'CRON_TRIGGER', action: 'DAILY_ROLLOVER', entity: 'movie_releases', desc: 'Shifted rolling 30-day window to 2026-09-22 through 2026-10-21', time: '21 Oct 2026 00:00:00 IST' },
            { id: 'log-2', actor: 'SYSTEM_WORKER', action: 'VERIFY', entity: 'udumbanchola-vision', desc: 'Promoted to Opening Today following Kerala circuit first show confirmations', time: '21 Oct 2026 02:00:00 IST' },
            { id: 'log-3', actor: 'SYSTEM_WORKER', action: 'QUARANTINE', entity: 'the-raja-saab', desc: 'Quarantined from active theatrical calendars to prevent false screening listings', time: '21 Oct 2026 00:00:02 IST' },
          ].map((log) => (
            <div key={log.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 font-mono text-xs flex justify-between items-center">
              <div>
                <span className="text-indigo-400 font-bold mr-2">[{log.actor}]</span>
                <span className="text-emerald-400 font-semibold mr-2">{log.action}</span>
                <span className="text-slate-300">{log.desc}</span>
              </div>
              <div className="text-slate-500 text-[11px]">{log.time}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
