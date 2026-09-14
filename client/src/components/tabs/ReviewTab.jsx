import React, { useState } from "react";
import {
  ShieldAlert,
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  Filter,
  Check
} from "lucide-react";

export function ReviewTab({ reviewData, isLoading }) {
  const [filterSeverity, setFilterSeverity] = useState("ALL");

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-28 bg-slate-900 rounded-2xl border border-slate-800" />
        <div className="h-20 bg-slate-900 rounded-xl border border-slate-800" />
        <div className="space-y-4">
          <div className="h-24 bg-slate-900 rounded-xl border border-slate-800" />
          <div className="h-24 bg-slate-900 rounded-xl border border-slate-800" />
        </div>
      </div>
    );
  }

  if (!reviewData) {
    return (
      <div className="p-8 text-center text-slate-500 text-sm">
        No code review generated yet. Click <strong className="text-cyan-400">Review Code</strong> to analyze.
      </div>
    );
  }

  const score = reviewData.score ?? 75;
  const issues = reviewData.issues || [];

  const filteredIssues = issues.filter((issue) => {
    if (filterSeverity === "ALL") return true;
    return issue.severity?.toUpperCase() === filterSeverity;
  });

  const getScoreColor = (val) => {
    if (val >= 80) return "text-emerald-400 border-emerald-500/30 bg-emerald-950/30";
    if (val >= 50) return "text-amber-400 border-amber-500/30 bg-amber-950/30";
    return "text-rose-400 border-rose-500/30 bg-rose-950/30";
  };

  const getSeverityBadge = (severity) => {
    const s = severity?.toUpperCase();
    switch (s) {
      case "CRITICAL":
        return {
          bg: "bg-rose-950/80 text-rose-300 border-rose-700/60",
          icon: AlertOctagon
        };
      case "HIGH":
        return {
          bg: "bg-orange-950/80 text-orange-300 border-orange-700/60",
          icon: ShieldAlert
        };
      case "MEDIUM":
        return {
          bg: "bg-amber-950/80 text-amber-300 border-amber-700/60",
          icon: AlertTriangle
        };
      default:
        return {
          bg: "bg-blue-950/80 text-blue-300 border-blue-700/60",
          icon: Info
        };
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Top Score Banner */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            Overall Quality Score
          </span>
          <p className="text-xs text-slate-300 max-w-md leading-relaxed">{reviewData.summary}</p>
        </div>

        {/* Circular / Box Score Gauge */}
        <div
          className={`flex flex-col items-center justify-center p-4 rounded-xl border min-w-24 text-center ${getScoreColor(
            score
          )}`}
        >
          <span className="text-3xl font-black font-mono tracking-tight">{score}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">/ 100</span>
        </div>
      </div>

      {/* Metrics Row */}
      {reviewData.metrics && (
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] uppercase text-slate-500 font-semibold mb-1">
              Maintainability
            </div>
            <div className="text-xs font-bold text-slate-200">
              {reviewData.metrics.maintainability || "Good"}
            </div>
          </div>
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] uppercase text-slate-500 font-semibold mb-1">
              Performance
            </div>
            <div className="text-xs font-bold text-slate-200">
              {reviewData.metrics.performance || "Optimal"}
            </div>
          </div>
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] uppercase text-slate-500 font-semibold mb-1">Security</div>
            <div className="text-xs font-bold text-slate-200">
              {reviewData.metrics.security || "Secure"}
            </div>
          </div>
        </div>
      )}

      {/* Issues Header & Filter Buttons */}
      <div className="flex items-center justify-between pt-2">
        <h3 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
          <span>Identified Issues</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
            {issues.length}
          </span>
        </h3>

        {/* Severity Filter */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <Filter className="w-3 h-3 text-slate-500 ml-1.5" />
          {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterSeverity(lvl)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                filterSeverity === lvl
                  ? "bg-cyan-600 text-white font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Issues Cards */}
      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs bg-slate-900/50 rounded-xl border border-slate-800">
            No issues found matching severity filter "{filterSeverity}".
          </div>
        ) : (
          filteredIssues.map((issue, idx) => {
            const badge = getSeverityBadge(issue.severity);
            const SeverityIcon = badge.icon;

            return (
              <div
                key={issue.id || idx}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                      <span>{issue.title}</span>
                      {issue.lineNumber && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {issue.lineNumber}
                        </span>
                      )}
                    </h4>
                    {issue.category && (
                      <span className="text-[10px] text-cyan-400 uppercase font-mono font-medium">
                        Category: {issue.category}
                      </span>
                    )}
                  </div>

                  {/* Severity Badge */}
                  <div
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${badge.bg}`}
                  >
                    <SeverityIcon className="w-3 h-3" />
                    <span>{issue.severity}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{issue.explanation}</p>

                {/* Fix Recommendation */}
                {issue.recommendation && (
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Recommended Fix
                    </span>
                    <p className="text-slate-300 font-mono text-[11px] leading-relaxed">
                      {issue.recommendation}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
