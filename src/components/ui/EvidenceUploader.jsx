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
