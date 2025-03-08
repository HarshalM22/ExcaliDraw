import Link from 'next/link';
import React from 'react';
// import { Link } from 'react-router-dom';

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
};

const Button = ({ 
  children, 
  className = '',
  href, 
  variant = 'primary',
  size = 'md',
  onClick
}: ButtonProps) => {
  
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-full";
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-md hover:shadow-lg",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-primary bg-transparent text-primary hover:bg-primary/5",
    ghost: "bg-transparent text-primary hover:bg-secondary"
  };
  
  const sizes = {
    sm: "text-sm px-4 py-1.5",
    md: "text-base px-5 py-2",
    lg: "text-lg px-7 py-3"
  };
  
  const allClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;
  
  if (href) {
    return (
      <Link href={href} className={allClasses}>
        {children}
      </Link>
    );
  }
  
  return (
    <button onClick={onClick} className={allClasses}>
      {children}
    </button>
  );
};

export default Button;
