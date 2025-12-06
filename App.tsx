
import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Portfolio from './components/Portfolio';
import DividendAnalytics from './components/DividendAnalytics';
import Community from './components/Community';
import AIAssistant from './components/AIAssistant';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import Billing from './components/Billing';
import { ViewState, Portfolio as PortfolioType, Holding, Alert, Notification, PlanTier, UserProfile, Brokerage, CryptoWallet, PortfolioContainer, PlanConfig, Promotion } from './types';
import { INITIAL_HOLDINGS, MOCK_STOCKS, DEFAULT_BROKERAGES, DEFAULT_WALLETS, PLAN_LIMITS, INITIAL_PLANS, INITIAL_PROMOTIONS } from './constants';
import { Bell, Search, Settings, Shield, X, Check, Menu, Plus, RefreshCw, Loader2 } from 'lucide-react';
import { supabase } from './supabaseClient'; 
import { fetchLivePrices } from './services/marketData';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<UserProfile | null>(null);

  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  
  // Multi-Portfolio State
  const [portfolios, setPortfolios] = useState<PortfolioContainer[]>([
    { id: '1', name: 'Main Portfolio', holdings: INITIAL_HOLDINGS, isDefault: true }
  ]);
  const [activePortfolioId, setActivePortfolioId] = useState<string>('1');

  // Global App Config (Super Admin Editable)
  const [plans, setPlans] = useState<PlanConfig[]>(INITIAL_PLANS);
  const [promotions, setPromotions] = useState<Promotion[]>(INITIAL_PROMOTIONS);
  const [brokerages, setBrokerages] = useState<Brokerage[]>(DEFAULT_BROKERAGES);
  const [wallets, setWallets] = useState<CryptoWallet[]>(DEFAULT_WALLETS);

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initial Auth Check (Simulated)
  useEffect(() => {
    // In a real app, check supabase.auth.getSession() here
  }, []);

  const handleLogin = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setCurrentView(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(ViewState.AUTH);
  };

  // Create New Portfolio
  const handleCreatePortfolio = (name: string) => {
    if (!user) return;
    const limit = PLAN_LIMITS[user.plan].maxPortfolios;
    if (portfolios.length >= limit) {
      alert(`Upgrade to create more portfolios. Current limit: ${limit}`);
      return;
    }
    const newId = Date.now().toString();
    setPortfolios([...portfolios, { id: newId, name, holdings: [], isDefault: false }]);
    setActivePortfolioId(newId);
  };

  const handleRenamePortfolio = (id: string, newName: string) => {
    setPortfolios(prev => prev.map(p => p.id === id ? { ...p, name: newName } : p));
  };

  const handleDeletePortfolio = (id: string) => {
    if (portfolios.length <= 1) {
      alert("You must have at least one portfolio.");
      return;
    }
    if (confirm("Are you sure you want to delete this portfolio? This cannot be undone.")) {
       const newPortfolios = portfolios.filter(p => p.id !== id);
       setPortfolios(newPortfolios);
       if (activePortfolioId === id) {
         setActivePortfolioId(newPortfolios[0].id);
       }
    }
  };

  // Get Active Portfolio Data
  const activePortfolioContainer = portfolios.find(p => p.id === activePortfolioId) || portfolios[0];
  const activeHoldings = activePortfolioContainer.holdings;

  // Computed Portfolio Stats
  const portfolio: PortfolioType = useMemo(() => {
    const totalValue = activeHoldings.reduce((acc, h) => acc + h.equity, 0);
    const totalDividendIncome = activeHoldings.reduce((acc, h) => acc + (h.shares * h.stock.price * (h.stock.dividendYield / 100)), 0);
    const dividendYield = totalValue > 0 ? (totalDividendIncome / totalValue) * 100 : 0;
    
    return {
      holdings: activeHoldings,
      totalValue,
      totalDividendIncome,
      dividendYield
    };
  }, [activeHoldings]);

  // LIVE DATA: Refresh prices
  const refreshMarketData = async () => {
    if (!user) return;
    setIsRefreshing(true);
    
    // Collect all tickers from all portfolios
    const allTickers = Array.from(new Set(portfolios.flatMap(p => p.holdings.map(h => h.stock.ticker)))) as string[];
    
    if (allTickers.length === 0) {
        setIsRefreshing(false);
        return;
    }

    const livePrices = await fetchLivePrices(allTickers);
    
    setPortfolios(prev => prev.map(port => ({
        ...port,
        holdings: port.holdings.map(h => {
            const newPrice = livePrices[h.stock.ticker];
            if (newPrice) {
                return {
                    ...h,
                    stock: { ...h.stock, price: newPrice },
                    equity: h.shares * newPrice,
                    totalReturn: (newPrice - h.avgCost) * h.shares,
                    totalReturnPercent: h.avgCost > 0 ? ((newPrice - h.avgCost) / h.avgCost) * 100 : 0
                };
            }
            return h;
        })
    })));
    
    setIsRefreshing(false);
  };

  // Initial Data Fetch on Login
  useEffect(() => {
    if (user) {
        refreshMarketData();
    }
  }, [user]);

  // Backend Logic Simulation: Alert Checking
  useEffect(() => {
    if (!user) return; 

    const checkAlerts = () => {
      setAlerts(prevAlerts => {
        let hasChanges = false;
        const newNotifications: Notification[] = [];
        
        const updatedAlerts = prevAlerts.map(alert => {
          if (!alert.active || alert.triggered) return alert;

          // Check against all holdings in the active portfolio or Mock Data
          const stock = activeHoldings.find(h => h.stock.ticker === alert.ticker)?.stock || MOCK_STOCKS[alert.ticker];
          
          if (!stock) return alert;

          // Using the current price in state (which is updated by refreshMarketData or default)
          const currentPrice = stock.price;

          let triggered = false;
          let triggerMsg = '';

          if (alert.condition === 'ABOVE' && currentPrice >= alert.value) {
            triggered = true;
            triggerMsg = `Price rose above $${alert.value}`;
          }
          if (alert.condition === 'BELOW' && currentPrice <= alert.value) {
            triggered = true;
            triggerMsg = `Price fell below $${alert.value}`;
          }
          if (alert.condition === 'CHANGE_PCT' && alert.baselinePrice) {
             const pctChange = ((currentPrice - alert.baselinePrice) / alert.baselinePrice) * 100;
             // Check absolute change magnitude
             if (Math.abs(pctChange) >= alert.value) {
                triggered = true;
                const direction = pctChange > 0 ? 'up' : 'down';
                triggerMsg = `Price moved ${direction} by ${Math.abs(pctChange).toFixed(2)}% (Threshold: ${alert.value}%)`;
             }
          }
          
          if (triggered) {
            hasChanges = true;
            newNotifications.push({
              id: Date.now().toString(),
              title: `Price Alert: ${alert.ticker}`,
              message: `${alert.ticker}: ${triggerMsg}. Current: $${currentPrice.toFixed(2)}`,
              timestamp: new Date(),
              read: false,
              type: 'ALERT'
            });
          }

          return triggered ? { ...alert, triggered: true } : alert;
        });

        if (newNotifications.length > 0) {
           setNotifications(prev => [...newNotifications, ...prev]);
        }

        return hasChanges ? updatedAlerts : prevAlerts;
      });
    };

    // Run check every 10 seconds to simulate backend job
    const intervalId = setInterval(() => {
        checkAlerts();
        // Also refresh live prices periodically
        refreshMarketData();
    }, 15000); 
    return () => clearInterval(intervalId);
  }, [activeHoldings, user]);

  const handleAddHolding = (ticker: string, shares: number, avgCost: number) => {
    const stock = MOCK_STOCKS[ticker] || {
      ticker,
      name: ticker,
      sector: 'Unknown',
      price: avgCost, // Fallback to cost if unknown
      dividendYield: 0,
      dividendFrequency: 'Quarterly',
    };

    const newHolding: Holding = {
      stock,
      shares,
      avgCost,
      equity: shares * stock.price,
      totalReturn: (stock.price - avgCost) * shares,
      totalReturnPercent: avgCost > 0 ? ((stock.price - avgCost) / avgCost) * 100 : 0,
      dripEnabled: false,
      targetAllocation: 0
    };

    // Update the active portfolio
    setPortfolios(prev => prev.map(p => {
      if (p.id === activePortfolioId) {
        // Check if holding exists, if so update it
        const existing = p.holdings.find(h => h.stock.ticker === ticker);
        if (existing) {
          const totalShares = existing.shares + shares;
          const totalCost = (existing.shares * existing.avgCost) + (shares * avgCost);
          const newAvgCost = totalCost / totalShares;
          
          return {
            ...p,
            holdings: p.holdings.map(h => h.stock.ticker === ticker ? {
              ...h,
              shares: totalShares,
              avgCost: newAvgCost,
              equity: totalShares * h.stock.price,
              totalReturn: (h.stock.price - newAvgCost) * totalShares,
              totalReturnPercent: ((h.stock.price - newAvgCost) / newAvgCost) * 100
            } : h)
          };
        }
        return { ...p, holdings: [...p.holdings, newHolding] };
      }
      return p;
    }));
    
    // Trigger price refresh for new holding
    setTimeout(refreshMarketData, 500);
  };

  const handleEditHolding = (ticker: string, shares: number, avgCost: number) => {
    setPortfolios(prev => prev.map(p => {
      if (p.id === activePortfolioId) {
        return {
          ...p,
          holdings: p.holdings.map(h => {
            if (h.stock.ticker === ticker) {
               // Recalculate metrics based on new inputs
               const equity = shares * h.stock.price;
               const totalReturn = (h.stock.price - avgCost) * shares;
               const totalReturnPercent = avgCost > 0 ? ((h.stock.price - avgCost) / avgCost) * 100 : 0;
               
               return {
                 ...h,
                 shares,
                 avgCost,
                 equity,
                 totalReturn,
                 totalReturnPercent
               };
            }
            return h;
          })
        };
      }
      return p;
    }));
  };

  const handleDeleteHolding = (ticker: string) => {
    if (confirm(`Are you sure you want to remove ${ticker} from this portfolio?`)) {
      setPortfolios(prev => prev.map(p => {
        if (p.id === activePortfolioId) {
          return { ...p, holdings: p.holdings.filter(h => h.stock.ticker !== ticker) };
        }
        return p;
      }));
    }
  };

  const handleUpdateHolding = (ticker: string, updates: Partial<Holding>) => {
    setPortfolios(prev => prev.map(p => {
      if (p.id === activePortfolioId) {
        return {
          ...p,
          holdings: p.holdings.map(h => h.stock.ticker === ticker ? { ...h, ...updates } : h)
        };
      }
      return p;
    }));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({...n, read: true})));
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard portfolio={portfolio} />;
      case ViewState.PORTFOLIO:
        return (
          <Portfolio 
            portfolio={portfolio} 
            portfolios={portfolios}
            activePortfolioId={activePortfolioId}
            setActivePortfolioId={setActivePortfolioId}
            onCreatePortfolio={handleCreatePortfolio}
            onRenamePortfolio={handleRenamePortfolio}
            onDeletePortfolio={handleDeletePortfolio}
            onAddHolding={handleAddHolding}
            onEditHolding={handleEditHolding}
            onDeleteHolding={handleDeleteHolding}
            brokerages={brokerages} 
            setBrokerages={setBrokerages}
            user={user}
          />
        );
      case ViewState.DIVIDENDS:
        return <DividendAnalytics portfolio={portfolio} onUpdateHolding={handleUpdateHolding} />;
      case ViewState.COMMUNITY:
        return <Community />;
      case ViewState.ANALYZER:
        return <AIAssistant portfolio={portfolio} alerts={alerts} setAlerts={setAlerts} />;
      case ViewState.ADMIN:
        return user ? (
          <AdminDashboard 
            currentUser={user} 
            brokerages={brokerages} 
            setBrokerages={setBrokerages}
            wallets={wallets}
            setWallets={setWallets}
            plans={plans}
            setPlans={setPlans}
            promotions={promotions}
            setPromotions={setPromotions}
          />
        ) : null;
      case ViewState.BILLING:
      case ViewState.SETTINGS: // Using Billing as Settings for now
        return user ? (
          <Billing 
            user={user} 
            onUpdatePlan={(plan) => setUser({...user, plan})} 
            plans={plans}
            promotions={promotions}
          /> 
        ) : null;
      default:
        return <Dashboard portfolio={portfolio} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}
      
      <div className={`fixed lg:static inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-200 ease-in-out`}>
         <Sidebar currentView={currentView} setView={setCurrentView} user={user} onLogout={handleLogout} />
      </div>
      
      <main className="flex-1 lg:ml-64 w-full p-4 lg:p-8">
        <header className="flex justify-between items-center mb-8 sticky top-0 z-30 bg-slate-50/90 backdrop-blur-sm py-3 px-1">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-slate-500" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="relative w-64 md:w-96 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search ticker, etf, or asset..." 
                className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all hover:border-blue-300"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 relative">
             {/* Refresh Data Button */}
             <button 
               onClick={refreshMarketData}
               title="Refresh Market Data"
               disabled={isRefreshing}
               className={`p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-500 ${isRefreshing ? 'opacity-50' : ''}`}
             >
               <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
             </button>

             <div className="relative">
               <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all relative ${isNotificationsOpen ? 'bg-white shadow-sm' : 'text-slate-500'}`}
               >
                 <Bell size={20} />
                 {unreadCount > 0 && (
                   <span className="absolute top-2 right-2 flex h-3 w-3">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                   </span>
                 )}
               </button>

               {isNotificationsOpen && (
                 <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 p-0 z-50 animate-fade-in overflow-hidden">
                    <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
                      <h3 className="font-bold text-slate-900">Notifications</h3>
                      <button className="text-xs text-blue-600 hover:underline flex items-center gap-1" onClick={markAllRead}>
                         <Check size={12} /> Mark all read
                      </button>
                    </div>
                    <div className="space-y-0 max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="text-center py-8 px-4">
                           <Bell size={24} className="mx-auto text-slate-200 mb-2" />
                           <p className="text-sm text-slate-400">You're all caught up</p>
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className={`flex gap-3 items-start p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${n.read ? 'opacity-60' : 'bg-blue-50/30'}`}>
                             <div className={`p-2 rounded-full shrink-0 ${n.type === 'ALERT' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                               {n.type === 'ALERT' ? <Bell size={16} /> : <Shield size={16} />}
                             </div>
                             <div>
                               <p className="text-sm font-semibold text-slate-800 leading-tight mb-1">{n.title}</p>
                               <p className="text-xs text-slate-500 leading-relaxed">{n.message}</p>
                               <p className="text-[10px] text-slate-400 mt-2 font-medium">{n.timestamp.toLocaleTimeString()}</p>
                             </div>
                          </div>
                        ))
                      )}
                    </div>
                 </div>
               )}
             </div>

             <button 
               onClick={() => setCurrentView(ViewState.SETTINGS)}
               className="p-2 text-slate-500 hover:bg-white hover:shadow-sm rounded-lg transition-all"
             >
               <Settings size={20} />
             </button>
             
             <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right hidden md:block">
                  <div className="text-sm font-bold text-slate-900">{user.name}</div>
                  <div className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full inline-block uppercase">
                    {user.plan}
                  </div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-blue-200 cursor-pointer" onClick={handleLogout}>
                  {user.name.charAt(0)}
                </div>
             </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto animate-fade-in pb-10">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
