import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  // Professional SaaS Look: Rounded-xl, subtle interactions
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#2B3D4F]";
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base"
  };

  // Palette Mapping:
  // Primary: #3398DB (Blue)
  // Danger: #E74D3C (Red)
  // Text: #EDF1F2 (Light Gray)
  
  const variants = {
    primary: "bg-[#3398DB] hover:bg-[#2980b9] text-white shadow-lg shadow-[#3398DB]/20 border border-transparent focus:ring-[#3398DB]",
    secondary: "bg-[#1F2B3A] hover:bg-[#253345] text-[#EDF1F2] border border-white/10 hover:border-white/20 focus:ring-white/20",
    danger: "bg-[#E74D3C]/10 hover:bg-[#E74D3C]/20 text-[#E74D3C] border border-[#E74D3C]/20 focus:ring-[#E74D3C]",
    ghost: "bg-transparent hover:bg-white/5 text-[#3398DB] hover:text-[#2980b9]"
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};