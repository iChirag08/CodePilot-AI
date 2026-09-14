import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { TestTube2, CheckCircle, Copy, Check, Code2 } from "lucide-react";

export function TestsTab({ testsData, isLoading, language, onCopyText }) {
  const [copiedSuite, setCopiedSuite] = useState(false);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-16 bg-slate-900 rounded-xl border border-slate-800" />
        <div className="space-y-4">
          <div className="h-24 bg-slate-900 rounded-xl border border-slate-800" />
          <div className="h-24 bg-slate-900 rounded-xl border border-slate-800" />
        </div>
      </div>
    );
  }

  if (!testsData) {
    return (
      <div className="p-8 text-center text-slate-500 text-sm">
        No unit tests generated yet. Click <strong className="text-purple-400">Generate Tests</strong>.
      </div>
    );
  }

  const handleCopyTests = () => {
    if (testsData?.fullTestFile) {
      onCopyText(testsData.fullTestFile, "Full test suite copied to clipboard!");
      setCopiedSuite(true);
      setTimeout(() => setCopiedSuite(false), 2000);
    }
  };

  const getCategoryColor = (type) => {
    const t = type?.toUpperCase();
    if (t?.includes("NORMAL")) return "bg-emerald-950/80 text-emerald-300 border-emerald-700/60";
    if (t?.includes("EDGE")) return "bg-cyan-950/80 text-cyan-300 border-cyan-700/60";
    if (t?.includes("BOUNDARY")) return "bg-purple-950/80 text-purple-300 border-purple-700/60";
    return "bg-rose-950/80 text-rose-300 border-rose-700/60";
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Test Suite Summary Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <TestTube2 className="w-4 h-4 text-purple-400" />
            <h3 className="font-semibold text-sm text-slate-200">
              Unit Test Suite ({testsData.framework || "Framework"})
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{testsData.summary}</p>
        </div>

        <button
          onClick={handleCopyTests}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition-all shrink-0 cursor-pointer"
        >
          {copiedSuite ? (
            <Check className="w-3.5 h-3.5 text-emerald-300" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          <span>Copy Full Tests</span>
        </button>
      </div>

      {/* Individual Test Cases */}
      <div className="space-y-4">
        <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-400">
          Generated Test Cases ({testsData.testCases?.length || 0})
        </h4>

        {(testsData.testCases || []).map((tc, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <h5 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                <span>{tc.title || `Test Case #${idx + 1}`}</span>
              </h5>

              <span
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${getCategoryColor(
                  tc.type
                )}`}
              >
                {tc.type || "Normal"}
              </span>
            </div>

            <p className="text-xs text-slate-300">{tc.description}</p>

            {/* Input & Output Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">
                  Input
                </span>
                <span className="text-cyan-300">{tc.input}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">
                  Expected Output
                </span>
                <span className="text-emerald-300">{tc.expectedOutput}</span>
              </div>
            </div>

            {/* Assertion Snippet */}
            {tc.codeSnippet && (
              <div className="p-2.5 rounded bg-[#1e1e1e] border border-slate-800 font-mono text-xs text-purple-300">
                <code>{tc.codeSnippet}</code>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Full Test Code File Editor View */}
      {testsData.fullTestFile && (
        <div className="space-y-3 pt-2">
          <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-purple-400" />
            Executable Test File ({testsData.framework})
          </h4>

          <div className="h-64 rounded-xl overflow-hidden border border-slate-800 bg-[#1e1e1e]">
            <Editor
              height="100%"
              language={language === "python" ? "python" : "javascript"}
              value={testsData.fullTestFile}
              theme="vs-dark"
              options={{
                readOnly: true,
                fontSize: 12.5,
                fontFamily: "'Fira Code', Consolas, monospace",
                minimap: { enabled: false }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
