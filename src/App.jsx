import React, { useState, useEffect } from 'react';
import WelcomePage from './components/WelcomePage';
import AuthPage from './components/AuthPage';
import DCSidebar from './components/DCSidebar';
import ChatInterface from './components/ChatInterface';

/* ===============================
   CHARACTER PROFILES
================================ */
const CHARACTER_PROFILES = {
  BATMAN: { name: "Batman", title: "The Dark Knight", icon: "🦇" },
  CYBORG: { name: "Cyborg", title: "Systems Intelligence", icon: "🤖" },
  LEX: { name: "Lex Luthor", title: "Strategic Mastermind", icon: "🧠" },
};

export default function App() {
  const [view, setView] = useState('welcome');
  const [selectedCharacter, setSelectedCharacter] = useState('BATMAN');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /* ===============================
     CHAT STORAGE
  ================================ */
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem('dc_ai_vault_master');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeChatId, setActiveChatId] = useState(null);

  useEffect(() => {
    localStorage.setItem('dc_ai_vault_master', JSON.stringify(chatHistory));
  }, [chatHistory]);

  /* ===============================
     AUTO-OPEN / AUTO-CREATE CHAT
  ================================ */
  const openChatForCharacter = (persona) => {
    // Check if chat already exists
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
      {view === 'auth' && <AuthPage setView={setView} />}

      {view === 'chat' && (
        <div className="flex h-screen w-full bg-black">

          {/* SIDEBAR */}
          <div
            className={`fixed inset-y-0 left-0 z-50 transform ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } md:relative md:translate-x-0 transition-transform duration-300 w-72 bg-black border-r border-zinc-800`}
          >
            <DCSidebar
              selectedCharacter={selectedCharacter}
              handlePersonaChange={(c) => {
                setSelectedCharacter(c);
                openChatForCharacter(c); // 🔥 AUTO OPEN
              }}
              chatHistory={chatHistory}
              activeChatId={activeChatId}
              setActiveChatId={setActiveChatId}
              deleteChat={deleteChat}
            />
          </div>

          {/* CHAT — ALWAYS AVAILABLE */}
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
