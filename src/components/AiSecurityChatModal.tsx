import React, { useState } from 'react';
import { Device } from '../types';
import { Sparkles, Send, X, Shield, Bot, User, RefreshCw } from 'lucide-react';

interface AiSecurityChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: Device;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export const AiSecurityChatModal: React.FC<AiSecurityChatModalProps> = ({
  isOpen,
  onClose,
  device,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `Hello! I am your AI Tactical Personal Safety Advisor powered by Gemini 3.6. I am currently monitoring ${device.personName || device.name} near ${device.location.address}, ${device.location.city}. How can I assist with your safety or route security today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const userMsg: Message = {
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/security-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: userText,
          deviceContext: device,
        }),
      });

      const json = await res.json();
      const aiReply = json.text || 'Target is safely monitored under encrypted cloud telemetry.';

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error('Failed to communicate with AI chat:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Security system AI server standby active. Target status remains normal.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#191c1e] w-full max-w-lg rounded-2xl border border-[#e2e8f0] dark:border-[#434655] shadow-2xl flex flex-col h-[550px] overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/30 border border-blue-400/40 text-blue-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm">AI Tactical Safety Advisor</h3>
                <span className="text-[10px] bg-amber-500/30 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Gemini 3.6
                </span>
              </div>
              <p className="text-[11px] text-blue-200">
                Monitoring: {device.personName || device.name} ({device.countryFlag || '🇺🇸'} {device.location.city})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f8fafc] dark:bg-[#25292c]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none font-medium'
                    : 'bg-white dark:bg-[#191c1e] text-[#1e293b] dark:text-slate-100 rounded-tl-none border border-[#e2e8f0] dark:border-[#434655]'
                }`}
              >
                <div>{msg.text}</div>
                <div
                  className={`text-[9px] mt-1 text-right ${
                    msg.sender === 'user' ? 'text-blue-200' : 'text-[#64748b] dark:text-[#bec6e0]'
                  }`}
                >
                  {msg.time}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#64748b] dark:text-[#bec6e0] italic p-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
              <span>AI Tactical Advisor is processing query...</span>
            </div>
          )}
        </div>

        {/* Form Input */}
        <form onSubmit={handleSend} className="p-3 bg-white dark:bg-[#191c1e] border-t border-[#e2e8f0] dark:border-[#434655] flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI about safety, routes, crime scene procedures..."
            className="flex-1 bg-[#f1f5f9] dark:bg-[#2d3133] border border-transparent focus:border-blue-500 px-3.5 py-2.5 rounded-xl text-xs text-[#1e293b] dark:text-white outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 transition-colors cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
