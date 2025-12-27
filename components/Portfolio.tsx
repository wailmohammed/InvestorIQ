
import React, { useState, useRef } from 'react';
import { Portfolio as PortfolioType, Brokerage, UserProfile, UserRole, PlanTier, PortfolioContainer, Holding } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Plus, Download, Share2, X, AlertTriangle, FileSpreadsheet, Globe, Keyboard, Loader2, Key, ShieldCheck, Trash2, Edit, Lock, ChevronDown, Check, Briefcase, RefreshCcw, Database, MoreHorizontal, Pencil, Search, UploadCloud } from 'lucide-react';
import { PLAN_LIMITS } from '../constants';

interface PortfolioProps {
  portfolio: PortfolioType;
  portfolios: PortfolioContainer[];
  activePortfolioId: string;
  setActivePortfolioId: (id: string) => void;
  onCreatePortfolio: (name: string) => void;
  onRenamePortfolio?: (id: string, name: string) => void;
  onDeletePortfolio?: (id: string) => void;
  onAddHolding?: (ticker: string, shares: number, avgCost: number) => void;
  onEditHolding?: (ticker: string, shares: number, avgCost: number) => void;
  onDeleteHolding?: (ticker: string) => void;
  brokerages: Brokerage[];
  setBrokerages: React.Dispatch<React.SetStateAction<Brokerage[]>>;
  user: UserProfile;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6'];

const Portfolio: React.FC<PortfolioProps> = ({ 
  portfolio, 
  portfolios, 
  activePortfolioId, 
  setActivePortfolioId, 
  onCreatePortfolio,
  onRenamePortfolio,
  onDeletePortfolio,
  onAddHolding,
  onEditHolding,
  onDeleteHolding,
  brokerages, 
  setBrokerages, 
  user 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPortfolioDropdownOpen, setIsPortfolioDropdownOpen] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [importMethod, setImportMethod] = useState<'MANUAL' | 'CSV' | 'API'>('MANUAL');
  const [selectedBroker, setSelectedBroker] = useState<string | null>(null);
  const [manageMode, setManageMode] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [isCreatingPortfolio, setIsCreatingPortfolio] = useState(false);
  const [editingPortfolioId, setEditingPortfolioId] = useState<string | null>(null);
  const [editPortfolioName, setEditPortfolioName] = useState('');
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  const [modalMode, setModalMode] = useState<'ADD' | 'EDIT'>('ADD');
  const [ticker, setTicker] = useState('');
  const [shares, setShares] = useState('');
  const [cost, setCost] = useState('');
  
  const [apiStep, setApiStep] = useState<'IDLE' | 'CONNECTING' | 'FETCHING' | 'SAVING' | 'COMPLETE'>('IDLE');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [importResult, setImportResult] = useState<{count: number, source: string, errors: string[]} | null>(null);

  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);

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

  const handleOpenEditModal = (holding: any) => {
    setModalMode('EDIT');
    setTicker(holding.stock.ticker);
    setShares(holding.shares.toString());
    setCost(holding.avgCost.toString());
    setImportMethod('MANUAL');
    setIsModalOpen(true);
    setOpenActionMenuId(null);
  };

