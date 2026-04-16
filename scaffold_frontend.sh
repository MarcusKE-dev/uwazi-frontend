#!/bin/bash
# ══════════════════════════════════════════════════════════════
# UWAZI Frontend — Complete File Scaffold
# Run from: ~/UWAZI-MVP/frontend
# Usage:    chmod +x scaffold_frontend.sh && ./scaffold_frontend.sh
# ══════════════════════════════════════════════════════════════

set -e
BASE="src"

echo "🚀 Creating all UWAZI frontend files..."

# ── Create all directories ────────────────────────────────────
mkdir -p $BASE/pages/auth
mkdir -p $BASE/pages/dashboard
mkdir -p $BASE/pages/cases
mkdir -p $BASE/pages/analytics
mkdir -p $BASE/pages/admin
mkdir -p $BASE/components/layout
mkdir -p $BASE/components/ui
mkdir -p $BASE/components/charts
mkdir -p $BASE/store
mkdir -p $BASE/hooks
mkdir -p $BASE/api
mkdir -p $BASE/utils
mkdir -p $BASE/constants

echo "📁 Directories created"

# ══════════════════════════════════════════════════════════════
# CONSTANTS
# ══════════════════════════════════════════════════════════════

cat > $BASE/constants/routes.js << 'EOF'
export const ROUTES = {
  LOGIN:           '/login',
  REGISTER:        '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD:       '/dashboard',
  ANALYTICS:       '/analytics',
  CASES:           '/cases',
  SUBMIT_CASE:     '/cases/submit',
  CASE_DETAIL:     (id) => `/cases/${id}`,
  TRACK:           '/track',
  ADMIN:           '/admin',
};
EOF

cat > $BASE/constants/counties.js << 'EOF'
export const COUNTIES = [
  'Baringo','Bomet','Bungoma','Busia','Elgeyo Marakwet',
  'Embu','Garissa','Homa Bay','Isiolo','Kajiado',
  'Kakamega','Kericho','Kiambu','Kilifi','Kirinyaga',
  'Kisii','Kisumu','Kitui','Kwale','Laikipia',
  'Lamu','Machakos','Makueni','Mandera','Marsabit',
  'Meru','Migori','Mombasa','Murang\'a','Nairobi',
  'Nakuru','Nandi','Narok','Nyamira','Nyandarua',
  'Nyeri','Samburu','Siaya','Taita Taveta','Tana River',
  'Tharaka Nithi','Trans Nzoia','Turkana','Uasin Gishu',
  'Vihiga','Wajir','West Pokot',
];
EOF

cat > $BASE/constants/roles.js << 'EOF'
export const ROLES = {
  CITIZEN:     'citizen',
  REVIEWER:    'reviewer',
  ADMIN:       'admin',
  SUPER_ADMIN: 'super_admin',
};

export const ROLE_LABELS = {
  citizen:     'Citizen',
  reviewer:    'Reviewer',
  admin:       'Admin',
  super_admin: 'Super Admin',
};
EOF

echo "✅ Constants created"

# ══════════════════════════════════════════════════════════════
# UTILS
# ══════════════════════════════════════════════════════════════

cat > $BASE/utils/cn.js << 'EOF'
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
EOF

cat > $BASE/utils/formatKES.js << 'EOF'
export function formatKES(amount, compact = true) {
  if (!amount && amount !== 0) return '—';
  const n = Number(amount); // DB returns strings from COUNT/SUM
  if (!compact) return new Intl.NumberFormat('en-KE').format(n);
  if (n >= 1e12) return `KES ${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9)  return `KES ${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6)  return `KES ${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3)  return `KES ${(n / 1e3).toFixed(0)}K`;
  return `KES ${n}`;
}
EOF

cat > $BASE/utils/formatDate.js << 'EOF'
import { format, formatDistanceToNow, parseISO } from 'date-fns';

export function fmtDate(dateStr) {
  if (!dateStr) return '—';
  try { return format(parseISO(dateStr), 'dd MMM yyyy'); }
  catch { return dateStr; }
}

export function fmtDateTime(dateStr) {
  if (!dateStr) return '—';
  try { return format(parseISO(dateStr), 'dd MMM yyyy, HH:mm'); }
  catch { return dateStr; }
}

export function fmtRelative(dateStr) {
  if (!dateStr) return '—';
  try { return formatDistanceToNow(parseISO(dateStr), { addSuffix: true }); }
  catch { return dateStr; }
}
EOF

cat > $BASE/utils/statusColors.js << 'EOF'
export const STATUS_COLORS = {
  submitted:    'bg-blue-50   text-blue-700  border border-blue-200',
  under_review: 'bg-amber-50  text-amber-700 border border-amber-200',
  escalated:    'bg-red-50    text-red-700   border border-red-200',
  resolved:     'bg-green-50  text-green-700 border border-green-200',
  closed:       'bg-slate-50  text-slate-600 border border-slate-200',
};

export function getStatusClass(status) {
  return STATUS_COLORS[status] ?? STATUS_COLORS.submitted;
}

export const STATUS_LABELS = {
  submitted:    'Submitted',
  under_review: 'Under Review',
  escalated:    'Escalated',
  resolved:     'Resolved',
  closed:       'Closed',
};
EOF

echo "✅ Utils created"

# ══════════════════════════════════════════════════════════════
# STORES
# ══════════════════════════════════════════════════════════════

cat > $BASE/store/authStore.js << 'EOF'
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user:            null,
  accessToken:     null,
  isAuthenticated: false,

  setAuth: (user, accessToken) => set({ user, accessToken, isAuthenticated: true }),
  clearAuth: () => set({ user: null, accessToken: null, isAuthenticated: false }),
  setAccessToken: (token) => set({ accessToken: token }),
}));
EOF

cat > $BASE/store/uiStore.js << 'EOF'
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create(persist(
  (set) => ({
    darkMode:    false,
    sidebarOpen: true,
    toggleDarkMode: () => set((state) => {
      const next = !state.darkMode;
      document.documentElement.classList.toggle('dark', next);
      return { darkMode: next };
    }),
    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  }),
  { name: 'uwazi-ui' }
));
EOF

cat > $BASE/store/notificationStore.js << 'EOF'
import { create } from 'zustand';

let id = 0;

export const useNotificationStore = create((set) => ({
  toasts: [],
  add:    (message, type = 'info') => set((s) => ({
    toasts: [...s.toasts, { id: ++id, message, type }]
  })),
  remove: (toastId) => set((s) => ({
    toasts: s.toasts.filter((t) => t.id !== toastId)
  })),
}));

export const toast = {
  success: (msg) => useNotificationStore.getState().add(msg, 'success'),
  error:   (msg) => useNotificationStore.getState().add(msg, 'error'),
  info:    (msg) => useNotificationStore.getState().add(msg, 'info'),
};
EOF

echo "✅ Stores created"

# ══════════════════════════════════════════════════════════════
# API LAYER
# ══════════════════════════════════════════════════════════════

cat > $BASE/api/client.js << 'EOF'
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const client = axios.create({
  baseURL:         import.meta.env.VITE_API_URL,
  headers:         { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout:         15000,
});

// Attach JWT to every request
client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 — auto-refresh token
let refreshing = false;
let queue       = [];

client.interceptors.response.use(
  (res) => res.data,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      if (refreshing) {
        return new Promise((res, rej) =>
          queue.push({ resolve: res, reject: rej })
        ).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return client(original);
        });
      }
      original._retry = true;
      refreshing      = true;
      try {
        const res      = await client.post('/auth/refresh');
        const newToken = res.data.accessToken;  // camelCase — matches backend
        useAuthStore.getState().setAccessToken(newToken);
        queue.forEach((p) => p.resolve(newToken));
        queue = [];
        original.headers.Authorization = `Bearer ${newToken}`;
        return client(original);
      } catch {
        queue.forEach((p) => p.reject());
        queue = [];
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
      } finally {
        refreshing = false;
      }
    }
    return Promise.reject(err.response?.data?.error || err.message);
  }
);

export default client;
EOF

cat > $BASE/api/auth.service.js << 'EOF'
import client from './client';

export const authService = {
  register:       (data) => client.post('/auth/register', data),
  login:          (data) => client.post('/auth/login', data),
  logout:         ()     => client.post('/auth/logout'),
  refresh:        ()     => client.post('/auth/refresh'),
  forgotPassword: (data) => client.post('/auth/forgot-password', data),
  resetPassword:  (data) => client.post('/auth/reset-password', data),
  me:             ()     => client.get('/auth/me'),
};
EOF

cat > $BASE/api/cases.service.js << 'EOF'
import client from './client';

export const casesService = {
  getAll:       (params) => client.get('/cases', { params }),
  getById:      (id)     => client.get(`/cases/${id}`),
  track:        (code)   => client.get(`/cases/track/${code}`),
  submit:       (data)   => client.post('/cases', data),
  updateStatus: (id, d)  => client.patch(`/cases/${id}/status`, d),
};
EOF

cat > $BASE/api/evidence.service.js << 'EOF'
import client from './client';

export const evidenceService = {
  // caseId in URL — matches POST /api/v1/evidence/:caseId
  upload: (caseId, file, description = '') => {
    const form = new FormData();
    form.append('file', file);
    if (description) form.append('description', description);
    return client.post(`/evidence/${caseId}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getByCase: (caseId) => client.get(`/evidence/${caseId}`),
};
EOF

