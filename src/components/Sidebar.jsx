import React, { useState } from 'react';
import { User, ChevronLeftSquare } from 'lucide-react';

const DCSidebar = () => {
  const [selectedCharacter, setSelectedCharacter] = useState('BATMAN');

  const characters = ['BATMAN', 'CYBORG', 'LEX LUTHOR'];

  return (
    <div className="w-72 h-screen bg-black text-white p-6 flex flex-col font-sans border-r border-gray-800">
      
      {/* --- TOP HEADER --- */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-2">
          {/* Mock DC Logo */}
          <div className="w-10 h-10 rounded-full border-2 border-gray-500 flex items-center justify-center overflow-hidden">
             <span className="font-bold text-xl tracking-tighter">DC</span>
          </div>
          <span className="text-2xl font-serif">-Ai</span>
        </div>
        <button className="text-white hover:opacity-70 transition-opacity">
          <ChevronLeftSquare size={28} strokeWidth={1.5} />
        </button>
      </div>

      {/* --- AI PERSONA SECTION --- */}
      <div className="flex items-center gap-3 mb-4">
        <User size={32} strokeWidth={2.5} fill="white" />
        <h2 className="text-3xl font-black tracking-tighter uppercase italic">
          Ai Persona
        </h2>
      </div>

      <hr className="border-t-2 border-white mb-8" />

      {/* --- CHARACTER SELECTION --- */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4 tracking-tight">
          Select Ai Character
        </h3>
        
        <div className="flex flex-wrap gap-3">
          {characters.map((char) => (
            <button
              key={char}
              onClick={() => setSelectedCharacter(char)}
              className={`px-4 py-1.5 rounded-full text-sm font-serif font-medium transition-colors duration-200 border border-transparent
                ${selectedCharacter === char 
                  ? 'bg-[#E2D43B] text-black hover:bg-[#c9bc34]' 
                  : 'bg-white text-black hover:bg-gray-200'
                }`}
            >
              {char}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-t-2 border-white mb-8" />

      {/* --- DOMAIN EXPERTISE --- */}
      <div>
        <h2 className="text-3xl font-black tracking-tighter uppercase italic mb-4">
          Domain Expertise
        </h2>
        <p className="text-xl font-serif text-gray-100">
          Generalist
        </p>
      </div>

      {/* Footer / Empty Space */}
      <div className="mt-auto">
        {/* You can add chat history or settings here */}
      </div>
    </div>
  );
};

export default SidebarApp;