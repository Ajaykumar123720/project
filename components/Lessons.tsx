import React, { useState, useEffect, useCallback } from 'react';
import { LessonTopic } from '../types';
import { geminiService } from '../services/geminiService';

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#FF7F11]"></div>
  </div>
);

const LessonCard: React.FC<{ topic: LessonTopic; onSelect: () => void }> = ({ topic, onSelect }) => (
  <div
    onClick={onSelect}
    className="bg-white/5 border border-white/10 border-l-4 border-l-[#FF7F11] rounded-lg p-6 shadow-lg backdrop-blur-md cursor-pointer transition-all duration-300 hover:bg-white/10 hover:shadow-xl hover:-translate-y-1"
  >
    <h3 className="text-xl font-bold text-[#FF7F11] mb-2">{topic.title}</h3>
    <p className="text-gray-300">{topic.summary}</p>
  </div>
);

const LessonDetail: React.FC<{ topic: LessonTopic; content: string; onBack: () => void }> = ({ topic, content, onBack }) => (
  <div className="bg-white/5 border border-white/10 rounded-lg p-8 shadow-lg backdrop-blur-md animate-fadeIn">
    <button onClick={onBack} className="mb-6 px-4 py-2 bg-[#FF7F11] text-white rounded-full hover:bg-[#D72638] transition-colors">
      &larr; Back to Lessons
    </button>
    <h2 className="text-3xl font-bold text-white mb-4">{topic.title}</h2>
    <div className="prose prose-invert max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: content }} />
  </div>
);

const Lessons: React.FC = () => {
  const [topics, setTopics] = useState<LessonTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<LessonTopic | null>(null);
  const [lessonContent, setLessonContent] = useState<string>('');
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTopics = useCallback(async () => {
    try {
      setIsLoadingTopics(true);
      setError(null);
      const fetchedTopics = await geminiService.generateLessonTopics();
      setTopics(fetchedTopics);
    } catch (err) {
      setError('Failed to load lesson topics. Please try again later.');
      console.error(err);
    } finally {
      setIsLoadingTopics(false);
    }
  }, []);
  
  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const handleSelectTopic = async (topic: LessonTopic) => {
    setSelectedTopic(topic);
    try {
      setIsLoadingContent(true);
      setError(null);
      const content = await geminiService.generateLessonContent(topic.title);
      setLessonContent(content);
    } catch (err) {
      setError('Failed to load lesson content. Please try again later.');
      console.error(err);
    } finally {
      setIsLoadingContent(false);
    }
  };

  const handleBack = () => {
    setSelectedTopic(null);
    setLessonContent('');
  };

  return (
    <section className="animate-fadeIn">
      <h2 className="text-3xl font-bold text-white mb-8">📘 Lessons on the Constitution</h2>
      {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6">{error}</div>}
      
      {selectedTopic ? (
        isLoadingContent ? <LoadingSpinner /> : <LessonDetail topic={selectedTopic} content={lessonContent} onBack={handleBack} />
      ) : (
        isLoadingTopics ? <LoadingSpinner /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic, index) => (
              <LessonCard key={index} topic={topic} onSelect={() => handleSelectTopic(topic)} />
            ))}
          </div>
        )
      )}
    </section>
  );
};

export default Lessons;
