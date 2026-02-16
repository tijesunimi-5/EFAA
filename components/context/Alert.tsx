"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

type AlertType = 'info' | 'success' | 'error' | 'warning';

interface Alert {
  id: number;
  message: string;
  type: AlertType;
}

interface AlertContextType {
  showAlert: (message: string, type?: AlertType) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const showAlert = (message: string, type: AlertType = 'info') => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, 4000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      {/* --- Animated Pop-up Container (Bottom Right) --- */}
      <div className="fixed bottom-6 right-6 z-9999 flex flex-col gap-3 pointer-events-none">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`
              pointer-events-auto flex items-center gap-3 p-4 rounded-2xl shadow-2xl border min-w-75 max-w-md
              animate-in fade-in slide-in-from-right-8 duration-300
              ${alert.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-800' :
                alert.type === 'success' ? 'bg-teal-50 border-teal-100 text-teal-800' :
                  'bg-white border-slate-100 text-slate-800'}
            `}
          >
            {alert.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            <p className="flex-1 font-bold text-sm leading-tight">{alert.message}</p>
            <button onClick={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}>
              <X className="w-4 h-4 opacity-40 hover:opacity-100" />
            </button>
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error("useAlert must be used within AlertProvider");
  return context;
};