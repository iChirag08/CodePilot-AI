import React from "react";
import { Sparkles, Code2, Github, Play, RotateCcw, ChevronDown, CheckCircle, AlertTriangle } from "lucide-react";
import { CODE_SAMPLES } from "../samples/codeSamples";

export function Header({
  language,
  onSelectSample,
  onResetCode,
  apiKeyConfigured,
  activeTab
}) {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white">
          <Code2 className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg text-slate-100 tracking-tight flex items-center gap-1.5">
              CodePilot <span className="text-cyan-400 font-extrabold">AI</span>
            </h1>
            <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800">
              v1.0 PORTFOLIO
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden md:block">
            AI Code Review & Debugging Assistant
          </p>
        </div>
      </div>

      {/* Center & Right Controls */}
      <div className="flex items-center gap-3">
        {/* Sample Loader Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium transition-all shadow-sm">
            <Play className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load Bugged Example</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
          </button>
          
          <div className="absolute right-0 top-full mt-1.5 w-48 py-1 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl hidden group-hover:block z-50">
            <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Select Sample Code
            </div>
            {Object.keys(CODE_SAMPLES).map((langKey) => (
              <button
                key={langKey}
                onClick={() => onSelectSample(langKey)}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-cyan-950/60 hover:text-cyan-300 flex items-center justify-between transition-colors"
              >
                <span className="capitalize">{langKey}</span>
                <span className="text-[10px] text-slate-500 font-mono">.buggy</span>
              </button>
            ))}
          </div>
        </div>

        {/* Reset Code */}
        <button
          onClick={onResetCode}
          title="Reset Editor"
          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* API Status Badge */}
        <div
          title={
            apiKeyConfigured
              ? "Gemini API Connected"
              : "Demo Mode Active (No GEMINI_API_KEY in server/.env)"
          }
          className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            apiKeyConfigured
              ? "bg-emerald-950/50 border-emerald-800/50 text-emerald-400"
              : "bg-amber-950/50 border-amber-800/50 text-amber-400"
          }`}
        >
          {apiKeyConfigured ? (
            <CheckCircle className="w-3.5 h-3.5" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5" />
          )}
          <span>{apiKeyConfigured ? "Gemini 2.5 Flash" : "Demo Engine Active"}</span>
        </div>

        {/* GitHub Repository Link */}
        <a
          href="https://github.com/iChirag08/CodePilot-AI"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-all"
        >
          <Github className="w-4 h-4 text-slate-300" />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </header>
  );
}
