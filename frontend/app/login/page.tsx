'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchApi } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';
import { Lock, Mail, Store, ShieldAlert, User, ArrowRight } from 'lucide-react';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user } = useAuth();

  const [email, setEmail] = useState('farmer@example.com');
  const [password, setPassword] = useState('farmer123');
  const [role, setRole] = useState<'ADMIN' | 'SELLER' | 'FARMER'>('FARMER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'SELLER') {
      setEmail('seller@example.com');
      setPassword('seller123');
      setRole('SELLER');
    } else if (roleParam === 'ADMIN') {
      setEmail('admin@example.com');
      setPassword('admin123');
      setRole('ADMIN');
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      if (user.role === 'SELLER') router.push('/seller/dashboard');
      else if (user.role === 'ADMIN') router.push('/admin/dashboard');
      else router.push('/seeds');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      login(data);

      if (data.role === 'SELLER') router.push('/seller/dashboard');
      else if (data.role === 'ADMIN') router.push('/admin/dashboard');
      else router.push('/seeds');

    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
      setLoading(false);
    }
  };

  const setDemoUser = (demoRole: 'ADMIN' | 'SELLER' | 'FARMER') => {
    if (demoRole === 'ADMIN') {
      setEmail('admin@example.com');
      setPassword('admin123');
      setRole('ADMIN');
    } else if (demoRole === 'SELLER') {
      setEmail('seller@example.com');
      setPassword('seller123');
      setRole('SELLER');
    } else {
      setEmail('farmer@example.com');
      setPassword('farmer123');
      setRole('FARMER');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-slate-50 border border-emerald-100 p-1 flex items-center justify-center mx-auto shadow-md">
            <Logo className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Sign In to TNSEEDS</h2>
          <p className="text-xs text-slate-500">Access seed availability network and ERP dashboard</p>
        </div>

        {/* Demo Fast Selector */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
          <span className="text-[10px] font-bold uppercase text-slate-500 block text-center">Quick Launch Demo Accounts</span>
          <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold">
            <button
              onClick={() => setDemoUser('FARMER')}
              className={`py-1.5 rounded-xl border transition ${role === 'FARMER' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700'}`}
            >
              👨‍🌾 Farmer
            </button>
            <button
              onClick={() => setDemoUser('SELLER')}
              className={`py-1.5 rounded-xl border transition ${role === 'SELLER' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700'}`}
            >
              🏪 Seller ERP
            </button>
            <button
              onClick={() => setDemoUser('ADMIN')}
              className={`py-1.5 rounded-xl border transition ${role === 'ADMIN' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700'}`}
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-200">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            {loading ? 'Authenticating...' : 'Sign In Now'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link href="/register" className="font-bold text-emerald-600 hover:underline">
            Register Here
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto my-16 p-8 text-center text-slate-500 font-semibold">Loading portal login...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
