import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToGemini } from '../services/gemini';

const ChatInterface = ({ currentChat, setChatHistory, setIsSidebarOpen, onReturn }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentChat?.messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = { id: Date.now(), sender: 'user', text: input };
    const updatedMessages = [...currentChat.messages, userMsg];

    setChatHistory(prev =>
      prev.map(chat =>
        chat.id === currentChat.id
          ? { ...chat, messages: updatedMessages }
          : chat
      )
    );

    setInput('');
    setIsTyping(true);

    try {
      const responseText = await sendMessageToGemini(
        input,
        currentChat.messages,
        currentChat.persona
      );

      const aiMsg = { id: Date.now() + 1, sender: 'ai', text: responseText };

      setChatHistory(prev =>
        prev.map(chat =>
          chat.id === currentChat.id
            ? { ...chat, messages: [...updatedMessages, aiMsg] }
            : chat
        )
      );
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: "Error: Neural Link Severed. Retrying uplink..."
      };

      setChatHistory(prev =>
        prev.map(chat =>
          chat.id === currentChat.id
            ? { ...chat, messages: [...updatedMessages, errorMsg] }
            : chat
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-black relative">

      {/* ===============================
         HEADER (PROFILE ADDED)
      ================================ */}
      <header className="flex items-center justify-between border-t border-b border-white h-12 md:h-14 bg-black shrink-0">

        {/* LEFT */}
        <div className="flex items-center h-full flex-1 min-w-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-2 text-white border-r border-white h-full"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* CHARACTER PROFILE */}
          <div className="flex items-center gap-3 px-3 md:px-6 truncate">
            <span className="text-xl md:text-2xl">
              {currentChat?.profile?.icon}
            </span>
            <div className="leading-tight truncate">
              <div className="font-serif text-[10px] md:text-sm text-white uppercase tracking-widest font-bold truncate">
                {currentChat?.profile?.name}
              </div>
              <div className="text-[8px] md:text-[10px] text-zinc-400 uppercase tracking-widest truncate">
                {currentChat?.profile?.title}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex h-full border-l border-white shrink-0">
          <button
            onClick={onReturn}
            className="px-3 md:px-6 text-white uppercase font-bold text-[8px] md:text-[10px] tracking-widest hover:text-yellow-400 transition-colors border-r border-white"
          >
            Return
          </button>

          <button
            onClick={() => {
              if (window.confirm("Purge Whole Site Cache?")) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="px-3 md:px-6 text-white uppercase font-bold text-[8px] md:text-[10px] tracking-widest hover:text-red-500 transition-colors"
          >
            Purge Cache
          </button>
        </div>
      </header>

      {/* ===============================
         MESSAGES
      ================================ */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-12 space-y-6 custom-scrollbar"
      >
        {currentChat?.messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            } animate-fade-in`}
          >
            <div
              className={`max-w-[85%] md:max-w-[80%] p-3 md:p-6 rounded-2xl text-sm md:text-lg font-serif border ${
                msg.sender === 'ai'
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
                  : 'bg-white text-black border-white shadow-lg'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="text-zinc-600 italic text-[10px] ml-4 animate-pulse uppercase tracking-widest">
            Processing...
          </div>
        )}
      </div>

      {/* ===============================
         INPUT
      ================================ */}
      <div className="p-3 md:p-10">
        <form
          onSubmit={handleSend}
          className="max-w-4xl mx-auto bg-white rounded-full flex items-center px-4 py-1.5 md:py-3 shadow-2xl"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type tactical command..."
            className="flex-1 bg-transparent border-none text-black px-2 py-1 text-sm md:text-xl font-serif outline-none"
          />
          <button
            type="submit"
            className="text-black p-1 hover:scale-110 active:scale-95 transition-transform"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
