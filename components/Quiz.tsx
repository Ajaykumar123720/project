import React, { useState, useEffect, useCallback } from 'react';
import { QuizQuestion } from '../types';
import { geminiService } from '../services/geminiService';

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#FF7F11]"></div>
  </div>
);

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const startQuiz = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setQuizFinished(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    try {
      const fetchedQuestions = await geminiService.generateQuizQuestions(5);
      setQuestions(fetchedQuestions);
    } catch (err) {
      setError('Failed to load quiz questions. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    startQuiz();
  }, [startQuiz]);

  const handleAnswerSelect = (option: string) => {
    if (!isAnswered) {
      setSelectedAnswer(option);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    setIsAnswered(true);
    if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const getOptionClass = (option: string) => {
    if (!isAnswered) {
      return selectedAnswer === option ? 'bg-[#FF7F11] text-white' : 'hover:bg-[#FF7F11]/20 hover:border-[#FF7F11]';
    }
    const isCorrect = option === questions[currentQuestionIndex].correctAnswer;
    if (isCorrect) return 'bg-[#00A86B] text-white';
    if (selectedAnswer === option && !isCorrect) return 'bg-[#D72638] text-white';
    return 'opacity-60';
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg text-center">{error} <button onClick={startQuiz} className="ml-4 px-4 py-2 bg-[#FF7F11] rounded-full">Retry</button></div>;
  if (quizFinished) {
    return (
      <div className="text-center bg-white/5 border border-white/10 p-8 rounded-lg shadow-lg backdrop-blur-md animate-fadeIn">
        <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-2xl mb-6">Your score: <span className="font-bold text-[#FF7F11]">{score}</span> / {questions.length}</p>
        <button onClick={startQuiz} className="px-6 py-3 bg-[#FF7F11] text-white font-bold rounded-full hover:bg-[#D72638] transition-colors">
          Play Again
        </button>
      </div>
    );
  }

  if (questions.length === 0) return <div className="text-center">No questions available.</div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-6 md:p-10 shadow-lg backdrop-blur-md max-w-3xl mx-auto animate-fadeIn">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#FF7F11]">🧠 Constitution Knowledge Quiz</h2>
        <p className="text-gray-300 mt-1">Question {currentQuestionIndex + 1} of {questions.length}</p>
      </div>
      <div className="bg-white/5 border-l-4 border-l-[#FF7F11] p-6 rounded-lg mb-6">
        <p className="text-lg">{currentQuestion.question}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            disabled={isAnswered}
            className={`p-4 rounded-lg border border-white/20 bg-white/5 text-left transition-all duration-300 ${getOptionClass(option)}`}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="text-center">
        {isAnswered ? (
          <button onClick={handleNextQuestion} className="px-8 py-3 bg-[#0B132B] text-white font-bold rounded-full hover:bg-opacity-80 transition-colors">
            {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={selectedAnswer === null} className="px-8 py-3 bg-[#00A86B] text-white font-bold rounded-full hover:bg-opacity-80 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
