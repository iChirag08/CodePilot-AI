import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === "success";
  const isError = toast.type === "error";

  return (
    <div className="fixed bottom-12 right-6 z-50 animate-bounce transition-all duration-300 max-w-sm w-full">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md ${
          isSuccess
            ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-100 shadow-emerald-900/30"
            : isError
            ? "bg-rose-950/90 border-rose-500/40 text-rose-100 shadow-rose-900/30"
            : "bg-cyan-950/90 border-cyan-500/40 text-cyan-100 shadow-cyan-900/30"
        }`}
      >
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
        {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />}
        
        <div className="flex-1 text-sm font-medium leading-relaxed">
          {toast.message}
        </div>
        
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
