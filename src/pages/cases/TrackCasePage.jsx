import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { casesService } from '../../api/cases.service';
import { StatusBadge } from '../../components/ui/Badge';
import { formatKES } from '../../utils/formatKES';
import { fmtDate } from '../../utils/formatDate';
import { ROUTES } from '../../constants/routes';

export default function TrackCasePage() {
  const [params]   = useSearchParams();
  const [code,     setCode]    = useState(params.get('code') ?? '');
  const [result,   setResult]  = useState(null);
  const [loading,  setLoading] = useState(false);
  const [error,    setError]   = useState('');

  // Auto-track if code in URL
  useEffect(() => {
    if (params.get('code')) handleTrack(params.get('code'));
  }, []);

  const handleTrack = async (trackCode) => {
    const c = trackCode ?? code;
    if (!c.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await casesService.track(c.trim());
      // Backend: { success: true, data: { case: { ...fields } } }
      setResult(res.data.case);
    } catch (err) {
      setError(err?.message ?? 'Tracking code not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-uwazi-navy flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg">
        <h1 className="text-2xl font-black text-uwazi-navy mb-1">UWAZI</h1>
        <h2 className="text-xl font-bold text-slate-800 mt-4 mb-2">Track a Case</h2>
        <p className="text-slate-500 text-sm mb-6">Enter your tracking code to see the current status</p>

        <div className="flex gap-3">
          <input value={code} onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
            placeholder="e.g. UW-2026-0042"
            className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-uwazi-sky/30 focus:border-uwazi-sky font-mono" />
          <button onClick={() => handleTrack()} disabled={loading}
            className="bg-uwazi-sky hover:bg-uwazi-blue text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60">
            {loading ? '…' : 'Track'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
        )}

        {result && (
          <div className="mt-6 border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-slate-900">{result.title}</p>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{result.tracking_code}</p>
              </div>
              <StatusBadge status={result.status} />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {result.category && <div><span className="text-slate-400 text-xs">Category</span><p className="capitalize">{result.category}</p></div>}
              {result.county   && <div><span className="text-slate-400 text-xs">County</span><p>{result.county}</p></div>}
              {result.estimated_amount_kes && <div><span className="text-slate-400 text-xs">Amount</span><p>{formatKES(result.estimated_amount_kes)}</p></div>}
              {result.created_at && <div><span className="text-slate-400 text-xs">Filed</span><p>{fmtDate(result.created_at)}</p></div>}
            </div>
          </div>
        )}

        <p className="text-center text-sm text-slate-400 mt-8">
          <Link to={ROUTES.LOGIN} className="text-uwazi-sky hover:underline">Sign in for full access →</Link>
        </p>
      </div>
    </div>
  );
}
