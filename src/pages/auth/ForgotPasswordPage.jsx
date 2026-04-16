import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../api/auth.service';
import { ROUTES } from '../../constants/routes';

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('');
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true); setError('');
    try {
      await authService.forgotPassword({ email });
      setSent(true);
    } catch (err) {
      setError(err?.message ?? 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-uwazi-navy flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <h1 className="text-2xl font-black text-uwazi-navy mb-1">UWAZI</h1>
        <h2 className="text-xl font-bold text-slate-800 mt-6 mb-2">Reset your password</h2>
        <p className="text-slate-500 text-sm mb-6">Enter your email and we'll send a reset link.</p>

        {sent ? (
          <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
            ✅ Reset link sent! Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-uwazi-sky/30 focus:border-uwazi-sky" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-uwazi-sky hover:bg-uwazi-blue text-white font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60">
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-slate-500 mt-6">
          <Link to={ROUTES.LOGIN} className="text-uwazi-sky hover:underline">← Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
