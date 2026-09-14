import React from "react";
import { Search, Bug, Zap, TestTube2, Sparkles, Play } from "lucide-react";

export function EmptyState({ onSelectSample }) {
  const features = [
    {
      icon: Search,
      color: "text-cyan-400 border-cyan-500/20 bg-cyan-950/40",
      title: "Code Review",
      desc: "Instant 0–100 quality scoring, security flaw detection, and severity-ranked recommendations."
    },
    {
      icon: Bug,
      color: "text-rose-400 border-rose-500/20 bg-rose-950/40",
      title: "Bug Detection",
      desc: "Deep root-cause diagnostics with single-click automated code fixes in Monaco editor."
    },
    {
      icon: Zap,
      color: "text-amber-400 border-amber-500/20 bg-amber-950/40",
      title: "Code Optimization",
      desc: "Side-by-side BEFORE vs AFTER diffs with Big-O time & space complexity analysis."
    },
    {
      icon: TestTube2,
      color: "text-purple-400 border-purple-500/20 bg-purple-950/40",
      title: "Test Case Generator",
      desc: "Automated unit tests covering boundary conditions, edge cases, and invalid inputs."
    }
  ];

  return (
    <div className="h-full overflow-y-auto p-6 flex flex-col items-center justify-center text-center max-w-3xl mx-auto my-auto">
      {/* Sparkles Icon Header */}
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/20 text-white mb-5">
        <Sparkles className="w-7 h-7 animate-pulse" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mb-2">
        Analyze your code with <span className="text-cyan-400">AI</span>
      </h2>
      <p className="text-sm text-slate-400 max-w-lg mb-8 leading-relaxed">
        Review, debug, optimize, and generate test suites for your code with an interactive AI-powered developer assistant.
      </p>

      {/* 4 Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8 text-left">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all hover:shadow-lg"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg border ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-slate-200">{item.title}</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* CTA Button */}
      <button
        onClick={() => onSelectSample("javascript")}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-xl shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
      >
        <Play className="w-4 h-4 fill-white" />
        <span>Try Example Buggy Code</span>
      </button>
    </div>
  );
}
