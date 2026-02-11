import React from 'react';

const bgAuth = "https://images7.alphacoders.com/133/thumb-1920-1330752.png";

const AuthPage = ({ setView }) => {
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
        <h1 className="text-white text-4xl md:text-7xl font-black italic tracking-tighter uppercase mb-2 animate-up">Welcome Back!</h1>
        <p className="text-zinc-200 font-serif italic mb-10 animate-up delay-1">Proceed from the last point.</p>
        <div className="bg-black/90 border border-zinc-800 p-6 md:p-10 rounded-[45px] shadow-3xl backdrop-blur-sm animate-up">
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

export default AuthPage;