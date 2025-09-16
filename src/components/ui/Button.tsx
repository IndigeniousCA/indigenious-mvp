import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-5 py-3 text-base min-h-[44px]',
    md: 'px-6 py-4 text-lg min-h-[48px]',
    lg: 'px-8 py-5 text-xl min-h-[56px]',
  };

  const variantClasses = {
    primary: 'btn-primary text-white font-semibold',
    secondary: 'btn-secondary text-white font-medium',
  };

  return (
    <button
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-lg
        transition-all
        duration-300
        relative
        overflow-hidden
        touch-manipulation
        active:scale-95
        disabled:active:scale-100
        select-none
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};