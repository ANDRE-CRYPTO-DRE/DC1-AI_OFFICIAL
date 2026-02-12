import React, { useState, useEffect } from 'react';
import WelcomePage from './components/WelcomePage';
import ChatInterface from './components/ChatInterface';

function App() {
  const [view, setView] = useState('welcome');
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  useEffect(() => {
    // Load user from localStorage on app start
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    // Load chats from localStorage
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  }, []);

  useEffect(() => {
    // Save user to localStorage
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  useEffect(() => {
    // Save chats to localStorage
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  const onLogout = () => {
    setUser(null);
    setView('welcome');
  };

  const purgeCache = () => {
    setChats([]);
    setActiveChatId(null);
    localStorage.removeItem('chats');
  };

  return (
    <div className="App">
      {view === 'welcome' && (
        <WelcomePage setView={setView} user={user} onLogout={onLogout} />
      )}
      {view === 'chat' && (
        <ChatInterface
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
          chats={chats}
          setChats={setChats}
          onReturn={() => setView('welcome')}
          purgeCache={purgeCache}
        />
      )}
    </div>
  );
}

export default App;