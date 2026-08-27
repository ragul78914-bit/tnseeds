'use client';

import React from 'react';

export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 overflow-hidden ${className}`}>
      <img
        src="/logo.jpg"
        alt="TNSEEDS Official Logo"
        className="w-full h-full object-contain rounded-full border border-emerald-900/10 shadow-sm"
      />
    </div>
  );
}
