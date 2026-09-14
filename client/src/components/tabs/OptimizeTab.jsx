import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Zap, Clock, HardDrive, Copy, Check, RefreshCw } from "lucide-react";

export function OptimizeTab({
  optimizeData,
  isLoading,
  originalCode,
  language,
  onReplaceEditorCode,
  onCopyText
}) {
  const [activeView, setActiveView] = useState("OPTIMIZED"); // 'OPTIMIZED' | 'BEFORE_AFTER'
  const [copiedOpt, setCopiedOpt] = useState(false);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-20 bg-slate-900 rounded-xl border border-slate-800" />
        <div className="grid grid-cols-2 gap-4 h-24 bg-slate-900 rounded-xl border border-slate-800" />
        <div className="h-64 bg-slate-900 rounded-xl border border-slate-800" />
      </div>
    );
  }

  if (!optimizeData) {
    return (
      <div className="p-8 text-center text-slate-500 text-sm">
        No optimization generated yet. Click <strong className="text-amber-400">Optimize Code</strong>.
      </div>
    );
  }

  const handleCopyOpt = () => {
    if (optimizeData?.optimizedCode) {
      onCopyText(optimizeData.optimizedCode, "Optimized code copied to clipboard!");
      setCopiedOpt(true);
      setTimeout(() => setCopiedOpt(false), 2000);
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* High level summary */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
        <span className="text-[10px] uppercase font-bold text-amber-400">Optimization Summary</span>
        <p className="text-xs text-slate-300 leading-relaxed">{optimizeData.summary}</p>
      </div>

      {/* Complexity Comparison Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Time Complexity */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Time Complexity</span>
          </div>
          <div className="flex items-center justify-between font-mono text-xs">
            <div className="p-2 rounded bg-rose-950/50 border border-rose-800/40 text-rose-300">
              <span className="text-[10px] text-slate-500 block">BEFORE</span>
              <span className="font-bold">{optimizeData.timeComplexityBefore || "O(N^2)"}</span>
            </div>
            <span className="text-slate-500 font-bold">➔</span>
            <div className="p-2 rounded bg-emerald-950/50 border border-emerald-800/40 text-emerald-300">
              <span className="text-[10px] text-slate-500 block">AFTER</span>
              <span className="font-bold">{optimizeData.timeComplexityAfter || "O(N)"}</span>
            </div>
          </div>
        </div>

        {/* Space Complexity */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <HardDrive className="w-4 h-4 text-purple-400" />
            <span>Space Complexity</span>
          </div>
          <div className="flex items-center justify-between font-mono text-xs">
            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-400">
              <span className="text-[10px] text-slate-500 block">BEFORE</span>
              <span className="font-bold">{optimizeData.spaceComplexityBefore || "O(N)"}</span>
            </div>
            <span className="text-slate-500 font-bold">➔</span>
            <div className="p-2 rounded bg-emerald-950/50 border border-emerald-800/40 text-emerald-300">
              <span className="text-[10px] text-slate-500 block">AFTER</span>
              <span className="font-bold">{optimizeData.spaceComplexityAfter || "O(1)"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Improvements Lists */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Applied Refactorings
        </h4>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          {optimizeData.performanceImprovements?.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
          {optimizeData.readabilityImprovements?.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
              <Check className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Optimized Code Display & Controls */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveView("OPTIMIZED")}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                activeView === "OPTIMIZED"
                  ? "bg-amber-600 text-white font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Optimized Code
            </button>
            <button
              onClick={() => setActiveView("BEFORE_AFTER")}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                activeView === "BEFORE_AFTER"
                  ? "bg-amber-600 text-white font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Side-by-Side (Before / After)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyOpt}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition-colors"
            >
              {copiedOpt ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>Copy</span>
            </button>

            <button
              onClick={() => onReplaceEditorCode(optimizeData.optimizedCode)}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md shadow-amber-600/20 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace Editor Code</span>
            </button>
          </div>
        </div>

        {/* Monaco Viewer */}
        {activeView === "OPTIMIZED" ? (
          <div className="h-72 rounded-xl overflow-hidden border border-slate-800 bg-[#1e1e1e]">
            <Editor
              height="100%"
              language={language === "cpp" ? "cpp" : language}
              value={optimizeData.optimizedCode}
              theme="vs-dark"
              options={{
                readOnly: true,
                fontSize: 13,
                fontFamily: "'Fira Code', Consolas, monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-72">
            <div className="flex flex-col border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-3 py-1.5 bg-rose-950/60 text-rose-300 font-mono text-[10px] font-bold border-b border-slate-800">
                BEFORE (Original)
              </div>
              <div className="flex-1 bg-[#1e1e1e]">
                <Editor
                  height="100%"
                  language={language === "cpp" ? "cpp" : language}
                  value={originalCode}
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    fontSize: 12,
                    fontFamily: "'Fira Code', Consolas, monospace",
                    minimap: { enabled: false }
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-3 py-1.5 bg-emerald-950/60 text-emerald-300 font-mono text-[10px] font-bold border-b border-slate-800">
                AFTER (Optimized)
              </div>
              <div className="flex-1 bg-[#1e1e1e]">
                <Editor
                  height="100%"
                  language={language === "cpp" ? "cpp" : language}
                  value={optimizeData.optimizedCode}
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    fontSize: 12,
                    fontFamily: "'Fira Code', Consolas, monospace",
                    minimap: { enabled: false }
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
