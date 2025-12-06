import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Portfolio from './components/Portfolio';
import DividendAnalytics from './components/DividendAnalytics';
import Community from './components/Community';
import AIAssistant from './components/AIAssistant';
import { ViewState, Portfolio as PortfolioType } from './types';
import { INITIAL_HOLDINGS } from './constants';
import { Bell, Search, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  
  // Portfolio State (Calculated from holdings)
  const portfolio: PortfolioType = useMemo(() => {
    const totalValue = INITIAL_HOLDINGS.reduce((acc, h) => acc + h.equity, 0);
    const totalDividendIncome = INITIAL_HOLDINGS.reduce((acc, h) => acc + (h.shares * h.stock.price * (h.stock.dividendYield / 100)), 0);
    const dividendYield = totalValue > 0 ? (totalDividendIncome / totalValue) * 100 : 0;
    
    return {
      holdings: INITIAL_HOLDINGS,
      totalValue,
      totalDividendIncome,
      dividendYield
    };
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard portfolio={portfolio} />;
      case ViewState.PORTFOLIO:
        return <Portfolio portfolio={portfolio} />;
      case ViewState.DIVIDENDS:
        return <DividendAnalytics portfolio={portfolio} />;
      case ViewState.COMMUNITY:
        return <Community />;
      case ViewState.ANALYZER:
        return <AIAssistant portfolio={portfolio} />;
      default:
        return <Dashboard portfolio={portfolio} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search ticker, etf, or asset..." 
              className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-4">
             <button className="p-2 text-slate-500 hover:bg-white hover:shadow-sm rounded-lg transition-all relative">
               <Bell size={20} />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
             </button>
             <button className="p-2 text-slate-500 hover:bg-white hover:shadow-sm rounded-lg transition-all">
               <Settings size={20} />
             </button>
             <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right hidden md:block">
                  <div className="text-sm font-bold text-slate-900">Alex Investor</div>
                  <div className="text-xs text-slate-500">Pro Member</div>
                </div>
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                  AI
                </div>
             </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="max-w-7xl mx-auto">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
