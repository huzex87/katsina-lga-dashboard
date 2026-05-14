import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Users, Calendar, Award } from 'lucide-react';
import { formatNaira, formatCoords, formatDate } from '@/lib/utils';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/types/project';

interface Props {
  params: Promise<{ id: string }>;
}

async function getProject(id: string) {
  try {
    const url = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${url}/api/projects/${id}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const catColor = CATEGORY_COLORS[project.category as keyof typeof CATEGORY_COLORS] ?? '#1D9B8A';
  const catLabel = CATEGORY_LABELS[project.category as keyof typeof CATEGORY_LABELS] ?? project.category;

  return (
    <main className="min-h-screen bg-navy text-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </Link>

        <div
          className="rounded-2xl overflow-hidden border border-white/10"
          style={{ backdropFilter: 'blur(12px)', background: 'rgba(15,31,58,0.8)' }}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mb-3"
              style={{ background: `${catColor}20`, color: catColor, border: `1px solid ${catColor}40` }}
            >
              {catLabel}
            </span>
            <h1 className="text-2xl font-bold text-white mb-1">{project.title_en}</h1>
            {project.title_ha && <p className="text-teal-light text-sm">{project.title_ha}</p>}
            <p className="text-xs text-white/30 mt-2 font-mono">{project.ref_code}</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/5">
            {[
              { icon: MapPin, label: 'Ward', value: project.ward?.name ?? 'N/A', color: 'text-teal' },
              { icon: Users, label: 'Beneficiaries', value: project.beneficiaries?.toLocaleString(), color: 'text-teal-light' },
              { icon: Calendar, label: 'Completed', value: formatDate(project.completion_date), color: 'text-gold' },
              { icon: Award, label: 'Budget', value: formatNaira(project.budget_ngn), color: 'text-white' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="p-4 bg-navy-mid/50">
                <Icon size={14} className={`${color} mb-2`} />
                <p className="text-xs text-white/40 mb-0.5">{label}</p>
                <p className="text-sm font-bold text-white">{value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          {project.description_en && (
            <div className="p-6">
              <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wide mb-3">About this project</h2>
              <p className="text-sm text-white/80 leading-relaxed">{project.description_en}</p>
            </div>
          )}

          {/* GPS */}
          <div className="px-6 pb-6">
            <div className="rounded-lg p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-xs text-white/40 mb-1">GPS Coordinates</p>
              <code className="text-sm text-teal-light font-mono">
                {formatCoords(project.latitude, project.longitude)}
              </code>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const project = await getProject(id);
  return {
    title: project ? `${project.title_en} — Katsina LGA` : 'Project Not Found',
    description: project?.description_en ?? 'Katsina LGA development project details.',
  };
}
