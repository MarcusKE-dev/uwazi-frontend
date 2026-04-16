import { useRef, useState } from 'react';
import { evidenceService } from '../api/evidence.service';
import { Paperclip, CheckCircle, AlertCircle } from 'lucide-react';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'];
const MAX_MB = 20;

export default function EvidenceUpload({ caseId, onUploaded }) {
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [status, setStatus]       = useState(null);   // 'ok' | 'error' | null
  const [desc, setDesc]           = useState('');

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    // Client-side validation (mirrors backend multer config)
    if (!ALLOWED_TYPES.includes(file.type)) {
      setStatus({ type: 'error', msg: 'Only JPEG, PNG, PDF, MP4 files allowed.' });
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setStatus({ type: 'error', msg: `File exceeds ${MAX_MB}MB limit.` });
      return;
    }

    setUploading(true);
    setStatus(null);
    try {
      // POST /evidence/:caseId — caseId in URL, NOT FormData
      const payload = await evidenceService.upload(caseId, file, desc);
      setStatus({ type: 'ok', msg: 'File uploaded successfully.' });
      onUploaded?.(payload.evidence);   // ← payload.evidence from backend
    } catch (err) {
      setStatus({ type: 'error', msg: err.message || 'Upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf,.mp4"
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0 file:bg-uwazi-pale file:text-uwazi-blue
          file:font-semibold hover:file:bg-uwazi-mist cursor-pointer"
      />
      <input
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Description (optional)"
        className="input-base"
      />
      <button onClick={handleUpload} disabled={uploading} className="btn-primary flex items-center gap-2">
        <Paperclip size={15} />
        {uploading ? 'Uploading…' : 'Attach Evidence'}
      </button>
      {status?.type === 'ok'    && <p className="text-green-600 text-sm flex items-center gap-1"><CheckCircle size={14} /> {status.msg}</p>}
      {status?.type === 'error' && <p className="text-red-500  text-sm flex items-center gap-1"><AlertCircle size={14} /> {status.msg}</p>}
    </div>
  );
}