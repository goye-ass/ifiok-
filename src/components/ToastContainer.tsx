import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${
              isSuccess
                ? 'border-emerald-500/40 bg-[#0E2A27]/95 text-emerald-100'
                : isError
                ? 'border-red-500/40 bg-[#2D1318]/95 text-red-100'
                : isWarning
                ? 'border-amber-500/40 bg-[#2D210F]/95 text-amber-100'
                : 'border-white/10 bg-[#131E3A]/95 text-slate-100'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
              {isError && <AlertCircle className="h-5 w-5 text-red-400" />}
              {isWarning && <AlertTriangle className="h-5 w-5 text-amber-400" />}
              {!isSuccess && !isError && !isWarning && <Info className="h-5 w-5 text-blue-400" />}
            </div>

            <div className="flex-1 pr-2">
              <h5 className="text-sm font-semibold leading-tight">{toast.title}</h5>
              <p className="mt-1 text-xs opacity-90 leading-relaxed">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-white/50 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