  const handleOpenAddModal = () => {
    setModalMode('ADD');
    resetForm();
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const limit = PLAN_LIMITS[user.plan].maxHoldings;
    
    if (modalMode === 'ADD' && portfolio.holdings.length >= limit) {
      alert(`Plan limit reached (${limit} holdings). Upgrade to add more.`);
      return;
    }

    if (ticker && shares && cost) {
      if (modalMode === 'ADD' && onAddHolding) {
        onAddHolding(ticker.toUpperCase(), Number(shares), Number(cost));
      } else if (modalMode === 'EDIT' && onEditHolding) {
        onEditHolding(ticker.toUpperCase(), Number(shares), Number(cost));
      }
      setIsModalOpen(false);
      resetForm();
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
    setApiStep('IDLE');
    setCsvFile(null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setCsvFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleProcessCsv = () => {
    if (!csvFile) return;
    setApiStep('FETCHING');
    
    setTimeout(() => {
        if (onAddHolding) {
            onAddHolding('VTI', 15, 225);
            onAddHolding('VXUS', 20, 55);
            onAddHolding('BND', 10, 72);
        }
        setApiStep('COMPLETE');
        setImportResult({ count: 3, source: 'CSV Upload', errors: [] });
        setCsvFile(null);
    }, 1500);
  };

  const handleDownloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,Ticker,Shares,AvgCost\nAAPL,10,150.00\nMSFT,5,280.50";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "investiq_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const submitApiConnection = () => {
    setApiStep('CONNECTING');
    setTimeout(() => {
      setApiStep('FETCHING');
      setTimeout(() => {
        setApiStep('SAVING');
        setTimeout(() => {
          let importedCount = 0;
          if (selectedBroker === 'Trading212') {
            if (onAddHolding) {
              onAddHolding('TSLA', 10, 210);
              onAddHolding('AMZN', 25, 145);
              importedCount = 2;
            }
          } else {
             if (onAddHolding) {
              onAddHolding('BTC', 0.5, 60000);
              importedCount = 1;
             }
          }
          setImportResult({ count: importedCount, source: selectedBroker || 'API', errors: [] });
          setApiStep('COMPLETE');
        }, 1000);
      }, 1500);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in" onClick={() => setOpenActionMenuId(null)}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button 
             onClick={(e) => { e.stopPropagation(); setIsPortfolioDropdownOpen(!isPortfolioDropdownOpen); }}
             className="flex items-center gap-2 text-2xl font-bold text-slate-900 hover:text-blue-600 transition-colors"
           >
             {activePortfolio.name} <ChevronDown size={20} className={isPortfolioDropdownOpen ? 'rotate-180' : ''}/>
           </button>
           <p className="text-slate-500">Total Value: <span className="font-semibold text-slate-700">${portfolio.totalValue.toLocaleString()}</span></p>
        </div>

        <div className="flex gap-3">
          <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
            <Share2 size={16} /> Share
          </button>
          <button onClick={handleOpenAddModal} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 text-sm font-medium">
            <Plus size={16} /> Add Holding
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-0 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900">{modalMode === 'EDIT' ? 'Edit Holding' : 'Add Assets'}</h3>
              <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            {modalMode === 'ADD' && (
              <div className="flex border-b border-slate-100">
                 <button onClick={() => setImportMethod('MANUAL')} className={`flex-1 py-3 text-sm font-medium ${importMethod === 'MANUAL' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 bg-slate-50'}`}>Manual</button>
                 <button onClick={() => setImportMethod('CSV')} className={`flex-1 py-3 text-sm font-medium ${importMethod === 'CSV' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 bg-slate-50'}`}>CSV Import</button>
                 <button onClick={() => setImportMethod('API')} className={`flex-1 py-3 text-sm font-medium ${importMethod === 'API' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 bg-slate-50'}`}>API Connect</button>
              </div>
            )}

            <div className="p-6">
              {importMethod === 'MANUAL' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ticker</label>
                    <input type="text" value={ticker} onChange={(e) => setTicker(e.target.value)} placeholder="AAPL" className="w-full border border-slate-300 rounded-lg px-4 py-2 uppercase font-bold" required disabled={modalMode === 'EDIT'} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Shares</label>
                      <input type="number" value={shares} onChange={(e) => setShares(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2" required step="any" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Avg Cost</label>
                      <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2" required step="0.01" />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 mt-4">
                    {modalMode === 'EDIT' ? 'Update Holding' : 'Add to Portfolio'}
                  </button>
                </form>
              )}

              {importMethod === 'CSV' && (
                <div className="text-center space-y-4 py-4">
                  {!importResult ? (
                    <>
                      <div 
                        className={`border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-500'}`}
                        onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                        onClick={() => inputRef.current?.click()}
                      >
                         <input ref={inputRef} type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
                         {csvFile ? (
                            <div className="flex flex-col items-center gap-2">
                               <FileSpreadsheet size={48} className="text-green-500" />
                               <p className="font-bold text-slate-900">{csvFile.name}</p>
                            </div>
                         ) : (
                           <>
                             <UploadCloud size={48} className="mx-auto text-slate-400 mb-3" />
                             <p className="font-medium">Drag & drop CSV or click to browse</p>
                           </>
                         )}
                      </div>
                      {csvFile && (
                         <button onClick={handleProcessCsv} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 flex items-center justify-center gap-2">
                           {apiStep === 'FETCHING' ? <Loader2 className="animate-spin" size={18}/> : 'Import File'}
                         </button>
                      )}
                      <button onClick={handleDownloadTemplate} className="text-blue-600 text-sm font-medium hover:underline flex items-center justify-center gap-2 mx-auto">
                        <Download size={14} /> Download Template
                      </button>
                    </>
                  ) : (
                     <div className="text-center py-6">
                        <ShieldCheck size={48} className="text-green-500 mx-auto mb-4" />
                        <h4 className="text-lg font-bold">Successfully Imported {importResult.count} Assets</h4>
                        <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="mt-6 bg-slate-900 text-white px-8 py-2 rounded-lg">Close</button>
                     </div>
                  )}
                </div>
              )}

              {importMethod === 'API' && !selectedBroker && !importResult && (
                 <div className="grid grid-cols-2 gap-3">
                    {brokerages.map(broker => (
                      <button key={broker.id} onClick={() => setSelectedBroker(broker.name)} className="p-4 border border-slate-200 rounded-xl hover:border-blue-500 flex flex-col items-center gap-2">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${broker.colorClass}`}>{broker.logoChar}</div>
                         <span className="text-sm font-medium">{broker.name}</span>
                      </button>
                    ))}
                 </div>
              )}

              {importMethod === 'API' && selectedBroker && !importResult && (
                <div className="space-y-4">
                   <div className="flex items-center gap-3 mb-6 p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">{selectedBroker[0]}</div>
                      <h4 className="font-bold">Connect {selectedBroker}</h4>
                      <button onClick={() => setSelectedBroker(null)} className="ml-auto text-xs text-slate-500">Change</button>
                   </div>
                   <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="API Key" className="w-full border p-2 rounded-lg" />
                   <button onClick={submitApiConnection} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">
                     {apiStep === 'IDLE' ? 'Connect & Import' : 'Processing...'}
                   </button>
                </div>
              )}

              {importMethod === 'API' && importResult && (
                 <div className="text-center py-6">
                    <ShieldCheck size={48} className="text-green-500 mx-auto mb-4" />
                    <h4 className="text-lg font-bold">Imported {importResult.count} holdings from {importResult.source}</h4>
                    <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="mt-6 bg-slate-900 text-white px-8 py-2 rounded-lg">Close</button>
                 </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-1 flex flex-col items-center">
          <h3 className="text-lg font-bold text-slate-900 mb-4 w-full">Allocation</h3>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={allocationData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={3} dataKey="value" stroke="none">
                  {allocationData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
               <p className="text-slate-400 text-xs">Total</p>
               <p className="text-slate-900 font-bold text-lg">${(portfolio.totalValue/1000).toFixed(1)}k</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 lg:col-span-2 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
             <div className="flex items-center gap-2 font-bold text-slate-900"><Briefcase size={20}/> Holdings</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Asset</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Price</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Return</th>
                  <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {portfolio.holdings.map((h, index) => (
                  <tr key={h.stock.ticker} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{h.stock.ticker}</div>
                      <div className="text-xs text-slate-500">{h.stock.name}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-medium text-slate-900">${h.stock.price.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      <div className={h.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {h.totalReturn >= 0 ? '+' : ''}{h.totalReturnPercent.toFixed(2)}%
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                       <button onClick={() => handleOpenEditModal(h)} className="p-2 text-slate-400 hover:text-blue-600"><Pencil size={16} /></button>
                       <button onClick={() => onDeleteHolding?.(h.stock.ticker)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
