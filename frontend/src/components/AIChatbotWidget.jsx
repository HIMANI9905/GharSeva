import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, User, ChevronRight } from 'lucide-react';
import API from '../services/api';

const AIChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hi! I am GharSeva Assistant. Ask me anything about home services, pricing, or instant booking recommendations!',
      suggestedActions: ['Estimate Price', 'Electrician Cost', 'Book AC Repair']
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text: query }];
    setMessages(newMsgs);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await API.post('/ai/chatbot', { message: query });
      if (res.data.success) {
        setMessages([
          ...newMsgs,
          {
            sender: 'bot',
            text: res.data.reply,
            suggestedActions: res.data.suggestedActions
          }
        ]);
      }
    } catch (err) {
      setMessages([
        ...newMsgs,
        {
          sender: 'bot',
          text: 'Apologies, I am having a temporary connection issue. Please try again!'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-300 hover:from-violet-300 hover:to-fuchsia-200 text-slate-800 font-bold shadow-lg shadow-violet-400/20 hover:scale-105 transition-all group"
        >
          <Sparkles className="w-5 h-5 animate-pulse text-amber-300" />
          <span>Ask GharSeva</span>
        </button>
      )}

      {isOpen && (
        <div className="w-80 sm:w-96 h-[500px] bg-white border border-rose-100 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-600 to-fuchsia-300 p-4 text-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
                <Bot className="w-5 h-5 text-slate-800" />
              </div>
              <div>
                <h4 className="font-bold text-sm">GharSeva Assistant</h4>
                <span className="text-[10px] text-sky-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
                  Instant Smart Recommendations
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm bg-rose-50/60/60">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-violet-400/20 text-violet-500 flex items-center justify-center shrink-0 border border-violet-400/30">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[80%] ${
                    m.sender === 'user'
                      ? 'bg-sky-600 text-slate-800 rounded-br-none'
                      : 'bg-rose-100/50 text-slate-700 border border-slate-300/60 rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>

                  {/* Action Chips */}
                  {m.suggestedActions && m.suggestedActions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-slate-300/50">
                      {m.suggestedActions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(act)}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-violet-400/10 text-blue-500 border border-violet-400/30 hover:bg-violet-400/20 transition-colors flex items-center gap-1"
                        >
                          {act} <ChevronRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-rose-200/40 text-slate-600 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 items-center text-slate-400 text-xs italic">
                <Bot className="w-4 h-4 animate-spin text-violet-500" />
                <span>GharSeva is thinking...</span>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-rose-100 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for prices, services, or booking..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-rose-50/60 text-slate-800 text-sm border border-rose-100 focus:outline-none focus:border-violet-400 placeholder-slate-500"
            />
            <button
              onClick={() => handleSend()}
              className="p-2.5 rounded-xl bg-violet-400 hover:bg-violet-400 text-slate-800 shadow-lg shadow-violet-400/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatbotWidget;
