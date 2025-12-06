
import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MONTHLY_DIVIDENDS_DATA } from '../constants';
import { Portfolio, Holding } from '../types';
import { ShieldCheck, ShieldAlert, RefreshCw, Settings2 } from 'lucide-react';

interface DividendAnalyticsProps {
  portfolio: Portfolio;
  onUpdateHolding?: (ticker: string, updates: Partial<Holding>) => void;
}

const DividendAnalytics: React.FC<DividendAnalyticsProps> = ({ portfolio, onUpdateHolding }) => {
  const [dividendGrowthRate, setDividendGrowthRate] = useState(5);
  const [priceAppreciationRate, setPriceAppreciationRate] = useState(7);
  
  // Advanced Snowball Calculation
  const snowballData = useMemo(() => {
    const data = [];
    
    // Deep clone holdings to simulate future state without mutating original props
    let simulatedHoldings = portfolio.holdings.map(h => ({
      ...h,
      simulatedShares: h.shares,
      simulatedPrice: h.stock.price,
      simulatedDividendPerShare: h.stock.price * (h.stock.dividendYield / 100)
    }));

    const years = 15;
    const divGrowth = dividendGrowthRate / 100;
    const priceGrowth = priceAppreciationRate / 100;

    for(let i = 0; i <= years; i++) {
      let annualDripIncome = 0;
      let annualCashIncome = 0;
      let currentYearPortfolioValue = 0;

      // 1. Calculate Income and Value for the CURRENT year state
      simulatedHoldings.forEach(h => {
        // Current Dividend for this year
        const totalDividend = h.simulatedShares * h.simulatedDividendPerShare;
        
        // Calculate holding value at current simulated price
        currentYearPortfolioValue += h.simulatedShares * h.simulatedPrice;

        if (h.dripEnabled) {
          annualDripIncome += totalDividend;
          // DRIP SIMULATION: 
          // Reinvest dividends to buy fractional shares immediately at current simulated price
          const newShares = totalDividend / h.simulatedPrice;
          h.simulatedShares += newShares; // Compounding shares for NEXT year's calculation
        } else {
          annualCashIncome += totalDividend;
        }

        // 2. Grow Stock Price and Dividend Rate for NEXT year
        h.simulatedPrice = h.simulatedPrice * (1 + priceGrowth);
        h.simulatedDividendPerShare = h.simulatedDividendPerShare * (1 + divGrowth);
      });

      // Baseline Calculation (No DRIP, No Reinvestment) for comparison
      // This estimates what income would be if shares remained constant
      const baselineIncome = portfolio.holdings.reduce((acc, h) => 
          acc + (h.shares * (h.stock.price * (h.stock.dividendYield / 100) * Math.pow(1 + divGrowth, i)))
      , 0);

      data.push({
        year: new Date().getFullYear() + i,
        dripIncome: Math.round(annualDripIncome),
        cashIncome: Math.round(annualCashIncome),
        totalIncome: Math.round(annualDripIncome + annualCashIncome),
        portfolioValue: Math.round(currentYearPortfolioValue),
        baselineIncome: Math.round(baselineIncome)
      });
    }
    return data;
  }, [portfolio.holdings, dividendGrowthRate, priceAppreciationRate]);

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Dividend Analytics</h2>
            <p className="text-slate-500">Track your passive income growth and projections.</p>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Income Calendar</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_DIVIDENDS_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} tickFormatter={(v) => `$${v}`} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">The Snowball Effect (15 Years)</h3>
                  <p className="text-sm text-slate-500">Projected income with DRIP & Compounding.</p>
               </div>
               <div className="flex gap-2 text-xs">
                  <div className="flex flex-col items-end">
                     <span className="text-slate-500 font-semibold">Div Growth</span>
                     <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                        <Settings2 size={10} className="text-slate-400"/>
                        <input 
                           type="number" 
                           value={dividendGrowthRate} 
                           onChange={(e) => setDividendGrowthRate(Number(e.target.value))}
                           className="w-8 bg-transparent text-right focus:outline-none font-bold text-blue-600"
                        />%
                     </div>
                  </div>
                  <div className="flex flex-col items-end">
                     <span className="text-slate-500 font-semibold">Appreciation</span>
                     <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                        <Settings2 size={10} className="text-slate-400"/>
                        <input 
                           type="number" 
                           value={priceAppreciationRate} 
                           onChange={(e) => setPriceAppreciationRate(Number(e.target.value))}
                           className="w-8 bg-transparent text-right focus:outline-none font-bold text-purple-600"
                        />%
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={snowballData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#64748b" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} tickFormatter={(v) => `$${v}`} />
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name === 'totalIncome' ? 'Projected (With DRIP)' : name === 'baselineIncome' ? 'Without Reinvestment' : name]}
                  />
                  <Area type="monotone" dataKey="totalIncome" stroke="#10b981" strokeWidth={3} fill="url(#colorTotal)" name="totalIncome" />
                  <Area type="monotone" dataKey="baselineIncome" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" fill="none" name="baselineIncome" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
       </div>

       {/* Detailed breakdown per stock */}
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-900">Dividend Breakdown & Settings</h3>
             <div className="text-sm text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
               Avg. Safety Score: <span className="font-bold text-green-600">85/100</span>
             </div>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Ticker</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Yield</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Safety Score</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Annual Income</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Frequency</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-center">DRIP Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {portfolio.holdings.map((h) => {
                     const annualIncome = h.shares * h.stock.price * (h.stock.dividendYield / 100);
                     const safetyScore = h.stock.dividendSafetyScore || 50;
                     
                     return (
                       <tr key={h.stock.ticker} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-800">{h.stock.ticker}</td>
                          <td className="px-6 py-4 text-right text-slate-600">{h.stock.dividendYield}%</td>
                          <td className="px-6 py-4 text-right">
                             <div className="flex items-center justify-end gap-2">
                                <span className={`font-bold ${safetyScore > 70 ? 'text-green-600' : safetyScore > 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                                  {safetyScore}
                                </span>
                                {safetyScore > 70 ? <ShieldCheck size={16} className="text-green-500"/> : <ShieldAlert size={16} className="text-yellow-500"/>}
                             </div>
                          </td>
                          <td className="px-6 py-4 text-right text-green-600 font-medium">${annualIncome.toFixed(2)}</td>
                          <td className="px-6 py-4 text-right text-slate-500">{h.stock.dividendFrequency}</td>
                          <td className="px-6 py-4 text-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={h.dripEnabled || false}
                                onChange={() => onUpdateHolding && onUpdateHolding(h.stock.ticker, { dripEnabled: !h.dripEnabled })}
                              />
                              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                            {h.dripEnabled && (
                               <div className="text-[10px] text-blue-600 font-bold mt-1 flex items-center justify-center gap-1">
                                 <RefreshCw size={10} /> Auto
                               </div>
                            )}
                          </td>
                       </tr>
                     );
                   })}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};

export default DividendAnalytics;
