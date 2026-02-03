"use client"

const TButton = ({
  children,
  onClick,
  variant = 'primary',
  className = "",
  disabled = false
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  disabled?: boolean;
}) => {
  const variants = {
    primary: "bg-teal-700 text-white hover:bg-teal-800 shadow-md",
    secondary: "bg-slate-800 text-white hover:bg-slate-900 shadow-md",
    outline: "border-2 border-teal-700 text-teal-700 hover:bg-teal-50",
    ghost: "text-slate-500 hover:bg-slate-100"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-4 rounded-2xl font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default TButton