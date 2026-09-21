'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@hariprasadam.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid credentials');
      }

      // Use full page location redirect to guarantee fresh cookie headers and layout load
      window.location.href = '/admin';
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border border-[#E6DEC8] rounded-2xl shadow-xl p-8 sm:p-10 space-y-8">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#C59B3F]/40 p-1 flex items-center justify-center mx-auto shadow-sm">
            <Image
              src="/images/branding/logo.png"
              alt="HariPrasadam Logo"
              width={56}
              height={56}
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="font-serif text-3xl font-bold text-[#1A1412] tracking-tight">
              HariPrasadam CMS
            </h2>
            <p className="text-xs text-[#7A6D63] uppercase tracking-wider font-semibold mt-1">
              Admin & Content Management Portal
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          action="javascript:void(0);"
          method="POST"
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E37] mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8A7E75] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hariprasadam.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-lg text-[#1A1412] focus:outline-none focus:ring-1 focus:ring-[#C59B3F]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E37] mb-1.5">
              Password / Passcode
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8A7E75] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password or passcode"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAF8F5] border border-[#DDD4C3] rounded-lg text-[#1A1412] focus:outline-none focus:ring-1 focus:ring-[#C59B3F]"
              />
            </div>
            <p className="text-[11px] text-[#8A7E75] mt-1">
              Default development passcode: <code className="bg-[#FAF8F5] px-1 py-0.5 rounded text-[#1A1412]">hari2026admin</code>
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#1A1412] hover:bg-[#2C221E] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider rounded-lg shadow transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#C59B3F]" />
                  <span>Verifying Session...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C59B3F]" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-[#F2ECE1] text-center text-xs text-[#8A7E75]">
          <ShieldCheck className="w-4 h-4 text-[#C59B3F] inline-block mr-1" />
          <span>Protected Administrative Interface • Surat, Gujarat</span>
        </div>
      </div>
    </div>
  );
}
