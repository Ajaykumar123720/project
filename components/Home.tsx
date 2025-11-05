import React from 'react';
import { SectionId } from '../types';

interface HomeProps {
  showSection: (id: SectionId) => void;
}

const Home: React.FC<HomeProps> = ({ showSection }) => {
  return (
    <section className="animate-fadeIn">
      <div className="text-center bg-gradient-to-br from-white/10 to-transparent border border-white/20 backdrop-blur-xl p-8 md:p-16 rounded-2xl shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Empowering Citizens through Constitutional Awareness
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Explore, Learn, and Test your knowledge about the Indian Constitution in an engaging and interactive way.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={() => showSection('lessons')}
            className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-[#FF7F11] to-[#D72638] rounded-full transition-transform duration-300 hover:scale-105 shadow-lg"
          >
            Start Learning
          </button>
          <button
            onClick={() => showSection('quiz')}
            className="px-8 py-4 text-lg font-bold text-white bg-[#0B132B] rounded-full transition-transform duration-300 hover:scale-105 shadow-lg"
          >
            Take a Quiz
          </button>
        </div>
      </div>
    </section>
  );
};

export default Home;
