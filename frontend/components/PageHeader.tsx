'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Sparkles } from 'lucide-react';

interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: string;
  badgeIcon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export default function PageHeader({
  title,
  subtitle,
  badge,
  badgeIcon,
  children,
  className = '',
  breadcrumbs,
}: PageHeaderProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl sm:rounded-3xl page-header-bg text-white shadow-2xl border border-emerald-500/30 ${className}`}
    >
      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md pointer-events-none" />

      {/* Decorative ambient gradient orbs */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-16 w-60 h-60 rounded-full bg-green-500/15 blur-2xl pointer-events-none" />

      <div className="relative z-10 p-6 sm:p-8 lg:p-10 space-y-4">
        {/* Optional Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-emerald-200/80 mb-2">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-400/60" />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-white transition">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white font-medium">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 lg:gap-6">
          <div className="space-y-2 max-w-3xl">
            {badge && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold tracking-wide backdrop-blur-md shadow-inner">
                {badgeIcon || <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                <span>{badge}</span>
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-md flex flex-wrap items-center gap-2.5">
              {title}
            </h1>

            {subtitle && (
              <p className="text-xs sm:text-sm lg:text-base text-emerald-100/90 font-medium leading-relaxed max-w-2xl drop-shadow-sm">
                {subtitle}
              </p>
            )}
          </div>

          {/* Action elements / Right slot */}
          {children && (
            <div className="w-full md:w-auto flex flex-wrap items-center gap-2.5 shrink-0 pt-2 md:pt-0">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
