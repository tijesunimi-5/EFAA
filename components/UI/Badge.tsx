"use client"

const Badge = ({ children, variant = 'slate' }: { children: string; variant?: 'teal' | 'rose' | 'slate' | 'amber' }) => {
  const variants = {
    teal: "bg-teal-50 text-teal-700 border-teal-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    slate: "bg-slate-50 text-slate-600 border-slate-200"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${variants[variant]}`}>
      {children}
    </span>
  );
};


export default Badge