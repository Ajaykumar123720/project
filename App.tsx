import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import Lessons from './components/Lessons';
import Quiz from './components/Quiz';
import Discussion from './components/Discussion';
import Admin from './components/Admin';
import { SectionId } from './types';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('home');

  const showSection = useCallback((id: SectionId) => {
    setActiveSection(id);
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <Home showSection={showSection} />;
      case 'lessons':
        return <Lessons />;
      case 'quiz':
        return <Quiz />;
      case 'discussion':
        return <Discussion />;
      case 'admin':
        return <Admin />;
      default:
        return <Home showSection={showSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-[#E0E0E0]">
      <Header activeSection={activeSection} showSection={showSection} />
      <main className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {renderSection()}
      </main>
    </div>
  );
};

export default App;
