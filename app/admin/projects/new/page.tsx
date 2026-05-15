'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, MapPin, Check } from 'lucide-react';
import Link from 'next/link';
import { ALL_CATEGORIES, CATEGORY_LABELS, WARD_NAMES } from '@/types/project';

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
          budget_ngn: Math.round(parseFloat(data.budget_ngn as string)),
          expenditure_ngn: Math.round(parseFloat(data.expenditure_ngn as string)),
          published: data.published === 'true',
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
        <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-xl border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <legend className="text-sm font-semibold text-white px-1 sm:col-span-2">Classification</legend>
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
              {Object.entries(WARD_NAMES).map(([id, name]) => (
                <option key={id} value={id} style={{ background: '#0F1F3A' }}>{name}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="community" className={labelClass}>Community *</label>
            <input id="community" name="community" required placeholder="e.g. Katsina City Centre" className={inputClass} />
          </div>
        </fieldset>

        {/* GPS */}
        <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-xl border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <legend className="text-sm font-semibold text-white px-1 sm:col-span-2">GPS Coordinates</legend>
          <div>
            <label htmlFor="latitude" className={labelClass}>Latitude *</label>
            <input id="latitude" name="latitude" type="number" step="any" required placeholder="12.9954" className={inputClass} />
          </div>
          <div>
            <label htmlFor="longitude" className={labelClass}>Longitude *</label>
            <input id="longitude" name="longitude" type="number" step="any" required placeholder="7.6014" className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <GpsButton latId="latitude" lngId="longitude" />
          </div>
        </fieldset>

        {/* Budget */}
        <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-xl border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <legend className="text-sm font-semibold text-white px-1 sm:col-span-2">Financials (₦)</legend>
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
        <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-xl border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <legend className="text-sm font-semibold text-white px-1 sm:col-span-2">Impact</legend>
          <div>
            <label htmlFor="beneficiaries" className={labelClass}>Beneficiaries *</label>
            <input id="beneficiaries" name="beneficiaries" type="number" required placeholder="0" className={inputClass} />
          </div>
          <div>
            <label htmlFor="completion_date" className={labelClass}>Completion Date</label>
            <input id="completion_date" name="completion_date" type="date" className={inputClass} />
          </div>
          <div className="sm:col-span-2">
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

        {/* Status & Published */}
        <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-xl border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <legend className="text-sm font-semibold text-white px-1 sm:col-span-2">Status & Visibility</legend>
          <div>
            <label htmlFor="status" className={labelClass}>Status *</label>
            <select id="status" name="status" required defaultValue="completed" className={`${inputClass} cursor-pointer`}>
              <option value="completed" style={{ background: '#0F1F3A' }}>Completed</option>
              <option value="ongoing" style={{ background: '#0F1F3A' }}>Ongoing</option>
              <option value="planning" style={{ background: '#0F1F3A' }}>Planning</option>
            </select>
          </div>
          <div className="flex flex-col justify-end">
            <label className={labelClass}>Published</label>
            <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
              <input type="checkbox" name="published" value="true" defaultChecked className="w-4 h-4 rounded accent-teal" />
              <span className="text-sm text-white/70">Visible on public dashboard</span>
            </label>
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

function GpsButton({ latId, lngId }: { latId: string; lngId: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const getLocation = () => {
    if (!navigator.geolocation) { setStatus('error'); setTimeout(() => setStatus('idle'), 3000); return; }
    setStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = document.getElementById(latId) as HTMLInputElement | null;
        const lng = document.getElementById(lngId) as HTMLInputElement | null;
        if (lat) lat.value = pos.coords.latitude.toFixed(6);
        if (lng) lng.value = pos.coords.longitude.toFixed(6);
        setStatus('done');
        setTimeout(() => setStatus('idle'), 3000);
      },
      () => { setStatus('error'); setTimeout(() => setStatus('idle'), 3000); },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  return (
    <button
      type="button"
      onClick={getLocation}
      disabled={status === 'loading'}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] border focus:outline-none focus-visible:ring-2 focus-visible:ring-teal ${
        status === 'done' ? 'border-teal/40 bg-teal/10 text-teal' :
        status === 'error' ? 'border-red-500/30 bg-red-500/10 text-red-400' :
        'border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/8 hover:border-white/20'
      }`}
    >
      {status === 'loading' ? <Loader2 size={14} className="animate-spin" /> :
       status === 'done' ? <Check size={14} /> :
       <MapPin size={14} />}
      {status === 'loading' ? 'Getting location…' :
       status === 'done' ? 'Location captured!' :
       status === 'error' ? 'Location unavailable' :
       'Use My Location'}
    </button>
  );
}
