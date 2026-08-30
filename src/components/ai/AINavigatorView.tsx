import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  User, 
  ArrowRight 
} from 'lucide-react';
import type { UserProfile } from '../../engine/types';
import { generateContextAwareAIResponse } from '../../engine/aiNavigator';
import type { AIMessage } from '../../engine/aiNavigator';

interface AINavigatorViewProps {
  profile: UserProfile;
  onNavigate: (tabId: string, payload?: any) => void;
}

export const AINavigatorView: React.FC<AINavigatorViewProps> = ({ profile, onNavigate }) => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      content: `Hello ${profile.fullName.split(' ')[0]}! I am your **NEXORA Context-Aware Learning Navigator**.\n\n` +
        `I am continuously tracking your journey toward **${profile.goalTitle}**.\n\n` +
        `Ask me anything about your current bottlenecks, why specific milestones are prioritized, or how to optimize your study sessions today.`,
      timestamp: 'Just now',
      suggestedActions: [
        { label: 'What should I learn next?', actionType: 'PROMPT', payload: 'What should I learn next?' },
        { label: 'Can I learn React first?', actionType: 'PROMPT', payload: 'Can I learn React first?' },
        { label: 'Explain Hashing Intuition', actionType: 'PROMPT', payload: 'Explain Hashing and Hash Maps intuition' },
        { label: 'How to improve my ATS resume?', actionType: 'PROMPT', payload: 'How to improve my ATS resume?' },
      ]
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: AIMessage = {
      id: `user-msg-${messages.length + 1}`,
      sender: 'user',
      content: text.trim(),
      timestamp: timeStr
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateContextAwareAIResponse(text, profile);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 600);
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
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-white/[0.08] backdrop-blur-md space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wider text-brand-400 uppercase">Context-Aware AI Assistant</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-300">
            Learner State Synced
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Bot className="w-6 h-6 text-brand-400" />
          <span>AI Learning & Career Navigator</span>
        </h1>
        <p className="text-xs text-slate-400">
          Understands your goal, active skill gaps, prerequisite dependencies, and assessment history.
        </p>
      </div>

      {/* Chat Container */}
      <div className="rounded-2xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-sm overflow-hidden flex flex-col h-[550px]">
        
        {/* Messages Feed */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-xl space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-brand-600 text-white rounded-tr-none'
                      : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none space-y-2'
                  }`}>
                    {/* Render message lines with basic bold formatting */}
                    <div className="space-y-1.5 whitespace-pre-line">
                      {msg.content}
                    </div>

                    {/* Interactive Action Buttons inside assistant responses */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="pt-3 flex flex-wrap gap-2 border-t border-slate-800/80">
                        {msg.suggestedActions.map((action, aIdx) => (
                          <button
                            key={aIdx}
                            type="button"
                            onClick={() => handleActionClick(action)}
                            className="px-3 py-1.5 rounded-lg bg-brand-950/60 hover:bg-brand-900/60 border border-brand-500/30 text-xs font-semibold text-brand-300 transition-colors flex items-center gap-1.5"
                          >
                            <span>{action.label}</span>
                            <ArrowRight className="w-3 h-3 opacity-70" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={`text-[10px] text-slate-500 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
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
            <div className="flex gap-3.5 items-center text-xs text-slate-400">
              <div className="w-8 h-8 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
                <Bot className="w-4 h-4 animate-spin-slow" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask about prerequisites, why a skill was recommended, or exam tips..."
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

    </div>
  );
};
