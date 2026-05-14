import Link from 'next/link';
import { Plus, FileJson, BarChart3, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function AdminOverviewPage() {
  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-sm text-white/40 mt-1">Manage Katsina LGA project records</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal hover:bg-teal-light text-white font-semibold text-sm transition-colors min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        >
          <Plus size={15} />
          New Project
        </Link>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { href: '/admin/projects/new', icon: Plus, label: 'Add Project', desc: 'Create a new project record', color: 'text-teal' },
          { href: '/admin/import', icon: FileJson, label: 'Bulk Import', desc: 'Upload CSV of projects', color: 'text-gold' },
          { href: '/', icon: BarChart3, label: 'View Map', desc: 'See public dashboard', color: 'text-white/60' },
        ].map(({ href, icon: Icon, label, desc, color }) => (
          <Link
            key={href}
            href={href}
            className="flex items-start gap-3 p-4 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all group"
          >
            <Icon size={18} className={`${color} mt-0.5 flex-shrink-0`} />
            <div>
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="text-xs text-white/40 mt-0.5">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: CheckCircle2, label: 'Completed', value: '—', color: 'text-teal' },
          { icon: Clock, label: 'Ongoing', value: '—', color: 'text-gold' },
          { icon: AlertCircle, label: 'Planning', value: '—', color: 'text-white/40' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="p-4 rounded-xl border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <Icon size={16} className={`${color} mb-3`} />
            <p className="text-xl font-bold text-white">{value}</p>
            <p className="text-xs text-white/40 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
