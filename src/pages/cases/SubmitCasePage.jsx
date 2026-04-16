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
