
import React, { useState } from 'react';
import { Portfolio as PortfolioType, Brokerage, UserProfile, UserRole, PlanTier, PortfolioContainer } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Plus, Download, Share2, X, AlertTriangle, FileSpreadsheet, Globe, Keyboard, Loader2, Key, ShieldCheck, Trash2, Edit, Lock, ChevronDown, Check, Briefcase, RefreshCcw } from 'lucide-react';
import { PLAN_LIMITS } from '../constants';

interface PortfolioProps {
  portfolio: PortfolioType;
  portfolios: PortfolioContainer[];
  activePortfolioId: string;
  setActivePortfolioId: (id: string) => void;
  onCreatePortfolio: (name: string) => void;
  onAddHolding?: (ticker: string, shares: number, avgCost: number) => void;
  brokerages: Brokerage[];
  setBrokerages: React.Dispatch<React.SetStateAction<Brokerage[]>>;
  user: UserProfile;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const Portfolio: React.FC<PortfolioProps> = ({ 
  portfolio, 
  portfolios, 
  activePortfolioId, 
  setActivePortfolioId, 
  onCreatePortfolio,
  onAddHolding, 
  brokerages, 
  setBrokerages, 
  user 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPortfolioDropdownOpen, setIsPortfolioDropdownOpen] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [importMethod, setImportMethod] = useState<'MANUAL' | 'CSV' | 'API'>('MANUAL');
  const [selectedBroker, setSelectedBroker] = useState<string | null>(null);
  const [manageMode, setManageMode] = useState(false); // Admin mode for brokerages
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [isCreatingPortfolio, setIsCreatingPortfolio] = useState(false);
  
  // Form State
  const [ticker, setTicker] = useState('');
  const [shares, setShares] = useState('');
  const [cost, setCost] = useState('');
  const [apiLoading, setApiLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [importResult, setImportResult] = useState<{count: number, source: string} | null>(null);

  // Admin Form State
  const [newBrokerName, setNewBrokerName] = useState('');
  const [newBrokerLogo, setNewBrokerLogo] = useState('');
  const [editingBrokerId, setEditingBrokerId] = useState<string | null>(null);
  const [editColor, setEditColor] = useState('');

  const allocationData = portfolio.holdings.map(h => ({
    name: h.stock.ticker,
    value: h.equity
  }));

  const activePortfolio = portfolios.find(p => p.id === activePortfolioId) || portfolios[0];

  const handleShare = () => {
    navigator.clipboard.writeText(`https://investiq.app/p/${Math.random().toString(36).substring(7)}`);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const limit = PLAN_LIMITS[user.plan].maxHoldings;
    if (portfolio.holdings.length >= limit) {
      alert(`Plan limit reached (${limit} holdings). Upgrade to add more.`);
      return;
    }

    if (onAddHolding && ticker && shares && cost) {
      onAddHolding(ticker.toUpperCase(), Number(shares), Number(cost));
      setIsModalOpen(false);
      resetForm();
    }
  };

  const handleCreatePortfolioSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(newPortfolioName) {
      onCreatePortfolio(newPortfolioName);
      setNewPortfolioName('');
      setIsCreatingPortfolio(false);
      setIsPortfolioDropdownOpen(false);
    }
  };

  const resetForm = () => {
    setTicker('');
    setShares('');
    setCost('');
    setApiKey('');
    setApiSecret('');
    setImportResult(null);
    setSelectedBroker(null);
  };

  const handleBrokerageConnect = (broker: string) => {
    setSelectedBroker(broker);
    setImportResult(null);
  };

  const submitApiConnection = () => {
    setApiLoading(true);
    
    // SIMULATION of Real API Latency and Response
    setTimeout(() => {
      setApiLoading(false);
      
      let importedCount = 0;

      if (selectedBroker === 'Binance') {
        if (onAddHolding) {
          onAddHolding('BTC', 0.45, 42000);
          onAddHolding('ETH', 5.2, 2800);
          onAddHolding('BNB', 15, 320);
          importedCount = 3;
        }
      } else if (selectedBroker === 'Trading212') {
        if (onAddHolding) {
          onAddHolding('TSLA', 10, 210);
          onAddHolding('AMZN', 25, 145);
          onAddHolding('GOOGL', 15, 130);
          importedCount = 3;
        }
      } else {
        if (onAddHolding) {
          onAddHolding('VTI', 10, 220);
          importedCount = 1;
        }
      }

      setImportResult({ count: importedCount, source: selectedBroker || 'API' });
    }, 2500);
  };

  // Admin Functions
  const handleAddBrokerage = () => {
    if (newBrokerName && newBrokerLogo) {
      const newBroker: Brokerage = {
        id: Date.now().toString(),
        name: newBrokerName,
        logoChar: newBrokerLogo[0].toUpperCase(),
        status: 'ACTIVE',
        colorClass: 'text-slate-600 bg-slate-100'
      };
      setBrokerages(prev => [...prev, newBroker]);
      setNewBrokerName('');
      setNewBrokerLogo('');
    }
  };

  const handleDeleteBrokerage = (id: string) => {
    setBrokerages(prev => prev.filter(b => b.id !== id));
  };

  const handleToggleBrokerStatus = (id: string) => {
    setBrokerages(prev => prev.map(b => b.id === id ? { ...b, status: b.status === 'ACTIVE' ? 'MAINTENANCE' : 'ACTIVE'} : b));
  };

  const handleUpdateColor = (id: string, colorClass: string) => {
     setBrokerages(prev => prev.map(b => b.id === id ? { ...b, colorClass } : b));
     setEditingBrokerId(null);
  };

  const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;
  const canUseApi = user.plan !== PlanTier.FREE || isAdmin;

  return (
    <div className="space-y-6 relative animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative">
           <button 
             onClick={() => setIsPortfolioDropdownOpen(!isPortfolioDropdownOpen)}
             className="flex items-center gap-2 text-2xl font-bold text-slate-900 hover:text-blue-600 transition-colors"
           >
             {activePortfolio.name} <ChevronDown size={20} />
           </button>
           <p className="text-slate-500">Total Value: <span className="font-semibold text-slate-700">${portfolio.totalValue.toLocaleString()}</span></p>

           {isPortfolioDropdownOpen && (
             <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-fade-in">
                <div className="p-2 space-y-1">
                   {portfolios.map(p => (
                     <button
                       key={p.id}
                       onClick={() => { setActivePortfolioId(p.id); setIsPortfolioDropdownOpen(false); }}
                       className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex justify-between items-center ${activePortfolioId === p.id ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}
                     >
                       {p.name}
                       {activePortfolioId === p.id && <Check size={14} />}
                     </button>
                   ))}
                </div>
                <div className="border-t border-slate-100 p-2">
                   {!isCreatingPortfolio ? (
                      <button 
                        onClick={() => setIsCreatingPortfolio(true)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 font-bold hover:bg-blue-50 rounded-lg"
                      >
                        <Plus size={16} /> New Portfolio
                      </button>
                   ) : (
                      <form onSubmit={handleCreatePortfolioSubmit} className="space-y-2">
                        <input 
                          autoFocus
                          placeholder="Portfolio Name"
                          className="w-full border rounded px-2 py-1 text-sm"
                          value={newPortfolioName}
                          onChange={(e) => setNewPortfolioName(e.target.value)}
                        />
                        <div className="flex gap-2">
                           <button type="submit" className="flex-1 bg-blue-600 text-white text-xs py-1 rounded">Create</button>
                           <button onClick={() => setIsCreatingPortfolio(false)} className="flex-1 bg-slate-100 text-slate-600 text-xs py-1 rounded">Cancel</button>
                        </div>
                      </form>
                   )}
                </div>
             </div>
           )}
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
          >
            <Share2 size={16} /> Share
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
            <Download size={16} /> Export
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 text-sm font-medium"
          >
            <Plus size={16} /> Add Holding
          </button>
        </div>
      </div>

      {showShareToast && (
        <div className="absolute top-0 right-0 transform -translate-y-full bg-slate-800 text-white px-4 py-2 rounded-lg text-sm shadow-lg animate-fade-in z-50">
          Link copied to clipboard!
        </div>
      )}

      {/* Import Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-0 shadow-2xl animate-fade-in overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900">Add Assets to {activePortfolio.name}</h3>
              <button onClick={() => { setIsModalOpen(false); resetForm(); setManageMode(false); }} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex border-b border-slate-100">
               <button 
                 onClick={() => { setImportMethod('MANUAL'); setSelectedBroker(null); setManageMode(false); }}
                 className={`flex-1 py-3 text-sm font-medium flex justify-center items-center gap-2 ${importMethod === 'MANUAL' ? 'border-b-2 border-blue-600 text-blue-600 bg-white' : 'text-slate-500 bg-slate-50 hover:bg-white'}`}
               >
                 <Keyboard size={16} /> Manual
               </button>
               <button 
                 onClick={() => { setImportMethod('CSV'); setSelectedBroker(null); setManageMode(false); }}
                 className={`flex-1 py-3 text-sm font-medium flex justify-center items-center gap-2 ${importMethod === 'CSV' ? 'border-b-2 border-blue-600 text-blue-600 bg-white' : 'text-slate-500 bg-slate-50 hover:bg-white'}`}
               >
                 <FileSpreadsheet size={16} /> CSV Import
               </button>
               <button 
                 onClick={() => { setImportMethod('API'); setSelectedBroker(null); setManageMode(false); }}
                 className={`flex-1 py-3 text-sm font-medium flex justify-center items-center gap-2 ${importMethod === 'API' ? 'border-b-2 border-blue-600 text-blue-600 bg-white' : 'text-slate-500 bg-slate-50 hover:bg-white'}`}
               >
                 <Globe size={16} /> Connect API
               </button>
            </div>

            <div className="p-6">
              {importMethod === 'MANUAL' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ticker Symbol</label>
                    <input 
                      type="text" 
                      value={ticker}
                      onChange={(e) => setTicker(e.target.value)}
                      placeholder="e.g. AAPL"
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                      <input 
                        type="number" 
                        value={shares}
                        onChange={(e) => setShares(e.target.value)}
                        placeholder="0"
                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Avg. Cost</label>
                      <input 
                        type="number" 
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="pt-4">
                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-200">
                      Add to Portfolio
                    </button>
                  </div>
                </form>
              )}

              {importMethod === 'CSV' && (
                <div className="text-center space-y-4 py-4">
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                     <FileSpreadsheet size={48} className="mx-auto text-slate-400 mb-3" />
                     <p className="font-medium text-slate-700">Drag & drop your CSV file here</p>
                     <p className="text-sm text-slate-500">Supports Trading212, Robinhood, Fidelity exports</p>
                  </div>
                  <button className="text-blue-600 font-medium text-sm hover:underline">Download Template</button>
                </div>
              )}

              {importMethod === 'API' && !selectedBroker && !manageMode && (
                 <div className="space-y-4">
                    {!canUseApi && (
                      <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-center gap-2 text-sm text-amber-800 mb-2">
                         <Lock size={16} /> Upgrade to Pro to connect brokerage APIs.
                      </div>
                    )}
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-slate-500">Securely connect your brokerage account.</p>
                      {isAdmin && (
                        <button onClick={() => setManageMode(true)} className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">
                           <Edit size={12} /> Manage
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       {brokerages.filter(b => b.status === 'ACTIVE' || isAdmin).map(broker => (
                         <button 
                           key={broker.id} 
                           onClick={() => canUseApi && broker.status === 'ACTIVE' && handleBrokerageConnect(broker.name)} 
                           disabled={!canUseApi || broker.status === 'MAINTENANCE'}
                           className={`p-4 border border-slate-200 rounded-xl transition-all flex flex-col items-center gap-2 group relative 
                             ${!canUseApi || broker.status === 'MAINTENANCE' ? 'opacity-60 cursor-not-allowed bg-slate-50' : 'hover:border-blue-500 hover:shadow-md cursor-pointer'}
                           `}
                         >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${broker.colorClass}`}>
                               {broker.logoChar}
                            </div>
                            <span className="text-sm font-medium">{broker.name}</span>
                            {broker.status === 'MAINTENANCE' && (
                              <span className="absolute top-2 right-2 text-[10px] bg-red-100 text-red-600 px-1 rounded">Offline</span>
                            )}
                         </button>
                       ))}
                    </div>
                 </div>
              )}

              {/* Admin Brokerage Management inside Modal */}
              {importMethod === 'API' && manageMode && isAdmin && (
                <div className="space-y-4">
                   <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-slate-700">Manage Integrations</h4>
                      <button onClick={() => setManageMode(false)} className="text-xs text-slate-500 hover:text-slate-700">Back</button>
                   </div>
                   <div className="space-y-2 max-h-60 overflow-y-auto">
                      {brokerages.map(b => (
                        <div key={b.id} className="flex justify-between items-center p-2 border rounded-lg bg-slate-50">
                           <div className="flex items-center gap-2">
                             <span className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold ${b.colorClass}`}>{b.logoChar}</span>
                             <span className="text-sm font-medium">{b.name}</span>
                           </div>
                           
                           <div className="flex items-center gap-2">
                             {/* Color Editor */}
                             {editingBrokerId === b.id ? (
                               <div className="flex items-center gap-1">
                                  <input 
                                    className="w-20 text-xs border rounded px-1"
                                    placeholder="bg-red-100"
                                    value={editColor}
                                    onChange={e => setEditColor(e.target.value)}
                                  />
                                  <button onClick={() => handleUpdateColor(b.id, editColor)} className="text-green-600"><Check size={14} /></button>
                                  <button onClick={() => setEditingBrokerId(null)} className="text-slate-400"><X size={14} /></button>
                               </div>
                             ) : (
                               <button onClick={() => { setEditingBrokerId(b.id); setEditColor(b.colorClass); }} className="text-slate-400 hover:text-blue-600">
                                 <Edit size={14} />
                               </button>
                             )}

                             <button onClick={() => handleToggleBrokerStatus(b.id)} className={`text-xs px-2 py-1 rounded ${b.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                               {b.status}
                             </button>
                             <button onClick={() => handleDeleteBrokerage(b.id)} className="text-slate-400 hover:text-red-600 p-1">
                               <Trash2 size={14} />
                             </button>
                           </div>
                        </div>
                      ))}
                   </div>
                   <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                      <input 
                        className="border rounded px-2 py-1 text-sm" 
                        placeholder="Name" 
                        value={newBrokerName} 
                        onChange={e => setNewBrokerName(e.target.value)} 
                      />
                      <input 
                        className="border rounded px-2 py-1 text-sm" 
                        placeholder="Logo Char" 
                        value={newBrokerLogo} 
                        onChange={e => setNewBrokerLogo(e.target.value)} 
                        maxLength={1}
                      />
                   </div>
                   <button onClick={handleAddBrokerage} className="w-full bg-slate-800 text-white py-2 rounded-lg text-sm font-bold">Add Brokerage</button>
                </div>
              )}

              {importMethod === 'API' && selectedBroker && !importResult && (
                <div className="space-y-4 animate-fade-in">
                   <div className="flex items-center gap-3 mb-6 p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold shadow-sm">
                        {selectedBroker[0]}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800">Connect {selectedBroker}</h4>
                        <p className="text-xs text-slate-500">Read-only access required.</p>
                      </div>
                      <button onClick={() => setSelectedBroker(null)} className="text-slate-400 hover:text-slate-600">Change</button>
                   </div>

                   {selectedBroker === 'Trading212' ? (
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">API Token</label>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            type="password" 
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your personal API token"
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Settings &gt; API &gt; Generate Token</p>
                     </div>
                   ) : (
                     <>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">API Key</label>
                          <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                              type="text" 
                              value={apiKey}
                              onChange={(e) => setApiKey(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Paste API Key here"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">API Secret</label>
                          <div className="relative">
                            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                              type="password" 
                              value={apiSecret}
                              onChange={(e) => setApiSecret(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Paste API Secret here"
                            />
                          </div>
                        </div>
                     </>
                   )}
                   
                   <div className="pt-2">
                     <button 
                       onClick={submitApiConnection}
                       disabled={apiLoading || !apiKey}
                       className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-50"
                     >
                       {apiLoading ? <Loader2 size={18} className="animate-spin"/> : <Globe size={18} />}
                       {apiLoading ? 'Syncing Assets...' : 'Connect & Import'}
                     </button>
                   </div>
                   <p className="text-xs text-center text-slate-400">Your keys are encrypted and never stored on our servers.</p>
                </div>
              )}

              {/* Import Success Screen */}
              {importResult && (
                <div className="text-center py-6 animate-fade-in">
                   <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                      <ShieldCheck size={32} />
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 mb-2">Sync Successful!</h3>
                   <p className="text-slate-600 mb-6">
                     Successfully imported <span className="font-bold text-slate-900">{importResult.count}</span> holdings from {importResult.source}.
                   </p>
                   <button 
                     onClick={() => { setIsModalOpen(false); resetForm(); }}
                     className="bg-slate-900 text-white px-8 py-2 rounded-lg font-bold hover:bg-slate-800"
                   >
                     Done
                   </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Allocation Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-1">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Allocation</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{paddingTop: '20px', fontSize: '12px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enhanced Holdings Table */}
        <div className="bg-white p-0 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
             <div className="flex items-center gap-2">
                <Briefcase size={20} className="text-slate-500" />
                <h3 className="text-lg font-bold text-slate-900">Holdings</h3>
             </div>
             <button className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700 bg-white border border-blue-200 px-3 py-1 rounded-full shadow-sm">
               <RefreshCcw size={12} /> Rebalance
             </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Asset</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Price</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Shares</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Value</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Return</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Allocation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {portfolio.holdings.map((h, index) => {
                  const allocPercent = (h.equity / portfolio.totalValue) * 100;
                  const dayChange = (Math.random() * 2) - 1; // Mock daily change
                  
                  return (
                    <tr key={h.stock.ticker} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-1 h-8 rounded-full`} style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                          <div>
                            <div className="font-bold text-slate-900">{h.stock.ticker}</div>
                            <div className="text-xs text-slate-500">{h.stock.sector}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-slate-900 font-medium">${h.stock.price.toFixed(2)}</div>
                        <div className={`text-xs ${dayChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                           {dayChange >= 0 ? '+' : ''}{dayChange.toFixed(2)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-slate-900">{h.shares.toFixed(h.shares % 1 !== 0 ? 3 : 0)}</div>
                        <div className="text-xs text-slate-400">@ ${h.avgCost.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900">${h.equity.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <div className={`font-medium ${h.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {h.totalReturn >= 0 ? '+' : ''}{h.totalReturnPercent.toFixed(2)}%
                        </div>
                        <div className="text-xs text-slate-400">
                          {h.totalReturn >= 0 ? '+' : ''}${Math.abs(h.totalReturn).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-700 font-medium relative">
                        {allocPercent.toFixed(1)}%
                        <div className="w-full bg-slate-100 h-1 mt-1 rounded-full overflow-hidden">
                           <div className="h-full rounded-full" style={{width: `${allocPercent}%`, backgroundColor: COLORS[index % COLORS.length]}}></div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
