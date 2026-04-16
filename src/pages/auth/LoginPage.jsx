import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/auth.service';
import { useAuthStore } from '../../store/authStore';

const schema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
});

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      // After interceptor unwraps: payload = { user, accessToken }
      const payload = await authService.login(formData);
      // ← accessToken (camelCase) — matches backend AuthService.login return
      setAuth(payload.user, payload.accessToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Full JSX login form — see components section
    <div className="min-h-screen flex items-center justify-center bg-uwazi-navy">
      <LoginForm
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        errors={errors}
        error={error}
        loading={loading}
      />
    </div>
  );
}