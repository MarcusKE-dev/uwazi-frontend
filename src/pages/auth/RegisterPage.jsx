import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { authService }  from '../../api/auth.service';
import { useAuthStore } from '../../store/authStore';
import { ROUTES } from '../../constants/routes';

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email:     z.string().email('Enter a valid email'),
  password:  z.string().min(8, 'Min 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Must have uppercase, lowercase and a number'),
  phone:     z.string().optional(),
});

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const setAuth   = useAuthStore((s) => s.setAuth);
  const navigate  = useNavigate();
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true); setError('');
    try {
      const res = await authService.register(data);
      setAuth(res.data.user, res.data.accessToken);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err?.message ?? 'Registration failed');
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
          <h2 className="text-xl font-bold text-slate-800 mt-6">Create your account</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
            <input {...register('full_name')} placeholder="John Mwaura"
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-uwazi-sky/30 focus:border-uwazi-sky" />
            {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
            <input {...register('email')} type="email" placeholder="you@example.com"
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-uwazi-sky/30 focus:border-uwazi-sky" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input {...register('password')} type="password" placeholder="Min 8 chars, upper + lower + number"
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-uwazi-sky/30 focus:border-uwazi-sky" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone <span className="text-slate-400">(optional)</span></label>
            <input {...register('phone')} placeholder="+254700000000"
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-uwazi-sky/30 focus:border-uwazi-sky" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-uwazi-sky hover:bg-uwazi-blue text-white font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="text-uwazi-sky font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
