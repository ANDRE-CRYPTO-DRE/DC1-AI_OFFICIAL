import React, { useState, useEffect } from 'react';
import WelcomePage from './components/WelcomePage';
import AuthPage from './components/AuthPage';
import DCSidebar from './components/DCSidebar';
import ChatInterface from './components/ChatInterface';

const InfoScreen = ({ title, content, setView }) => (
  <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-center p-12">
    <h1 className="text-white text-5xl md:text-7xl font-black italic uppercase mb-6 animate-up relative z-10">{title}</h1>
    <p className="text-zinc-400 font-serif text-xl md:text-2xl max-w-lg mb-10 animate-up delay-1 relative z-10">{content}</p>
    <button onClick={() => setView('welcome')} className="relative z-10 px-12 py-3 border-2 border-white text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">RETURN</button>
  </div>
);

export default function App() {
  const [view, setView] = useState('welcome');
  const [selectedCharacter, setSelectedCharacter] = useState('BATMAN');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem('dc_ai_vault_master');
    const parsed = saved ? JSON.parse(saved) : [];
    if (parsed.length === 0) {
      const newId = Date.now();
      return [{ id: newId, name: "Tactical Uplink", persona: 'BATMAN', messages: [], timestamp: new Date().toLocaleDateString() }];
    }
    return parsed;
  });

  const [activeChatId, setActiveChatId] = useState(() => {
    // Re-read or just rely on the fact that if we just initialized, we can grab the first id.
    // Since we can't easily access the result of the previous useState initializer *inside* this initializer without repeating logic:
    const saved = localStorage.getItem('dc_ai_vault_master');
    const parsed = saved ? JSON.parse(saved) : [];
    if (parsed.length === 0) {
      // This logic is slightly risky if Date.now() ticks, but we can't easily share the "newly created" ID unless we extract logic.
      // However, since we just need *a* ID to match, and strict mode might run twice...
      // Let's rely on an effect for the *selection* if it's null, BUT validly so.
      // Actually, if I just modify the first useState to return the history, I can set the activeId in a useEffect that simple sets it if null, which is what was happening.
      // The warning was about `createNewChat` (modifying history) inside effect.
      // Setting active ID is fine.
      return null;
    }
    return parsed[0].id;
  });

  // Clean up side-effects
  useEffect(() => {
    localStorage.setItem('dc_ai_vault_master', JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Ensure activeChatId is set if possible


  const createNewChat = (persona = selectedCharacter) => {
    const newId = Date.now();
    const newEntry = { id: newId, name: "Tactical Uplink", persona: persona, messages: [], timestamp: new Date().toLocaleDateString() };
    setChatHistory([newEntry, ...chatHistory]);
    setActiveChatId(newId);
    setIsSidebarOpen(false);
  };

  const deleteChat = (id) => {
    const filtered = chatHistory.filter(chat => chat.id !== id);
    setChatHistory(filtered);
    if (activeChatId === id) setActiveChatId(filtered.length > 0 ? filtered[0].id : null);
  };

  const currentChat = chatHistory.find(c => c.id === activeChatId) || chatHistory[0];

  return (
    <div className="bg-black min-h-screen text-white overflow-hidden">
      {view === 'welcome' && <WelcomePage setView={setView} />}
      {view === 'auth' && <AuthPage setView={setView} />}
      {view === 'contacts' && <InfoScreen title="CONTACTS" content="Justice League Secure Frequency: 01-G-Delta" setView={setView} />}
      {view === 'about' && <InfoScreen title="ABOUT" content="Advanced Neural Interface for mission coordination." setView={setView} />}

      {view === 'chat' && (
        <div className="flex h-screen w-full bg-black overflow-hidden relative animate-fade-in">
          <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 w-72 bg-black border-r border-zinc-800 flex flex-col p-6`}>
            <DCSidebar
              selectedCharacter={selectedCharacter}
              handlePersonaChange={(c) => { setSelectedCharacter(c); createNewChat(c); }}
              createNewChat={() => createNewChat(selectedCharacter)}
              chatHistory={chatHistory}
              activeChatId={activeChatId}
              setActiveChatId={setActiveChatId}
              deleteChat={deleteChat}
            />
          </div>
          <ChatInterface
            currentChat={currentChat}
            setChatHistory={setChatHistory}
            setIsSidebarOpen={setIsSidebarOpen}
            onReturn={() => setView('welcome')}
          />
        </div>
      )}
    </div>
  );
}