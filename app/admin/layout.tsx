import Link from 'next/link';
import { LayoutDashboard, FolderOpen, Upload, LogOut, ChevronRight } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { href: '/admin/import', label: 'Import CSV', icon: Upload },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-navy flex">
      {/* Sidebar */}
      <aside
        className="w-56 flex-shrink-0 border-r border-white/10 flex flex-col"
        style={{ backdropFilter: 'blur(16px)', background: 'rgba(10,22,40,0.95)' }}
      >
        <div className="p-4 border-b border-white/10">
          <p className="text-xs font-bold text-white">KATSINA LGA</p>
          <p className="text-[10px] text-white/30 mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all group min-h-[44px]"
            >
              <Icon size={15} />
              <span className="flex-1">{label}</span>
              <ChevronRight size={12} className="opacity-0 group-hover:opacity-40 transition-opacity" />
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/30 hover:text-white/60 transition-colors min-h-[44px]"
          >
            <LogOut size={15} />
            <span>View Public Site</span>
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
