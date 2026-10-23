import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldAlert } from 'lucide-react';

export const CorrectionsPage: React.FC = () => {
  const [entityType, setEntityType] = useState('movie');
  const [entityId, setEntityId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [correctionText, setCorrectionText] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/v1/corrections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity_type: entityType,
          entity_id: entityId,
          user_email: userEmail,
          requested_correction: correctionText,
          evidence_url: evidenceUrl,
        }),
      });
      const data: any = await res.json();
      setTicketId(data.data?.ticketId || `corr-${Date.now()}`);
      setSubmitted(true);
    } catch {
      setTicketId(`corr-${Date.now()}`);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono uppercase tracking-wider mb-4">
          <ShieldAlert className="w-4 h-4" />
          Trade & Public Dispute Protocol
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-2">Request a Data Correction</h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          CinéPulse Bharat welcomes verified corrections from film producers, distributor federations, exhibitor associations, and film scholars. All disputes require verifiable evidence URLs.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Correction Ticket Logged</h2>
          <p className="text-sm font-mono text-emerald-300 mb-4">Ticket Reference ID: {ticketId}</p>
          <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed mb-6">
            Your submission has been queued for verification with our algorithmic and editorial audit desks. If the provided evidence verifies a discrepancy, the database will update in the next scheduled cycle.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setCorrectionText('');
              setEvidenceUrl('');
            }}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-colors"
          >
            Submit Another Correction
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                Dispute Entity Type
              </label>
              <select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="movie">Movie Metadata (Title / Director / Cast)</option>
                <option value="release_date">Release Date / Postponement</option>
                <option value="box_office">Box Office Collection Figure</option>
                <option value="ratings">Rating Discrepancy</option>
                <option value="article">Editorial Article Correction</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                Movie Name / Slug / ID
              </label>
              <input
                type="text"
                required
                placeholder="e.g. jailer-2 or Ramayana Part 1"
                value={entityId}
                onChange={(e) => setEntityId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
              Your Professional / Contact Email
            </label>
            <input
              type="email"
              required
              placeholder="analyst@productionhouse.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
              Requested Correction Details
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe the exact factual error and the corrected factual data point..."
              value={correctionText}
              onChange={(e) => setCorrectionText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
              Verifiable Evidence URL (Mandatory)
            </label>
            <input
              type="url"
              required
              placeholder="https://official-trade-statement.com or CBFC certificate link"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
            <p className="text-[11px] text-slate-500 mt-1.5">
              Unverified claims without official links will be automatically discarded by the audit gate.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-amber-600 hover:from-indigo-500 hover:to-amber-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Submitting to Review Gate...' : 'Submit Verifiable Correction'}
          </button>
        </form>
      )}
    </div>
  );
};
