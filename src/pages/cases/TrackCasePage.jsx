import { useState } from 'react';
import { casesService } from '../../api/cases.service';
import { useSearchParams } from 'react-router-dom';

export default function TrackCasePage() {
  const [searchParams] = useSearchParams();
  const [code, setCode]     = useState(searchParams.get('code') || '');
  const [result, setResult] = useState(null);
  const [error, setError]   = useState(null);

  const trackCase = async () => {
    try {
      const payload = await casesService.track(code.trim().toUpperCase());
      setResult(payload.case);
      setError(null);
    } catch (err) {
      setError('No case found with that tracking code.');
      setResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-uwazi-navy flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Track Your Case</h1>
      <div className="flex gap-2 w-full max-w-md">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="UW-2026-0001"
          className="input-base flex-1"
        />
        <button onClick={trackCase} className="btn-primary">Track</button>
      </div>
      {result && <div className="mt-6 text-white text-sm">Case found: {result.status}</div>}
      {error  && <p className="text-red-400 mt-4">{error}</p>}
    </div>
  );
}
