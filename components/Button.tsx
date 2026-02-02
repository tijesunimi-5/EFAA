"use client"
import React from 'react'





interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "emergency" | "outline";
  className?: string;
}

const Button = ({ children, variant = "primary", className = "", ...props }: ButtonProps) => {
  const variants = {
    primary: "bg-teal-700 text-white hover:bg-teal-800 shadow-md",
    emergency: "bg-rose-600 text-white hover:bg-rose-700 shadow-lg animate-pulse",
    outline: "border-2 border-teal-700 text-teal-700 hover:bg-teal-50",
  };
  return (
    <button
      className={`px-6 py-4 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 text-lg ${variants[variant]} ${className}`}
      {...props}
      >
      {children}
    </button>
  );
};

export default Button