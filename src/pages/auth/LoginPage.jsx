import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { authService }  from '../../api/auth.service';
import { useAuthStore } from '../../store/authStore';
import { ROUTES } from '../../constants/routes';

const schema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const setAuth  = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const [error,  setError]  = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true); setError('');
    try {
      const res = await authService.login(data);
      // Backend returns: { success, data: { user, accessToken } }
      setAuth(res.data.user, res.data.accessToken);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err?.message ?? 'Login failed. Check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-uwazi-navy flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-uwazi-navy tracking-wide">UWAZI</h1>
          <p className="text-slate-400 text-sm mt-1">Public Finance Intelligence</p>
          <h2 className="text-xl font-bold text-slate-800 mt-6">Sign in to your account</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
            <input {...register('email')} type="email" placeholder="you@example.com"
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-uwazi-sky/30 focus:border-uwazi-sky" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input {...register('password')} type="password" placeholder="••••••••"
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-uwazi-sky/30 focus:border-uwazi-sky" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div className="flex justify-end">
            <Link to={ROUTES.FORGOT_PASSWORD} className="text-xs text-uwazi-sky hover:underline">Forgot password?</Link>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-uwazi-sky hover:bg-uwazi-blue text-white font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          No account?{' '}
          <Link to={ROUTES.REGISTER} className="text-uwazi-sky font-medium hover:underline">Create one</Link>
        </p>
        <p className="text-center text-xs text-slate-400 mt-4">
          <Link to={ROUTES.TRACK} className="hover:underline">Track a case without logging in →</Link>
        </p>
      </div>
    </div>
  );
}
