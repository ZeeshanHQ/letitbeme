import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'pure' | 'glass' | 'subtle' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'pure',
  padding = 'lg',
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-200';

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-7 sm:p-8',
    xl: 'p-8 sm:p-10',
  };

  const variantStyles = {
    pure: 'bg-white border border-slate-200/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)]',
    glass: 'bg-white/85 backdrop-blur-xl border border-white/60 shadow-[0_12px_36px_-8px_rgba(15,23,42,0.06)]',
    subtle: 'bg-slate-50/70 border border-slate-200/50',
    interactive: 'bg-white border border-slate-200/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-indigo-200 hover:shadow-[0_16px_36px_-12px_rgba(99,102,241,0.1)] cursor-pointer',
  };

  return (
    <div
      className={twMerge(clsx(baseStyles, paddingStyles[padding], variantStyles[variant], className))}
      {...props}
    >
      {children}
    </div>
  );
};
