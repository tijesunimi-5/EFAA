"use client"
import { ReactNode } from "react";


const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`bg-white rounded-3xl p-8 shadow-sm border border-slate-100 ${className}`}>
    {children}
  </div>
);

export default Card