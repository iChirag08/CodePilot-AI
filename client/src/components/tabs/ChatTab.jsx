import React, { useState } from "react";
import { MessageSquare, Send, Bot, User, Loader2, Sparkles, Code2 } from "lucide-react";

export function ChatTab({ onAskChat, isLoading, language }) {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `Hello! I'm CodePilot AI. I am bound contextually to your current ${language} code in the editor.\n\nAsk me anything about your code, performance, logic, or request conversions!`
    }
  ]);
  const [inputQuery, setInputQuery] = useState("");

  const quickPrompts = [
    "Explain this function",
    "Why is this code slow?",
    "How can I improve this?",
    "Explain potential edge cases",
    "Convert this function to TypeScript"
  ];

  const handleSend = async (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const newMessages = [...messages, { sender: "user", text: textToSend }];
    setMessages(newMessages);
    setInputQuery("");

    try {
      const response = await onAskChat(textToSend);
      setMessages([
        ...newMessages,
        { sender: "ai", text: response.answer || "No response received." }
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          sender: "ai",
          text: `⚠️ Error: ${err.message || "Failed to fetch response from CodePilot AI."}`
        }
      ]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Messages Container */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 max-w-2xl ${
              msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                msg.sender === "user"
                  ? "bg-cyan-600 text-white"
                  : "bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20"
              }`}
            >
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-3.5 rounded-2xl text-xs leading-relaxed font-sans shadow-sm ${
                msg.sender === "user"
                  ? "bg-cyan-600 text-white rounded-tr-none"
                  : "bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none whitespace-pre-wrap"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-md mr-auto">
            <div className="w-7 h-7 rounded-lg bg-cyan-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 rounded-tl-none flex items-center gap-2 text-xs text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Analyzing editor context...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800 flex items-center gap-2 overflow-x-auto select-none shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={`Ask CodePilot about your ${language} code...`}
            className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 font-sans"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputQuery.trim()}
            className="p-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl disabled:opacity-50 transition-all shadow-md shadow-cyan-600/20 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
