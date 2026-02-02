"use client"
import { ReactNode } from "react";

const SButton = ({
  children,
  variant = 'primary',
  className = "",
  ...props
}: {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const variants = {
    primary: "bg-teal-700 text-white hover:bg-teal-800 shadow-md",
    secondary: "bg-white text-teal-700 border-2 border-teal-700 hover:bg-teal-50",
    ghost: "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
  };

  return (
    <button
      {...props}
      className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default SButton;