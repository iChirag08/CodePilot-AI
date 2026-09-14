import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { EditorPanel } from "./components/EditorPanel";
import { StatusBar } from "./components/StatusBar";
import { EmptyState } from "./components/EmptyState";
import { Toast } from "./components/Toast";
import { ReviewTab } from "./components/tabs/ReviewTab";
import { DebugTab } from "./components/tabs/DebugTab";
import { OptimizeTab } from "./components/tabs/OptimizeTab";
import { TestsTab } from "./components/tabs/TestsTab";
import { ChatTab } from "./components/tabs/ChatTab";
import { CODE_SAMPLES } from "./samples/codeSamples";
import { api } from "./services/api";
import { Search, Bug, Zap, TestTube2, MessageSquare } from "lucide-react";

export default function App() {
  // App Core State
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(CODE_SAMPLES.javascript.code);
  const [filename, setFilename] = useState(CODE_SAMPLES.javascript.filename);
  
  // Right Panel Tabs: 'review' | 'debug' | 'optimize' | 'tests' | 'chat'
  const [activeTab, setActiveTab] = useState("review");
  const [hasRunAnalysis, setHasRunAnalysis] = useState(false);

  // Analysis Data State
  const [reviewData, setReviewData] = useState(null);
  const [debugData, setDebugData] = useState(null);
  const [optimizeData, setOptimizeData] = useState(null);
  const [testsData, setTestsData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Loading & Network State
  const [loadingAction, setLoadingAction] = useState(null); // 'review' | 'debug' | 'optimize' | 'tests' | 'chat'
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  const [statusText, setStatusText] = useState("Ready");
  const [latency, setLatency] = useState(0);
  
  // UI Helpers
  const [toast, setToast] = useState(null);
  const [copied, setCopied] = useState(false);

  // Check Backend Health on Mount
  useEffect(() => {
    async function checkHealth() {
      const health = await api.getHealth();
      setApiKeyConfigured(Boolean(health.apiKeyConfigured));
    }
    checkHealth();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Language Change Handler
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    const sample = CODE_SAMPLES[newLang];
    if (sample) {
      setCode(sample.code);
      setFilename(sample.filename);
      showToast(`Switched language to ${newLang.toUpperCase()}`, "info");
    } else {
      setFilename(`code.${newLang}`);
    }
  };

  // Select Sample Code
  const handleSelectSample = (langKey) => {
    const sample = CODE_SAMPLES[langKey];
    if (sample) {
      setLanguage(sample.language);
      setCode(sample.code);
      setFilename(sample.filename);
      showToast(`Loaded buggy sample code for ${langKey.toUpperCase()}`, "success");
    }
  };

  // Reset / Clear Code
  const handleResetCode = () => {
    setCode("");
    setHasRunAnalysis(false);
    setReviewData(null);
    setDebugData(null);
    setOptimizeData(null);
    setTestsData(null);
    showToast("Editor cleared", "info");
  };

  const handleCopyCode = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    showToast("Editor code copied to clipboard", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  // Unified AI Action Dispatcher
  const handleAction = async (actionType) => {
    if (!code.trim()) {
      showToast("Please enter or paste code first!", "error");
      return;
    }

    setLoadingAction(actionType);
    setActiveTab(actionType);
    setHasRunAnalysis(true);
    setStatusText(`Running ${actionType} analysis...`);
    const startTime = Date.now();

    try {
      if (actionType === "review") {
        const res = await api.reviewCode(code, language);
        setReviewData(res);
        showToast("Code Review Complete!", "success");
      } else if (actionType === "debug") {
        const res = await api.debugCode(code, language, errorMessage);
        setDebugData(res);
        showToast("Bug Diagnostics Complete!", "success");
      } else if (actionType === "optimize") {
        const res = await api.optimizeCode(code, language);
        setOptimizeData(res);
        showToast("Code Optimization Analysis Complete!", "success");
      } else if (actionType === "tests") {
        const res = await api.generateTests(code, language);
        setTestsData(res);
        showToast("Unit Test Suite Generated!", "success");
      }
    } catch (err) {
      showToast(err.message || "Failed to complete AI request", "error");
      console.error(`Error in ${actionType}:`, err);
    } finally {
      setLoadingAction(null);
      setStatusText("Ready");
      setLatency(Date.now() - startTime);
    }
  };

  // Apply Fix from Debug panel directly into Monaco Editor
  const handleApplyFix = (fixedCode) => {
    setCode(fixedCode);
    showToast("Applied fix to editor code!", "success");
  };

  // Replace Editor code with Optimized version
  const handleReplaceEditorCode = (optimizedCode) => {
    setCode(optimizedCode);
    showToast("Replaced editor code with optimized version!", "success");
  };

  // Ask Chat Handler
  const handleAskChat = async (userQuestion) => {
    setLoadingAction("chat");
    setStatusText("CodePilot AI is thinking...");
    const startTime = Date.now();
    try {
      const res = await api.askChat(code, language, userQuestion);
      return res;
    } finally {
      setLoadingAction(null);
      setStatusText("Ready");
      setLatency(Date.now() - startTime);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <Header
        language={language}
        onSelectSample={handleSelectSample}
        onResetCode={handleResetCode}
        apiKeyConfigured={apiKeyConfigured}
        activeTab={activeTab}
      />

      {/* Main 2-Column Responsive Workspace */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Column: Monaco Code Editor Panel */}
        <section className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col">
          <EditorPanel
            code={code}
            language={language}
            onCodeChange={setCode}
            onLanguageChange={handleLanguageChange}
            filename={filename}
            onAction={handleAction}
            loadingAction={loadingAction}
            onCopyCode={handleCopyCode}
            onClearCode={handleResetCode}
            copied={copied}
          />
        </section>

        {/* Right Column: AI Analysis Panel */}
        <section className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col bg-slate-950 border-t md:border-t-0 md:border-l border-slate-800">
          {/* Navigation Tabs Header */}
          <div className="h-12 bg-slate-900 border-b border-slate-800 px-3 flex items-center gap-1 overflow-x-auto shrink-0 select-none">
            <button
              onClick={() => setActiveTab("review")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "review"
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Review</span>
            </button>

            <button
              onClick={() => setActiveTab("debug")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "debug"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <Bug className="w-3.5 h-3.5" />
              <span>Debug</span>
            </button>

            <button
              onClick={() => setActiveTab("optimize")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "optimize"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Optimize</span>
            </button>

            <button
              onClick={() => setActiveTab("tests")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "tests"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <TestTube2 className="w-3.5 h-3.5" />
              <span>Tests</span>
            </button>

            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "chat"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask CodePilot</span>
            </button>
          </div>

          {/* Tab Content Container */}
          <div className="flex-1 overflow-hidden relative">
            {!hasRunAnalysis && activeTab !== "chat" ? (
              <EmptyState onSelectSample={handleSelectSample} />
            ) : (
              <>
                {activeTab === "review" && (
                  <ReviewTab
                    reviewData={reviewData}
                    isLoading={loadingAction === "review"}
                  />
                )}

                {activeTab === "debug" && (
                  <DebugTab
                    debugData={debugData}
                    isLoading={loadingAction === "debug"}
                    language={language}
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                    onRunDebug={() => handleAction("debug")}
                    onApplyFix={handleApplyFix}
                    onCopyText={(txt, msg) => {
                      navigator.clipboard.writeText(txt);
                      showToast(msg, "success");
                    }}
                  />
                )}

                {activeTab === "optimize" && (
                  <OptimizeTab
                    optimizeData={optimizeData}
                    isLoading={loadingAction === "optimize"}
                    originalCode={code}
                    language={language}
                    onReplaceEditorCode={handleReplaceEditorCode}
                    onCopyText={(txt, msg) => {
                      navigator.clipboard.writeText(txt);
                      showToast(msg, "success");
                    }}
                  />
                )}

                {activeTab === "tests" && (
                  <TestsTab
                    testsData={testsData}
                    isLoading={loadingAction === "tests"}
                    language={language}
                    onCopyText={(txt, msg) => {
                      navigator.clipboard.writeText(txt);
                      showToast(msg, "success");
                    }}
                  />
                )}

                {activeTab === "chat" && (
                  <ChatTab
                    onAskChat={handleAskChat}
                    isLoading={loadingAction === "chat"}
                    language={language}
                  />
                )}
              </>
            )}
          </div>
        </section>
      </main>

      {/* Bottom Status Bar */}
      <StatusBar
        language={language}
        apiKeyConfigured={apiKeyConfigured}
        statusText={statusText}
        latency={latency}
      />
    </div>
  );
}
