import React from 'react';
import { SectionId, NavButton } from '../types';

interface HeaderProps {
  activeSection: SectionId;
  showSection: (id: SectionId) => void;
}

const navButtons: NavButton[] = [
  { id: 'home', label: 'Home' },
  { id: 'lessons', label: 'Lessons' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'discussion', label: 'Discussion' },
  { id: 'admin', label: 'Admin' },
];

const Header: React.FC<HeaderProps> = ({ activeSection, showSection }) => {
  return (
    <header className="bg-gradient-to-r from-[#FF7F11] to-[#D72638] sticky top-0 z-50 shadow-2xl backdrop-blur-lg">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center">
        <div className="text-2xl font-bold text-white tracking-wider text-shadow">
          🇮🇳 Constitution Connect
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-4 md:mt-0">
          {navButtons.map((button) => (
            <button
              key={button.id}
              onClick={() => showSection(button.id)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ease-in-out backdrop-blur-sm
                ${
                  activeSection === button.id
                    ? 'bg-white text-[#0B132B] shadow-lg transform -translate-y-0.5'
                    : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:text-white'
                }`}
            >
              {button.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
