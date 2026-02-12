import React, { useState, useEffect } from 'react';
import WelcomePage from './components/WelcomePage';
import DCSidebar from './components/DCSidebar';
import ChatInterface from './components/ChatInterface';

/* ===============================
   INTERNAL COMPONENT: AuthPage
   (Moved here to fix import errors)
================================ */
const AuthPage = ({ setView }) => {
  const bgAuth = "https://images7.alphacoders.com/133/thumb-1920-1330752.png";
  const providers = [
    { name: 'Google', icon: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' },
    { name: 'Facebook', icon: 'https://cdn-icons-png.flaticon.com/512/124/124010.png' },
    { name: 'Apple', icon: 'https://cdn-icons-png.flaticon.com/512/152/152752.png' },
    { name: 'Email', icon: 'https://cdn-icons-png.flaticon.com/512/732/732200.png' }
  ];

  return (
    <div className="relative h-screen w-full bg-black flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="absolute inset-0 opacity-50 grayscale blur-[1px] bg-cover bg-center" style={{ backgroundImage: `url(${bgAuth})` }} />
      <div className="relative z-10 w-full max-w-sm md:max-w-md text-center">
        <h1 className="text-white text-4xl md:text-7xl font-black italic tracking-tighter uppercase mb-2">Welcome Back!</h1>
        <p className="text-zinc-200 font-serif italic mb-10">Proceed from the last point.</p>
        <div className="bg-black/90 border border-zinc-800 p-6 md:p-10 rounded-[45px] shadow-3xl backdrop-blur-sm">
          <div className="flex flex-col gap-4">
            {providers.map((p) => (
              <button key={p.name} onClick={() => setView('chat')} className="w-full bg-white text-black py-4 px-6 md:px-10 rounded-full flex items-center justify-between hover:scale-[1.02] active:scale-95 transition-all shadow-md">
                <img src={p.icon} alt={p.name} className="w-7 h-7 object-contain" />
                <span className="font-serif text-lg md:text-xl font-bold">Continue with {p.name}</span>
                <div className="w-7" />
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => setView('welcome')} className="mt-10 text-zinc-400 uppercase text-[10px] md:text-xs font-bold tracking-[0.5em] hover:text-white transition-colors">← Cancel Terminal Uplink</button>
      </div>
    </div>
  );
};

/* ===============================
   CHARACTER PROFILES
================================ */
const CHARACTER_PROFILES = {
  BATMAN: { name: "Batman", title: "The Dark Knight", icon: "🦇" },
  CYBORG: { name: "Cyborg", title: "Systems Intelligence", icon: "🤖" },
  LEX: { name: "Lex Luthor", title: "Strategic Mastermind", icon: "🧠" },
};

/* ===============================
   MAIN APP COMPONENT
================================ */
export default function App() {
  const [view, setView] = useState('welcome');
  const [selectedCharacter, setSelectedCharacter] = useState('BATMAN');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem('dc_ai_vault_master');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeChatId, setActiveChatId] = useState(null);

  useEffect(() => {
    localStorage.setItem('dc_ai_vault_master', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const openChatForCharacter = (persona) => {
    const existing = chatHistory.find(chat => chat.persona === persona);
    if (existing) {
      setActiveChatId(existing.id);
    } else {
      const profile = CHARACTER_PROFILES[persona];
      const newChat = {
        id: Date.now(),
        persona,
        profile,
        messages: [],
        timestamp: new Date().toLocaleDateString(),
      };
      setChatHistory(prev => [newChat, ...prev]);
      setActiveChatId(newChat.id);
    }
    setIsSidebarOpen(false);
  };

  const deleteChat = (id) => {
    const filtered = chatHistory.filter(chat => chat.id !== id);
    setChatHistory(filtered);
    setActiveChatId(filtered.length ? filtered[0].id : null);
  };

  const currentChat = chatHistory.find(c => c.id === activeChatId);

  return (
    <div className="bg-black min-h-screen text-white overflow-hidden">
      
      {view === 'welcome' && <WelcomePage setView={setView} />}
      
      {/* AuthPage is now internal, no import needed */}
      {view === 'auth' && <AuthPage setView={setView} />}

      {view === 'chat' && (
        <div className="flex h-screen w-full bg-black">
          <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 w-72 bg-black border-r border-zinc-800`}>
            <DCSidebar
              selectedCharacter={selectedCharacter}
              handlePersonaChange={(c) => {
                setSelectedCharacter(c);
                openChatForCharacter(c);
              }}
              chatHistory={chatHistory}
              activeChatId={activeChatId}
              setActiveChatId={setActiveChatId}
              deleteChat={deleteChat}
            />
          </div>

          {currentChat && (
            <ChatInterface
              currentChat={currentChat}
              setChatHistory={setChatHistory}
              setIsSidebarOpen={setIsSidebarOpen}
              onReturn={() => setView('welcome')}
            />
          )}
        </div>
      )}
    </div>
  );
}