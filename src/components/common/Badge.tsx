import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'indigo' | 'cyan' | 'emerald' | 'rose' | 'amber' | 'neutral' | 'live';
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'indigo',
  size = 'md',
  pulse = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full tracking-wide select-none';

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const variantStyles = {
    indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200/60',
    cyan: 'bg-cyan-50 text-cyan-700 border border-cyan-200/60',
    emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    rose: 'bg-rose-50 text-rose-700 border border-rose-200/60',
    amber: 'bg-amber-50 text-amber-800 border border-amber-200/60',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200/80',
    live: 'bg-rose-500/10 text-rose-600 border border-rose-500/30 font-semibold',
  };

  return (
    <span
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
      {...props}
    >
      {(pulse || variant === 'live') && (
        <span className="relative flex h-2 w-2">
          <span className={clsx("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", variant === 'live' ? 'bg-rose-500' : 'bg-current')} />
          <span className={clsx("relative inline-flex rounded-full h-2 w-2", variant === 'live' ? 'bg-rose-600' : 'bg-current')} />
        </span>
      )}
      {children}
    </span>
  );
};
