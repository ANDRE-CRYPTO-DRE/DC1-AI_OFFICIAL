import { sendMessageToGemini } from '../services/gemini';
import { useState } from 'react';

const ChatInterface = ({ activeChatId, setActiveChatId, chats, setChats, onReturn, purgeCache }) => {
  const [input, setInput] = useState("");
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeInfoTab, setActiveInfoTab] = useState('BATMAN');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // TTS

  const personas = {
    BATMAN: {
      name: 'BATMAN', color: 'bg-[#FFD700]', icon: '🦇',
      img: "https://i.pinimg.com/originals/03/5e/70/035e70ea30afe3513b9b0277a25b9bb3.jpg",
      trait: "Masked hero with bat horns",
      desc: "Batman is a dark and disciplined masked hero with distinct bat horns. He relies on intelligence, strategy, and preparation. He is a silent protector whose words are few but direct."
    },
    CYBORG: {
      name: 'CYBORG', color: 'bg-white', icon: '🤖',
      img: "https://i.pinimg.com/originals/51/3f/ad/513fad730a2b13ed1b4bdf77f08165eb.jpg",
      trait: "Half man, half robot",
      desc: "Cyborg is a powerful blend of human emotion and advanced technology—literally half man and half robot. He is highly intelligent, logical, and skilled in technological systems."
    },
    LEX: {
      name: 'LEX LUTHOR', color: 'bg-[#15803d]', icon: '🧠',
      img: "https://static.wikia.nocookie.net/dccomicsdatabase/images/5/5a/Lex_Profile_2.jpg/revision/latest?cb=20200211125845&path-prefix=it",
      trait: "Strategic technology scientist",
      desc: "Lex Luthor is a brilliant technology scientist and ambitious mastermind. He believes that human potential and scientific advancement are the ultimate forms of power."
    }
  };

  const speakText = (text) => {
    if (isMuted || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const startNewChat = (key) => {
    if (activeChatId !== null) return;

    const id = Date.now();
    const newChat = {
      id, persona: key, messages: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChats([newChat, ...chats]);
    setActiveChatId(id);
  };

  const handleSend = async () => {
    if (!input.trim() || !activeChatId) return;
    const activeChat = chats.find(c => c.id === activeChatId);

    // Optimistic Update
    const updatedMessages = [...activeChat.messages, { sender: 'user', text: input }];
    setChats(chats.map(c => c.id === activeChatId ? { ...c, messages: updatedMessages } : c));
    setInput("");

    try {
      const responseText = await sendMessageToGemini(input, activeChat.messages, activeChat.persona);

      setChats(prev => prev.map(c => c.id === activeChatId ? {
        ...c,
        messages: [...updatedMessages, { sender: 'bot', text: responseText }]
      } : c));

      if (!responseText.startsWith("System Error")) {
        speakText(responseText);
      }
    } catch (error) {
      setChats(prev => prev.map(c => c.id === activeChatId ? {
        ...c,
        messages: [...updatedMessages, { sender: 'bot', text: `Critical Fault: ${error.message}` }]
      } : c));
    }
  };

  const activeChat = chats.find(c => c.id === activeChatId);

  return (
    <div className="flex h-screen w-full bg-black text-white animate-fade-in relative overflow-hidden">

      {/* SIDEBAR - Hidden on mobile by default, toggleable */}
      <div className={`w-80 border-r-4 border-white flex flex-col p-6 overflow-hidden z-10 bg-black absolute md:relative h-full md:h-auto transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex items-center gap-2 mb-8">
          <div className="border border-zinc-700 rounded-full w-8 h-8 flex items-center justify-center text-[10px] font-black italic text-zinc-500">DC</div>
          <span className="text-3xl font-serif">-Ai</span>
        </div>

        <button
          onClick={() => setActiveChatId(null)}
          className="w-full bg-white text-black font-black py-3 mb-10 border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] uppercase text-xs tracking-widest transition-all"
        >
          New Chat
        </button>

        <div className="space-y-6">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">AI Persona</h2>
          <div className="h-[2px] bg-white w-full"></div>

          <div className="flex flex-wrap gap-2">
            {Object.keys(personas).map(key => (
              <button
                key={key}
                disabled={activeChatId !== null}
                onClick={() => startNewChat(key)}
                className={`px-5 py-1.5 rounded-full font-black text-[10px] uppercase transition-all 
                  ${activeChat?.persona === key ? `${personas[key].color} text-black scale-105` :
                    activeChatId === null ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-900 text-zinc-600 cursor-not-allowed opacity-50'}`}
              >
                {personas[key].name}
              </button>
            ))}
          </div>
          <p className="text-[8px] text-zinc-500 uppercase tracking-widest">
            {activeChatId === null ? "Select persona to begin" : "Persona locked during session"}
          </p>
        </div>

        <div className="mt-10 flex-1 overflow-y-auto custom-scrollbar pt-6 border-t border-zinc-900">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[10px] text-zinc-600 uppercase tracking-widest">Encrypted Logs</h3>
            <div className="flex gap-2">
              {chats.length > 0 && (
                <>
                  <button onClick={() => setIsSelectMode(!isSelectMode)} className="text-[8px] font-bold uppercase px-2 py-1 border border-zinc-800 text-zinc-500 hover:text-white">
                    {isSelectMode ? 'Cancel' : 'Select'}
                  </button>
                  <button onClick={purgeCache} className="text-[8px] font-bold uppercase px-2 py-1 border border-red-900 text-red-500 hover:bg-red-600 hover:text-white transition-all">
                    Delete All
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {chats.map(chat => (
              <div key={chat.id} onClick={() => isSelectMode ? (setSelectedIds(prev => prev.includes(chat.id) ? prev.filter(i => i !== chat.id) : [...prev, chat.id])) : setActiveChatId(chat.id)}
                className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all border ${isSelectMode && selectedIds.includes(chat.id) ? 'border-cyan-400 bg-cyan-950/20' : activeChatId === chat.id ? 'bg-zinc-800 border-zinc-700' : 'border-transparent hover:bg-zinc-900'}`}>
                {isSelectMode && <div className={`w-3 h-3 rounded-sm border ${selectedIds.includes(chat.id) ? 'bg-cyan-400 border-cyan-400' : 'border-zinc-600'}`}></div>}
                {/* LOGS PROFILE IMAGE */}
                <img src={personas[chat.persona].img} className="w-8 h-8 rounded-full object-cover border border-white/10" alt="hero" />
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase leading-none">{chat.persona}</p>
                  <p className="text-[7px] text-zinc-600 italic mt-1">{chat.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
          {isSelectMode && selectedIds.length > 0 && (
            <button onClick={() => { setChats(chats.filter(c => !selectedIds.includes(c.id))); setSelectedIds([]); setIsSelectMode(false); }} className="w-full mt-4 bg-red-600 text-white font-black py-2 rounded-lg text-[9px] uppercase tracking-widest">Delete Selected</button>
          )}
        </div>
      </div>

      {/* BACKDROP for mobile sidebar */}
      {isSidebarOpen && <div className="absolute inset-0 bg-black/50 z-5 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col relative h-full">
        <div className="border-b-4 border-white flex justify-between bg-black z-10 shrink-0">
          <div className="flex items-center h-full overflow-hidden">
            {/* Mobile menu button */}
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 text-white">
              <div className="w-6 h-0.5 bg-white mb-1"></div>
              <div className="w-6 h-0.5 bg-white mb-1"></div>
              <div className="w-6 h-0.5 bg-white"></div>
            </button>
            <div className="bg-white text-black px-2 md:px-6 py-4 font-black text-xs md:text-xl uppercase italic border-r-4 border-black">⌨ SESSION ACTIVE</div>
            {activeChat && (
              <div className="ml-2 md:ml-6 flex items-center gap-2 md:gap-3 animate-fade-in flex-shrink-0">
                {/* HEADER PROFILE IMAGE */}
                <img src={personas[activeChat.persona].img} className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover border border-white/20" alt="pfp" />
                <span className="text-white font-black uppercase text-xs md:text-sm tracking-[0.2em] hidden sm:inline">{activeChat.persona}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 md:gap-4 mr-2 md:mr-8 flex-shrink-0">
            <button onClick={() => setIsMuted(!isMuted)} className="text-zinc-400 hover:text-white transition-colors">
              {isMuted ? "🔇" : "🔊"}
            </button>
            <button onClick={onReturn} className="text-white uppercase text-[8px] md:text-[11px] font-black tracking-widest border border-white/20 px-2 md:px-4 py-1 md:py-1.5 rounded hover:bg-white hover:text-black transition-all">Return</button>
            <button onClick={() => setIsInfoOpen(!isInfoOpen)} className="flex flex-col gap-1 group cursor-pointer ml-1 md:ml-2">
              <div className={`w-6 md:w-8 h-1.5 md:h-2 border border-white/40 transition-all ${isInfoOpen ? 'bg-white' : 'group-hover:bg-white'}`}></div>
              <div className={`w-6 md:w-8 h-1.5 md:h-2 border border-white/40 transition-all ${isInfoOpen ? 'bg-white' : 'group-hover:bg-white'}`}></div>
              <div className={`w-6 md:w-8 h-1.5 md:h-2 border border-white/40 transition-all ${isInfoOpen ? 'bg-white' : 'group-hover:bg-white'}`}></div>
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 md:p-6 lg:p-10 overflow-y-auto space-y-6 custom-scrollbar">
          {activeChat?.messages.length > 0 ? (
            activeChat.messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-up`}>
                {m.sender === 'bot' ? (
                  <div className="flex items-start gap-3 max-w-[90%] md:max-w-[85%] lg:max-w-[70%]">
                    <img src={personas[activeChat.persona].img} className="w-8 h-8 rounded-full object-cover border border-white/20 flex-shrink-0" alt="pfp" />
                    <div className="flex flex-col">
                      <span className="text-xs text-zinc-500 uppercase tracking-widest mb-1">{activeChat.persona}</span>
                      <div className="bg-white text-black p-3 md:p-4 rounded-[20px] font-serif italic text-sm md:text-base">{m.text}</div>
                    </div>
                  </div>
                ) : (
                  <div className={`max-w-[90%] md:max-w-[85%] lg:max-w-[70%] p-3 md:p-4 rounded-[20px] font-serif italic text-sm md:text-base bg-zinc-800 text-white`}>{m.text}</div>
                )}
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-10 text-center uppercase tracking-[0.5em]">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-black italic">Initialize Terminal</h2>
              <p className="text-[8px] md:text-[10px] mt-2 font-serif tracking-widest">Awaiting Uplink with {activeChat ? activeChat.persona : 'Strategic Asset'}</p>
            </div>
          )}
        </div>

        <div className="p-4 md:p-6 lg:p-10 shrink-0">
          <div className="max-w-4xl mx-auto bg-white rounded-full p-1.5 md:p-2 flex items-center shadow-2xl">
            <button className="p-2 md:p-4 text-zinc-400 hover:text-black transition-colors"><span className="text-lg md:text-xl">📎</span></button>
            <button className="p-2 md:p-4 text-zinc-400 hover:text-black transition-colors"><span className="text-lg md:text-xl">🎙</span></button>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Submit terminal query..." className="flex-1 bg-transparent text-black px-2 md:px-4 outline-none font-serif italic text-sm md:text-lg" />
            <button onClick={handleSend} className={`w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all ${input.trim() ? 'bg-black text-white hover:scale-110' : 'bg-zinc-100 text-zinc-300'}`}>➤</button>
          </div>
        </div>
      </div>

      {/* INTELLIGENCE MODAL */}
      {isInfoOpen && (
        <div className="absolute inset-0 z-[150] bg-black/95 flex items-center justify-center p-4 md:p-6 animate-fade-in backdrop-blur-md">
          <div className="w-full max-w-2xl bg-black border-2 border-white p-4 md:p-6 lg:p-10 rounded-sm shadow-2xl animate-up">
            <div className="flex gap-2 md:gap-4 mb-8">
              {Object.keys(personas).map(key => (
                <button key={key} onClick={() => setActiveInfoTab(key)} className={`flex-1 py-2 rounded-full font-black text-[10px] uppercase border-2 transition-all ${activeInfoTab === key ? `${personas[key].color} text-black border-transparent shadow-lg scale-105` : 'bg-transparent text-white border-zinc-800'}`}>{personas[key].name}</button>
              ))}
            </div>
            <div className="min-h-[250px] animate-fade-in" key={activeInfoTab}>
              <div className="flex items-center gap-4 mb-4">
                {/* MODAL PROFILE IMAGE */}
                <img src={personas[activeInfoTab].img} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-white/20" alt="pfp" />
                <div>
                  <h1 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter" style={{ color: activeInfoTab === 'CYBORG' ? 'white' : activeInfoTab === 'LEX' ? '#22c55e' : '#eab308' }}>{personas[activeInfoTab].name}</h1>
                  <p className="text-zinc-500 font-serif italic text-[8px] md:text-[10px] uppercase tracking-widest">{personas[activeInfoTab].trait}</p>
                </div>
              </div>
              <p className="text-zinc-300 font-serif italic text-sm md:text-base leading-relaxed text-justify">{personas[activeInfoTab].desc}</p>
            </div>
            <button onClick={() => setIsInfoOpen(false)} className="mt-10 w-full text-[10px] text-white font-black uppercase tracking-[0.3em] border border-zinc-800 px-10 py-4 hover:bg-white hover:text-black transition-all">Close Files</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;