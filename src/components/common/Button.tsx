import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'solar' | 'cyan' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-heading font-semibold transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.97] active:translate-y-0.5 cursor-pointer';

  const variantStyles = {
    // 3D Solar Glassmorphic Button with Inner Highlight & Ambient Drop Shadow
    primary: 'bg-gradient-to-b from-[#FF7A1A] via-[#FF6B00] to-[#E65100] hover:from-[#FF852E] hover:to-[#EB5A00] text-white border-t border-white/35 shadow-[0_8px_20px_-4px_rgba(255,107,0,0.45),0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:shadow-[0_12px_28px_-4px_rgba(255,107,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.5)]',
    
    solar: 'bg-gradient-to-b from-[#FF7A1A] via-[#FF6B00] to-[#E65100] text-white border-t border-white/35 shadow-[0_8px_20px_-4px_rgba(255,107,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:shadow-[0_12px_28px_-4px_rgba(255,107,0,0.55)]',
    
    // 3D Frosted Pearl Translucent Button
    secondary: 'bg-white/95 backdrop-blur-xl text-obsidian border border-slate-200/90 shadow-[0_4px_14px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)] hover:bg-white hover:border-slate-300 hover:shadow-[0_8px_22px_rgba(0,0,0,0.08)]',
    
    glass: 'bg-white/80 backdrop-blur-xl text-obsidian border border-white/60 shadow-[0_4px_14px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.9)] hover:bg-white',
    
    outline: 'bg-transparent hover:bg-solar-50/50 text-solar-600 border border-solar-300/80 shadow-sm',
    
    ghost: 'bg-transparent hover:bg-slate-100/70 text-slate-700',
    
    cyan: 'bg-gradient-to-b from-amber-400 to-solar-500 text-obsidian font-bold border-t border-white/40 shadow-[0_6px_18px_rgba(245,158,11,0.35)]',
  };

  const sizeStyles = {
    sm: 'text-xs px-4 py-1.5 rounded-full gap-1.5',
    md: 'text-xs sm:text-sm px-6 py-2.5 rounded-full gap-2',
    lg: 'text-sm sm:text-base px-7 py-3 rounded-full gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!isLoading && leftIcon}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
