
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Sun, Moon, Send, Bot, User, Sparkles, Copy, Check } from 'lucide-react';

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm Neo your AI assistant. How can I help you today?", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to the bottom when a new message arrives
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Adjust input textarea height automatically based on typed text lines
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [input]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    
    // 1. Append user message to UI
    setMessages((prev) => [...prev, { id: Date.now(), text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      // 2. Axios Call
      const response = await axios.post('http://localhost:3000/api/chat/response', { 
        message: userMessage 
      });

      const aiReply = response.data || "No reply field found in response. check your server backend output format.";
      
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: aiReply, isUser: false }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [
        ...prev, 
        { id: Date.now() + 1, text: "Sorry, I encountered an error. Please try again later.", isUser: false }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for Enter key press (Send) vs Shift+Enter (New line)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Copy utility logic function
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className={`flex flex-col h-screen w-full transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* HEADER */}
      <header className={`flex items-center justify-between px-4 py-3 border-b sticky top-0 z-50 ${darkMode ? 'bg-slate-900/80 border-slate-800/80 backdrop-blur-md' : 'bg-white/80 border-slate-200 backdrop-blur-md'}`}>
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl ${darkMode ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-100 text-indigo-600'}`}>
            <Bot size={22} />
          </div>
          <div>
            <h1 className="text-base font-semibold flex items-center gap-1.5">
              Neo AI Assistant
              <Sparkles size={14} className="text-amber-400 animate-pulse" />
            </h1>
            <p className="text-xs text-emerald-500 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
              Online
            </p>
          </div>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-xl transition-all duration-200 border ${darkMode ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'}`}
          aria-label="Toggle Theme"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      {/* CHAT WINDOW */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-5 max-w-2xl w-full mx-auto scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 w-full ${msg.isUser ? 'justify-end' : 'justify-start'}`}
          >
            {!msg.isUser && (
              <div className={`p-1.5 rounded-lg shrink-0 mb-1 border ${darkMode ? 'bg-slate-900 border-slate-800 text-indigo-400' : 'bg-slate-200 border-slate-300 text-indigo-600'}`}>
                <Bot size={16} />
              </div>
            )}

            {/* 3D Bubble Container */}
            <div
              className={`group relative max-w-[80%] pl-4 pr-10 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap wrap-break-word transition-all duration-200
                ${msg.isUser 
                  ? 'bg-linear-to-b from-indigo-500 to-indigo-600 text-white rounded-br-none shadow-[0_4px_12px_rgba(79,70,229,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] border border-indigo-500' 
                  : (darkMode 
                      ? 'bg-linear-to-b from-slate-900 to-slate-900 text-slate-200 rounded-bl-none shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] border border-slate-800/80' 
                      : 'bg-linear-to-b from-white to-slate-50 text-slate-800 rounded-bl-none shadow-[0_4px_10px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] border border-slate-200')
                }`}
            >
              <div>{msg.text}</div>

              {/* Updated Copy Button Positioned at Top Right */}
              <button
                onClick={() => copyToClipboard(msg.text, msg.id)}
                className={`absolute top-2 right-2 p-1.5 rounded-lg transition-all backdrop-blur-sm border cursor-pointer
                  ${msg.isUser 
                    ? 'bg-white/10 border-white/10 text-indigo-200 hover:text-white hover:bg-white/20' 
                    : (darkMode 
                        ? 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800' 
                        : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-200')
                  }`}
                title="Copy message"
              >
                {copiedId === msg.id ? (
                  <Check size={13} className="text-emerald-400" />
                ) : (
                  <Copy size={13} />
                )}
              </button>
            </div>

            {msg.isUser && (
              <div className="p-1.5 rounded-lg bg-indigo-600/10 text-indigo-400 shrink-0 mb-1 border border-indigo-500/10">
                <User size={16} />
              </div>
            )}
          </div>
        ))}

        {/* THREE-DOT LOADING INDICATOR */}
        {isLoading && (
          <div className="flex items-end gap-2 justify-start">
            <div className={`p-1.5 rounded-lg shrink-0 mb-1 border ${darkMode ? 'bg-slate-900 border-slate-800 text-indigo-400' : 'bg-slate-200 border-slate-300 text-indigo-600'}`}>
              <Bot size={16} />
            </div>
            <div className={`px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-1.5 border shadow-md
              ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
            >
              <span className={`h-2 w-2 rounded-full animate-bounce [animation-delay:-0.3s] ${darkMode ? 'bg-indigo-400' : 'bg-indigo-500'}`}></span>
              <span className={`h-2 w-2 rounded-full animate-bounce [animation-delay:-0.15s] ${darkMode ? 'bg-indigo-400' : 'bg-indigo-500'}`}></span>
              <span className={`h-2 w-2 rounded-full animate-bounce ${darkMode ? 'bg-indigo-400' : 'bg-indigo-500'}`}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* INPUT FOOTER */}
      <footer className={`p-3 border-t sticky bottom-0 z-50 ${darkMode ? 'bg-slate-950 border-slate-900' : 'bg-slate-50 border-slate-200'}`}>
        <div className="max-w-2xl w-full mx-auto flex items-end gap-2 relative">
          
          {/* Dynamic Expandable Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isLoading}
            className={`flex-1 px-4 py-3 pr-12 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all border resize-none max-h-35 scrollbar-none leading-relaxed
              ${darkMode 
                ? 'bg-slate-900 border-slate-800 placeholder-slate-500 text-slate-100' 
                : 'bg-white border-slate-200 placeholder-slate-400 text-slate-900'
              }`}
          />
          
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-xl transition-all font-medium shrink-0 flex items-center justify-center absolute right-1.5 bottom-1.5
              ${input.trim() && !isLoading
                ? 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 cursor-pointer shadow-md' 
                : 'bg-slate-800/40 text-slate-600 cursor-not-allowed'
              }`}
          >
            <Send size={16} />
          </button>
        </div>
      </footer>

    </div>
  );
}