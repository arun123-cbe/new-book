import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, CheckCircle2, Phone } from 'lucide-react';

interface WhatsAppWidgetProps {
  phoneNumber?: string;
  supportName?: string;
}

export const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({
  phoneNumber = "9787196806",
  supportName = "Arun Prabhu / SSS Support"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);

  // Format clean international phone number for WhatsApp wa.me link
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const formattedWaPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  const handleOpenChat = (customMsg?: string) => {
    const textToSubmit = customMsg || userMessage.trim() || "Hi, I have a query regarding Search, Social & Systems book.";
    const encodedText = encodeURIComponent(textToSubmit);
    const waUrl = `https://wa.me/${formattedWaPhone}?text=${encodedText}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleOpenChat();
    setUserMessage('');
  };

  return (
    <div className="fixed bottom-3.5 right-3.5 sm:bottom-5 sm:right-5 z-50 flex flex-col items-end font-sans">
      {/* Expanded Chat Popover */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-28px)] sm:w-[360px] max-w-[380px] bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden transition-all duration-300 transform scale-100 animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-3 sm:p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-2.5">
              <div className="relative">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-100" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h4 className="font-bold text-xs sm:text-sm tracking-wide text-white">WhatsApp Assistant</h4>
                  <span className="bg-emerald-500/40 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded text-emerald-100 border border-emerald-400/30">Live</span>
                </div>
                <p className="text-[11px] text-emerald-100/90 font-medium">{supportName}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/20 text-emerald-100 hover:text-white transition-colors"
              aria-label="Close WhatsApp chat"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-3 sm:p-4 bg-slate-50 space-y-3 max-h-[60vh] sm:max-h-[360px] overflow-y-auto">
            {/* Timestamp Badge */}
            <div className="text-center">
              <span className="text-[9px] sm:text-[10px] font-medium text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">
                Direct WhatsApp • Quick Reply
              </span>
            </div>

            {/* Incoming Automated Bot Greeting Bubble */}
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white flex-shrink-0 text-xs font-bold shadow-sm">
                <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="bg-white p-3 rounded-2xl rounded-tl-xs shadow-sm border border-slate-200/80 text-xs text-slate-700 space-y-1.5 max-w-[88%]">
                <p className="font-semibold text-slate-900 flex items-center gap-1">
                  Hi there! 👋 Welcome!
                </p>
                <p className="leading-relaxed">
                  Have questions about <strong>Search, Social & Systems</strong>, delivery, or orders?
                </p>
                <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                  Click a option below or send a message to start WhatsApp chat on <strong>+91 {phoneNumber}</strong>.
                </p>
              </div>
            </div>

            {/* Quick Action Suggestion Chips */}
            <div className="space-y-1 pl-7 sm:pl-9">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Quick Inquiries:</p>
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => handleOpenChat("Hi, I want to inquire about buying the Search, Social & Systems book.")}
                  className="text-left text-[11px] sm:text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-medium py-1.5 px-2.5 rounded-xl border border-emerald-200/60 transition-colors flex items-center justify-between group"
                >
                  <span>📖 Book Purchase & Info</span>
                  <Send className="w-3 h-3 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button
                  onClick={() => handleOpenChat("Hi, I would like to track my order status for Search, Social & Systems.")}
                  className="text-left text-[11px] sm:text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-medium py-1.5 px-2.5 rounded-xl border border-emerald-200/60 transition-colors flex items-center justify-between group"
                >
                  <span>📦 Track My Order</span>
                  <Send className="w-3 h-3 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button
                  onClick={() => handleOpenChat("Hi, I need assistance with corporate/bulk ordering of Search, Social & Systems.")}
                  className="text-left text-[11px] sm:text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-medium py-1.5 px-2.5 rounded-xl border border-emerald-200/60 transition-colors flex items-center justify-between group"
                >
                  <span>🏢 Bulk / Corporate Orders</span>
                  <Send className="w-3 h-3 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Input Area */}
          <div className="p-2.5 sm:p-3 bg-white border-t border-slate-100 space-y-2">
            <form onSubmit={handleSubmit} className="flex items-center space-x-1.5">
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-slate-100 hover:bg-slate-50 focus:bg-white text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 placeholder-slate-400 transition-all"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white p-2 rounded-xl transition-all shadow-sm flex items-center justify-center"
                title="Send via WhatsApp"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <button
              onClick={() => handleOpenChat()}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Open Chat (+91 {phoneNumber})</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Launcher Button - Compact & Mobile Optimised */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setHasInteracted(true);
        }}
        className="relative bg-emerald-500 hover:bg-emerald-600 text-white w-12 h-12 sm:w-13 sm:h-13 rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center justify-center border-2 border-white/20"
        aria-label="Open WhatsApp Chat"
      >
        {/* Unread badge dot */}
        {!hasInteracted && !isOpen && (
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400 border border-white text-[8px] font-black text-slate-900 items-center justify-center">1</span>
          </span>
        )}

        {isOpen ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        ) : (
          <div className="flex items-center justify-center">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-current text-white" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
          </div>
        )}
      </button>
    </div>
  );
};
