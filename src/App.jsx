import React, { useState, useEffect, useRef } from 'react';

// --- MAIN APPLICATION ---
export default function App() {
  const [selectedCharacter, setSelectedCharacter] = useState('BATMAN');
  const [activeChatId, setActiveChatId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem('dc_ai_vault_master');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('dc_ai_vault_master', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const createNewChat = (persona = selectedCharacter) => {
    const newId = Date.now();
    const newEntry = {
      id: newId,
      name: "New Intelligence Log",
      persona: persona,
      messages: [],
      timestamp: new Date().toLocaleDateString()
    };
    setChatHistory([newEntry, ...chatHistory]);
    setActiveChatId(newId);
    setIsSidebarOpen(false);
  };

  const handlePersonaChange = (char) => {
    setSelectedCharacter(char);
    const existingChat = chatHistory.find(c => c.persona === char);
    if (existingChat) {
      setActiveChatId(existingChat.id);
    } else {
      createNewChat(char);
    }
  };

  useEffect(() => {
    if (chatHistory.length === 0) {
      createNewChat('BATMAN');
    } else if (!activeChatId) {
      setActiveChatId(chatHistory[0].id);
      setSelectedCharacter(chatHistory[0].persona);
    }
  }, []);

  const currentChat = chatHistory.find(c => c.id === activeChatId) || chatHistory[0];

  return (
    <div className="flex h-screen w-full bg-black overflow-hidden select-none text-white font-sans relative">
      
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/80 z-40 md:hidden transition-opacity" onClick={() => setIsSidebarOpen(false)} />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative md:translate-x-0 transition-transform duration-300 ease-in-out
        w-72 bg-black border-r border-zinc-800 flex flex-col p-6 shrink-0
      `}>
        <DCSidebar 
          selectedCharacter={selectedCharacter} 
          handlePersonaChange={handlePersonaChange} 
          createNewChat={() => createNewChat(selectedCharacter)}
          chatHistory={chatHistory}
          activeChatId={activeChatId}
          setActiveChatId={(id) => {
            setActiveChatId(id);
            const chat = chatHistory.find(c => c.id === id);
            if(chat) setSelectedCharacter(chat.persona);
          }}
        />
      </div>
      
      <ChatInterface 
        currentChat={currentChat} 
        setChatHistory={setChatHistory}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    </div>
  );
}

// --- SIDEBAR COMPONENT ---
const DCSidebar = ({ 
  selectedCharacter, handlePersonaChange, createNewChat, 
  chatHistory, activeChatId, setActiveChatId 
}) => {
  const characters = ['BATMAN', 'CYBORG', 'LEX LUTHOR'];
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full border-2 border-zinc-600 flex items-center justify-center">
             <span className="font-bold text-lg tracking-tighter leading-none">DC</span>
          </div>
          <span className="text-2xl font-serif">-Ai</span>
        </div>
      </div>

      <button 
        onClick={createNewChat}
        className="w-full py-3 mb-8 border border-white hover:bg-white hover:text-black transition-all font-black uppercase italic tracking-[0.2em] text-[10px]"
      >
        + New Chat
      </button>

      <div className="flex items-center gap-3 mb-2">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 12c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z"/></svg>
        <h2 className="text-xl font-black tracking-tighter uppercase italic leading-none">Ai Persona</h2>
      </div>
      <hr className="border-t border-white mb-8" />

      <div className="mb-10">
        <div className="flex flex-col gap-3">
          {characters.map((char) => (
            <button
              key={char}
              onClick={() => handlePersonaChange(char)}
              className={`px-6 py-3 rounded-full text-[14px] font-bold transition-all duration-300 text-left uppercase tracking-wider
                ${selectedCharacter === char 
                  ? (char === 'BATMAN' ? 'bg-[#DED045] text-black shadow-lg scale-105' : char === 'CYBORG' ? 'bg-zinc-300 text-black scale-105' : 'bg-green-600 text-white scale-105') 
                  : 'bg-zinc-900 text-zinc-500 hover:text-white border border-zinc-800'
                }`}
            >
              {char === 'LEX LUTHOR' ? '🧠 LEX LUTHOR' : char === 'BATMAN' ? '🦇 BATMAN' : '🤖 CYBORG'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <h2 className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase mb-4">Chat History</h2>
        <div className="flex flex-col gap-3">
          {chatHistory.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`p-3 rounded-lg text-left transition-all border ${activeChatId === chat.id ? 'border-zinc-500 bg-zinc-900' : 'border-transparent hover:bg-zinc-900/40'}`}
            >
              <p className={`text-xs font-bold truncate ${activeChatId === chat.id ? 'text-white' : 'text-zinc-500'}`}>{chat.name}</p>
              <p className="text-[9px] text-zinc-600 uppercase mt-1 italic font-serif tracking-tighter">{chat.persona} // {chat.timestamp}</p>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

// --- CHAT INTERFACE COMPONENT ---
const ChatInterface = ({ currentChat, setChatHistory, setIsSidebarOpen }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [currentChat?.messages, isTyping]);

  const generateAIResponse = (input, persona) => {
    const text = input.toLowerCase();

    if (persona === 'LEX LUTHOR') {
      if (text.match(/\b(hi|hello)\b/)) return "Greetings. I assume you’ve come for knowledge—most do.";
      if (text.includes("who are you")) return "Lex Luthor. Visionary. Scientist. The man ensuring humanity’s survival.";
      if (text.includes("superman") || text.includes("hate")) return "Hate is irrational. I simply refuse to worship a god in a cape.";
      if (text.includes("goal")) return "To place humanity back in control of its own destiny.";
      return "That information is either irrelevant to you or beyond your current understanding.";
    }

    if (persona === 'BATMAN') {
      if (text.match(/\b(hi|hello)\b/)) return "State your purpose.";
      if (text.includes("who are you")) return "Batman.";
      if (text.includes("crime")) return "So no one else has to grow up afraid.";
      if (text.includes("trust") || text.includes("superman")) return "I trust preparation. Not gods.";
      return "That’s not something I can discuss.";
    }

    if (persona === 'CYBORG') {
      if (text.match(/\b(hi|hello)\b/)) return "Hey. Systems online. What’s up?";
      if (text.includes("who are you")) return "Victor Stone. Cyborg. Part human, part machine—all hero.";
      if (text.includes("like") && text.includes("cyborg")) return "Some days it’s tough. But I use what I’ve got to help people.";
      if (text.includes("hack")) return "With the right access? Yeah. Most systems don’t stand a chance.";
      return "I don’t have enough data to answer that.";
    }
    return "...";
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setChatHistory(prev => prev.map(chat => 
      chat.id === currentChat.id ? { ...chat, messages: [...chat.messages, userMsg] } : chat
    ));
    
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(currentInput, currentChat.persona);
      const aiMsg = { id: Date.now() + 1, sender: 'ai', text: response };
      setChatHistory(prev => prev.map(chat => 
        chat.id === currentChat.id ? { ...chat, messages: [...chat.messages, aiMsg] } : chat
      ));
      setIsTyping(false);
    }, 1000);
  };

  const getAvatar = (char) => {
    if (char === 'BATMAN') return <svg viewBox="0 0 100 100" className="w-6 h-6 fill-white"><path d="M20 20 L40 50 L60 50 L80 20 L85 80 L50 95 L15 80 Z" /></svg>;
    if (char === 'CYBORG') return <svg viewBox="0 0 100 100" className="w-6 h-6"><circle cx="50" cy="50" r="40" fill="#94a3b8" /><circle cx="65" cy="45" r="10" fill="#ef4444" /></svg>;
    if (char === 'LEX LUTHOR') return <svg viewBox="0 0 100 100" className="w-6 h-6"><path d="M50 25 C35 25 25 35 25 55 C25 80 40 95 50 95 C60 95 75 80 75 55 C75 35 65 25 50 25 Z" fill="#16a34a" /></svg>;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-black relative">
      {/* HEADER: MOBILE OPTIMIZED */}
      <header className="flex items-center justify-between border-t border-b border-white h-12 md:h-14 bg-black px-0 shrink-0">
        <div className="flex items-center h-full overflow-hidden flex-1">
          {/* Hamburger Menu - Fixed Width */}
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-white border-r border-white h-full shrink-0">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
          
          {/* SESSION ACTIVE - Shrinkable text */}
          <div className="flex items-center gap-1 md:gap-2 px-1 md:px-5 border-r border-white h-full shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" className="shrink-0 ml-1">
               <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H5v-2h10v2zm4-4H5V8h14v6zM7 10h2v2H7v-2z" />
            </svg>
            <span className="font-sans font-black text-[9px] md:text-lg tracking-tighter text-white uppercase whitespace-nowrap pr-1">
              SESSION ACTIVE
            </span>
          </div>

          {/* Character Name - Responsive width with truncation */}
          <div className="px-2 md:px-8 flex-1 min-w-0 overflow-hidden">
            <span className="font-serif text-xs md:text-xl text-white/90 uppercase tracking-widest italic truncate block">
              {currentChat?.persona}
            </span>
          </div>
        </div>

        {/* Purge Cache - Shrinkable button */}
        <button 
          onClick={() => { if(window.confirm("Purge all local cache?")) { localStorage.clear(); window.location.reload(); } }}
          className="px-2 md:px-8 text-white uppercase font-bold text-[8px] md:text-[10px] tracking-[0.1em] md:tracking-[0.2em] hover:text-red-500 transition-colors h-full border-l border-white shrink-0 whitespace-nowrap"
        >
          Purge Cache
        </button>
      </header>

      {/* CHAT AREA */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-12 space-y-6">
        {currentChat?.messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-10 text-white font-serif italic text-2xl md:text-3xl text-center px-4">
             {getAvatar(currentChat?.persona)}
             <p className="mt-4 tracking-widest uppercase text-sm md:text-base">Initializing Uplink...</p>
          </div>
        )}
        
        {currentChat?.messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-2 md:gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 md:w-10 md:h-10 bg-zinc-900 border border-zinc-800 flex items-center justify-center rounded-lg md:rounded-xl shrink-0">
                {getAvatar(currentChat.persona)}
              </div>
            )}
            <div className={`max-w-[85%] md:max-w-[80%] p-3 md:p-6 rounded-2xl text-base md:text-lg font-serif border whitespace-pre-wrap
              ${msg.sender === 'ai' ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white text-black border-white shadow-lg'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && <div className="text-zinc-600 font-serif italic text-[10px] md:text-xs ml-10 md:ml-14 animate-pulse uppercase tracking-[0.3em]">Processing...</div>}
      </div>

      {/* INPUT AREA: MOBILE OPTIMIZED */}
      <div className="p-3 md:p-10">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto bg-white rounded-full flex items-center px-2 md:px-6 py-1 md:py-4 shadow-2xl">
          {/* Paperclip */}
          <button type="button" className="p-1.5 md:p-2 text-black opacity-60 hover:opacity-100 transition-opacity shrink-0">
            <svg width="18" height="18" md:width="22" md:height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </button>

          {/* Microphone */}
          <button type="button" className="p-1.5 md:p-2 text-black opacity-60 hover:opacity-100 transition-opacity shrink-0">
            <svg width="18" height="18" md:width="22" md:height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            </svg>
          </button>

          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Ask something..." 
            className="flex-1 bg-transparent border-none text-black px-2 md:px-4 text-sm md:text-xl font-serif outline-none placeholder:text-zinc-400 min-w-0" 
          />
          
          {/* Send Button */}
          <button type="submit" disabled={isTyping} className="text-black p-1.5 md:p-2 hover:scale-110 active:scale-95 transition-transform disabled:opacity-20 shrink-0">
            <svg width="22" height="22" md:width="28" md:height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
};