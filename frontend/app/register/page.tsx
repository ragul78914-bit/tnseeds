'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchApi } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';
import { User, Mail, Lock, Phone, MapPin, Building2, Store } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [role, setRole] = useState<'FARMER' | 'SELLER'>('FARMER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [district, setDistrict] = useState('Coimbatore');
  const [licenseNo, setLicenseNo] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          role,
          name,
          email,
          password,
          phone,
          businessName: role === 'SELLER' ? businessName : undefined,
          district,
          licenseNo: role === 'SELLER' ? licenseNo : undefined
        })
      });

      login(data);

      if (data.role === 'SELLER') router.push('/seller/dashboard');
      else router.push('/seeds');

    } catch (err: any) {
      setError(err.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-slate-50 border border-emerald-100 p-1 flex items-center justify-center mx-auto shadow-md">
            <Logo className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Create Your TNSEEDS Account</h2>
          <p className="text-xs text-slate-500">Join the Smart Seed Availability Network</p>
        </div>

        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('FARMER')}
            className={`py-2.5 rounded-xl font-bold text-xs transition ${role === 'FARMER' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'}`}
          >
            👨‍🌾 Register as Farmer
          </button>
          <button
            type="button"
            onClick={() => setRole('SELLER')}
            className={`py-2.5 rounded-xl font-bold text-xs transition ${role === 'SELLER' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'}`}
          >
            🏪 Register as Seed Seller
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-200">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block font-bold text-slate-600 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter full name"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-600 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@domain.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="9876543210"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {role === 'SELLER' && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Business / Store Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  placeholder="e.g. Sri Lakshmi Seeds & Fertilisers"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Seed License Number</label>
                <input
                  type="text"
                  value={licenseNo}
                  onChange={(e) => setLicenseNo(e.target.value)}
                  required
                  placeholder="e.g. LIC-CBE-2026-9901"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-600 mb-1">District</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Coimbatore">Coimbatore</option>
              <option value="Erode">Erode</option>
              <option value="Salem">Salem</option>
              <option value="Madurai">Madurai</option>
              <option value="Thanjavur">Thanjavur</option>
              <option value="Tiruppur">Tiruppur</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-emerald-600 hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
}
