'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ALL_CATEGORIES, CATEGORY_LABELS } from '@/types/project';

export default function NewProjectPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          latitude: parseFloat(data.latitude as string),
          longitude: parseFloat(data.longitude as string),
          beneficiaries: parseInt(data.beneficiaries as string),
          budget_ngn: Math.round(parseFloat(data.budget_ngn as string) * 100),
          expenditure_ngn: Math.round(parseFloat(data.expenditure_ngn as string) * 100),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      router.push('/admin/projects');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project');
      setSaving(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-teal focus:bg-white/8 transition-colors min-h-[44px]";
  const labelClass = "block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide";

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/projects" className="text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-bold text-white">New Project</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="px-4 py-3 rounded-lg bg-red-pin/10 border border-red-pin/30 text-sm text-red-400" role="alert">
            {error}
          </div>
        )}

        {/* Titles */}
        <fieldset className="space-y-4 p-5 rounded-xl border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <legend className="text-sm font-semibold text-white px-1">Project Title</legend>
          <div>
            <label htmlFor="title_en" className={labelClass}>Title (English) *</label>
            <input id="title_en" name="title_en" required placeholder="e.g. Road Rehabilitation Project" className={inputClass} />
          </div>
          <div>
            <label htmlFor="title_ha" className={labelClass}>Title (Hausa)</label>
            <input id="title_ha" name="title_ha" placeholder="e.g. Gyaran Hanya" className={inputClass} />
          </div>
        </fieldset>

        {/* Category & Ward */}
        <fieldset className="grid grid-cols-2 gap-4 p-5 rounded-xl border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <legend className="text-sm font-semibold text-white px-1 col-span-2">Classification</legend>
          <div>
            <label htmlFor="category" className={labelClass}>Category *</label>
            <select id="category" name="category" required className={`${inputClass} cursor-pointer`}>
              <option value="">Select category…</option>
              {ALL_CATEGORIES.map((c) => (
                <option key={c} value={c} style={{ background: '#0F1F3A' }}>{CATEGORY_LABELS[c]}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ward_id" className={labelClass}>Ward *</label>
            <select id="ward_id" name="ward_id" required className={`${inputClass} cursor-pointer`}>
              <option value="">Select ward…</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1} style={{ background: '#0F1F3A' }}>Ward {i + 1}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label htmlFor="community" className={labelClass}>Community *</label>
            <input id="community" name="community" required placeholder="e.g. Katsina City Centre" className={inputClass} />
          </div>
        </fieldset>

        {/* GPS */}
        <fieldset className="grid grid-cols-2 gap-4 p-5 rounded-xl border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <legend className="text-sm font-semibold text-white px-1 col-span-2">GPS Coordinates</legend>
          <div>
            <label htmlFor="latitude" className={labelClass}>Latitude *</label>
            <input id="latitude" name="latitude" type="number" step="0.0001" required placeholder="12.9954" className={inputClass} />
          </div>
          <div>
            <label htmlFor="longitude" className={labelClass}>Longitude *</label>
            <input id="longitude" name="longitude" type="number" step="0.0001" required placeholder="7.6014" className={inputClass} />
          </div>
        </fieldset>

        {/* Budget */}
        <fieldset className="grid grid-cols-2 gap-4 p-5 rounded-xl border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <legend className="text-sm font-semibold text-white px-1 col-span-2">Financials (₦)</legend>
          <div>
            <label htmlFor="budget_ngn" className={labelClass}>Budget Allocated *</label>
            <input id="budget_ngn" name="budget_ngn" type="number" step="0.01" required placeholder="0.00" className={inputClass} />
          </div>
          <div>
            <label htmlFor="expenditure_ngn" className={labelClass}>Amount Spent</label>
            <input id="expenditure_ngn" name="expenditure_ngn" type="number" step="0.01" defaultValue="0" placeholder="0.00" className={inputClass} />
          </div>
        </fieldset>

        {/* Impact */}
        <fieldset className="grid grid-cols-2 gap-4 p-5 rounded-xl border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <legend className="text-sm font-semibold text-white px-1 col-span-2">Impact</legend>
          <div>
            <label htmlFor="beneficiaries" className={labelClass}>Beneficiaries *</label>
            <input id="beneficiaries" name="beneficiaries" type="number" required placeholder="0" className={inputClass} />
          </div>
          <div>
            <label htmlFor="completion_date" className={labelClass}>Completion Date</label>
            <input id="completion_date" name="completion_date" type="date" className={inputClass} />
          </div>
          <div className="col-span-2">
            <label htmlFor="contractor" className={labelClass}>Contractor</label>
            <input id="contractor" name="contractor" placeholder="Contractor name" className={inputClass} />
          </div>
        </fieldset>

        {/* Descriptions */}
        <fieldset className="space-y-4 p-5 rounded-xl border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <legend className="text-sm font-semibold text-white px-1">Descriptions</legend>
          <div>
            <label htmlFor="description_en" className={labelClass}>Description (English)</label>
            <textarea id="description_en" name="description_en" rows={3} placeholder="Describe the project…" className={`${inputClass} min-h-[80px] resize-y`} />
          </div>
          <div>
            <label htmlFor="description_ha" className={labelClass}>Description (Hausa)</label>
            <textarea id="description_ha" name="description_ha" rows={3} placeholder="Bayani a Hausa…" className={`${inputClass} min-h-[80px] resize-y`} />
          </div>
        </fieldset>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-teal hover:bg-teal-light disabled:opacity-50 text-white font-semibold text-sm transition-colors min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Saving…' : 'Save Project'}
          </button>
          <Link
            href="/admin/projects"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-white/10 text-white/50 hover:text-white text-sm transition-colors min-h-[44px]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
