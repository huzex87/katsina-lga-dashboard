'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, FolderOpen, Upload, LogOut, ChevronRight, Menu, X, TrendingUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { href: '/admin/import', label: 'Import CSV', icon: Upload },
];

function NavLinks({ pathname, onNav }: { pathname: string; onNav?: () => void }) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    onNav?.();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNav}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group min-h-[44px] ${
                active
                  ? 'bg-teal/10 text-teal border border-teal/20'
                  : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon size={15} />
              <span className="flex-1">{label}</span>
              <ChevronRight size={12} className={`transition-opacity ${active ? 'opacity-40' : 'opacity-0 group-hover:opacity-40'}`} />
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/10 space-y-1">
        <Link
          href="/"
          onClick={onNav}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/30 hover:text-white/60 transition-colors min-h-[44px]"
        >
          <TrendingUp size={15} />
          <span>View Public Site</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <LogOut size={15} />
          <span>Sign out</span>
        </button>
      </div>
    </>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-navy flex">
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex w-56 flex-shrink-0 border-r border-white/10 flex-col"
        style={{ backdropFilter: 'blur(16px)', background: 'rgba(10,22,40,0.95)' }}
      >
        <div className="p-4 border-b border-white/10">
          <p className="text-xs font-bold text-white">KATSINA LGA</p>
          <p className="text-[10px] text-white/30 mt-0.5">Admin Panel</p>
        </div>
        <NavLinks pathname={pathname} />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 border-b border-white/10"
        style={{ background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(16px)' }}
      >
        <div>
          <p className="text-xs font-bold text-white leading-none">KATSINA LGA</p>
          <p className="text-[10px] text-white/30 leading-none mt-0.5">Admin Panel</p>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center justify-center w-10 h-10 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              className="fixed top-0 left-0 bottom-0 w-64 z-50 md:hidden flex flex-col border-r border-white/10"
              style={{ background: 'rgba(10,22,40,0.98)', backdropFilter: 'blur(20px)' }}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div>
                  <p className="text-xs font-bold text-white">KATSINA LGA</p>
                  <p className="text-[10px] text-white/30 mt-0.5">Admin Panel</p>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center justify-center w-9 h-9 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
                  aria-label="Close navigation menu"
                >
                  <X size={18} />
                </button>
              </div>
              <NavLinks pathname={pathname} onNav={() => setDrawerOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Content */}
      <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 pt-20 md:pt-8">
        {children}
      </main>
    </div>
  );
}
