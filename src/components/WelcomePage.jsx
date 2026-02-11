import React from 'react';

const bgDesktop = "https://th.bing.com/th/id/R.213fc3d2246e8d03ed34de1b6a6f99d6?rik=sqBs7zXQG3ANJw&riu=http%3a%2f%2fs1.picswalls.com%2fwallpapers%2f2014%2f02%2f25%2fbatman-wallpaper-hd_022006607_34.jpg&ehk=fGSP9%2bdVculOeTult2MoFjPWdAFAY%2fvt4SJRQ4Tbzw0%3d&risl=&pid=ImgRaw&r=0";
const bgMobile = "https://tse2.mm.bing.net/th/id/OIP.W33V_Hzqo3GfrA-VcCt4cwHaLH?w=1333&h=2000&rs=1&pid=ImgDetMain&o=7&rm=3";

const WelcomePage = ({ setView }) => {
  return (
    <div className="relative h-screen w-full bg-black flex items-center overflow-hidden px-6 md:px-24 animate-fade-in">
      <div className="absolute inset-0 z-0">
        <div className="hidden md:block absolute inset-0 bg-cover bg-center grayscale-[0.3]" style={{ backgroundImage: `url(${bgDesktop})` }} />
        <div className="block md:hidden absolute inset-0 bg-cover bg-center grayscale-[0.2]" style={{ backgroundImage: `url(${bgMobile})` }} />
      </div>
      <div className="absolute inset-0 z-1 bg-black/40 md:bg-gradient-to-r md:from-black/80 md:via-black/20 md:to-transparent" />

      <div className="absolute top-8 left-8 flex flex-col gap-2.5 z-20 animate-up">
        <button onClick={() => setView('chat')} className="w-10 h-2 md:w-14 md:h-3 bg-black border border-white/40 hover:bg-zinc-800 transition-all cursor-pointer" title="Home"></button>
        <button onClick={() => setView('contacts')} className="w-10 h-2 md:w-14 md:h-3 bg-black border border-white/40 hover:bg-zinc-800 transition-all cursor-pointer" title="Contacts"></button>
        <button onClick={() => setView('about')} className="w-10 h-2 md:w-14 md:h-3 bg-black border border-white/40 hover:bg-zinc-800 transition-all cursor-pointer" title="About DC-AI"></button>
      </div>

      <div className="absolute top-8 right-8 w-12 h-12 md:w-16 md:h-16 border-2 border-white/20 rounded-full flex items-center justify-center font-black italic text-white/30 text-lg md:text-2xl z-20">DC</div>

      <div className="relative z-10 w-full animate-up">
        <h1 className="text-white text-5xl md:text-[8rem] font-black italic tracking-tighter leading-[0.9] mb-12 drop-shadow-2xl">
          WELCOME <br /> <span className="text-white/80 uppercase">to dc-ai</span>
        </h1>
        <div className="flex flex-col gap-4 w-full max-w-[280px] md:max-w-[320px] animate-up delay-1">
          <button onClick={() => setView('auth')} className="w-full py-4 bg-black text-white font-black italic tracking-[0.4em] rounded-full border border-zinc-700 hover:bg-zinc-900 transition-all uppercase shadow-2xl">Sign In</button>
          <button onClick={() => setView('auth')} className="w-full py-4 bg-black text-white font-black italic tracking-[0.4em] rounded-full border border-zinc-700 hover:bg-zinc-900 transition-all uppercase shadow-2xl">Log In</button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;