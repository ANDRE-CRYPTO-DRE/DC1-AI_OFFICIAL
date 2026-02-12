import React from 'react';

const DCSidebar = ({ 
  handlePersonaChange, 
  onShowAbout, 
  onShowDesign, 
  onShowChat,
  chatHistory, 
  activeChatId, 
  setActiveChatId, 
  deleteChat 
}) => {
  return (
    <div className="flex flex-col h-full p-4 bg-black text-white">
      {/* TOP MENU - The 3 Lines You Asked For */}
      <div className="space-y-2 mb-10">
        <button 
          onClick={onShowChat}
          className="w-full text-left px-4 py-2 hover:bg-zinc-900 rounded-lg transition-colors uppercase text-xs font-bold tracking-widest border-l-2 border-white"
        >
          01. Terminal Chat
        </button>
        <button 
          onClick={onShowAbout}
          className="w-full text-left px-4 py-2 hover:bg-zinc-900 rounded-lg transition-colors uppercase text-xs font-bold tracking-widest border-l-2 border-zinc-800"
        >
          02. About DC-AI
        </button>
        <button 
          onClick={onShowDesign}
          className="w-full text-left px-4 py-2 hover:bg-zinc-900 rounded-lg transition-colors uppercase text-xs font-bold tracking-widest border-l-2 border-zinc-800"
        >
          03. System Design
        </button>
      </div>

      <div className="h-px bg-zinc-800 mb-6" />

      {/* CHARACTER SELECT */}
      <div className="mb-6">
        <h3 className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mb-4 ml-4">Initialize Persona</h3>
        <div className="grid grid-cols-3 gap-2">
          {['BATMAN', 'CYBORG', 'LEX'].map((p) => (
            <button 
              key={p} 
              onClick={() => handlePersonaChange(p)}
              className="p-3 bg-zinc-900 hover:bg-white hover:text-black transition-all rounded-xl text-xl"
            >
              {p === 'BATMAN' ? '🦇' : p === 'CYBORG' ? '🤖' : '🧠'}
            </button>
          ))}
        </div>
      </div>

      {/* CHAT HISTORY */}
      <div className="flex-1 overflow-y-auto">
        <h3 className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mb-4 ml-4">Encrypted Logs</h3>
        {chatHistory.map((chat) => (
          <div 
            key={chat.id}
            onClick={() => { setActiveChatId(chat.id); onShowChat(); }}
            className={`group flex items-center justify-between p-3 mb-2 rounded-xl cursor-pointer transition-all ${activeChatId === chat.id ? 'bg-zinc-800' : 'hover:bg-zinc-900'}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{chat.profile.icon}</span>
              <div>
                <p className="text-sm font-bold uppercase tracking-tighter">{chat.profile.name}</p>
                <p className="text-[9px] text-zinc-500">{chat.timestamp}</p>
              </div>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
              className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-500 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DCSidebar;