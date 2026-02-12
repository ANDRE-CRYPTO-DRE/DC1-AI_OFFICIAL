import React, { useState } from 'react';

const WelcomePage = ({ setView, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [overlay, setOverlay] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  // Updated Desktop Background to the new image
  const bgDesktop = "https://moewalls.com/wp-content/uploads/2023/06/batman-overlooking-gotham-from-wayne-tower-thumb.jpg";
  // Kept original Mobile Background untouched
  const bgMobile = "https://images7.alphacoders.com/133/thumb-1920-1330752.png";

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Simple localStorage-based auth (for demo purposes)
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
      // Log in with existing user
      setUser({ email: existingUser.email, nickname: existingUser.nickname });
      setView('chat');
      setShowAuth(false);
    } else {
      // Sign up new user
      if (!nickname.trim()) {
        setError('Nickname is required.');
        return;
      }
      const newUser = { email, nickname };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      setUser({ email, nickname });
      setView('chat');
      setShowAuth(false);
    }
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex items-center px-8 md:px-24 animate-fade-in">
      
      {/* BLUE MOVING GLOW FRAME */}
      <div className="fancy-frame"></div>

      <div className="absolute inset-0 z-0">
        {/* Desktop Image with Updated Background */}
        <div className="hidden md:block absolute inset-0 bg-cover bg-center grayscale-[0.2]" 
             style={{ backgroundImage: `url(${bgDesktop})`, filter: 'brightness(0.4)' }} />
        {/* Mobile Image (Untouched) */}
        <div className="block md:hidden absolute inset-0 bg-cover bg-center grayscale-[0.2]" 
             style={{ backgroundImage: `url(${bgMobile})`, filter: 'brightness(0.5)' }} />
      </div>
      
      <nav className="absolute top-10 left-8 md:left-10 z-[110] animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex flex-col gap-2 group transition-all">
          <div className={`w-10 h-2.5 md:w-12 md:h-3 border border-cyan-400/40 transition-all ${isMenuOpen ? 'bg-cyan-400' : 'group-hover:bg-cyan-400'}`}></div>
          <div className={`w-10 h-2.5 md:w-12 md:h-3 border border-cyan-400/40 transition-all ${isMenuOpen ? 'bg-cyan-400' : 'group-hover:bg-cyan-400'}`}></div>
          <div className={`w-10 h-2.5 md:w-12 md:h-3 border border-cyan-400/40 transition-all ${isMenuOpen ? 'bg-cyan-400' : 'group-hover:bg-cyan-400'}`}></div>
        </button>

        {isMenuOpen && (
          <div className="mt-4 bg-black/90 border border-zinc-800 p-6 rounded-3xl w-64 backdrop-blur-md animate-up shadow-2xl">
            <div className="flex flex-col gap-5 text-left">
              <button onClick={() => {setOverlay('Contacts'); setIsMenuOpen(false);}} className="text-zinc-400 hover:text-white uppercase text-[10px] font-black tracking-widest transition-all">01. Contacts</button>
              <button onClick={() => {setOverlay('About DC-AI'); setIsMenuOpen(false);}} className="text-zinc-400 hover:text-white uppercase text-[10px] font-black tracking-widest transition-all">02. About DC-AI</button>
              <button onClick={() => {setOverlay('About Design'); setIsMenuOpen(false);}} className="text-zinc-400 hover:text-white uppercase text-[10px] font-black tracking-widest transition-all">03. About Design</button>
            </div>
          </div>
        )}
      </nav>

      {/* OVERLAY MODALS WITH NEW DESCRIPTIONS */}
      {overlay && (
        <div className="fixed inset-0 z-[120] bg-black/95 flex items-center justify-center p-10 animate-fade-in text-center backdrop-blur-sm">
          <div className="max-w-md animate-up">
            <h2 className="text-4xl font-black uppercase italic mb-6 text-white tracking-tighter">{overlay}</h2>
            <div className="text-zinc-300 font-serif italic text-lg mb-10 leading-relaxed">
              {overlay === 'Contacts' && (
                <div className="space-y-2">
                  <p>Email: andikel2008@gmail.com</p>
                  <p>Phone: 09150847628</p>
                </div>
              )}
              
              {overlay === 'About DC-AI' && (
                <p>DC-AI is a smart chatbot that lets you talk directly with legendary characters like Batman, Cyborg, and Lex Luthor. Each character responds exactly like they do in the comics—Batman is tactical and serious, Cyborg is high-tech and helpful, and Lex is brilliant and ambitious. It’s like having a private, secret terminal to the most powerful minds in the DC Universe.</p>
              )}

              {overlay === 'About Design' && (
                <p>The look of this app is inspired by the dark, high-tech world of Gotham City. We used a "Brutalist" style, which means using bold white lines, deep black backgrounds, and sharp edges. The glowing blue frame and clean circular profiles make the app feel like a tactical computer you would see in the Batcave. It is designed to be simple, fast, and powerful.</p>
              )}
            </div>
            <button onClick={() => setOverlay(null)} className="px-10 py-2 border border-zinc-800 rounded-full uppercase text-[10px] font-black tracking-widest hover:bg-white hover:text-black transition-all">Close</button>
          </div>
        </div>
      )}

      <div className="relative z-10 w-full text-center md:text-right animate-up" style={{ animationDelay: '0.2s' }}>
        <h1 className="text-white text-5xl md:text-[9rem] font-black italic tracking-tighter leading-[0.9] uppercase mb-12 drop-shadow-2xl animate-fade-in" style={{ animationDelay: '0.8s' }}>
          Welcome<br />To DC-AI
        </h1>
        
        <div className="flex flex-col items-center md:items-end gap-4 animate-fade-in" style={{ animationDelay: '1.2s' }}>
          {!user ? (
            showAuth ? (
              <form onSubmit={handleAuthSubmit} className="flex flex-col items-center md:items-end gap-4 animate-up" style={{ animationDelay: '0.1s' }}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-56 md:w-64 py-4 border border-zinc-800 rounded-full text-white bg-black/50 placeholder-zinc-500 outline-none focus:border-cyan-400 px-4 transition-all duration-300 hover:scale-105"
                  required
                />
                <input
                  type="text"
                  placeholder="Nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-56 md:w-64 py-4 border border-zinc-800 rounded-full text-white bg-black/50 placeholder-zinc-500 outline-none focus:border-cyan-400 px-4 transition-all duration-300 hover:scale-105"
                  required
                />
                {error && <p className="text-red-500 text-sm w-56 md:w-64 text-center md:text-right animate-fade-in">{error}</p>}
                <button
                  type="submit"
                  className="w-56 md:w-64 py-4 bg-cyan-400 text-black rounded-full uppercase text-[10px] font-black tracking-[0.4em] hover:bg-cyan-300 transition-all shadow-2xl hover:scale-110"
                >
                  Start Chat
                </button>
              </form>
            ) : (
              <>
                <button onClick={() => setView('chat')} className="w-56 md:w-64 py-4 border border-zinc-800 rounded-full text-white uppercase text-[10px] font-black tracking-[0.4em] hover:bg-white hover:text-black transition-all shadow-2xl hover:scale-110 animate-fade-in" style={{ animationDelay: '1.5s' }}>Start Chat</button>
              </>
            )
          ) : (
            <>
              <button onClick={() => setView('chat')} className="w-56 md:w-64 py-4 bg-white text-black rounded-full uppercase text-[10px] font-black tracking-[0.4em] hover:bg-zinc-200 transition-all shadow-2xl hover:scale-110 animate-fade-in" style={{ animationDelay: '1.5s' }}>Continue Terminal</button>
              <button onClick={onLogout} className="w-56 md:w-64 py-4 border border-zinc-800 rounded-full text-white uppercase text-[10px] font-black tracking-[0.4em] hover:bg-red-600 hover:border-red-600 transition-all hover:scale-110 animate-fade-in" style={{ animationDelay: '1.7s' }}>Log Out</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;