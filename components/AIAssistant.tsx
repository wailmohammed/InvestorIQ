import React, { useState, useRef, useEffect } from 'react';
import { Portfolio } from '../types';
import { getPortfolioAnalysis, getStockDeepDive, chatWithAdvisor } from '../services/geminiService';
import { Send, Sparkles, Loader2, Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

interface AIAssistantProps {
  portfolio: Portfolio;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ portfolio }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'analyze' | 'roast'>('chat');
  
  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Hello! I am your InvestIQ AI assistant. Ask me about investment concepts, market trends, or help analyzing a stock.' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Analysis State
  const [analyzeTicker, setAnalyzeTicker] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analyzeLoading, setAnalyzeLoading] = useState(false);

  // Portfolio Analysis State
  const [portfolioReview, setPortfolioReview] = useState<string | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatLoading(true);

    // Convert messages to history format for Gemini
    const history = messages.map(m => ({ role: m.role, parts: m.text }));
    const response = await chatWithAdvisor(history, userMsg);

    setMessages(prev => [...prev, { role: 'model', text: response || "Sorry, I couldn't process that." }]);
    setChatLoading(false);
  };

  const handleAnalyzeStock = async () => {
    if (!analyzeTicker) return;
    setAnalyzeLoading(true);
    setAnalysisResult(null);
    
    const result = await getStockDeepDive(analyzeTicker);
    // Add dummy radar data if result exists
    if (result) {
        result.radarData = [
            { subject: 'Value', A: Math.floor(Math.random() * 100), fullMark: 100 },
            { subject: 'Future', A: Math.floor(Math.random() * 100), fullMark: 100 },
            { subject: 'Past', A: Math.floor(Math.random() * 100), fullMark: 100 },
            { subject: 'Health', A: Math.floor(Math.random() * 100), fullMark: 100 },
            { subject: 'Dividend', A: Math.floor(Math.random() * 100), fullMark: 100 },
        ];
    }
    setAnalysisResult(result);
    setAnalyzeLoading(false);
  };

  const handlePortfolioRoast = async () => {
    setReviewLoading(true);
    const result = await getPortfolioAnalysis(portfolio.holdings);
    setPortfolioReview(result || "Failed to analyze.");
    setReviewLoading(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
      
      {/* Sidebar / Tabs for AI Tools */}
      <div className="w-full lg:w-64 flex flex-col gap-2 shrink-0">
        <button 
          onClick={() => setActiveTab('chat')}
          className={`p-4 rounded-xl text-left border transition-all ${activeTab === 'chat' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
        >
          <div className="font-bold flex items-center gap-2"><Sparkles size={18} /> Chat Advisor</div>
          <div className="text-xs text-slate-500 mt-1">Ask general questions</div>
        </button>
        <button 
          onClick={() => setActiveTab('analyze')}
          className={`p-4 rounded-xl text-left border transition-all ${activeTab === 'analyze' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
        >
          <div className="font-bold flex items-center gap-2"><Search size={18} /> Stock Deep Dive</div>
          <div className="text-xs text-slate-500 mt-1">Analyze a specific ticker</div>
        </button>
        <button 
          onClick={() => setActiveTab('roast')}
          className={`p-4 rounded-xl text-left border transition-all ${activeTab === 'roast' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
        >
          <div className="font-bold flex items-center gap-2"><AlertCircle size={18} /> Portfolio Checkup</div>
          <div className="text-xs text-slate-500 mt-1">Risk & Diversification</div>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        
        {/* TAB: CHAT */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] p-4 rounded-2xl ${
                     m.role === 'user' 
                     ? 'bg-blue-600 text-white rounded-br-none' 
                     : 'bg-slate-100 text-slate-800 rounded-bl-none'
                   }`}>
                     <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                   </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 p-4 rounded-2xl rounded-bl-none flex gap-2 items-center text-slate-500 text-sm">
                    <Loader2 size={16} className="animate-spin" /> Thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask a question..."
                  className="flex-1 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={chatLoading}
                  className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: ANALYZE */}
        {activeTab === 'analyze' && (
          <div className="p-6 h-full overflow-y-auto">
            <div className="flex gap-2 max-w-md mb-8">
               <input 
                  type="text" 
                  value={analyzeTicker}
                  onChange={(e) => setAnalyzeTicker(e.target.value.toUpperCase())}
                  placeholder="Enter Ticker (e.g. AAPL)"
                  className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button 
                  onClick={handleAnalyzeStock}
                  disabled={analyzeLoading}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {analyzeLoading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />} Analyze
                </button>
            </div>

            {analysisResult && (
              <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                      {analyzeTicker} 
                      <span className={`text-sm px-2 py-1 rounded-full border ${
                        analysisResult.sentiment === 'Bullish' ? 'bg-green-50 text-green-700 border-green-200' : 
                        analysisResult.sentiment === 'Bearish' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}>
                        {analysisResult.sentiment}
                      </span>
                    </h2>
                    {analysisResult.fairValue && (
                       <p className="text-slate-500 mb-4">Est. Fair Value: <span className="font-bold text-slate-800">${analysisResult.fairValue}</span></p>
                    )}
                    <div className="prose prose-sm prose-slate">
                      <p className="whitespace-pre-wrap">{analysisResult.analysis}</p>
                    </div>
                 </div>
                 
                 <div className="bg-slate-50 rounded-2xl p-4 flex flex-col items-center justify-center">
                    <h3 className="font-bold text-slate-700 mb-2">Snowflake Analysis</h3>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analysisResult.radarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" tick={{fontSize: 12}} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar
                            name={analyzeTicker}
                            dataKey="A"
                            stroke="#8884d8"
                            fill="#8884d8"
                            fillOpacity={0.6}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                 </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: ROAST */}
        {activeTab === 'roast' && (
          <div className="p-6 h-full overflow-y-auto">
            {!portfolioReview ? (
               <div className="text-center py-20">
                 <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
                    <BrainCircuit size={32} />
                 </div>
                 <h2 className="text-xl font-bold text-slate-900 mb-2">AI Portfolio Review</h2>
                 <p className="text-slate-500 max-w-md mx-auto mb-8">
                   Get an instant, unbiased analysis of your portfolio's diversification, risk exposure, and potential improvement areas.
                 </p>
                 <button 
                   onClick={handlePortfolioRoast}
                   disabled={reviewLoading}
                   className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200 disabled:opacity-50 flex items-center gap-2 mx-auto"
                 >
                   {reviewLoading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />} Generate Report
                 </button>
               </div>
            ) : (
               <div className="animate-fade-in max-w-3xl mx-auto">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Analysis Report</h2>
                    <button onClick={() => setPortfolioReview(null)} className="text-sm text-blue-600 hover:underline">Run Again</button>
                 </div>
                 <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                    <pre className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed">{portfolioReview}</pre>
                 </div>
               </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default AIAssistant;

// Helper icons
function BrainCircuit(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 3 2.5 2.5 0 0 0 0 .2" />
      <path d="M14 9.5a2.5 2.5 0 0 0 5.06-.46 2.5 2.5 0 0 0 1.98-3 2.5 2.5 0 0 0 1.32-3 2.5 2.5 0 0 0 0-.2" />
      <path d="M12 19.5a2.5 2.5 0 0 1-4.96.46 2.5 2.5 0 0 1-1.98-3 2.5 2.5 0 0 1-1.32-3 2.5 2.5 0 0 1 0-.2" />
      <path d="M14 14.5a2.5 2.5 0 0 1 5.06.46 2.5 2.5 0 0 1 1.98 3 2.5 2.5 0 0 1 1.32 3 2.5 2.5 0 0 1 0 .2" />
      <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M20 12h2" />
      <path d="M2 12h2" />
    </svg>
  );
}
