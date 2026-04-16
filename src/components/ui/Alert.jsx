import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

const VARIANTS = {
  error:   { icon: XCircle,     bg: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',   text: 'text-red-700 dark:text-red-400'   },
  success: { icon: CheckCircle, bg: 'bg-green-50 border-green-200',                                     text: 'text-green-700'                   },
  info:    { icon: Info,        bg: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-300' },
  warning: { icon: AlertCircle, bg: 'bg-amber-50 border-amber-200',                                    text: 'text-amber-700'                  },
};

export default function Alert({ variant = 'info', children }) {
  const { icon: Icon, bg, text } = VARIANTS[variant];
  return (
    <div className={cn('flex items-start gap-3 rounded-lg border p-3 text-sm', bg)}>
      <Icon size={16} className={cn('mt-0.5 flex-shrink-0', text)} />
      <span className={text}>{children}</span>
    </div>
  );
}
// The Axios interceptor rejects with: err.response.data.error
// Backend error shape: { code: "EMAIL_EXISTS", message: "...", statusCode: 409 }
try {
  await authService.register(formData);
} catch (err) {
  // err.message from the backend's structured error
  setError(err.message || 'Something went wrong. Please try again.');

  // You can also check the error code for specific handling:
  if (err.code === 'EMAIL_EXISTS') {
    setFieldError('email', { message: 'This email is already registered.' });
  }
}