cat > $BASE/api/analytics.service.js << 'EOF'
import client from './client';

export const analyticsService = {
  // Only these 2 endpoints exist in the backend
  getStats: () => client.get('/analytics/stats'),
  byCounty: () => client.get('/analytics/by-county'),
};
EOF

cat > $BASE/api/admin.service.js << 'EOF'
import client from './client';

export const adminService = {
  getUsers:    ()            => client.get('/admin/users'),
  updateRole:  (id, role)    => client.patch(`/admin/users/${id}/role`, { role }),
  getAuditLog: (params)      => client.get('/admin/audit-log', { params }),
};
EOF

echo "✅ API services created"

# ══════════════════════════════════════════════════════════════
# HOOKS
# ══════════════════════════════════════════════════════════════

cat > $BASE/hooks/useCases.js << 'EOF'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { casesService } from '../api/cases.service';

export function useCases(filters = {}) {
  return useQuery({
    queryKey: ['cases', filters],
    queryFn:  () => casesService.getAll(filters),
    placeholderData: (prev) => prev,
  });
}

export function useCase(id) {
  return useQuery({
    queryKey: ['case', id],
    queryFn:  () => casesService.getById(id),
    enabled:  !!id,
  });
}

export function useSubmitCase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: casesService.submit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    },
  });
}
EOF

cat > $BASE/hooks/useAnalytics.js << 'EOF'
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../api/analytics.service';

export function useAnalyticsStats() {
  return useQuery({
    queryKey: ['analytics-stats'],
    queryFn:  analyticsService.getStats,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCountyBreakdown() {
  return useQuery({
    queryKey: ['analytics-counties'],
    queryFn:  analyticsService.byCounty,
  });
}
EOF

cat > $BASE/hooks/useAuth.js << 'EOF'
import { useAuthStore } from '../store/authStore';
import { ROLES } from '../constants/roles';

export function useAuth() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const isAdmin      = ['admin', 'super_admin'].includes(user?.role);
  const isReviewer   = ['reviewer', 'admin', 'super_admin'].includes(user?.role);
  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN;
  return { user, isAuthenticated, isAdmin, isReviewer, isSuperAdmin, clearAuth };
}
EOF

cat > $BASE/hooks/useDebounce.js << 'EOF'
import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
EOF

echo "✅ Hooks created"

# ══════════════════════════════════════════════════════════════
# UI COMPONENTS
# ══════════════════════════════════════════════════════════════

cat > $BASE/components/ui/Spinner.jsx << 'EOF'
export default function Spinner({ size = 'md', className = '' }) {
  const s = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }[size];
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className={`${s} animate-spin rounded-full border-2 border-slate-200 border-t-uwazi-sky`} />
    </div>
  );
}
EOF

cat > $BASE/components/ui/EmptyState.jsx << 'EOF'
import { FileSearch } from 'lucide-react';
export default function EmptyState({ message = 'No data found', sub = '' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <FileSearch size={40} className="text-slate-300 dark:text-blue-900 mb-3" />
      <p className="text-slate-500 dark:text-blue-400 font-medium">{message}</p>
      {sub && <p className="text-slate-400 dark:text-blue-600 text-sm mt-1">{sub}</p>}
    </div>
  );
}
EOF

cat > $BASE/components/ui/Alert.jsx << 'EOF'
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { useState } from 'react';

