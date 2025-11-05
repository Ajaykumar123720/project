import React, { useState, useEffect, useCallback } from 'react';
import { DiscussionPost } from '../types';
import { geminiService } from '../services/geminiService';

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center py-4">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF7F11]"></div>
  </div>
);


const Discussion: React.FC = () => {
  const [posts, setPosts] = useState<DiscussionPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInitialPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const initialPosts = await geminiService.generateDiscussionTopics();
      setPosts(initialPosts);
    } catch(err) {
      setError("Failed to load discussion topics. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialPosts();
  }, [fetchInitialPosts]);
  
  const handlePostSubmit = async () => {
    if (!newPost.trim()) return;

    const userPost: DiscussionPost = { author: 'You', content: newPost };
    const updatedPosts = [...posts, userPost];
    setPosts(updatedPosts);
    setNewPost('');
    setIsAiTyping(true);

    try {
      const aiResponse = await geminiService.getAiResponse(updatedPosts);
      setPosts(prevPosts => [...prevPosts, { author: 'AI Assistant', content: aiResponse }]);
    } catch (err) {
      setPosts(prevPosts => [...prevPosts, { author: 'System', content: 'Sorry, I was unable to generate a response.' }]);
      console.error(err);
    } finally {
      setIsAiTyping(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-6 md:p-10 shadow-lg backdrop-blur-md max-w-4xl mx-auto animate-fadeIn">
      <h2 className="text-3xl font-bold text-white mb-6">💬 Discussion Forum</h2>
      
      {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6">{error}</div>}

      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
        {isLoading ? <LoadingSpinner /> : posts.map((post, index) => (
          <div key={index} className={`bg-white/5 p-4 rounded-lg border-l-4 ${post.author === 'AI Assistant' ? 'border-l-[#00A86B]' : 'border-l-[#FF7F11]'}`}>
            <p><strong className="text-white">{post.author}:</strong> <span className="text-gray-300">{post.content}</span></p>
          </div>
        ))}
        {isAiTyping && (
           <div className="flex items-center space-x-2 bg-white/5 p-4 rounded-lg border-l-4 border-l-[#00A86B]">
              <strong className="text-white">AI Assistant:</strong>
              <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
              </div>
           </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <textarea
          rows={2}
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handlePostSubmit(); }}}
          placeholder="Add your comment..."
          className="flex-grow bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF7F11] transition-all"
        />
        <button 
          onClick={handlePostSubmit}
          disabled={!newPost.trim() || isAiTyping}
          className="px-8 py-3 bg-[#FF7F11] text-white font-bold rounded-full hover:bg-[#D72638] transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
          Post
        </button>
      </div>
    </div>
  );
};

export default Discussion;
