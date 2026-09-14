import React from "react";
import Editor from "@monaco-editor/react";
import {
  Code,
  FileCode,
  Copy,
  Trash2,
  Search,
  Bug,
  Zap,
  TestTube2,
  Loader2,
  Check
} from "lucide-react";

const LANGUAGES = [
  { id: "javascript", label: "JavaScript (.js)" },
  { id: "typescript", label: "TypeScript (.ts)" },
  { id: "python", label: "Python (.py)" },
  { id: "java", label: "Java (.java)" },
  { id: "cpp", label: "C++ (.cpp)" },
  { id: "sql", label: "SQL (.sql)" }
];

export function EditorPanel({
  code,
  language,
  onCodeChange,
  onLanguageChange,
  filename,
  onAction,
  loadingAction,
  onCopyCode,
  onClearCode,
  copied
}) {
  const lineCount = code ? code.split("\n").length : 1;
  const charCount = code ? code.length : 0;

  return (
    <div className="h-full flex flex-col bg-slate-900 border-r border-slate-800 relative">
      {/* Editor Header Bar */}
      <div className="h-12 px-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3">
          <FileCode className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono text-slate-300 font-semibold">{filename}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1">
            <Code className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-200 outline-none cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id} className="bg-slate-900 text-slate-200">
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Copy & Clear Quick Controls */}
          <button
            onClick={onCopyCode}
            title="Copy Editor Code"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          
          <button
            onClick={onClearCode}
            title="Clear Editor Code"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Monaco Code Editor Instance */}
      <div className="flex-1 w-full bg-[#1e1e1e] relative">
        <Editor
          height="100%"
          language={language === "cpp" ? "cpp" : language}
          value={code}
          theme="vs-dark"
          onChange={(value) => onCodeChange(value || "")}
          options={{
            fontSize: 13.5,
            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            lineNumbersMinChars: 3,
            padding: { top: 12, bottom: 12 },
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on"
          }}
        />
      </div>

      {/* Action Trigger Toolbar */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0 select-none">
        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
          <span>{lineCount} lines</span>
          <span>•</span>
          <span>{charCount} chars</span>
        </div>

        {/* AI Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onAction("review")}
            disabled={Boolean(loadingAction)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {loadingAction === "review" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Search className="w-3.5 h-3.5" />
            )}
            <span>Review</span>
          </button>

          <button
            onClick={() => onAction("debug")}
            disabled={Boolean(loadingAction)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {loadingAction === "debug" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Bug className="w-3.5 h-3.5" />
            )}
            <span>Debug</span>
          </button>

          <button
            onClick={() => onAction("optimize")}
            disabled={Boolean(loadingAction)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md shadow-amber-600/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {loadingAction === "optimize" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5" />
            )}
            <span>Optimize</span>
          </button>

          <button
            onClick={() => onAction("tests")}
            disabled={Boolean(loadingAction)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {loadingAction === "tests" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <TestTube2 className="w-3.5 h-3.5" />
            )}
            <span>Tests</span>
          </button>
        </div>
      </div>
    </div>
  );
}
