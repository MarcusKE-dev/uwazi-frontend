import { casesService } from '../../api/cases.service';
import { useNavigate } from 'react-router-dom';
import COUNTIES from '../../constants/counties';

// Zod schema mirrors backend src/validators/case.validators.js
const schema = z.object({
  title:               z.string().min(5).max(500),
  description:         z.string().min(10),
  // All 6 backend categories:
  category:            z.enum(['procurement', 'budget', 'salary', 'land', 'contracts', 'other']),
  county:              z.string().optional(),
  constituency:        z.string().optional(),
  ward:                z.string().optional(),
  agency_involved:     z.string().optional(),
  officer_name:        z.string().optional(),
  estimated_amount_kes: z.number().positive().optional(),
  incident_date:       z.string().optional(),   // YYYY-MM-DD
  is_anonymous:        z.boolean().default(false),
});

const onSubmit = async (formData) => {
  try {
    // POST /cases → payload: { case: { id, tracking_code, ... } }
    const payload = await casesService.submit(formData);
    // payload.case.tracking_code === "UW-2026-0001"
    navigate(`/track?code=${payload.case.tracking_code}`);
  } catch (err) {
    setError(err.message);
  }
};