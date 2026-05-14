import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/types/project';

export default function AdminProjectsPage() {
  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal hover:bg-teal-light text-white text-sm font-semibold transition-colors min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        >
          <Plus size={14} />
          Add Project
        </Link>
      </div>

      <div
        className="rounded-xl border border-white/10 overflow-hidden"
        style={{ background: 'rgba(15,31,58,0.6)' }}
      >
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] text-xs text-white/30 uppercase tracking-wide px-4 py-2.5 border-b border-white/10 font-medium">
          <span>Project</span>
          <span>Ward</span>
          <span>Category</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        <div className="divide-y divide-white/5">
          <div className="flex items-center justify-center py-16 text-sm text-white/30">
            No projects yet. <Link href="/admin/projects/new" className="text-teal ml-1 hover:underline">Add your first project</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
