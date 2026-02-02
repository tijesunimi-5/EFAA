"use client"
import { ReactNode } from "react";


const Card = ({ children, className = "", onClick, disabled = false }: { children: ReactNode; className?: string; onClick?: () => void; disabled?: boolean }) => (
  <div
    onClick={!disabled ? onClick : undefined}
    className={`bg-white rounded-3xl p-5 shadow-sm border border-slate-100 transition-all ${disabled
        ? 'opacity-60 grayscale cursor-not-allowed'
        : 'cursor-pointer hover:shadow-md hover:border-teal-200 active:scale-[0.98]'
      } ${className}`}
  >
    {children}
  </div>
);

export default Card