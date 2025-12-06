import React from 'react';
import { MOCK_POSTS } from '../constants';
import { MessageSquare, Heart, Share2, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const Community: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Community Feed</h2>
        <p className="text-slate-500 text-sm">See what other investors are buying and selling.</p>
        
        <div className="mt-4 flex gap-3">
          <input 
            type="text" 
            placeholder="Share your thoughts or a ticker..." 
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors">
            Post
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_POSTS.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full bg-slate-200" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{post.user}</h4>
                  <p className="text-xs text-slate-500">{post.timestamp}</p>
                </div>
              </div>
              {post.sentiment && (
                <div className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1
                  ${post.sentiment === 'Bullish' ? 'bg-green-100 text-green-700' : 
                    post.sentiment === 'Bearish' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                  {post.sentiment === 'Bullish' ? <TrendingUp size={12} /> : 
                   post.sentiment === 'Bearish' ? <TrendingDown size={12} /> : <Minus size={12} />}
                  {post.sentiment}
                </div>
              )}
            </div>
            
            <p className="text-slate-700 mb-4 leading-relaxed">
              {post.content.split(' ').map((word, i) => 
                word.startsWith('$') || word.startsWith('#') ? 
                <span key={i} className="text-blue-600 font-medium cursor-pointer hover:underline">{word} </span> : 
                word + ' '
              )}
            </p>

            <div className="flex items-center gap-6 pt-4 border-t border-slate-50 text-slate-400">
               <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
                 <Heart size={18} />
                 <span className="text-sm">{post.likes}</span>
               </button>
               <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                 <MessageSquare size={18} />
                 <span className="text-sm">{post.comments}</span>
               </button>
               <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
                 <Share2 size={18} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
