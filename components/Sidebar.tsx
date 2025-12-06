import React from 'react';
import { ViewState, UserProfile, UserRole } from '../types';
import { LayoutDashboard, PieChart, TrendingUp, Users, BrainCircuit, LogOut, Shield, CreditCard, Settings } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  user: UserProfile | null;
  onLogout: () => void;
}

interface NavItem {
  view: ViewState;
  label: string;
  icon: any;
}

const NavButton: React.FC<{ item: NavItem; currentView: ViewState; setView: (view: ViewState) => void }> = ({ item, currentView, setView }) => (
  <button
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
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, user, onLogout }) => {
  const navItems = [
    { view: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { view: ViewState.PORTFOLIO, label: 'Portfolio', icon: PieChart },
    { view: ViewState.DIVIDENDS, label: 'Dividends', icon: TrendingUp },
    { view: ViewState.COMMUNITY, label: 'Community', icon: Users },
    { view: ViewState.ANALYZER, label: 'AI Advisor', icon: BrainCircuit },
  ];

  const adminItems = [
    { view: ViewState.ADMIN, label: 'Admin Console', icon: Shield },
  ];

  const settingsItems = [
    { view: ViewState.BILLING, label: 'Billing & Plans', icon: CreditCard },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 shadow-xl z-50">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-lg shadow-blue-500/20 shadow-lg">IQ</div>
        <h1 className="text-xl font-bold tracking-tight">InvestIQ</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        <div className="mb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Main</div>
        {navItems.map((item) => (
          <NavButton key={item.view} item={item} currentView={currentView} setView={setView} />
        ))}

        {(user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN) && (
          <>
            <div className="mt-6 mb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Administration</div>
            {adminItems.map((item) => (
              <NavButton key={item.view} item={item} currentView={currentView} setView={setView} />
            ))}
          </>
        )}

        <div className="mt-6 mb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Account</div>
        {settingsItems.map((item) => (
          <NavButton key={item.view} item={item} currentView={currentView} setView={setView} />
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold text-xs">
              {user?.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
               <p className="text-sm font-medium truncate">{user?.name}</p>
               <p className="text-xs text-slate-500 truncate">{user?.role === 'SUPER_ADMIN' ? 'Admin' : 'User'}</p>
            </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors text-sm"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;