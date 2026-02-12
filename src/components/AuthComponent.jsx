// components/AuthPage.jsx
import React, { useState } from 'react';

const AuthPage = ({ setView, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [isLogin, setIsLogin] = useState(true); // true for login, false for signup
  const [error, setError] = useState('');

  // Same backgrounds as WelcomePage
  const bgDesktop = "https://wallpapers.com/images/hd/gotham-city-1920-x-1080-background-uk0bh5rclbs88zdq.jpg";
  const bgMobile = "https://images7.alphacoders.com/133/thumb-1920-1330752.png";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Simple localStorage-based auth (for demo purposes)
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email);

    if (isLogin) {
      if (user && user.password === password) {
        setUser({ email: user.email, nickname: user.nickname });
        setView('chat');
      } else if (user) {
        setError('Incorrect password.');
      } else {
        // No account, switch to signup mode
        setIsLogin(false);
        setError('No account found. Please sign up below.');
      }
    } else {
      // Signup
      if (user) {
        setError('Account already exists. Please log in.');
        setIsLogin(true);
      } else if (!nickname.trim()) {
        setError('Nickname is required for signup.');
      } else {
        const newUser = { email, password, nickname };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        setUser({ email, nickname });
        setView('chat');
      }
    }
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex items-center px-4 md:px-8 lg:px-24">
      
      {/* BLUE MOVING GLOW FRAME */}
      <div className="fancy-frame"></div>

      <div className="absolute inset-0 z-0">
        {/* Desktop Image with Gotham Wallpaper */}
        <div className="hidden md:block absolute inset-0 bg-cover bg-center grayscale-[0.2]" 
             style={{ backgroundImage: `url(${bgDesktop})`, filter: 'brightness(0.4)' }} />
        {/* Mobile Image (Untouched) */}
        <div className="block md:hidden absolute inset-0 bg-cover bg-center grayscale-[0.2]" 
             style={{ backgroundImage: `url(${bgMobile})`, filter: 'brightness(0.5)' }} />
      </div>
      
      <div className="relative z-10 w-full text-center md:text-left animate-up">
        <h1 className="text-white text-4xl md:text-6xl lg:text-[9rem] font-black italic tracking-tighter leading-[0.9] uppercase mb-8 md:mb-12 drop-shadow-2xl">
          {isLogin ? 'Log In' : 'Sign Up'}
        </h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col items-center md:items-start gap-4 mb-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full max-w-xs md:w-56 lg:w-64 py-3 md:py-4 border border-zinc-800 rounded-full text-white bg-black/50 placeholder-zinc-500 outline-none focus:border-cyan-400 px-4"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full max-w-xs md:w-56 lg:w-64 py-3 md:py-4 border border-zinc-800 rounded-full text-white bg-black/50 placeholder-zinc-500 outline-none focus:border-cyan-400 px-4"
            required
          />
          {!isLogin && (
            <input
              type="text"
              placeholder="Nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full max-w-xs md:w-56 lg:w-64 py-3 md:py-4 border border-zinc-800 rounded-full text-white bg-black/50 placeholder-zinc-500 outline-none focus:border-cyan-400 px-4"
              required
            />
          )}
          {error && <p className="text-red-500 text-sm w-full max-w-xs md:w-56 lg:w-64 text-center md:text-left">{error}</p>}
          <button
            type="submit"
            className="w-full max-w-xs md:w-56 lg:w-64 py-3 md:py-4 bg-cyan-400 text-black rounded-full uppercase text-[9px] md:text-[10px] font-black tracking-[0.3em] md:tracking-[0.4em] hover:bg-cyan-300 transition-all shadow-2xl"
          >
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;