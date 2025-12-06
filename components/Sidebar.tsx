import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, PieChart, TrendingUp, Users, BrainCircuit, LogOut } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { view: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { view: ViewState.PORTFOLIO, label: 'Portfolio', icon: PieChart },
    { view: ViewState.DIVIDENDS, label: 'Dividends', icon: TrendingUp },
    { view: ViewState.COMMUNITY, label: 'Community', icon: Users },
    { view: ViewState.ANALYZER, label: 'AI Advisor', icon: BrainCircuit },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 shadow-xl z-50">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-lg">IQ</div>
        <h1 className="text-xl font-bold tracking-tight">InvestIQ</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              currentView === item.view
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={20} className={currentView === item.view ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors">
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
