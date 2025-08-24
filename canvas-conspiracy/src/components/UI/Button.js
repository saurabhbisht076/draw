import React from 'react';

const Button = ({ variant = 'primary', size = 'md', children, className = "", ...props }) => {
  const baseClasses = "font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg",
    secondary: "bg-gray-700 hover:bg-gray-600 text-white shadow-md",
    outline: "border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white",
    danger: "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;