import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  User, 
  ArrowRight,
  Key,
  Sparkles,
  Mic,
  MicOff,
  Copy,
  Check,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  X
} from 'lucide-react';
import type { UserProfile } from '../../engine/types';
import { generateContextAwareAIResponse, getGoalAwareNavigatorConfig } from '../../engine/aiNavigator';
import type { AIMessage } from '../../engine/aiNavigator';
import { getGeminiApiKey, setGeminiApiKey, isGeminiConfigured, testGeminiConnection } from '../../engine/geminiAI';

interface AINavigatorViewProps {
  profile: UserProfile;
  onNavigate: (tabId: string, payload?: any) => void;
}

export const AINavigatorView: React.FC<AINavigatorViewProps> = ({ profile, onNavigate }) => {
  const goalConfig = getGoalAwareNavigatorConfig(profile);

  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      content: goalConfig.greeting,
      timestamp: 'Just now',
      suggestedActions: goalConfig.suggestedActions
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Gemini API Key Modal & State
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getGeminiApiKey());
  const [keyTestStatus, setKeyTestStatus] = useState<{ testing: boolean; success?: boolean; message?: string }>({ testing: false });
  const [isLiveActive, setIsLiveActive] = useState(isGeminiConfigured());

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages, isTyping]);

  // Voice Recognition Handler
  const handleToggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputVal(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim() || isTyping) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: AIMessage = {
      id: `user-msg-${Date.now()}`,
      sender: 'user',
      content: text.trim(),
      timestamp: timeStr
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInputVal('');
    setIsTyping(true);

    try {
      const response = await generateContextAwareAIResponse(text.trim(), profile, updatedHistory);
      setMessages(prev => [...prev, response]);
    } catch (err) {
      console.error('Failed to get AI response:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          content: `I encountered an issue processing your request. Please try again!`,
          timestamp: timeStr
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action: { label: string; actionType: string; payload?: any }) => {
    if (action.actionType === 'PROMPT') {
      handleSend(action.payload);
    } else if (action.actionType === 'NAVIGATE_ROADMAP') {
      onNavigate('roadmap');
    } else if (action.actionType === 'NAVIGATE_RESUME') {
      onNavigate('career');
    } else if (action.actionType === 'START_NBA' || action.actionType === 'START_PRACTICE') {
      onNavigate('assessments', action.payload);
    } else if (action.actionType === 'SIMULATE_SCENARIO') {
      onNavigate('whatif');
    } else if (action.actionType === 'NAVIGATE_RESOURCES') {
      onNavigate('resources');
    }
  };

  const handleCopyCode = (codeText: string, id: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleSaveApiKey = async () => {
    setKeyTestStatus({ testing: true });
    const trimmed = apiKeyInput.trim();
    if (!trimmed) {
      setGeminiApiKey('');
      setIsLiveActive(false);
      setKeyTestStatus({ testing: false, success: true, message: 'API key cleared. Offline intelligent AI engine active.' });
      setTimeout(() => setShowKeyModal(false), 1200);
      return;
    }

    const testRes = await testGeminiConnection(trimmed);
    setKeyTestStatus({ testing: false, success: testRes.success, message: testRes.message });

    if (testRes.success) {
      setGeminiApiKey(trimmed);
      setIsLiveActive(true);
      setTimeout(() => setShowKeyModal(false), 1200);
    }
  };

  const handleResetChat = () => {
    const freshConfig = getGoalAwareNavigatorConfig(profile);
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'assistant',
        content: `Chat session refreshed! How can I assist your preparation for **${profile.goalTitle}** right now?`,
        timestamp: 'Just now',
        suggestedActions: freshConfig.suggestedActions
      }
    ]);
  };

  // Helper to render markdown-like text with bolding, lists, headers & code blocks
  const renderFormattedContent = (content: string, msgId: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, pIdx) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const lang = lines[0]?.match(/^[a-zA-Z0-9_-]+$/) ? lines[0] : '';
        const code = lang ? lines.slice(1).join('\n') : lines.join('\n');
        const codeBlockId = `${msgId}-code-${pIdx}`;

        return (
          <div key={pIdx} className="my-3 rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 font-mono text-xs shadow-md">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
              <span className="font-semibold text-brand-400 uppercase tracking-wider">{lang || 'Code'}</span>
              <button
                type="button"
                onClick={() => handleCopyCode(code, codeBlockId)}
                className="flex items-center gap-1 hover:text-white transition-colors"
                title="Copy code"
              >
                {copiedCodeId === codeBlockId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 text-[10px]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3.5 overflow-x-auto text-slate-200 leading-relaxed font-mono">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Render regular text with markdown headers, bold, bullet points
      const lines = part.split('\n');
      return (
        <div key={pIdx} className="space-y-1.5">
          {lines.map((line, lIdx) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={lIdx} className="h-1" />;

            // Headings
            if (trimmed.startsWith('### ')) {
              return (
                <h3 key={lIdx} className="text-sm font-bold text-white mt-3 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                  <span>{trimmed.replace('### ', '')}</span>
                </h3>
              );
            }
            if (trimmed.startsWith('#### ')) {
              return (
                <h4 key={lIdx} className="text-xs font-bold text-brand-300 mt-2 mb-1">
                  {trimmed.replace('#### ', '')}
                </h4>
              );
            }

            // Bullet points
            const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*');
            const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

            return (
              <div
                key={lIdx}
                className={`${isBullet ? 'pl-3 relative text-slate-300' : 'text-slate-200'} leading-relaxed`}
                dangerouslySetInnerHTML={{ __html: formattedLine }}
              />
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      
      {/* Header with Live AI status & API Key Config */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/[0.08] backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold tracking-wider text-brand-400 uppercase">Personalized AI Mentor</span>
            
            {/* Live AI status indicator */}
            {isLiveActive ? (
              <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Gemini AI Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Goal-Calibrated AI Engine
              </span>
            )}
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Bot className="w-6 h-6 text-brand-400" />
            <span>AI Learning & Path Navigator</span>
          </h1>
          <p className="text-xs text-slate-400">
            Tailored specifically for <strong>{profile.goalTitle}</strong> ({profile.educationLevel}).
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setApiKeyInput(getGeminiApiKey());
              setKeyTestStatus({ testing: false });
              setShowKeyModal(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Key className="w-3.5 h-3.5 text-brand-400" />
            <span>{isLiveActive ? 'Gemini API Key' : 'Connect Gemini API'}</span>
          </button>

          <button
            type="button"
            onClick={handleResetChat}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            title="Reset Chat Session"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="rounded-2xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-sm overflow-hidden flex flex-col h-[600px] shadow-xl">
        
        {/* Messages Feed */}
        <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-2xl space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-tr-none shadow-md shadow-brand-500/20'
                      : 'bg-slate-950/90 border border-slate-800/90 text-slate-200 rounded-tl-none shadow-lg'
                  }`}>
                    {/* Render message lines with markdown & code support */}
                    <div className="space-y-1">
                      {renderFormattedContent(msg.content, msg.id)}
                    </div>

                    {/* Interactive Action Buttons inside assistant responses */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="pt-3.5 mt-3 flex flex-wrap gap-2 border-t border-slate-800/80">
                        {msg.suggestedActions.map((action, aIdx) => (
                          <button
                            key={aIdx}
                            type="button"
                            onClick={() => handleActionClick(action)}
                            className="px-3 py-1.5 rounded-lg bg-brand-950/70 hover:bg-brand-900/80 border border-brand-500/30 text-xs font-semibold text-brand-300 transition-all flex items-center gap-1.5 hover:scale-[1.02]"
                          >
                            <span>{action.label}</span>
                            <ArrowRight className="w-3 h-3 opacity-70" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={`text-[10px] text-slate-500 px-1 flex items-center gap-1.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <span>{msg.timestamp}</span>
                    {msg.isLiveAI && (
                      <span className="text-emerald-400 font-medium flex items-center gap-0.5">
                        • Gemini 1.5 Flash
                      </span>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3.5 items-center text-xs text-slate-400 animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
                <Bot className="w-4 h-4 animate-spin-slow" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-slate-400 ml-1">NEXORA AI is thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar with Typing & Voice Recognition */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`p-3 rounded-xl border transition-all shrink-0 ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-400 animate-pulse shadow-lg shadow-rose-500/30'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-800'
              }`}
              title={isListening ? 'Listening... click to stop' : 'Click to speak your question'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={isListening ? "Listening to your voice..." : goalConfig.inputPlaceholder}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-all"
            />

            <button
              type="submit"
              disabled={!inputVal.trim() || isTyping}
              className="px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all flex items-center gap-1.5 shadow-md shadow-brand-500/20 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* Gemini API Key Configuration Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 text-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
                  <Key className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Google Gemini API Configuration</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Connect your free Google AI Studio API key to enable unlimited real-time conversational responses from <strong>Gemini 1.5 Flash & 2.0</strong> for all student questions.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Gemini API Key</label>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Stored securely in your local browser storage.</span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-400 hover:text-brand-300 flex items-center gap-1 underline"
                >
                  <span>Get free key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {keyTestStatus.message && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                keyTestStatus.success
                  ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
              }`}>
                {keyTestStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{keyTestStatus.message}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={keyTestStatus.testing}
                onClick={handleSaveApiKey}
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-xs font-bold text-white shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
              >
                {keyTestStatus.testing && <span className="w-3 h-3 rounded-full border-2 border-white/20 border-t-white animate-spin" />}
                <span>{keyTestStatus.testing ? 'Validating...' : 'Save & Connect'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
