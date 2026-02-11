import React from 'react';

const DCSidebar = ({ selectedCharacter, handlePersonaChange, createNewChat, chatHistory, activeChatId, setActiveChatId, deleteChat }) => {
  const characters = ['BATMAN', 'CYBORG', 'LEX LUTHOR'];
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full border-2 border-zinc-600 flex items-center justify-center font-black">DC</div>
          <span className="text-2xl font-serif italic">-Ai</span>
        </div>
      </div>
      <button onClick={createNewChat} className="w-full py-3 mb-8 border border-white hover:bg-white hover:text-black transition-all font-black uppercase italic tracking-[0.2em] text-[10px] shrink-0">+ New Chat</button>
      
      <div className="mb-10 flex flex-col gap-3 shrink-0">
        {characters.map((char) => (
          <button key={char} onClick={() => handlePersonaChange(char)} className={`px-6 py-3 rounded-full text-[14px] font-bold transition-all text-left uppercase tracking-wider ${selectedCharacter === char ? 'bg-zinc-100 text-black scale-105 shadow-lg' : 'bg-zinc-900 text-zinc-500 hover:text-white border border-zinc-800'}`}>
            {char === 'LEX LUTHOR' ? '🧠 ' : char === 'BATMAN' ? '🦇 ' : '🤖 '}{char}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <h2 className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase mb-4 italic">Chat Logs</h2>
        <div className="flex flex-col gap-2">
          {chatHistory.map((chat) => (
            <div key={chat.id} className="group relative">
              <button onClick={() => setActiveChatId(chat.id)} className={`w-full p-3 rounded-lg text-left transition-all border ${activeChatId === chat.id ? 'border-zinc-500 bg-zinc-900' : 'border-transparent hover:bg-zinc-900/40'}`}>
                <p className={`text-xs font-bold truncate pr-6 ${activeChatId === chat.id ? 'text-white' : 'text-zinc-500'}`}>{chat.name}</p>
                <p className="text-[9px] text-zinc-600 mt-1 italic uppercase">{chat.persona} // {chat.timestamp}</p>
              </button>
              {/* INDIVIDUAL CLEAR BUTTON */}
              <button 
                onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 hover:text-red-500 transition-all text-zinc-600"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2 2H7m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DCSidebar;