const CONFIG = {
  success: { icon: CheckCircle, cls: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800' },
  error:   { icon: XCircle,     cls: 'bg-red-50   text-red-800   border-red-200   dark:bg-red-900/20   dark:text-red-300   dark:border-red-800'   },
  warn:    { icon: AlertCircle, cls: 'bg-amber-50  text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800' },
  info:    { icon: Info,        cls: 'bg-blue-50   text-blue-800  border-blue-200  dark:bg-blue-900/20  dark:text-blue-300  dark:border-blue-800'  },
};

export default function Alert({ variant = 'info', message, dismissible = false }) {
  const [visible, setVisible] = useState(true);
  if (!visible || !message) return null;
  const { icon: Icon, cls } = CONFIG[variant] ?? CONFIG.info;
  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${cls} mx-6 my-4`}>
      <Icon size={16} className="shrink-0 mt-0.5" />
      <p className="text-sm flex-1">{message}</p>
      {dismissible && (
        <button onClick={() => setVisible(false)} className="opacity-60 hover:opacity-100">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
EOF

cat > $BASE/components/ui/StatCard.jsx << 'EOF'
import { cn } from '../../utils/cn';

export default function StatCard({ title, value, sub, variant = 'default', live = false }) {
  const isDanger  = variant === 'danger';
  const isSuccess = variant === 'success';
  const isWarn    = variant === 'warn';

  return (
    <div className={cn(
      'rounded-xl p-5 border',
      isDanger  && 'bg-red-50   border-red-200   dark:bg-red-900/20   dark:border-red-800',
      isSuccess && 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
      isWarn    && 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800',
      !isDanger && !isSuccess && !isWarn &&
        'bg-white border-slate-200 dark:bg-uwazi-dark dark:border-blue-900/50'
    )}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-uwazi-muted mb-2">
        {title}
      </p>
      <p className={cn(
        'text-2xl font-bold',
        isDanger  && 'text-red-600   dark:text-red-400',
        isSuccess && 'text-green-600 dark:text-green-400',
        isWarn    && 'text-amber-600 dark:text-amber-400',
        !isDanger && !isSuccess && !isWarn && 'text-slate-900 dark:text-white'
      )}>
        {value ?? '—'}
      </p>
      {sub  && <p className="text-xs text-slate-500 dark:text-blue-400 mt-1">{sub}</p>}
      {live && <p className="text-xs text-green-500 mt-1">● Live</p>}
    </div>
  );
}
EOF

cat > $BASE/components/ui/Badge.jsx << 'EOF'
import { cn } from '../../utils/cn';
import { getStatusClass, STATUS_LABELS } from '../../utils/statusColors';

export function StatusBadge({ status }) {
  return (
    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold', getStatusClass(status))}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function RoleBadge({ role }) {
  const cls = {
    citizen:     'bg-slate-100 text-slate-700',
    reviewer:    'bg-blue-100  text-blue-700',
    admin:       'bg-purple-100 text-purple-700',
    super_admin: 'bg-red-100   text-red-700',
  }[role] ?? 'bg-slate-100 text-slate-700';
  return (
    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize', cls)}>
      {role?.replace('_', ' ')}
    </span>
  );
}
EOF

cat > $BASE/components/ui/EvidenceUploader.jsx << 'EOF'
import { useState } from 'react';
import { Upload } from 'lucide-react';
import { evidenceService } from '../../api/evidence.service';
import { toast } from '../../store/notificationStore';

const ALLOWED = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'];
const MAX_MB  = 20 * 1024 * 1024;

export default function EvidenceUploader({ caseId, onUploaded }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!ALLOWED.includes(file.type)) { toast.error('Only JPEG, PNG, PDF, or MP4 allowed'); return; }
    if (file.size > MAX_MB)           { toast.error('File must be under 20MB'); return; }
    setUploading(true);
    try {
      const res = await evidenceService.upload(caseId, file);
      toast.success('Evidence uploaded successfully');
      onUploaded?.(res.data.evidence);
    } catch (err) {
      toast.error(err?.message ?? 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <label className="cursor-pointer border-2 border-dashed border-uwazi-sky/40 dark:border-blue-700
      rounded-xl p-8 flex flex-col items-center gap-3
      hover:border-uwazi-sky hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all">
      <Upload size={28} className="text-uwazi-sky" />
      <span className="text-sm text-slate-500 dark:text-blue-400 text-center">
        {uploading ? 'Uploading…' : 'Click to upload evidence\nJPEG · PNG · PDF · MP4 · max 20MB'}
      </span>
      <input type="file" className="hidden" onChange={handleFile}
        accept=".jpg,.jpeg,.png,.pdf,.mp4" disabled={uploading} />
    </label>
  );
}
EOF

echo "✅ UI components created"

# ══════════════════════════════════════════════════════════════
# CHART COMPONENTS
# ══════════════════════════════════════════════════════════════

cat > $BASE/components/charts/CountyBarChart.jsx << 'EOF'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function CountyBarChart({ data = [] }) {
  if (!data.length) return (
    <div className="bg-white dark:bg-uwazi-dark rounded-xl border border-slate-200 dark:border-blue-900/50 p-6">
      <p className="text-sm font-semibold text-slate-700 dark:text-white mb-4">Cases by County</p>
      <p className="text-slate-400 text-sm text-center py-8">No county data yet</p>
    </div>
  );

  const top = [...data].sort((a, b) => b.case_count - a.case_count).slice(0, 10);

  return (
    <div className="bg-white dark:bg-uwazi-dark rounded-xl border border-slate-200 dark:border-blue-900/50 p-6">
      <p className="text-sm font-semibold text-slate-700 dark:text-white mb-6">
        Cases by County <span className="text-slate-400 font-normal">(top 10)</span>
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={top} margin={{ top: 0, right: 0, left: -20, bottom: 40 }}>
          <XAxis dataKey="county" tick={{ fontSize: 11, fill: '#64748B' }}
            angle={-35} textAnchor="end" interval={0} />
          <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
          <Tooltip
            contentStyle={{ background: '#0A1628', border: 'none', borderRadius: 8, color: '#E2E8F0', fontSize: 12 }}
            formatter={(v) => [v, 'Cases']}
          />
          <Bar dataKey="case_count" radius={[4, 4, 0, 0]}>
            {top.map((_, i) => (
              <Cell key={i} fill={`hsl(${215 + i * 4}, 70%, ${50 + i * 2}%)`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
EOF

cat > $BASE/components/charts/SummaryPieChart.jsx << 'EOF'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#2563EB', '#F59E0B', '#EF4444', '#10B981'];

export default function SummaryPieChart({ stats }) {
  if (!stats) return null;

  const data = [
    { name: 'Submitted',    value: Number(stats.total_cases) - Number(stats.resolved_cases) - Number(stats.under_review) - Number(stats.escalated) },
    { name: 'Under Review', value: Number(stats.under_review) },
    { name: 'Escalated',    value: Number(stats.escalated) },
    { name: 'Resolved',     value: Number(stats.resolved_cases) },
  ].filter((d) => d.value > 0);

  if (!data.length) return null;

  return (
    <div className="bg-white dark:bg-uwazi-dark rounded-xl border border-slate-200 dark:border-blue-900/50 p-6">
      <p className="text-sm font-semibold text-slate-700 dark:text-white mb-4">Case Status Breakdown</p>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          } labelLine={{ stroke: '#64748B' }}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#0A1628', border: 'none', borderRadius: 8, color: '#E2E8F0', fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
EOF

echo "✅ Chart components created"

# ══════════════════════════════════════════════════════════════
# LAYOUT COMPONENTS
# ══════════════════════════════════════════════════════════════

cat > $BASE/components/layout/ProtectedRoute.jsx << 'EOF'
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}
EOF

cat > $BASE/components/layout/Sidebar.jsx << 'EOF'
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart2, FileText, ShieldCheck, PlusCircle, Menu, X } from 'lucide-react';
import { useUIStore }  from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../utils/cn';

const MAIN_NAV = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard'   },
  { to: '/cases',         icon: FileText,        label: 'Cases'        },
  { to: '/analytics',     icon: BarChart2,        label: 'Analytics'   },
  { to: '/cases/submit',  icon: PlusCircle,      label: 'Report Case'  },
];

const ADMIN_NAV = [
  { to: '/admin', icon: ShieldCheck, label: 'Admin Panel' },
];

const linkCls = ({ isActive }) => cn(
  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150',
  isActive
    ? 'bg-blue-600 text-white font-semibold shadow-sm'
    : 'text-blue-200 hover:bg-white/10 hover:text-white'
);

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user } = useAuthStore();
  const isAdmin = ['admin', 'super_admin'].includes(user?.role);

  return (
    <aside className={cn(
      'h-screen flex flex-col border-r border-blue-900/50 bg-uwazi-navy transition-all duration-200 shrink-0',
      sidebarOpen ? 'w-60' : 'w-16'
    )}>
      {/* Logo */}
      <div className="p-4 border-b border-blue-900/50 flex items-center justify-between">
        {sidebarOpen && (
          <div>
            <span className="text-lg font-black text-white tracking-wide">UWAZI</span>
            <p className="text-[10px] text-blue-400 uppercase tracking-widest">Finance Intelligence</p>
          </div>
        )}
        <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-white/10 text-blue-300">
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {sidebarOpen && <p className="text-[10px] text-blue-700 uppercase tracking-widest px-2 py-1 font-bold">Main</p>}
        {MAIN_NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={linkCls}>
            <Icon size={18} />
            {sidebarOpen && <span>{label}</span>}
          </NavLink>
        ))}
        {isAdmin && (
          <>
            {sidebarOpen && <p className="text-[10px] text-blue-700 uppercase tracking-widest px-2 pt-4 pb-1 font-bold">Admin</p>}
            {ADMIN_NAV.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} className={linkCls}>
                <Icon size={18} />
                {sidebarOpen && <span>{label}</span>}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User footer */}
      {sidebarOpen && user && (
        <div className="p-4 border-t border-blue-900/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold shrink-0">
              {user.full_name?.[0] ?? 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user.full_name}</p>
              <p className="text-xs text-blue-400 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
EOF

cat > $BASE/components/layout/TopBar.jsx << 'EOF'
import { Search, Moon, Sun, Bell, LogOut } from 'lucide-react';
import { useUIStore }  from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { authService }  from '../../api/auth.service';
import { useNavigate }  from 'react-router-dom';

export default function TopBar() {
  const { darkMode, toggleDarkMode } = useUIStore();
  const { user, clearAuth }          = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await authService.logout(); } catch {}
    clearAuth();
    navigate('/login');
  };

  return (
    <header className="h-14 flex items-center px-5 gap-3 shrink-0
      bg-white dark:bg-uwazi-navy border-b border-slate-200 dark:border-blue-900/50">
      <div className="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-uwazi-dark
        rounded-lg px-3 py-2 border border-slate-200 dark:border-blue-900/50">
        <Search size={15} className="text-slate-400" />
        <input placeholder="Search cases, counties..."
          className="bg-transparent text-sm text-slate-600 dark:text-blue-200 outline-none flex-1" />
      </div>
      <button onClick={toggleDarkMode}
        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-blue-900/30 text-slate-500 dark:text-blue-300">
        {darkMode ? <Sun size={17} /> : <Moon size={17} />}
      </button>
      <button className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-blue-900/30 text-slate-500 dark:text-blue-300">
        <Bell size={17} />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
      </button>
      {user && (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-uwazi-blue text-white text-sm
            flex items-center justify-center font-bold shrink-0">
            {user.full_name?.[0] ?? 'U'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-900 dark:text-white leading-tight">{user.full_name}</p>
            <p className="text-xs text-slate-400 dark:text-blue-400 capitalize">{user.role}</p>
          </div>
        </div>
      )}
      <button onClick={handleLogout}
        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-blue-900/30 text-slate-400 dark:text-blue-400"
        title="Log out">
        <LogOut size={16} />
      </button>
    </header>
  );
}
EOF

cat > $BASE/components/layout/AppLayout.jsx << 'EOF'
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import TopBar  from './TopBar';
import { useUIStore } from '../../store/uiStore';

export default function AppLayout() {
  const { sidebarOpen, toggleSidebar } = useUIStore();

  useEffect(() => {
    const check = () => { if (window.innerWidth < 768 && sidebarOpen) toggleSidebar(); };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-uwazi-navy">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
EOF

echo "✅ Layout components created"

# ══════════════════════════════════════════════════════════════
# AUTH PAGES
# ══════════════════════════════════════════════════════════════

cat > $BASE/pages/auth/LoginPage.jsx << 'EOF'
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
EOF

cat > $BASE/pages/auth/RegisterPage.jsx << 'EOF'
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
EOF

cat > $BASE/pages/auth/ForgotPasswordPage.jsx << 'EOF'
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
EOF

echo "✅ Auth pages created"

# ══════════════════════════════════════════════════════════════
# MAIN PAGES
# ══════════════════════════════════════════════════════════════

cat > $BASE/pages/dashboard/DashboardPage.jsx << 'EOF'
import { useAnalyticsStats, useCountyBreakdown } from '../../hooks/useAnalytics';
import StatCard       from '../../components/ui/StatCard';
import CountyBarChart from '../../components/charts/CountyBarChart';
import Spinner        from '../../components/ui/Spinner';
import { formatKES }  from '../../utils/formatKES';

export default function DashboardPage() {
  const { data: statsRes, isLoading } = useAnalyticsStats();
  const { data: countyRes }           = useCountyBreakdown();

  // Axios interceptor returns full { success, data } — drill into .data
  const stats    = statsRes?.data;
  const counties = countyRes?.data?.counties ?? [];

  if (isLoading) return <Spinner />;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">National Overview</h1>
        <p className="text-sm text-slate-500 dark:text-uwazi-muted">Real-time corruption case intelligence</p>
      </div>

      {/* Stat cards — field names match /analytics/stats response */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard title="Total Cases"     value={stats?.total_cases} />
        <StatCard title="Resolved"        value={stats?.resolved_cases} variant="success" />
        <StatCard title="Under Review"    value={stats?.under_review}   variant="warn" />
        <StatCard title="Total Amount"    value={formatKES(stats?.total_amount_kes)} />
      </div>

      {/* Escalated callout */}
      {Number(stats?.escalated) > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.escalated}</span>
          <div>
            <p className="font-semibold text-red-700 dark:text-red-300 text-sm">Cases Escalated</p>
            <p className="text-xs text-red-500">Require urgent attention</p>
          </div>
        </div>
      )}

      {/* County chart */}
      <CountyBarChart data={counties} />
    </div>
  );
}
EOF

cat > $BASE/pages/cases/CaseListPage.jsx << 'EOF'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCases } from '../../hooks/useCases';
import Spinner     from '../../components/ui/Spinner';
import EmptyState  from '../../components/ui/EmptyState';
import Alert       from '../../components/ui/Alert';
import { StatusBadge } from '../../components/ui/Badge';
import { fmtDate } from '../../utils/formatDate';
import { formatKES } from '../../utils/formatKES';
import { ROUTES } from '../../constants/routes';
import { COUNTIES } from '../../constants/counties';

const STATUSES = ['submitted','under_review','escalated','resolved','closed'];
const CATEGORIES = ['procurement','budget','salary','land','contracts','other'];

export default function CaseListPage() {
  const [filters, setFilters] = useState({ page: 1, limit: 20 });

  const { data, isLoading, isError, error } = useCases(filters);

  if (isLoading) return <Spinner />;
  if (isError)   return <Alert variant="error" message={error?.message ?? 'Failed to load cases'} />;

  const cases = data?.data?.cases ?? [];

  const set = (key, val) => setFilters((f) => ({ ...f, [key]: val || undefined, page: 1 }));

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Cases</h1>
          <p className="text-sm text-slate-500 dark:text-uwazi-muted">{cases.length} results</p>
        </div>
        <Link to={ROUTES.SUBMIT_CASE}
          className="bg-uwazi-sky hover:bg-uwazi-blue text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          + Report Case
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select onChange={(e) => set('status', e.target.value)}
          className="text-sm border border-slate-200 dark:border-blue-900/50 rounded-lg px-3 py-2 bg-white dark:bg-uwazi-dark text-slate-700 dark:text-blue-200 outline-none">
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
        </select>
        <select onChange={(e) => set('category', e.target.value)}
          className="text-sm border border-slate-200 dark:border-blue-900/50 rounded-lg px-3 py-2 bg-white dark:bg-uwazi-dark text-slate-700 dark:text-blue-200 outline-none">
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select onChange={(e) => set('county', e.target.value)}
          className="text-sm border border-slate-200 dark:border-blue-900/50 rounded-lg px-3 py-2 bg-white dark:bg-uwazi-dark text-slate-700 dark:text-blue-200 outline-none">
          <option value="">All Counties</option>
          {COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Cases list */}
      {!cases.length ? (
        <EmptyState message="No cases match your filters" sub="Try adjusting the filters above" />
      ) : (
        <div className="space-y-3">
          {cases.map((c) => (
            <Link key={c.id} to={ROUTES.CASE_DETAIL(c.id)}
              className="block bg-white dark:bg-uwazi-dark border border-slate-200 dark:border-blue-900/50
                rounded-xl p-5 hover:border-uwazi-sky/50 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{c.title}</p>
                  <p className="text-xs text-slate-400 dark:text-blue-500 mt-0.5">{c.tracking_code}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 dark:text-blue-500">
                <span className="capitalize">{c.category}</span>
                {c.county && <span>📍 {c.county}</span>}
                {c.estimated_amount_kes && <span>{formatKES(c.estimated_amount_kes)}</span>}
                <span>{fmtDate(c.created_at)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
EOF

cat > $BASE/pages/cases/CaseDetailPage.jsx << 'EOF'
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCase } from '../../hooks/useCases';
import { evidenceService } from '../../api/evidence.service';
import { casesService }    from '../../api/cases.service';
import { useAuthStore }    from '../../store/authStore';
import { StatusBadge }     from '../../components/ui/Badge';
import EvidenceUploader    from '../../components/ui/EvidenceUploader';
import Spinner             from '../../components/ui/Spinner';
import Alert               from '../../components/ui/Alert';
import { toast }           from '../../store/notificationStore';
import { formatKES }       from '../../utils/formatKES';
import { fmtDateTime }     from '../../utils/formatDate';

const REVIEWER_ROLES = ['reviewer', 'admin', 'super_admin'];
const STATUSES = ['submitted','under_review','escalated','resolved','closed'];

export default function CaseDetailPage() {
  const { id }         = useParams();
  const { user }       = useAuthStore();
  const queryClient    = useQueryClient();
  const canReview      = REVIEWER_ROLES.includes(user?.role);

  const { data: caseRes, isLoading, isError, error } = useCase(id);
  const { data: evRes, refetch: refetchEvidence } = useQuery({
    queryKey: ['evidence', id],
    queryFn:  () => evidenceService.getByCase(id),
    enabled:  !!id,
  });

  if (isLoading) return <Spinner />;
  if (isError)   return <Alert variant="error" message={error?.message ?? 'Case not found'} />;

  const c        = caseRes?.data?.case;
  const evidence = evRes?.data?.evidence ?? [];

  const handleStatusChange = async (newStatus) => {
    try {
      await casesService.updateStatus(id, { status: newStatus });
      queryClient.invalidateQueries({ queryKey: ['case', id] });
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err?.message ?? 'Update failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-5">
      {/* Header */}
      <div className="bg-white dark:bg-uwazi-dark border border-slate-200 dark:border-blue-900/50 rounded-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{c?.title}</h1>
            <p className="text-xs text-slate-400 dark:text-blue-500 mt-1 font-mono">{c?.tracking_code}</p>
          </div>
          <StatusBadge status={c?.status} />
        </div>
        <p className="text-sm text-slate-600 dark:text-blue-200 mt-4 leading-relaxed">{c?.description}</p>
      </div>

      {/* Details */}
      <div className="bg-white dark:bg-uwazi-dark border border-slate-200 dark:border-blue-900/50 rounded-xl p-6">
        <h2 className="text-sm font-bold text-slate-700 dark:text-uwazi-muted uppercase tracking-wide mb-4">Details</h2>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-3">
          {[
            ['Category',    c?.category],
            ['County',      c?.county],
            ['Agency',      c?.agency_involved],
            ['Officer',     c?.officer_name],
            ['Amount (KES)',c?.estimated_amount_kes ? formatKES(c.estimated_amount_kes) : null],
            ['Incident Date',c?.incident_date],
            ['Submitted',   fmtDateTime(c?.created_at)],
            ['Reviewer',    c?.reviewer_name],
          ].filter(([, v]) => v).map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs text-slate-400 dark:text-blue-500">{k}</dt>
              <dd className="text-sm text-slate-700 dark:text-blue-200 font-medium mt-0.5 capitalize">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Reviewer status change */}
      {canReview && (
        <div className="bg-white dark:bg-uwazi-dark border border-slate-200 dark:border-blue-900/50 rounded-xl p-6">
          <h2 className="text-sm font-bold text-slate-700 dark:text-uwazi-muted uppercase tracking-wide mb-3">Update Status</h2>
          <div className="flex flex-wrap gap-2">
            {STATUSES.filter((s) => s !== c?.status).map((s) => (
              <button key={s} onClick={() => handleStatusChange(s)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-blue-900/50
                  text-slate-600 dark:text-blue-300 hover:bg-uwazi-sky hover:text-white hover:border-uwazi-sky transition-colors capitalize">
                → {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Evidence */}
      <div className="bg-white dark:bg-uwazi-dark border border-slate-200 dark:border-blue-900/50 rounded-xl p-6">
        <h2 className="text-sm font-bold text-slate-700 dark:text-uwazi-muted uppercase tracking-wide mb-4">Evidence ({evidence.length})</h2>
        {evidence.length > 0 && (
          <div className="space-y-2 mb-4">
            {evidence.map((ev) => (
              <div key={ev.id} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-blue-900/30">
                <div>
                  <p className="text-sm text-slate-700 dark:text-blue-200">{ev.file_name}</p>
                  <p className="text-xs text-slate-400 dark:text-blue-500">{ev.file_type} · {fmtDateTime(ev.created_at)}</p>
                </div>
                <a href={ev.download_url} target="_blank" rel="noreferrer"
                  className="text-uwazi-sky text-xs font-semibold hover:underline">Download</a>
              </div>
            ))}
          </div>
        )}
        <EvidenceUploader caseId={id} onUploaded={() => refetchEvidence()} />
      </div>
    </div>
  );
}
EOF

cat > $BASE/pages/cases/SubmitCasePage.jsx << 'EOF'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useSubmitCase } from '../../hooks/useCases';
import { toast } from '../../store/notificationStore';
import { COUNTIES } from '../../constants/counties';
import { ROUTES } from '../../constants/routes';

const CATEGORIES = ['procurement','budget','salary','land','contracts','other'];

// Field names match the DB cases table columns exactly
const schema = z.object({
  title:                z.string().min(10, 'Min 10 characters').max(500),
  description:          z.string().min(20, 'Min 20 characters'),
  category:             z.enum(['procurement','budget','salary','land','contracts','other']),
  county:               z.string().optional(),
  agency_involved:      z.string().optional(),   // ← correct DB field name
  officer_name:         z.string().optional(),
  estimated_amount_kes: z.coerce.number().positive().optional().or(z.literal('')),
  incident_date:        z.string().optional(),
  is_anonymous:         z.boolean().default(false),
});

export default function SubmitCasePage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { is_anonymous: false },
  });
  const submitMutation = useSubmitCase();
  const navigate       = useNavigate();

  const onSubmit = async (formData) => {
    // Clean up empty strings
    const clean = Object.fromEntries(
      Object.entries(formData).filter(([, v]) => v !== '' && v !== undefined)
    );
    try {
      const res = await submitMutation.mutateAsync(clean);
      // Backend: { success: true, data: { case: { tracking_code, ... } } }
      const trackingCode = res.data.case.tracking_code;
      toast.success(`Case submitted! Code: ${trackingCode}`);
      navigate(`${ROUTES.TRACK}?code=${trackingCode}`);
    } catch (err) {
      toast.error(err?.message ?? 'Submission failed');
    }
  };

  const Field = ({ label, error, children, optional }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-blue-200 mb-1">
        {label} {optional && <span className="text-slate-400 font-normal">(optional)</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );

  const inputCls = "w-full border border-slate-200 dark:border-blue-900/50 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-uwazi-dark text-slate-700 dark:text-blue-200 outline-none focus:ring-2 focus:ring-uwazi-sky/30 focus:border-uwazi-sky";

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Report a Case</h1>
        <p className="text-sm text-slate-500 dark:text-uwazi-muted mt-1">
          Submit evidence of corruption or misuse of public funds
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="bg-white dark:bg-uwazi-dark border border-slate-200 dark:border-blue-900/50 rounded-xl p-6 space-y-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Case Information</h2>

          <Field label="Title" error={errors.title}>
            <input {...register('title')} placeholder="Brief description of the issue"
              className={inputCls} />
          </Field>

          <Field label="Description" error={errors.description}>
            <textarea {...register('description')} rows={4}
              placeholder="Provide detailed information about the incident..."
              className={inputCls} />
          </Field>

          <Field label="Category" error={errors.category}>
            <select {...register('category')} className={inputCls}>
              <option value="">Select category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="County" error={errors.county} optional>
              <select {...register('county')} className={inputCls}>
                <option value="">Select county</option>
                {COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Agency / Ministry" error={errors.agency_involved} optional>
              <input {...register('agency_involved')} placeholder="e.g. Nairobi County Government"
                className={inputCls} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Officer Name" error={errors.officer_name} optional>
              <input {...register('officer_name')} placeholder="Name of officer involved"
                className={inputCls} />
            </Field>
            <Field label="Estimated Amount (KES)" error={errors.estimated_amount_kes} optional>
              <input {...register('estimated_amount_kes')} type="number" placeholder="0"
                className={inputCls} />
            </Field>
          </div>

          <Field label="Incident Date" error={errors.incident_date} optional>
            <input {...register('incident_date')} type="date" className={inputCls} />
          </Field>
        </div>

        <div className="bg-white dark:bg-uwazi-dark border border-slate-200 dark:border-blue-900/50 rounded-xl p-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input {...register('is_anonymous')} type="checkbox" className="mt-0.5 accent-uwazi-sky" />
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-blue-200">Submit anonymously</p>
              <p className="text-xs text-slate-400 dark:text-blue-500 mt-0.5">
                Your identity will not be associated with this submission
              </p>
            </div>
          </label>
        </div>

        <button type="submit" disabled={submitMutation.isPending}
          className="w-full bg-uwazi-sky hover:bg-uwazi-blue text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-60">
          {submitMutation.isPending ? 'Submitting…' : 'Submit Case'}
        </button>
      </form>
    </div>
  );
}
EOF

cat > $BASE/pages/cases/TrackCasePage.jsx << 'EOF'
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
EOF

cat > $BASE/pages/analytics/AnalyticsPage.jsx << 'EOF'
import { useAnalyticsStats, useCountyBreakdown } from '../../hooks/useAnalytics';
import StatCard       from '../../components/ui/StatCard';
import CountyBarChart from '../../components/charts/CountyBarChart';
import SummaryPieChart from '../../components/charts/SummaryPieChart';
import Spinner        from '../../components/ui/Spinner';
import { formatKES }  from '../../utils/formatKES';

export default function AnalyticsPage() {
  const { data: statsRes, isLoading } = useAnalyticsStats();
  const { data: countyRes }           = useCountyBreakdown();

  const stats    = statsRes?.data;
  const counties = countyRes?.data?.counties ?? [];

  if (isLoading) return <Spinner />;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-uwazi-muted">Live statistics from the UWAZI database</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Cases"    value={stats?.total_cases} />
        <StatCard title="Under Review"   value={stats?.under_review}    variant="warn" />
        <StatCard title="Escalated"      value={stats?.escalated}       variant="danger" />
        <StatCard title="Resolved"       value={stats?.resolved_cases}  variant="success" />
      </div>

      {stats?.total_amount_kes && (
        <div className="bg-uwazi-navy text-white rounded-xl p-6">
          <p className="text-xs text-uwazi-muted uppercase tracking-widest mb-1">Total Amount Involved</p>
          <p className="text-3xl font-bold">{formatKES(stats.total_amount_kes, false)}</p>
          <p className="text-sm text-blue-300 mt-1">Across all submitted cases</p>
        </div>
      )}

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <CountyBarChart data={counties} />
        <SummaryPieChart stats={stats} />
      </div>
    </div>
  );
}
EOF

cat > $BASE/pages/admin/AdminDashboard.jsx << 'EOF'
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService }     from '../../api/admin.service';
import { analyticsService } from '../../api/analytics.service';
import { casesService }     from '../../api/cases.service';
import { StatusBadge, RoleBadge } from '../../components/ui/Badge';
import Spinner    from '../../components/ui/Spinner';
import { fmtDateTime } from '../../utils/formatDate';
import { toast }   from '../../store/notificationStore';
import { formatKES } from '../../utils/formatKES';

const TABS = ['Cases', 'Users', 'Audit Log'];
const ROLES = ['citizen', 'reviewer', 'admin', 'super_admin'];

export default function AdminDashboard() {
  const [tab, setTab] = useState('Cases');
  const queryClient   = useQueryClient();

  // Stats from /analytics/stats (correct — no /admin/stats endpoint)
  const { data: statsRes } = useQuery({
    queryKey: ['analytics-stats'],
    queryFn:  analyticsService.getStats,
  });

  // Cases via public /cases (no /admin/cases endpoint)
  const { data: casesRes, isLoading: casesLoading } = useQuery({
    queryKey: ['cases', { limit: 50 }],
    queryFn:  () => casesService.getAll({ limit: 50 }),
  });

  // Users via /admin/users
  const { data: usersRes, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn:  adminService.getUsers,
  });

  // Audit log via /admin/audit-log
  const { data: auditRes, isLoading: auditLoading } = useQuery({
    queryKey: ['audit-log'],
    queryFn:  adminService.getAuditLog,
  });

  // Role change mutation (super_admin only)
  const roleChange = useMutation({
    mutationFn: ({ id, role }) => adminService.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Role updated');
    },
    onError: (err) => toast.error(err?.message ?? 'Update failed'),
  });

  const stats    = statsRes?.data;
  const cases    = casesRes?.data?.cases ?? [];
  const users    = usersRes?.data?.users ?? [];
  const auditLog = auditRes?.data?.logs  ?? [];

  const cellCls = "px-4 py-3 text-sm text-slate-700 dark:text-blue-200";
  const thCls   = "px-4 py-3 text-xs font-bold text-white bg-uwazi-navy text-left";

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Panel</h1>
      </div>

      {/* Stats summary */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ['Total Cases',  stats.total_cases],
            ['Under Review', stats.under_review],
            ['Escalated',    stats.escalated],
            ['Resolved',     stats.resolved_cases],
          ].map(([label, val]) => (
            <div key={label} className="bg-white dark:bg-uwazi-dark border border-slate-200 dark:border-blue-900/50 rounded-xl p-4">
              <p className="text-xs text-slate-400 uppercase tracking-wide">{label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{val ?? '—'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-blue-900/50 flex gap-1">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? 'border-uwazi-sky text-uwazi-sky'
                : 'border-transparent text-slate-500 dark:text-blue-400 hover:text-slate-700'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* Cases tab */}
      {tab === 'Cases' && (casesLoading ? <Spinner /> : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-blue-900/50">
          <table className="w-full text-sm">
            <thead><tr>
              {['Code','Title','Category','Status','County','Amount','Filed'].map((h) => (
                <th key={h} className={thCls}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.id} className="border-t border-slate-100 dark:border-blue-900/20 hover:bg-slate-50 dark:hover:bg-uwazi-mid/30">
                  <td className={`${cellCls} font-mono text-xs`}>{c.tracking_code}</td>
                  <td className={cellCls}><p className="max-w-xs truncate">{c.title}</p></td>
                  <td className={`${cellCls} capitalize`}>{c.category}</td>
                  <td className={cellCls}><StatusBadge status={c.status} /></td>
                  <td className={cellCls}>{c.county ?? '—'}</td>
                  <td className={cellCls}>{c.estimated_amount_kes ? formatKES(c.estimated_amount_kes) : '—'}</td>
                  <td className={`${cellCls} text-xs`}>{fmtDateTime(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!cases.length && <p className="text-center text-slate-400 py-8 text-sm">No cases yet</p>}
        </div>
      ))}

      {/* Users tab */}
      {tab === 'Users' && (usersLoading ? <Spinner /> : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-blue-900/50">
          <table className="w-full text-sm">
            <thead><tr>
              {['Name','Email','Role','Joined','Change Role'].map((h) => (
                <th key={h} className={thCls}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-slate-100 dark:border-blue-900/20 hover:bg-slate-50 dark:hover:bg-uwazi-mid/30">
                  <td className={cellCls}>{u.full_name}</td>
                  <td className={cellCls}>{u.email}</td>
                  <td className={cellCls}><RoleBadge role={u.role} /></td>
                  <td className={`${cellCls} text-xs`}>{fmtDateTime(u.created_at)}</td>
                  <td className={cellCls}>
                    <select defaultValue={u.role}
                      onChange={(e) => roleChange.mutate({ id: u.id, role: e.target.value })}
                      className="text-xs border border-slate-200 dark:border-blue-900/50 rounded-lg px-2 py-1 bg-white dark:bg-uwazi-dark outline-none">
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!users.length && <p className="text-center text-slate-400 py-8 text-sm">No users yet</p>}
        </div>
      ))}

      {/* Audit Log tab */}
      {tab === 'Audit Log' && (auditLoading ? <Spinner /> : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-blue-900/50">
          <table className="w-full text-sm">
            <thead><tr>
              {['Time','Action','Role','IP','Resource','Status'].map((h) => (
                <th key={h} className={thCls}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {auditLog.map((log) => (
                <tr key={log.id} className="border-t border-slate-100 dark:border-blue-900/20 hover:bg-slate-50 dark:hover:bg-uwazi-mid/30">
                  <td className={`${cellCls} text-xs font-mono`}>{fmtDateTime(log.created_at)}</td>
                  <td className={`${cellCls} font-mono text-xs`}>{log.action}</td>
                  <td className={`${cellCls} capitalize text-xs`}>{log.actor_role ?? '—'}</td>
                  <td className={`${cellCls} text-xs font-mono`}>{log.actor_ip}</td>
                  <td className={`${cellCls} text-xs`}>{log.resource_type ?? '—'}</td>
                  <td className={cellCls}>
                    <span className={`text-xs font-semibold ${log.success ? 'text-green-600' : 'text-red-600'}`}>
                      {log.success ? '✓ OK' : '✗ Fail'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!auditLog.length && <p className="text-center text-slate-400 py-8 text-sm">No audit logs yet</p>}
        </div>
      ))}
    </div>
  );
}
EOF

cat > $BASE/pages/NotFoundPage.jsx << 'EOF'
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-uwazi-navy flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-7xl font-black text-blue-900 mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-2">Page not found</h1>
        <p className="text-blue-400 mb-8">This page does not exist or has been moved.</p>
        <Link to={ROUTES.DASHBOARD}
          className="bg-uwazi-sky hover:bg-uwazi-blue text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
EOF

echo "✅ All pages created"

# ══════════════════════════════════════════════════════════════
# App.jsx and main.jsx
# ══════════════════════════════════════════════════════════════

cat > $BASE/App.jsx << 'EOF'
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout      from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Auth pages (no sidebar)
import LoginPage          from './pages/auth/LoginPage';
import RegisterPage       from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import TrackCasePage      from './pages/cases/TrackCasePage';

// Protected app pages (sidebar + topbar)
import DashboardPage  from './pages/dashboard/DashboardPage';
import AnalyticsPage  from './pages/analytics/AnalyticsPage';
import CaseListPage   from './pages/cases/CaseListPage';
import CaseDetailPage from './pages/cases/CaseDetailPage';
import SubmitCasePage from './pages/cases/SubmitCasePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFoundPage   from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login"           element={<LoginPage />} />
      <Route path="/register"        element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/track"           element={<TrackCasePage />} />

      {/* Protected app routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/"             element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"    element={<DashboardPage />} />
          <Route path="/analytics"    element={<AnalyticsPage />} />
          <Route path="/cases"        element={<CaseListPage />} />
          <Route path="/cases/submit" element={<SubmitCasePage />} />
          <Route path="/cases/:id"    element={<CaseDetailPage />} />
        </Route>
      </Route>

      {/* Admin-only routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'super_admin']} />}>
        <Route element={<AppLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
EOF

cat > $BASE/main.jsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
EOF

# ══════════════════════════════════════════════════════════════
# index.css and tailwind.config.js
# ══════════════════════════════════════════════════════════════

cat > $BASE/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; }
  body { @apply bg-slate-50 dark:bg-uwazi-navy text-slate-900 dark:text-white; }
}
EOF

cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'uwazi-navy':  '#0A1628',
        'uwazi-dark':  '#0F1E35',
        'uwazi-mid':   '#162440',
        'uwazi-blue':  '#1B4FD8',
        'uwazi-sky':   '#2563EB',
        'uwazi-light': '#3B82F6',
        'uwazi-pale':  '#DBEAFE',
        'uwazi-muted': '#93C5FD',
      },
    },
  },
  plugins: [],
};
EOF

cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',  // backend PORT 3000
        changeOrigin: true,
      }
    }
  }
});
EOF

# .env file
if [ ! -f ".env" ]; then
cat > .env << 'EOF'
VITE_API_URL=http://localhost:3000/api/v1
VITE_APP_NAME=UWAZI
VITE_APP_TAGLINE=Public Finance Intelligence
VITE_ENABLE_DARK_MODE=true
EOF
echo "✅ .env created"
fi

echo ""
echo "════════════════════════════════════════════"
echo "  ✅ UWAZI Frontend scaffold complete!"
echo "════════════════════════════════════════════"
echo ""
echo "Files created:"
find src -name "*.js" -o -name "*.jsx" | sort | while read f; do echo "  ✓ $f"; done
echo ""
echo "Next steps:"
echo "  1. npm run dev"
echo "  2. Open http://localhost:5173"
echo "  3. Start backend: cd ../backend && npm run dev"
echo ""
