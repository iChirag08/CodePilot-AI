import React from "react";
import { Cpu, Terminal, Clock, Activity } from "lucide-react";

export function StatusBar({ language, apiKeyConfigured, statusText, latency }) {
  return (
    <footer className="h-8 bg-slate-950 border-t border-slate-800 px-4 flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0 select-none z-20">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-cyan-400">
          <Terminal className="w-3.5 h-3.5" />
          <span className="uppercase font-semibold tracking-wider">{language}</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-slate-500" />
          <span>Provider: {apiKeyConfigured ? "Google Gemini 2.5 Flash" : "Demo Mode"}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {latency > 0 && (
          <div className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>{latency}ms</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-slate-300">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>{statusText || "System Ready"}</span>
        </div>
      </div>
    </footer>
  );
}
