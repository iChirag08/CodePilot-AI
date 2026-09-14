import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Bug,
  AlertCircle,
  Check,
  Copy,
  ArrowRight,
  Trash2,
  Send,
  Lightbulb
} from "lucide-react";

export function DebugTab({
  debugData,
  isLoading,
  language,
  errorMessage,
  setErrorMessage,
  onRunDebug,
  onApplyFix,
  onCopyText
}) {
  const [copiedFix, setCopiedFix] = useState(false);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-16 bg-slate-900 rounded-xl border border-slate-800" />
        <div className="h-32 bg-slate-900 rounded-xl border border-slate-800" />
        <div className="h-64 bg-slate-900 rounded-xl border border-slate-800" />
      </div>
    );
  }

  const handleCopyFix = () => {
    if (debugData?.fixedCode) {
      onCopyText(debugData.fixedCode, "Fixed code copied to clipboard!");
      setCopiedFix(true);
      setTimeout(() => setCopiedFix(false), 2000);
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Error Message Input Ingestion */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            Optional Error Message / Stack Trace
          </span>
          <span className="text-[10px] text-slate-500 font-mono">paste compiler output</span>
        </label>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={errorMessage}
            onChange={(e) => setErrorMessage(e.target.value)}
            placeholder="e.g. TypeError: Cannot read properties of undefined (reading 'email')"
            className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-rose-500/50 font-mono"
          />
          <button
            onClick={onRunDebug}
            className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-md shadow-rose-600/20 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Debug</span>
          </button>
        </div>
      </div>

      {!debugData ? (
        <div className="p-8 text-center text-slate-500 text-sm">
          No debugging analysis generated yet. Click <strong className="text-rose-400">Debug Code</strong>.
        </div>
      ) : (
        <>
          {/* Debug Summary */}
          {debugData.summary && (
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 text-xs text-rose-200 leading-relaxed font-mono">
              <strong className="text-rose-400 block mb-1">Diagnostic Summary:</strong>
              {debugData.summary}
            </div>
          )}

          {/* Identified Bugs */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
              <Bug className="w-4 h-4 text-rose-400" />
              <span>Identified Bugs & Root Causes</span>
            </h3>

            {(debugData.bugsIdentified || []).map((bug, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3"
              >
                <h4 className="font-semibold text-sm text-slate-100">{bug.title}</h4>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Root Cause</span>
                  <p className="text-xs text-slate-300">{bug.rootCause}</p>
                </div>

                {bug.problematicSnippet && (
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 font-mono text-xs text-rose-300">
                    <span className="text-[10px] text-slate-500 block mb-1">Problematic Section:</span>
                    <code>{bug.problematicSnippet}</code>
                  </div>
                )}

                <div className="space-y-1 text-xs text-slate-300">
                  <strong className="text-slate-200">Explanation:</strong> {bug.explanation}
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300">
                  <strong className="text-emerald-400">Recommended Solution:</strong> {bug.solution}
                </div>
              </div>
            ))}
          </div>

          {/* Fixed Code Monaco Panel */}
          {debugData.fixedCode && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Generate Fixed Code</span>
                </h3>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyFix}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition-colors"
                  >
                    {copiedFix ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>Copy</span>
                  </button>

                  <button
                    onClick={() => onApplyFix(debugData.fixedCode)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>Apply Fix to Editor</span>
                  </button>
                </div>
              </div>

              <div className="h-64 rounded-xl overflow-hidden border border-slate-800 bg-[#1e1e1e]">
                <Editor
                  height="100%"
                  language={language === "cpp" ? "cpp" : language}
                  value={debugData.fixedCode}
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
            </div>
          )}

          {/* Prevention Tips */}
          {debugData.preventionTips && debugData.preventionTips.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" /> Proactive Prevention Tips
              </span>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                {debugData.preventionTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
