'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ImportPage() {
  const [csv, setCsv] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [result, setResult] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCsv(ev.target?.result as string ?? '');
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!csv.trim()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/import', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ csv }) });
      const data = await res.json();
      setResult(res.ok ? `Imported ${data.count} projects successfully.` : data.error ?? 'Import failed');
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setResult('Network error. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-white mb-2">Bulk CSV Import</h1>
      <p className="text-sm text-white/40 mb-6">Upload a CSV file or paste CSV content to import multiple projects at once.</p>

      <div className="space-y-4">
        {/* File upload */}
        <div
          className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-white/10 hover:border-teal/40 transition-colors cursor-pointer"
          onClick={() => fileRef.current?.click()}
        >
          <Upload size={24} className="text-white/30 mb-3" />
          <p className="text-sm text-white/50">Click to select CSV file</p>
          <p className="text-xs text-white/30 mt-1">or paste CSV below</p>
          <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} className="hidden" aria-label="Select CSV file" />
        </div>

        {/* Paste area */}
        <div>
          <label htmlFor="csv-content" className="block text-xs text-white/40 uppercase tracking-wide mb-1.5 font-medium">CSV Content</label>
          <textarea
            id="csv-content"
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            rows={8}
            placeholder="title_en,category,ward_id,community,latitude,longitude,beneficiaries,budget_ngn,completion_date&#10;Road Project,roads,1,Katsina,12.9954,7.6014,5000,10000000,2024-01-01"
            className="w-full px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 text-xs font-mono placeholder-white/20 focus:outline-none focus:border-teal transition-colors resize-y"
          />
        </div>

        {/* Status */}
        {result && (
          <div className={`flex items-start gap-2 px-4 py-3 rounded-lg text-sm ${status === 'done' ? 'bg-teal/10 border border-teal/20 text-teal-light' : 'bg-red-pin/10 border border-red-pin/30 text-red-400'}`} role="alert">
            {status === 'done' ? <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0" /> : <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />}
            {result}
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={!csv.trim() || status === 'loading'}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-teal hover:bg-teal-light disabled:opacity-40 text-white font-semibold text-sm transition-colors min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        >
          {status === 'loading' ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
          {status === 'loading' ? 'Importing…' : 'Import Projects'}
        </button>
      </div>
    </div>
  );
}
