'use client';

import { Suspense, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        router.push(redirectTo);
        router.refresh();
      }
    });
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(15,31,58,0.95)',
          border: '1px solid rgba(29,155,138,0.20)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Header */}
        <div
          className="px-8 py-6 border-b border-white/10 text-center"
          style={{ background: 'rgba(29,155,138,0.06)' }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{ background: 'rgba(29,155,138,0.15)', border: '1px solid rgba(29,155,138,0.30)' }}
          >
            <Shield size={22} className="text-teal-light" />
          </div>
          <h1 className="text-base font-bold text-white">Admin Access</h1>
          <p className="text-xs text-white/40 mt-1">Katsina LGA Dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-white/60 mb-1.5">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg text-sm text-white bg-white/5 border border-white/10 placeholder-white/20 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
              placeholder="admin@katsinalga.gov.ng"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-white/60 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 pr-10 rounded-lg text-sm text-white bg-white/5 border border-white/10 placeholder-white/20 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="text-xs px-3 py-2 rounded-lg"
              style={{ background: 'rgba(226,75,74,0.12)', color: '#E24B4A', border: '1px solid rgba(226,75,74,0.25)' }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal min-h-[44px]"
            style={{
              background: isPending
                ? 'rgba(29,155,138,0.40)'
                : 'linear-gradient(135deg, #1D9B8A, #145F55)',
              boxShadow: isPending ? 'none' : '0 0 16px rgba(29,155,138,0.30)',
            }}
          >
            {isPending ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <p className="text-center text-[10px] text-white/20 pb-5">
          Protected area — authorised personnel only
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-navy" />}>
      <LoginForm />
    </Suspense>
  );
}
